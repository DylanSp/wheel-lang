import { Program, Expression, Block } from "./parser";
import { Either, right, left } from "fp-ts/lib/Either";
import { Identifier } from "./types";

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

export type Value = NumberValue | ClosureValue;

type Evaluate = (program: Program) => Either<RuntimeFailure, Value>;

export const evaluate: Evaluate = (program) => {
  // utility functions
  const evaluateExpr = (env: Environment, expr: Expression): Value => {
    switch (expr.expressionKind) {
      case "number": {
        return makeNumberValue(expr.value);
      }
      case "binOp": {
        const lhsValue = evaluateExpr(env, expr.leftOperand);
        const rhsValue = evaluateExpr(env, expr.rightOperand);

        if (lhsValue.valueKind !== "number" || rhsValue.valueKind !== "number") {
          throw new RuntimeError("Trying to perform binOp on non-numeric values", {
            runtimeErrorKind: "typeMismatch",
            expectedType: "number",
            actualType: lhsValue.valueKind !== "number" ? lhsValue.valueKind : rhsValue.valueKind,
          });
        }

        switch (expr.operation) {
          case "add":
            return makeNumberValue(lhsValue.value + rhsValue.value);
          case "subtract":
            return makeNumberValue(lhsValue.value - rhsValue.value);
          case "multiply":
            return makeNumberValue(lhsValue.value * rhsValue.value);
          case "divide":
            return makeNumberValue(lhsValue.value / rhsValue.value);
        }
      }
      case "variableRef": {
        const variableValue = env.get(expr.variableName);
        if (variableValue === undefined) {
          throw new RuntimeError(`Variable ${expr.variableName} not in scope`, {
            runtimeErrorKind: "notInScope",
            outOfScopeIdentifier: expr.variableName,
          });
        }

        return variableValue;
      }
      case "funcCall": {
        const func = evaluateExpr(env, expr.callee);
        const args = expr.args.map((arg) => evaluateExpr(env, arg));
        return apply(func, args);
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

    return evaluateBlock(envWithArgs, func.body);
  };

  const evaluateBlock = (env: Environment, block: Block): Value => {
    // TODO check that is true deep copy with Map copy constructor
    const blockEnv = new Map(env); // TODO immer for guaranteed immutability?
    for (const statement of block) {
      switch (statement.statementKind) {
        case "return": {
          return evaluateExpr(blockEnv, statement.returnedValue);
        }
        case "assignment": {
          blockEnv.set(statement.variableName, evaluateExpr(blockEnv, statement.variableValue));
          break;
        }
        case "funcDecl": {
          const closureValue = makeClosureValue(
            statement.functionName,
            statement.argNames,
            statement.body,
            new Map(blockEnv), // make copy of blockEnv so later changes to blockEnv don't affect the environment captured by the closure
            // TODO immer?
          );
          blockEnv.set(statement.functionName, closureValue);
          break;
        }
      }
    }

    throw new RuntimeError("No return statement in block", {
      runtimeErrorKind: "noReturn",
    });
  };

  // main driver
  try {
    const evalResult = evaluateBlock(new Map<Identifier, Value>(), program);
    return right(evalResult);
  } catch (err) {
    if (err instanceof RuntimeError) {
      return left(err.underlyingFailure);
    } else {
      throw err;
    }
  }
};
