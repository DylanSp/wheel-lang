import { Program } from "./parser";
import { Either, right } from "fp-ts/lib/Either";

/**
 * TYPES
 */

export interface RuntimeError {
  message: string;
}

type EvaluateResult = number;

type Evaluate = (program: Program) => Either<RuntimeError, EvaluateResult>;

export const evaluate: Evaluate = (program) => {
  return right(1);
};
