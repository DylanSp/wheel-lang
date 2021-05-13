import { Identifier } from "./universal_types";

export type Token =
  | LeftBrace
  | RightBrace
  | LeftParen
  | RightParen
  | SingleEquals
  | LetKeyword
  | FunctionKeyword
  | ReturnKeyword
  | IfKeyword
  | ElseKeyword
  | WhileKeyword
  | NullKeyword
  | ClassKeyword
  | ConstructorKeyword
  | ThisKeyword
  | Semicolon
  | Colon
  | Comma
  | Period
  | PlusToken
  | MinusToken
  | Asterisk
  | ForwardSlash
  | ExclamationPoint
  | DoubleEquals
  | NotEqualsToken
  | Ampersand
  | VerticalBar
  | LessThanToken
  | LessThanEqualsToken
  | GreaterThanToken
  | GreaterThanEqualsToken
  | ModuleToken
  | ImportToken
  | ExportToken
  | FromToken
  | NumberToken
  | BooleanToken
  | IdentifierToken
  | StringToken;

interface LeftBrace {
  tokenKind: "leftBrace";
}

interface RightBrace {
  tokenKind: "rightBrace";
}

interface LeftParen {
  tokenKind: "leftParen";
}

interface RightParen {
  tokenKind: "rightParen";
}

interface SingleEquals {
  tokenKind: "singleEquals";
}

interface LetKeyword {
  tokenKind: "let";
}

interface FunctionKeyword {
  tokenKind: "function";
}

interface ReturnKeyword {
  tokenKind: "return";
}

interface IfKeyword {
  tokenKind: "if";
}

interface ElseKeyword {
  tokenKind: "else";
}

interface WhileKeyword {
  tokenKind: "while";
}

interface NullKeyword {
  tokenKind: "null";
}

interface ClassKeyword {
  tokenKind: "class";
}

interface ConstructorKeyword {
  tokenKind: "constructor";
}

interface ThisKeyword {
  tokenKind: "this";
}

interface Semicolon {
  tokenKind: "semicolon";
}

interface Colon {
  tokenKind: "colon";
}

interface Comma {
  tokenKind: "comma";
}

interface Period {
  tokenKind: "period";
}

interface PlusToken {
  tokenKind: "plus";
}

interface MinusToken {
  tokenKind: "minus";
}

interface Asterisk {
  tokenKind: "asterisk";
}

interface ForwardSlash {
  tokenKind: "forwardSlash";
}

interface ExclamationPoint {
  tokenKind: "exclamationPoint";
}

interface DoubleEquals {
  tokenKind: "doubleEquals";
}

interface NotEqualsToken {
  tokenKind: "notEqual";
}

interface Ampersand {
  tokenKind: "ampersand";
}

interface VerticalBar {
  tokenKind: "verticalBar";
}

interface LessThanToken {
  tokenKind: "lessThan";
}

interface LessThanEqualsToken {
  tokenKind: "lessThanEquals";
}

interface GreaterThanToken {
  tokenKind: "greaterThan";
}

interface GreaterThanEqualsToken {
  tokenKind: "greaterThanEquals";
}

interface ModuleToken {
  tokenKind: "module";
}

interface ImportToken {
  tokenKind: "import";
}

interface ExportToken {
  tokenKind: "export";
}

interface FromToken {
  tokenKind: "from";
}

export interface NumberToken {
  tokenKind: "number";
  value: number;
}

export interface BooleanToken {
  tokenKind: "boolean";
  isTrue: boolean;
}

export interface IdentifierToken {
  tokenKind: "identifier";
  name: Identifier;
}

export interface StringToken {
  tokenKind: "string";
  value: string;
}

export interface ScanError {
  invalidLexeme: string;
}
