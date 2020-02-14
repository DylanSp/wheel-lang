import { ScanError, Token, scan } from "./scanner";
import { ParseFailure, Program, parse } from "./parser";
import { RuntimeFailure, Value, evaluate } from "./evaluator";
import { Either, right, mapLeft, chain } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";

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

// TODO should this return Value? or should we constrain it to just number?
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
    }))(parse(input));
  };

  const liftedEval = (input: Program): Either<PipelineError, Value> => {
    return mapLeft((evalError: RuntimeFailure) => ({
      pipelineErrorKind: "evaluation" as const,
      evalError,
    }))(evaluate(input));
  };

  return pipe(right(programText), chain(liftedScan), chain(liftedParse), chain(liftedEval));
};
