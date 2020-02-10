import { Program, Expression, Block } from "./parser";
import { Either, right } from "fp-ts/lib/Either";
import { Identifier } from "./types";

/**
 * TYPES
 */

// TODO use
type Environment = Record<Identifier, Value>;

export interface RuntimeError {
  message: string;
}

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
  env: Record<Identifier, Value>;
}

const makeClosureValue = (
  closureName: Identifier,
  argNames: Array<Identifier>,
  body: Block,
  env: Record<Identifier, Value>,
): ClosureValue => ({
  valueKind: "closure",
  closureName,
  argNames,
  body,
  env,
});

type Value = NumberValue | ClosureValue;

type Evaluate = (program: Program) => Either<RuntimeError, Value>;

const evaluateExpr = (env: Record<Identifier, Value>, expr: Expression): Value => {
  // TODO refactor to switch
  if (expr.expressionKind === "number") {
    return makeNumberValue(expr.value);
  } else if (expr.expressionKind === "binOp") {
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
  } else if (expr.expressionKind === "variableRef") {
    return env[expr.variableName];
  } else if (expr.expressionKind === "funcCall") {
    const func = evaluateExpr(env, expr.callee);
    const args = expr.args.map((arg) => evaluateExpr(env, arg));
    return apply(func, args);
  }

  throw new Error("Not implemented");
};

const apply = (func: Value, args: Array<Value>): Value => {
  if (func.valueKind !== "closure") {
    throw new Error("Attempting to apply non-closure");
  }

  // TODO check that func.argNames.length === args.length

  const envWithArgs: Record<Identifier, Value> = {};
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

const evaluateBlock = (env: Record<Identifier, Value>, block: Block): Value => {
  for (const statement of block) {
    // TODO refactor to switch
    if (statement.statementKind === "return") {
      return evaluateExpr(env, statement.returnedValue);
    } else if (statement.statementKind === "assignment") {
      env[statement.variableName] = evaluateExpr(env, statement.variableValue);
    } else if (statement.statementKind === "funcDecl") {
      env[statement.functionName] = makeClosureValue(statement.functionName, statement.args, statement.body, env);
    } else {
      throw new Error("Not implemented!");
    }
  }

  throw new Error("No statements");
};

export const evaluate: Evaluate = (program) => {
  return right(evaluateBlock({}, program));
};
