import { Program, Expression } from "./parser";
import { Either, right } from "fp-ts/lib/Either";

/**
 * TYPES
 */

export interface RuntimeError {
  message: string;
}

type EvaluateResult = number;

type Evaluate = (program: Program) => Either<RuntimeError, EvaluateResult>;

const evaluateExpr = (expr: Expression): number => {
  if (expr.expressionKind === "number") {
    return expr.value;
  } else if (expr.expressionKind === "binOp") {
    const lhsValue = evaluateExpr(expr.leftOperand);
    const rhsValue = evaluateExpr(expr.rightOperand);

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
  }

  throw new Error("Not implemented");
};

export const evaluate: Evaluate = (program) => {
  if (program[0].statementKind === "return") {
    return right(evaluateExpr(program[0].returnedValue));
  }

  throw new Error("Not implemented");
};
