import { Program, Expression, Block } from "./parser";
import { Either, right, left } from "fp-ts/lib/Either";
import { lookup } from "fp-ts/lib/Map";
import { Identifier, eqIdentifier } from "./types";
import { isNone, Option, some, isSome, none } from "fp-ts/lib/Option";

/**
 * TYPES
 */

type Environment = Map<Identifier, Value>;

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
  expectedType: string;
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
  | ArityMismatchError;

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

export type Value = NumberValue | BooleanValue | ClosureValue;

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
                expectedType: "number",
                actualType: lhsValue.valueKind !== "number" ? lhsValue.valueKind : rhsValue.valueKind,
              });
            }
            return makeNumberValue(lhsValue.value + rhsValue.value);
          case "subtract":
            if (lhsValue.valueKind !== "number" || rhsValue.valueKind !== "number") {
              throw new RuntimeError("Trying to perform binOp on non-numeric values", {
                runtimeErrorKind: "typeMismatch",
                expectedType: "number",
                actualType: lhsValue.valueKind !== "number" ? lhsValue.valueKind : rhsValue.valueKind,
              });
            }
            return makeNumberValue(lhsValue.value - rhsValue.value);
          case "multiply":
            if (lhsValue.valueKind !== "number" || rhsValue.valueKind !== "number") {
              throw new RuntimeError("Trying to perform binOp on non-numeric values", {
                runtimeErrorKind: "typeMismatch",
                expectedType: "number",
                actualType: lhsValue.valueKind !== "number" ? lhsValue.valueKind : rhsValue.valueKind,
              });
            }
            return makeNumberValue(lhsValue.value * rhsValue.value);
          case "divide":
            if (lhsValue.valueKind !== "number" || rhsValue.valueKind !== "number") {
              throw new RuntimeError("Trying to perform binOp on non-numeric values", {
                runtimeErrorKind: "typeMismatch",
                expectedType: "number",
                actualType: lhsValue.valueKind !== "number" ? lhsValue.valueKind : rhsValue.valueKind,
              });
            }
            return makeNumberValue(lhsValue.value / rhsValue.value);
          case "and":
            if (lhsValue.valueKind !== "boolean" || rhsValue.valueKind !== "boolean") {
              throw new RuntimeError("Trying to perform logical operation on non-boolean values", {
                runtimeErrorKind: "typeMismatch",
                expectedType: "boolean",
                actualType: lhsValue.valueKind !== "boolean" ? lhsValue.valueKind : rhsValue.valueKind,
              });
            }
            return makeBooleanValue(lhsValue.isTrue && rhsValue.isTrue);
          case "or":
            if (lhsValue.valueKind !== "boolean" || rhsValue.valueKind !== "boolean") {
              throw new RuntimeError("Trying to perform logical operation on non-boolean values", {
                runtimeErrorKind: "typeMismatch",
                expectedType: "boolean",
                actualType: lhsValue.valueKind !== "boolean" ? lhsValue.valueKind : rhsValue.valueKind,
              });
            }
            return makeBooleanValue(lhsValue.isTrue || rhsValue.isTrue);
          case "lessThan":
            if (lhsValue.valueKind !== "number" || rhsValue.valueKind !== "number") {
              throw new RuntimeError("Trying to compare non-numeric values", {
                runtimeErrorKind: "typeMismatch",
                expectedType: "number",
                actualType: lhsValue.valueKind !== "number" ? lhsValue.valueKind : rhsValue.valueKind,
              });
            }
            return makeBooleanValue(lhsValue.value < rhsValue.value);
          case "greaterThan":
            if (lhsValue.valueKind !== "number" || rhsValue.valueKind !== "number") {
              throw new RuntimeError("Trying to compare non-numeric values", {
                runtimeErrorKind: "typeMismatch",
                expectedType: "number",
                actualType: lhsValue.valueKind !== "number" ? lhsValue.valueKind : rhsValue.valueKind,
              });
            }
            return makeBooleanValue(lhsValue.value > rhsValue.value);
          case "lessThanEquals":
            if (lhsValue.valueKind !== "number" || rhsValue.valueKind !== "number") {
              throw new RuntimeError("Trying to compare non-numeric values", {
                runtimeErrorKind: "typeMismatch",
                expectedType: "number",
                actualType: lhsValue.valueKind !== "number" ? lhsValue.valueKind : rhsValue.valueKind,
              });
            }
            return makeBooleanValue(lhsValue.value <= rhsValue.value);
          case "greaterThanEquals":
            if (lhsValue.valueKind !== "number" || rhsValue.valueKind !== "number") {
              throw new RuntimeError("Trying to compare non-numeric values", {
                runtimeErrorKind: "typeMismatch",
                expectedType: "number",
                actualType: lhsValue.valueKind !== "number" ? lhsValue.valueKind : rhsValue.valueKind,
              });
            }
            return makeBooleanValue(lhsValue.value >= rhsValue.value);
          case "equals":
            if (lhsValue.valueKind === "closure") {
              throw new RuntimeError("Trying to compare closure value", {
                runtimeErrorKind: "typeMismatch",
                expectedType: "number or boolean", // TODO how to denote this in a machine-parseable way? could check rhsValue.valueKind, but what if that's "closure" as well? maybe make expectedType an array?
                actualType: "closure",
              });
            }

            if (rhsValue.valueKind === "closure") {
              throw new RuntimeError("Trying to compare closure value", {
                runtimeErrorKind: "typeMismatch",
                expectedType: "number or boolean", // TODO how to denote this in a machine-parseable way? could check rhsValue.valueKind, but what if that's "closure" as well?
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
                expectedType: lhsValue.valueKind,
                actualType: rhsValue.valueKind,
              });
            }
          case "notEqual":
            if (lhsValue.valueKind === "closure") {
              throw new RuntimeError("Trying to compare closure value", {
                runtimeErrorKind: "typeMismatch",
                expectedType: "number or boolean", // TODO how to denote this in a machine-parseable way? could check rhsValue.valueKind, but what if that's "closure" as well?
                actualType: "closure",
              });
            }

            if (rhsValue.valueKind === "closure") {
              throw new RuntimeError("Trying to compare closure value", {
                runtimeErrorKind: "typeMismatch",
                expectedType: "number or boolean", // TODO how to denote this in a machine-parseable way? could check rhsValue.valueKind, but what if that's "closure" as well?
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
                expectedType: lhsValue.valueKind,
                actualType: rhsValue.valueKind,
              });
            }
        }
      }
      case "variableRef": {
        const variableValue = lookup(eqIdentifier)(expr.variableName, env);
        if (isNone(variableValue)) {
          throw new RuntimeError(`Variable ${expr.variableName} not in scope`, {
            runtimeErrorKind: "notInScope",
            outOfScopeIdentifier: expr.variableName,
          });
        }

        return variableValue.value;
      }
      case "funcCall": {
        const func = evaluateExpr(env, expr.callee);
        const args = expr.args.map((arg) => evaluateExpr(env, arg));
        return apply(func, args);
      }
      case "unaryOp": {
        const operandValue = evaluateExpr(env, expr.operand);
        if (operandValue.valueKind !== "boolean") {
          throw new RuntimeError("Attempting to apply logical not to non-boolean", {
            runtimeErrorKind: "typeMismatch",
            expectedType: "boolean",
            actualType: operandValue.valueKind,
          });
        }
        return makeBooleanValue(!operandValue.isTrue);
      }
    }
  };

  const apply = (func: Value, args: Array<Value>): Value => {
    if (func.valueKind !== "closure") {
      throw new RuntimeError("Attempting to apply non-closure", {
        runtimeErrorKind: "notFunction",
        nonFunctionType: func.valueKind,
      });
    }

    if (func.argNames.length !== args.length) {
      throw new RuntimeError("Wrong number of arguments when applying function", {
        runtimeErrorKind: "arityMismatch",
        expectedNumArgs: func.argNames.length,
        actualNumArgs: args.length,
      });
    }

    const envWithArgs: Environment = new Map<Identifier, Value>();
    for (let i = 0; i < func.argNames.length; i++) {
      envWithArgs.set(func.argNames[i], args[i]);
    }

    for (const [ident, val] of func.env) {
      envWithArgs.set(ident, val);
    }

    const result = evaluateBlock(envWithArgs, func.body);
    if (isNone(result)) {
      throw new RuntimeError("No return statement in block", {
        runtimeErrorKind: "noReturn",
      });
    }

    return result.value;
  };

  // returns None if the block has no return statement; lack of returns are caught by apply() for function bodies, main driver for main block
  // if there is a return, returns Some
  const evaluateBlock = (env: Environment, block: Block): Option<Value> => {
    for (const statement of block) {
      switch (statement.statementKind) {
        case "return": {
          return some(evaluateExpr(env, statement.returnedValue));
        }
        case "assignment": {
          env.set(statement.variableName, evaluateExpr(env, statement.variableValue));
          break;
        }
        case "funcDecl": {
          const closureValue = makeClosureValue(statement.functionName, statement.argNames, statement.body, env);
          closureValue.env.set(statement.functionName, closureValue);
          env.set(statement.functionName, closureValue);
          break;
        }
        case "if": {
          const condition = evaluateExpr(env, statement.condition);
          if (condition.valueKind !== "boolean") {
            throw new RuntimeError("Condition of if-statement evaluated to non-boolean value", {
              runtimeErrorKind: "typeMismatch",
              expectedType: "boolean",
              actualType: condition.valueKind,
            });
          }

          if (condition.isTrue) {
            const blockResult = evaluateBlock(env, statement.trueBody); // use same environment so block can cause side effects
            if (isSome(blockResult)) {
              return blockResult;
            }

            break;
          } else {
            const blockResult = evaluateBlock(env, statement.falseBody); // use same environment so block can cause side effects
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
                expectedType: "boolean",
                actualType: condition.valueKind,
              });
            }

            if (condition.isTrue) {
              const blockResult = evaluateBlock(env, statement.body);
              if (isSome(blockResult)) {
                return blockResult;
              }
            } else {
              break;
            }
          }
        }
      }
    }

    return none;
  };

  // main driver
  try {
    const evalResult = evaluateBlock(new Map<Identifier, Value>(), program);
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
