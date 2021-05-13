import { isLeft } from "fp-ts/lib/Either";
import { insertAt, lookup } from "fp-ts/lib/Map";
import { isNone, none, Option, some } from "fp-ts/lib/Option";
import { evaluateModule } from "./evaluator";
import { ImportResult, NativeFunctionValue, NATIVE_MODULE_NAME, RuntimeError, Value } from "./evaluator_types";
import { Module } from "./parser_types";
import { eqIdentifier, Identifier } from "./universal_types";

export class ExportedValues {
  // maps module names to their exports
  // value of None represents an un-evaluated module,
  // value of Some represents an evaluated module
  private exportValues: Map<Identifier, Option<Map<Identifier, Value>>>;

  private modules: Array<Module>;
  private nativeFuncs?: Array<NativeFunctionValue>;

  public constructor(modules: Array<Module>, nativeFuncs?: Array<NativeFunctionValue>) {
    this.modules = modules;
    this.nativeFuncs = nativeFuncs;

    this.exportValues = new Map<Identifier, Option<Map<Identifier, Value>>>();
    modules
      .map((module) => module.name)
      .forEach((moduleName) => {
        this.exportValues = insertAt(eqIdentifier)(moduleName, none as Option<Map<Identifier, Value>>)(
          this.exportValues,
        );
      });
  }

  public getExportedValue = (moduleName: Identifier, exportName: Identifier): ImportResult => {
    if (moduleName === NATIVE_MODULE_NAME) {
      const possibleNativeExport = this.nativeFuncs?.find((nativeFunc) => nativeFunc.funcName === exportName);
      if (possibleNativeExport === undefined) {
        return {
          exportResultKind: "noSuchExport",
        };
      }

      return {
        exportResultKind: "validExport",
        exportedValue: possibleNativeExport,
      };
    }

    const possibleExports = lookup(eqIdentifier)(moduleName)(this.exportValues);
    const moduleToExport = this.modules.find((module) => module.name === moduleName);
    if (isNone(possibleExports) || moduleToExport === undefined) {
      return {
        exportResultKind: "noSuchModule",
      };
    }

    let exportValues: Map<Identifier, Value>;

    if (isNone(possibleExports.value)) {
      const moduleEvalResult = evaluateModule(this, moduleToExport);
      if (isLeft(moduleEvalResult)) {
        throw new RuntimeError(`Error evaluating imported module ${moduleName}`, moduleEvalResult.left);
      }
      const moduleExports = moduleEvalResult.right[1];

      this.exportValues = insertAt(eqIdentifier)(moduleName, some(moduleExports))(this.exportValues);
      exportValues = moduleExports;
    } else {
      exportValues = possibleExports.value.value;
    }

    const possibleExport = lookup(eqIdentifier)(exportName)(exportValues);
    if (isNone(possibleExport)) {
      return {
        exportResultKind: "noSuchExport",
      };
    }

    return {
      exportResultKind: "validExport",
      exportedValue: possibleExport.value,
    };
  };
}
