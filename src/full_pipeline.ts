import { Either, right, mapLeft, chain } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import { ScanError, Token, scan } from "./scanner";
import { ParseFailure, Program, parseModule } from "./parser";
import { RuntimeFailure, Value, evaluateModule } from "./evaluator";

/**
 * TYPES
 */

interface PipelineScanError {
  pipelineErrorKind: "scan";
  scanErrors: Array<ScanError>;
}

interface PipelineParseError {
  pipelineErrorKind: "parse";
  parseError: ParseFailure;
}

interface PipelineEvalError {
  pipelineErrorKind: "evaluation";
  evalError: RuntimeFailure;
}

type PipelineError = PipelineScanError | PipelineParseError | PipelineEvalError;

type RunProgram = (programText: string) => Either<PipelineError, Value>;

export const runProgram: RunProgram = (programText) => {
  const liftedScan = (input: string): Either<PipelineError, Array<Token>> => {
    return mapLeft((scanErrors: Array<ScanError>) => ({
      pipelineErrorKind: "scan" as const,
      scanErrors,
    }))(scan(input));
  };

  const liftedParse = (input: Array<Token>): Either<PipelineError, Program> => {
    return mapLeft((parseError: ParseFailure) => ({
      pipelineErrorKind: "parse" as const,
      parseError,
    }))(parseModule(input));
  };

  const liftedEval = (input: Program): Either<PipelineError, Value> => {
    return mapLeft((evalError: RuntimeFailure) => ({
      pipelineErrorKind: "evaluation" as const,
      evalError,
    }))(evaluateModule(input));
  };

  return pipe(right(programText), chain(liftedScan), chain(liftedParse), chain(liftedEval));
};
