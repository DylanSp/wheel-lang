import { zip } from "fp-ts/lib/Array";
import { Either, right, left } from "fp-ts/lib/Either";
import { lookup, member, insertAt, toArray } from "fp-ts/lib/Map";
import { isNone, Option, some, isSome, none } from "fp-ts/lib/Option";
import { prompt } from "readline-sync";
import { Identifier, eqIdentifier, identifierIso, ordIdentifier } from "./types";
import { Program, Expression, Block } from "./parser";

/**
 * TYPES
 */

class Environment {
  private values: Map<Identifier, Option<Value>>;

  private parentEnvironment?: Environment;

  public constructor(parentEnvironment?: Environment) {
    this.values = new Map<Identifier, Option<Value>>();
    this.parentEnvironment = parentEnvironment;
  }

  public lookup = (ident: Identifier): Option<Option<Value>> => {
    const possibleLocalValue = lookup(eqIdentifier)(ident, this.values);

    if (isSome(possibleLocalValue)) {
      return possibleLocalValue;
    }

    if (this.parentEnvironment !== undefined) {
      return this.parentEnvironment.lookup(ident);
    }

    return none;
  };

  public define = (ident: Identifier): void => {
    this.values = insertAt(eqIdentifier)<Option<Value>>(ident, none)(this.values);
  };

  // set a variable's value in the innermost environment in which it's found; return true iff variable was found
  public assign = (ident: Identifier, value: Value): boolean => {
    if (member(eqIdentifier)(ident, this.values)) {
      this.values = insertAt(eqIdentifier)(ident, some(value))(this.values);
      return true;
    }

    if (this.parentEnvironment !== undefined) {
      return this.parentEnvironment.assign(ident, value);
    }

    return false;
  };
}

interface NotInScopeError {
  runtimeErrorKind: "notInScope";
  outOfScopeIdentifier: Identifier;
}

interface NotFunctionError {
  runtimeErrorKind: "notFunction";
  nonFunctionType: ValueKind;
}

interface TypeMismatchError {
  runtimeErrorKind: "typeMismatch";
  expectedTypes: Array<ValueKind>;
  actualType: ValueKind;
}

interface ArityMismatchError {
  runtimeErrorKind: "arityMismatch";
  expectedNumArgs: number;
  actualNumArgs: number;
}

interface UnassignedVariableError {
  runtimeErrorKind: "unassignedVariable";
  unassignedIdentifier: Identifier;
}

interface NativeFunctionReturnedFunctionError {
  runtimeErrorKind: "nativeFunctionReturnFunc";
  nativeFunctionName: Identifier;
}

class RuntimeError extends Error {
  constructor(public readonly message: string, public readonly underlyingFailure: RuntimeFailure) {
    super(message);
  }
}

export type RuntimeFailure =
  | NotInScopeError
  | NotFunctionError
  | TypeMismatchError
  | ArityMismatchError
  | UnassignedVariableError
  | NativeFunctionReturnedFunctionError;

interface NumberValue {
  valueKind: "number";
  value: number;
}

const makeNumberValue = (value: number): NumberValue => ({
  valueKind: "number",
  value,
});

interface BooleanValue {
  valueKind: "boolean";
  isTrue: boolean;
}

const makeBooleanValue = (value: boolean): BooleanValue => ({
  valueKind: "boolean",
  isTrue: value,
});

interface ClosureValue {
  valueKind: "closure";
  closureName: Identifier;
  argNames: Array<Identifier>;
  body: Block;
  env: Environment;
}

const makeClosureValue = (
  closureName: Identifier,
  argNames: Array<Identifier>,
  body: Block,
  env: Environment,
): ClosureValue => ({
  valueKind: "closure",
  closureName,
  argNames,
  body,
  env,
});

interface NativeFunctionValue {
  valueKind: "nativeFunc";
  funcName: Identifier;
  argTypes: Array<ValueKind>;
  body: Function;
  returnType: ValueKind;
}

interface NullValue {
  valueKind: "null";
}

