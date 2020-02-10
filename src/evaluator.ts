import { Program, Expression, Block } from "./parser";
import { Either, right } from "fp-ts/lib/Either";
import { Identifier } from "./types";

/**
 * TYPES
 */

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
  name: Identifier;
  body: Block;
  env: Record<Identifier, Value>;
}

type Value = NumberValue | ClosureValue;

type Evaluate = (program: Program) => Either<RuntimeError, Value>;

const evaluateExpr = (env: Record<Identifier, Value>, expr: Expression): Value => {
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
  }

  throw new Error("Not implemented");
};

export const evaluate: Evaluate = (program) => {
  const env: Record<Identifier, Value> = {};

  for (const statement of program) {
    if (statement.statementKind === "return") {
      return right(evaluateExpr(env, statement.returnedValue));
    } else if (statement.statementKind === "assignment") {
      env[statement.variableName] = evaluateExpr(env, statement.variableValue);
    } else if (statement.statementKind === "funcDecl") {
      throw new Error("Function decl not implemented");
    } else {
      throw new Error("Not implemented!");
    }
  }

  throw new Error("No statements");
};
