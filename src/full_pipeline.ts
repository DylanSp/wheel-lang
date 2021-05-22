import { Either, isLeft, left, Right } from "fp-ts/lib/Either";
import { scan } from "./scanner";
import { parseModule } from "./parser";
import { evaluateProgram, NativeFunctionImplementations } from "./evaluator";
import { isCyclicDependencyPresent } from "./cycle_checker";
import { desugar } from "./desugar";
import { ScanError, Token } from "./scanner_types";
import { Module, ParseFailure } from "./parser_types";
import { RuntimeFailure, Value } from "./evaluator_types";

/**
 * TYPES
 */

interface PipelineScanError {
  pipelineErrorKind: "scan";
  scanErrors: Array<ScanError>;
}

interface PipelineParseError {
  pipelineErrorKind: "parse";
  parseErrors: Array<ParseFailure>;
}

interface PipelineCircularDependencyError {
  pipelineErrorKind: "circularDep";
}

interface PipelineEvalError {
  pipelineErrorKind: "evaluation";
  evalError: RuntimeFailure;
}

type PipelineError = PipelineScanError | PipelineParseError | PipelineCircularDependencyError | PipelineEvalError;

export const runProgram =
  (nativeFunctions: NativeFunctionImplementations) =>
  (moduleTexts: Array<string>): Either<PipelineError, Value> => {
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

    const parseResults = scannedModules.map(parseModule);
    if (parseResults.some(isLeft)) {
      const parseErrors = parseResults.filter(isLeft).reduce((prev, current) => {
        return prev.concat([current.left]);
      }, [] as Array<ParseFailure>);
      return left({
        pipelineErrorKind: "parse",
        parseErrors,
      });
    }

    const parsedModules = parseResults.map((result) => (result as Right<Module>).right);
    const desugaredModules = parsedModules.map(desugar);

    const hasDependencyCycle = isCyclicDependencyPresent(desugaredModules);
    if (hasDependencyCycle) {
      return left({
        pipelineErrorKind: "circularDep",
      });
    }

    const evalResult = evaluateProgram(nativeFunctions)(desugaredModules);
    if (isLeft(evalResult)) {
      return left({
        pipelineErrorKind: "evaluation",
        evalError: evalResult.left,
      });
    }
    return evalResult;
  };
