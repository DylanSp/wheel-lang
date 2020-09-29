import { Either, isLeft, left, Right } from "fp-ts/lib/Either";
import { ScanError, Token, scan } from "./scanner";
import { ParseFailure, parseModule, Module } from "./parser";
import { RuntimeFailure, Value, evaluateProgram } from "./evaluator";

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

export const runProgram = (moduleTexts: Array<string>): Either<PipelineError, Value> => {
  const scanResults = moduleTexts.map(scan);

  if (scanResults.some(isLeft)) {
    const scanErrors = scanResults.filter(isLeft).reduce((prev, current) => {
      return prev.concat(current.left);
    }, [] as Array<ScanError>);
    return left({
      pipelineErrorKind: "scan",
      scanErrors,
    });
  }

  const scannedModules = scanResults.map((result) => (result as Right<Array<Token>>).right);
  const parsedModules: Array<Module> = [];
  scannedModules.forEach((scannedModule) => {
    const parseResult = parseModule(scannedModule);
    if (isLeft(parseResult)) {
      throw new Error("Bad parse");
    }
    parsedModules.push(parseResult.right);
  });

  const evalResult = evaluateProgram(parsedModules);
  if (isLeft(evalResult)) {
    throw new Error("Bad eval");
  }
  return evalResult;
};
