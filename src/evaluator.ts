import { Program, Expression, Block } from "./parser";
import { Either, right, left } from "fp-ts/lib/Either";
import { lookup, member, insertAt } from "fp-ts/lib/Map";
import { Identifier, eqIdentifier, identifierIso } from "./types";
import { isNone, Option, some, isSome, none } from "fp-ts/lib/Option";

/**
 * TYPES
 */

// TODO make Environment a class with lookup(), define(), assign() methods?
interface Environment {
  values: Map<Identifier, Option<Value>>; // value of None represents a declared but unassigned variable; value of Some represents the assigned value
  parentEnvironment?: Environment;
}

const lookupInEnvironment = (ident: Identifier, env: Environment): Option<Option<Value>> => {
  const result = lookup(eqIdentifier)(ident, env.values);

  if (isSome(result)) {
    return result;
  }

  if (env.parentEnvironment !== undefined) {
    return lookupInEnvironment(ident, env.parentEnvironment);
  }

  return none;
};

const defineInEnvironment = (ident: Identifier, env: Environment): void => {
  env.values.set(ident, none);
};

// set a variable's value in the innermost environment in which it's found; return true iff variable was found
const assignInEnvironment = (ident: Identifier, value: Value, env: Environment): boolean => {
  if (member(eqIdentifier)(ident, env.values)) {
    env.values.set(ident, some(value));
    return true;
  }

  if (env.parentEnvironment !== undefined) {
    return assignInEnvironment(ident, value, env.parentEnvironment);
  }

  return false;
};

interface NotInScopeError {
  runtimeErrorKind: "notInScope";
  outOfScopeIdentifier: Identifier;
}

interface NotFunctionError {
  runtimeErrorKind: "notFunction";
  nonFunctionType: string;
}

interface TypeMismatchError {
  runtimeErrorKind: "typeMismatch";
  expectedTypes: Array<string>;
  actualType: string;
}