const makeNullValue = (): NullValue => ({
  valueKind: "null",
});

interface ObjectValue {
  valueKind: "object";
  fields: Map<Identifier, Value>;
}

const makeObjectValue = (fields: Map<Identifier, Value>): ObjectValue => ({
  valueKind: "object",
  fields,
});

type ValueKind = Value["valueKind"];
export type Value = NumberValue | BooleanValue | ClosureValue | NativeFunctionValue | NullValue | ObjectValue;

class Return extends Error {
  constructor(public readonly possibleValue: Value) {
    super();
  }
}

type Evaluate = (program: Program) => Either<RuntimeFailure, Value>;

export const evaluate: Evaluate = (program) => {
  // utility functions
  const areEqual = (lhsValue: Value, rhsValue: Value): boolean => {
    if (lhsValue.valueKind === "closure") {
      throw new RuntimeError("Trying to compare closure value", {
        runtimeErrorKind: "typeMismatch",
        expectedTypes: ["number", "boolean", "null", "object"], // not really scalable (would have to contain every type that supports equality), but allowable since this project doesn't allow custom types
        actualType: "closure",
      });
    }

    if (rhsValue.valueKind === "closure") {
      throw new RuntimeError("Trying to compare closure value", {
        runtimeErrorKind: "typeMismatch",
        expectedTypes: ["number", "boolean", "null", "object"], // not really scalable (would have to contain every type that supports inequality), but allowable since this project doesn't allow custom types
        actualType: "closure",
      });
    }

    if (lhsValue.valueKind === "nativeFunc") {
      throw new RuntimeError("Trying to compare native function value", {
        runtimeErrorKind: "typeMismatch",
        expectedTypes: ["number", "boolean", "null", "object"],
        actualType: "nativeFunc",
      });
    }

    if (rhsValue.valueKind === "nativeFunc") {
      throw new RuntimeError("Trying to compare native function value", {
        runtimeErrorKind: "typeMismatch",
        expectedTypes: ["number", "boolean", "null", "object"],
        actualType: "nativeFunc",
      });
    }

    if (lhsValue.valueKind === "null") {
      if (rhsValue.valueKind === "null") {
        return true;
      } else if (rhsValue.valueKind === "object") {
        return false;
      } else {
        throw new RuntimeError("Trying to compare non-object to null", {
          runtimeErrorKind: "typeMismatch",
          expectedTypes: ["null", "object"],
          actualType: rhsValue.valueKind,
        });
      }
    }

    if (rhsValue.valueKind === "null") {
      // null == null already handled above
      if (lhsValue.valueKind === "object") {
        return false;
      } else {
        throw new RuntimeError("Trying to compare non-object to null", {
          runtimeErrorKind: "typeMismatch",
          expectedTypes: ["null", "object"],
          actualType: lhsValue.valueKind,
        });
      }
    }

    if (lhsValue.valueKind === "object" && rhsValue.valueKind === "object") {
      const lhsFields = toArray(ordIdentifier)(lhsValue.fields);
      const rhsFields = toArray(ordIdentifier)(rhsValue.fields);

      if (lhsFields.length !== rhsFields.length) {
        return false;
      }

      for (const [[lhsFieldName, lhsFieldValue], [rhsFieldName, rhsFieldValue]] of zip(lhsFields, rhsFields)) {
        if (lhsFieldName !== rhsFieldName) {
          return false;
        }

        if (!areEqual(lhsFieldValue, rhsFieldValue)) {
          return false;
        }
      }

      return true;
    }

    if (lhsValue.valueKind === "number" && rhsValue.valueKind === "number") {
      return lhsValue.value === rhsValue.value;
    } else if (lhsValue.valueKind === "boolean" && rhsValue.valueKind === "boolean") {
      return lhsValue.isTrue === rhsValue.isTrue;
    } else {
      throw new RuntimeError("Trying to compare values of different types", {
        runtimeErrorKind: "typeMismatch",
        expectedTypes: [lhsValue.valueKind],
        actualType: rhsValue.valueKind,
      });
    }
  };

  const evaluateExpr = (env: Environment, expr: Expression): Value => {
    switch (expr.expressionKind) {
      case "numberLit": {
        return makeNumberValue(expr.value);
      }
      case "booleanLit": {
        return makeBooleanValue(expr.isTrue);
      }
      case "nullLit": {
        return makeNullValue();
      }
      case "binOp": {
        const lhsValue = evaluateExpr(env, expr.leftOperand);
        const rhsValue = evaluateExpr(env, expr.rightOperand);

        switch (expr.binOp) {
          case "add":
            if (lhsValue.valueKind !== "number" || rhsValue.valueKind !== "number") {
              throw new RuntimeError("Trying to perform binOp on non-numeric values", {
                runtimeErrorKind: "typeMismatch",
                expectedTypes: ["number"],
                actualType: lhsValue.valueKind !== "number" ? lhsValue.valueKind : rhsValue.valueKind,
              });
            }
            return makeNumberValue(lhsValue.value + rhsValue.value);
          case "subtract":
            if (lhsValue.valueKind !== "number" || rhsValue.valueKind !== "number") {
              throw new RuntimeError("Trying to perform binOp on non-numeric values", {
                runtimeErrorKind: "typeMismatch",
                expectedTypes: ["number"],
                actualType: lhsValue.valueKind !== "number" ? lhsValue.valueKind : rhsValue.valueKind,
              });
            }
            return makeNumberValue(lhsValue.value - rhsValue.value);
          case "multiply":
            if (lhsValue.valueKind !== "number" || rhsValue.valueKind !== "number") {
              throw new RuntimeError("Trying to perform binOp on non-numeric values", {
                runtimeErrorKind: "typeMismatch",
                expectedTypes: ["number"],
                actualType: lhsValue.valueKind !== "number" ? lhsValue.valueKind : rhsValue.valueKind,
              });
            }
            return makeNumberValue(lhsValue.value * rhsValue.value);
          case "divide":
            if (lhsValue.valueKind !== "number" || rhsValue.valueKind !== "number") {
              throw new RuntimeError("Trying to perform binOp on non-numeric values", {
                runtimeErrorKind: "typeMismatch",
                expectedTypes: ["number"],
                actualType: lhsValue.valueKind !== "number" ? lhsValue.valueKind : rhsValue.valueKind,
              });
            }
            return makeNumberValue(lhsValue.value / rhsValue.value);
          case "and":
            if (lhsValue.valueKind !== "boolean" || rhsValue.valueKind !== "boolean") {
              throw new RuntimeError("Trying to perform logical operation on non-boolean values", {
                runtimeErrorKind: "typeMismatch",
                expectedTypes: ["boolean"],
                actualType: lhsValue.valueKind !== "boolean" ? lhsValue.valueKind : rhsValue.valueKind,
              });
            }
            return makeBooleanValue(lhsValue.isTrue && rhsValue.isTrue);
          case "or":
            if (lhsValue.valueKind !== "boolean" || rhsValue.valueKind !== "boolean") {
              throw new RuntimeError("Trying to perform logical operation on non-boolean values", {
                runtimeErrorKind: "typeMismatch",
                expectedTypes: ["boolean"],
                actualType: lhsValue.valueKind !== "boolean" ? lhsValue.valueKind : rhsValue.valueKind,
              });
            }
            return makeBooleanValue(lhsValue.isTrue || rhsValue.isTrue);
          case "lessThan":
            if (lhsValue.valueKind !== "number" || rhsValue.valueKind !== "number") {
              throw new RuntimeError("Trying to compare non-numeric values", {
                runtimeErrorKind: "typeMismatch",
                expectedTypes: ["number"],
                actualType: lhsValue.valueKind !== "number" ? lhsValue.valueKind : rhsValue.valueKind,
              });
            }
            return makeBooleanValue(lhsValue.value < rhsValue.value);
          case "greaterThan":
            if (lhsValue.valueKind !== "number" || rhsValue.valueKind !== "number") {
              throw new RuntimeError("Trying to compare non-numeric values", {
                runtimeErrorKind: "typeMismatch",
                expectedTypes: ["number"],
                actualType: lhsValue.valueKind !== "number" ? lhsValue.valueKind : rhsValue.valueKind,
              });
            }
            return makeBooleanValue(lhsValue.value > rhsValue.value);
          case "lessThanEquals":
            if (lhsValue.valueKind !== "number" || rhsValue.valueKind !== "number") {
              throw new RuntimeError("Trying to compare non-numeric values", {
                runtimeErrorKind: "typeMismatch",
                expectedTypes: ["number"],
                actualType: lhsValue.valueKind !== "number" ? lhsValue.valueKind : rhsValue.valueKind,
              });
            }
            return makeBooleanValue(lhsValue.value <= rhsValue.value);
          case "greaterThanEquals":
            if (lhsValue.valueKind !== "number" || rhsValue.valueKind !== "number") {
              throw new RuntimeError("Trying to compare non-numeric values", {
                runtimeErrorKind: "typeMismatch",
                expectedTypes: ["number"],
                actualType: lhsValue.valueKind !== "number" ? lhsValue.valueKind : rhsValue.valueKind,
              });
            }
            return makeBooleanValue(lhsValue.value >= rhsValue.value);
          case "equals":
            return makeBooleanValue(areEqual(lhsValue, rhsValue));
          case "notEqual":
            return makeBooleanValue(!areEqual(lhsValue, rhsValue));
        }
      }
      case "variableRef": {
        const variableValue = env.lookup(expr.variableName);

        if (isNone(variableValue)) {
          throw new RuntimeError(`Variable ${expr.variableName} not in scope`, {
            runtimeErrorKind: "notInScope",
            outOfScopeIdentifier: expr.variableName,
          });
        }

        if (isNone(variableValue.value)) {
          throw new RuntimeError(`Variable ${expr.variableName} has no assigned value`, {
            runtimeErrorKind: "unassignedVariable",
            unassignedIdentifier: expr.variableName,
          });
        }

        return variableValue.value.value;
      }
      case "funcCall": {
        const func = evaluateExpr(env, expr.callee);
        const args = expr.args.map((arg) => evaluateExpr(env, arg));
        return apply(func, args);
      }
      case "unaryOp": {
        const operandValue = evaluateExpr(env, expr.operand);

        if (expr.unaryOp === "not") {
          if (operandValue.valueKind !== "boolean") {
            throw new RuntimeError("Attempting to apply logical not to non-boolean", {
              runtimeErrorKind: "typeMismatch",
              expectedTypes: ["boolean"],
              actualType: operandValue.valueKind,
            });
          }
          return makeBooleanValue(!operandValue.isTrue);
        } else if (expr.unaryOp === "negative") {
          if (operandValue.valueKind !== "number") {
            throw new RuntimeError("Attempting to apply unary minus to non-number", {
              runtimeErrorKind: "typeMismatch",
              expectedTypes: ["number"],
              actualType: operandValue.valueKind,
            });
          }
          return makeNumberValue(0 - operandValue.value);
        } else {
          throw new Error(
            `Programming error; tried to evaluate unaryOp of kind ${expr.unaryOp}, only supported unary ops are "not" and "negative"`,
          );
        }
      }
      case "get": {
        const obj = evaluateExpr(env, expr.object);
        if (obj.valueKind !== "object") {
          throw new Error("Insert runtime error for running getter on non-object");
        }

        const possibleVal = lookup(eqIdentifier)(expr.field)(obj.fields);
        return isSome(possibleVal) ? possibleVal.value : makeNullValue();
      }
      case "objectLit": {
        let fields = new Map<Identifier, Value>();
        expr.fields.forEach((field) => {
          fields = insertAt(eqIdentifier)(field.fieldName, evaluateExpr(env, field.fieldValue))(fields);
        });
        return makeObjectValue(fields);
      }
    }
  };

  const apply = (func: Value, args: Array<Value>): Value => {
    if (func.valueKind !== "closure" && func.valueKind !== "nativeFunc") {
      throw new RuntimeError("Attempting to apply non-closure", {
        runtimeErrorKind: "notFunction",
        nonFunctionType: func.valueKind,
      });
    }

    if (func.valueKind === "closure") {
      if (func.argNames.length !== args.length) {
        throw new RuntimeError("Wrong number of arguments when applying function", {
          runtimeErrorKind: "arityMismatch",
          expectedNumArgs: func.argNames.length,
          actualNumArgs: args.length,
        });
      }

      const functionLocalEnv = new Environment(func.env);
      for (let i = 0; i < func.argNames.length; i++) {
        functionLocalEnv.define(func.argNames[i]);
        functionLocalEnv.assign(func.argNames[i], args[i]);
      }

      try {
        evaluateBlock(functionLocalEnv, func.body);
        return makeNullValue();
      } catch (err) {
        if (err instanceof Return) {
          return err.possibleValue;
        } else {
          throw err;
        }
      }
    } else {
      // native function
      if (func.argTypes.length !== args.length) {
        throw new RuntimeError("Wrong number of arguments when applying function", {
          runtimeErrorKind: "arityMismatch",
          expectedNumArgs: func.argTypes.length,
          actualNumArgs: args.length,
        });
      }

      const possibleResult = func.body(...args);
      switch (func.returnType) {
        case "number":
          return makeNumberValue(possibleResult as number);
        case "boolean":
          return makeBooleanValue(possibleResult as boolean);
        case "closure":
        case "nativeFunc":
          throw new RuntimeError("Native function returned a closure/nativeFunc", {
            runtimeErrorKind: "nativeFunctionReturnFunc",
            nativeFunctionName: func.funcName,
          });
        case "null":
          return makeNullValue();
        case "object":
          return makeObjectValue(possibleResult as Map<Identifier, Value>);
      }
    }
  };

  // throws a Return "error" if a value is returned; if this method returns, execution falls out of block
  const evaluateBlock = (env: Environment, block: Block): void => {
    for (const statement of block) {
      switch (statement.statementKind) {
        case "return": {
          const valueToReturn =
            statement.returnedValue === undefined ? makeNullValue() : evaluateExpr(env, statement.returnedValue);
          throw new Return(valueToReturn);
        }
        case "varDecl": {
          env.define(statement.variableName);
          break;
        }
        case "assignment": {
          const successfullyAssigned = env.assign(statement.variableName, evaluateExpr(env, statement.variableValue));
          if (!successfullyAssigned) {
            throw new RuntimeError(`Variable ${statement.variableName} not in scope`, {
              runtimeErrorKind: "notInScope",
              outOfScopeIdentifier: statement.variableName,
            });
          }

          break;
        }
        case "funcDecl": {
          const closureEnv = new Environment(env);
          const closureValue = makeClosureValue(statement.functionName, statement.argNames, statement.body, closureEnv);

          env.define(statement.functionName);
          env.assign(statement.functionName, closureValue);
          break;
        }
        case "if": {
          const condition = evaluateExpr(env, statement.condition);
          if (condition.valueKind !== "boolean") {
            throw new RuntimeError("Condition of if-statement evaluated to non-boolean value", {
              runtimeErrorKind: "typeMismatch",
              expectedTypes: ["boolean"],
              actualType: condition.valueKind,
            });
          }

          const blockEnv = new Environment(env);

          if (condition.isTrue) {
            evaluateBlock(blockEnv, statement.trueBody);
          } else {
            evaluateBlock(blockEnv, statement.falseBody);
          }
          break;
        }
        case "while": {
          while (true) {
            const condition = evaluateExpr(env, statement.condition);
            if (condition.valueKind !== "boolean") {
              throw new RuntimeError("Condition of while statement evaluated to non-boolean value", {
                runtimeErrorKind: "typeMismatch",
                expectedTypes: ["boolean"],
                actualType: condition.valueKind,
              });
            }

            if (condition.isTrue) {
              const blockEnv = new Environment(env);
              evaluateBlock(blockEnv, statement.body);
            } else {
              break;
            }
          }
          break;
        }
        case "set": {
          const obj = evaluateExpr(env, statement.object);
          if (obj.valueKind !== "object") {
            throw new Error("Insert runtime error for running setter on non-object");
          }

          const value = evaluateExpr(env, statement.value);
          obj.fields = insertAt(eqIdentifier)(statement.field, value)(obj.fields);

          break;
        }
        case "expression": {
          evaluateExpr(env, statement.expression);
          break;
        }
      }
    }
  };

  const defineNativeFunctions = (env: Environment): void => {
    const nativeFuncs: Array<NativeFunctionValue> = [
      {
        funcName: identifierIso.wrap("clock"),
        valueKind: "nativeFunc",
        argTypes: [],
        returnType: "number",
        body: (): number => Date.now(),
      },
      {
        funcName: identifierIso.wrap("printNum"),
        valueKind: "nativeFunc",
        argTypes: ["number"],
        returnType: "null",
        body: (numVal: NumberValue): void => console.log(numVal.value),
      },
      {
        funcName: identifierIso.wrap("printBool"),
        valueKind: "nativeFunc",
        argTypes: ["boolean"],
        returnType: "null",
        body: (boolVal: BooleanValue): void => console.log(boolVal.isTrue),
      },
      {
        funcName: identifierIso.wrap("readNum"),
        valueKind: "nativeFunc",
        argTypes: [],
        returnType: "object",
        body: (): Map<Identifier, Value> => {
          const rawInput = prompt();
          const parsed = parseFloat(rawInput);
          let result = new Map<Identifier, Value>();
          const validityIdent = identifierIso.wrap("isValid");
          const valueIdent = identifierIso.wrap("value");

          if (isNaN(parsed)) {
            result = insertAt(eqIdentifier)<Value>(validityIdent, makeBooleanValue(false))(result);
            result = insertAt(eqIdentifier)<Value>(valueIdent, makeNumberValue(0))(result);
          } else {
            result = insertAt(eqIdentifier)<Value>(validityIdent, makeBooleanValue(true))(result);
            result = insertAt(eqIdentifier)<Value>(valueIdent, makeNumberValue(parsed))(result);
          }
          return result;
        },
      },
      {
        funcName: identifierIso.wrap("readBool"),
        valueKind: "nativeFunc",
        argTypes: [],
        returnType: "object",
        body: (): Map<Identifier, Value> => {
          const rawInput = prompt();
          let result = new Map<Identifier, Value>();
          const validityIdent = identifierIso.wrap("isValid");
          const valueIdent = identifierIso.wrap("value");

          if (rawInput === "true") {
            result = insertAt(eqIdentifier)<Value>(validityIdent, makeBooleanValue(true))(result);
            result = insertAt(eqIdentifier)<Value>(valueIdent, makeBooleanValue(true))(result);
          } else if (rawInput === "false") {
            result = insertAt(eqIdentifier)<Value>(validityIdent, makeBooleanValue(true))(result);
            result = insertAt(eqIdentifier)<Value>(valueIdent, makeBooleanValue(false))(result);
          } else {
            result = insertAt(eqIdentifier)<Value>(validityIdent, makeBooleanValue(false))(result);
            result = insertAt(eqIdentifier)<Value>(valueIdent, makeBooleanValue(false))(result);
          }

          return result;
        },
      },
    ];

    nativeFuncs.forEach((nativeFunc) => {
      env.define(nativeFunc.funcName);
      env.assign(nativeFunc.funcName, nativeFunc);
    });
  };

  // main driver
  try {
    const topLevelEnv = new Environment();
    defineNativeFunctions(topLevelEnv);
    evaluateBlock(topLevelEnv, program);
    return right(makeNullValue());
  } catch (err) {
    if (err instanceof RuntimeError) {
      return left(err.underlyingFailure);
    } else if (err instanceof Return) {
      return right(err.possibleValue);
    } else {
      throw err;
    }
  }
};
