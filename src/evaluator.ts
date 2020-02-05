import { Program, Expression } from "./parser";
import { Either, right } from "fp-ts/lib/Either";
import { Identifier } from "./types";

/**
 * TYPES
 */

export interface RuntimeError {
  message: string;
}

type Value = number;

type Evaluate = (program: Program) => Either<RuntimeError, Value>;

const evaluateExpr = (env: Record<Identifier, Value>, expr: Expression): Value => {
  if (expr.expressionKind === "number") {
    return expr.value;
  } else if (expr.expressionKind === "binOp") {
    const lhsValue = evaluateExpr(env, expr.leftOperand);
    const rhsValue = evaluateExpr(env, expr.rightOperand);

    switch (expr.operation) {
      case "add":
        return lhsValue + rhsValue;
      case "subtract":
        return lhsValue - rhsValue;
      case "multiply":
        return lhsValue * rhsValue;
      case "divide":
        return lhsValue / rhsValue;
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
    } else {
      throw new Error("Not implemented!");
    }
  }

  throw new Error("No statements");
};