interface NoReturnError {
  runtimeErrorKind: "noReturn";
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
  | NoReturnError
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

type Evaluate = (program: Program) => Either<RuntimeFailure, Value>;

export const evaluate: Evaluate = (program) => {
  // utility functions
  const evaluateExpr = (env: Environment, expr: Expression): Value => {
    switch (expr.expressionKind) {
      case "numberLit": {
        return makeNumberValue(expr.value);
      }
      case "booleanLit": {
        return makeBooleanValue(expr.isTrue);
      }
      case "binOp": {
        const lhsValue = evaluateExpr(env, expr.leftOperand);
        const rhsValue = evaluateExpr(env, expr.rightOperand);

        switch (expr.binOp) {
          // TODO refactor type-checking? pull it out into a separate function?
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
            if (lhsValue.valueKind === "closure") {
              throw new RuntimeError("Trying to compare closure value", {
                runtimeErrorKind: "typeMismatch",
                expectedTypes: ["number", "boolean"], // not really scalable (would have to contain every type that supports equality), but allowable since this project doesn't allow custom types
                actualType: "closure",
              });
            }

            if (rhsValue.valueKind === "closure") {
              throw new RuntimeError("Trying to compare closure value", {
                runtimeErrorKind: "typeMismatch",
                expectedTypes: ["number", "boolean"], // not really scalable (would have to contain every type that supports inequality), but allowable since this project doesn't allow custom types
                actualType: "closure",
              });
            }

            if (lhsValue.valueKind === "number" && rhsValue.valueKind === "number") {
              return makeBooleanValue(lhsValue.value === rhsValue.value);
            } else if (lhsValue.valueKind === "boolean" && rhsValue.valueKind === "boolean") {
              return makeBooleanValue(lhsValue.isTrue === rhsValue.isTrue);
            } else {
              throw new RuntimeError("Trying to compare values of different types", {
                runtimeErrorKind: "typeMismatch",
                expectedTypes: [lhsValue.valueKind],
                actualType: rhsValue.valueKind,
              });
            }
          case "notEqual":
            if (lhsValue.valueKind === "closure") {
              throw new RuntimeError("Trying to compare closure value", {
                runtimeErrorKind: "typeMismatch",
                expectedTypes: ["number", "boolean"],
                actualType: "closure",
              });
            }

            if (rhsValue.valueKind === "closure") {
              throw new RuntimeError("Trying to compare closure value", {
                runtimeErrorKind: "typeMismatch",
                expectedTypes: ["number", "boolean"],
                actualType: "closure",
              });
            }

            if (lhsValue.valueKind === "number" && rhsValue.valueKind === "number") {
              return makeBooleanValue(lhsValue.value !== rhsValue.value);
            } else if (lhsValue.valueKind === "boolean" && rhsValue.valueKind === "boolean") {
              return makeBooleanValue(lhsValue.isTrue !== rhsValue.isTrue);
            } else {
              throw new RuntimeError("Trying to compare values of different types", {
                runtimeErrorKind: "typeMismatch",
                expectedTypes: [lhsValue.valueKind],
                actualType: rhsValue.valueKind,
              });
            }
        }
      }
      case "variableRef": {
        const variableValue = lookupInEnvironment(expr.variableName, env);

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
        if (isSome(possibleVal)) {
          return possibleVal.value;
        } else {
          throw new Error("Insert runtime error for trying to access nonexistent field");
        }
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

      const functionLocalEnv: Environment = {
        values: new Map<Identifier, Option<Value>>(),
        parentEnvironment: func.env,
      };
      for (let i = 0; i < func.argNames.length; i++) {
        defineInEnvironment(func.argNames[i], functionLocalEnv);
        assignInEnvironment(func.argNames[i], args[i], functionLocalEnv);
      }

      const result = evaluateBlock(functionLocalEnv, func.body);
      if (isNone(result)) {
        throw new RuntimeError("No return statement in block", {
          runtimeErrorKind: "noReturn",
        });
      }

      return result.value;
    } else {
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
          throw new Error("Returning objects from native functions not yet supported!");
      }
    }
  };

  // returns None if the block has no return statement; lack of returns are caught by apply() for function bodies, main driver for main block
  // if there is a return, returns Some
  const evaluateBlock = (env: Environment, block: Block): Option<Value> => {
    for (const statement of block) {
      switch (statement.statementKind) {
        case "return": {
          return some(evaluateExpr(env, statement.returnedValue));
        }
        case "varDecl": {
          defineInEnvironment(statement.variableName, env);
          break;
        }
        case "assignment": {
          const successfullyAssigned = assignInEnvironment(
            statement.variableName,
            evaluateExpr(env, statement.variableValue),
            env,
          );
          if (!successfullyAssigned) {
            throw new RuntimeError(`Variable ${statement.variableName} not in scope`, {
              runtimeErrorKind: "notInScope",
              outOfScopeIdentifier: statement.variableName,
            });
          }

          break;
        }
        case "funcDecl": {
          const closureEnv: Environment = {
            values: new Map<Identifier, Option<Value>>(),
            parentEnvironment: env,
          };
          const closureValue = makeClosureValue(statement.functionName, statement.argNames, statement.body, closureEnv);

          defineInEnvironment(statement.functionName, closureEnv);
          assignInEnvironment(statement.functionName, closureValue, closureEnv);

          defineInEnvironment(statement.functionName, env);
          assignInEnvironment(statement.functionName, closureValue, env);
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

          const blockEnv: Environment = {
            values: new Map<Identifier, Option<Value>>(),
            parentEnvironment: env,
          };

          if (condition.isTrue) {
            const blockResult = evaluateBlock(blockEnv, statement.trueBody);
            if (isSome(blockResult)) {
              return blockResult;
            }

            break;
          } else {
            const blockResult = evaluateBlock(blockEnv, statement.falseBody);
            if (isSome(blockResult)) {
              return blockResult;
            }

            break;
          }
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
              const blockEnv: Environment = {
                values: new Map<Identifier, Option<Value>>(),
                parentEnvironment: env,
              };
              const blockResult = evaluateBlock(blockEnv, statement.body);
              if (isSome(blockResult)) {
                return blockResult;
              }
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
      }
    }

    return none;
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
    ];

    nativeFuncs.forEach((nativeFunc) => {
      defineInEnvironment(nativeFunc.funcName, env);
      assignInEnvironment(nativeFunc.funcName, nativeFunc, env);
    });
  };

  // main driver
  try {
    const topLevelEnv = {
      values: new Map<Identifier, Option<Value>>(),
    };
    defineNativeFunctions(topLevelEnv);
    const evalResult = evaluateBlock(topLevelEnv, program);
    if (isNone(evalResult)) {
      throw new RuntimeError("No return statement in main program", {
        runtimeErrorKind: "noReturn",
      });
    }

    return right(evalResult.value);
  } catch (err) {
    if (err instanceof RuntimeError) {
      return left(err.underlyingFailure);
    } else {
      throw err;
    }
  }
};
