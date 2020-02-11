import { Program, Expression, Block } from "./parser";
import { Either, right, left } from "fp-ts/lib/Either";
import { Identifier } from "./types";

/**
 * TYPES
 */

type Environment = Record<Identifier, Value>; // TODO use newtype-ts for this?

interface NotInScopeError {
  runtimeErrorKind: "notInScope";
  outOfScopeIdentifier: Identifier;
}

class RuntimeError extends Error {
  constructor(public readonly message: string, public readonly underlyingFailure: RuntimeFailure) {
    super(message);
  }
}

type RuntimeFailure = NotInScopeError;

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

type Value = NumberValue | ClosureValue;

type Evaluate = (program: Program) => Either<RuntimeFailure, Value>;

const evaluateExpr = (env: Environment, expr: Expression): Value => {
  switch (expr.expressionKind) {
    case "number": {
      return makeNumberValue(expr.value);
    }
    case "binOp": {
      const lhsValue = evaluateExpr(env, expr.leftOperand);
      const rhsValue = evaluateExpr(env, expr.rightOperand);

      if (lhsValue.valueKind !== "number" || rhsValue.valueKind !== "number") {
        throw new Error("Trying to perform a binOp on non-numeric values");
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
      const variableValue = env[expr.variableName];
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
      const args = expr.args.map((arg) => evaluateExpr(env, arg)); // TODO curry evaluateExpr so I can simplify this to expr.args.map(evaluateExpr(env)) ?
      return apply(func, args);
    }
  }
};

const apply = (func: Value, args: Array<Value>): Value => {
  if (func.valueKind !== "closure") {
    throw new Error("Attempting to apply non-closure");
  }

  // TODO check that func.argNames.length === args.length

  const envWithArgs: Environment = {};
  for (let i = 0; i < func.argNames.length; i++) {
    envWithArgs[func.argNames[i]] = args[i];
  }

  return evaluateBlock(
    {
      ...envWithArgs,
      ...func.env,
    },
    func.body,
  );
};

const evaluateBlock = (env: Environment, block: Block): Value => {
  const blockEnv = { ...env }; // TODO immer for guaranteed immutability?
  for (const statement of block) {
    switch (statement.statementKind) {
      case "return": {
        return evaluateExpr(blockEnv, statement.returnedValue);
      }
      case "assignment": {
        blockEnv[statement.variableName] = evaluateExpr(blockEnv, statement.variableValue);
        break;
      }
      case "funcDecl": {
        blockEnv[statement.functionName] = makeClosureValue(statement.functionName, statement.args, statement.body, {
          ...blockEnv, // make copy of blockEnv so later changes to blockEnv don't affect the environment captured by the closure
          // TODO immer?
        });
        break;
      }
    }
  }

  throw new Error("No statements"); // TODO this should only happen if block.length is 0; if not, the error is that there's no return statement in block
};

export const evaluate: Evaluate = (program) => {
  try {
    const evalResult = evaluateBlock({}, program);
    return right(evalResult);
  } catch (err) {
    if (err instanceof RuntimeError) {
      return left(err.underlyingFailure);
    } else {
      throw err;
    }
  }
};
