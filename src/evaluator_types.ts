import { Environment } from "./environment";
import { Block } from "./parser_types";
import { Identifier, identifierIso } from "./universal_types";

interface NotInScopeError {
  runtimeErrorKind: "notInScope";
  outOfScopeIdentifier: Identifier;
}

interface NotFunctionError {
  runtimeErrorKind: "notFunction";
  nonFunctionType: ValueKind;
}

interface TypeMismatchError {
  runtimeErrorKind: "typeMismatch";
  expectedTypes: Array<ValueKind>;
  actualType: ValueKind;
}

interface ArityMismatchError {
  runtimeErrorKind: "arityMismatch";
  expectedNumArgs: number;
  actualNumArgs: number;
}

interface UnassignedVariableError {
  runtimeErrorKind: "unassignedVariable";
  unassignedIdentifier: Identifier;
}

interface NativeFunctionReturnedFunctionError {
  runtimeErrorKind: "nativeFunctionReturnFunc";
  nativeFunctionName: Identifier;
}

interface NotObjectError {
  runtimeErrorKind: "notObject";
  nonObjectType: ValueKind;
}

interface NoMainError {
  runtimeErrorKind: "noMain";
}

interface NoSuchModuleError {
  runtimeErrorKind: "noSuchModule";
  moduleName: Identifier;
}

interface NoSuchExportError {
  runtimeErrorKind: "noSuchExport";
  exportName: Identifier;
}

interface MultipleMainsError {
  runtimeErrorKind: "multipleMains";
}

export class RuntimeError extends Error {
  constructor(public readonly message: string, public readonly underlyingFailure: RuntimeFailure) {
    super(message);
  }
}

export type RuntimeFailure =
  | NotInScopeError
  | NotFunctionError
  | TypeMismatchError
  | ArityMismatchError
  | UnassignedVariableError
  | NativeFunctionReturnedFunctionError
  | NotObjectError
  | NoMainError
  | NoSuchModuleError
  | NoSuchExportError
  | MultipleMainsError;

interface NumberValue {
  valueKind: "number";
  value: number;
}

export const makeNumberValue = (value: number): NumberValue => ({
  valueKind: "number",
  value,
});

interface BooleanValue {
  valueKind: "boolean";
  isTrue: boolean;
}

export const makeBooleanValue = (value: boolean): BooleanValue => ({
  valueKind: "boolean",
  isTrue: value,
});

interface ClosureValue {
  valueKind: "closure";
  closureName: Identifier;
  argNames: Array<Identifier>;
  body: Block;
  env: Environment;
}

export const makeClosureValue = (
  closureName: Identifier,
  argNames: Array<Identifier>,
  body: Block,
  env: Environment,
): ClosureValue => ({
  valueKind: "closure",
  closureName,
  argNames,
  body,
  env,
});

export interface NativeFunctionValue {
  valueKind: "nativeFunc";
  funcName: Identifier;
  argCount: number;
  body: Function;
  returnType: ValueKind;
}

interface NullValue {
  valueKind: "null";
}

export const makeNullValue = (): NullValue => ({
  valueKind: "null",
});

export interface ObjectValue {
  valueKind: "object";
  fields: Map<Identifier, Value>;
}

export const makeObjectValue = (fields: Map<Identifier, Value>): ObjectValue => ({
  valueKind: "object",
  fields,
});

export interface StringValue {
  valueKind: "string";
  value: string;
}

export const makeStringValue = (value: string): StringValue => {
  return {
    valueKind: "string",
    value,
  };
};

type ValueKind = Value["valueKind"];
export type Value =
  | NumberValue
  | BooleanValue
  | ClosureValue
  | NativeFunctionValue
  | NullValue
  | ObjectValue
  | StringValue;

export class Return extends Error {
  constructor(public readonly possibleValue: Value) {
    super();
  }
}

export type ImportResult =
  | { exportResultKind: "noSuchModule" }
  | { exportResultKind: "noSuchExport" }
  | { exportResultKind: "validExport"; exportedValue: Value };

export const NATIVE_MODULE_NAME = identifierIso.wrap("Native");
