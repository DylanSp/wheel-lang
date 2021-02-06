import { Identifier } from "./universal_types";

export interface Module {
  name: Identifier;
  body: Block;
  exports: Array<Identifier>;
}

export type Block = Array<Statement>;

export type Statement =
  | FunctionDeclaration
  | ReturnStatement
  | VariableDeclaration
  | VariableAssignment
  | IfStatement
  | WhileStatement
  | SetStatement
  | ExpressionStatement
  | ImportStatement
  | ClassDeclaration;

interface FunctionDeclaration {
  statementKind: "funcDecl";
  functionName: Identifier;
  argNames: Array<Identifier>;
  body: Block;
}

interface ReturnStatement {
  statementKind: "return";
  returnedValue?: Expression;
}

interface VariableDeclaration {
  statementKind: "varDecl";
  variableName: Identifier;
}

interface VariableAssignment {
  statementKind: "assignment";
  variableName: Identifier;
  variableValue: Expression;
}

export interface IfStatement {
  statementKind: "if";
  condition: Expression;
  trueBody: Block;
  falseBody: Block;
}

interface WhileStatement {
  statementKind: "while";
  condition: Expression;
  body: Block;
}

interface SetStatement {
  statementKind: "set";
  object: Expression;
  field: Identifier;
  value: Expression;
}

interface ExpressionStatement {
  statementKind: "expression";
  expression: Expression;
}

interface ImportStatement {
  statementKind: "import";
  moduleName: Identifier;
  imports: Array<Identifier>;
}

interface ClassDeclaration {
  statementKind: "classDecl";
  className: Identifier;
  constructor: Constructor;
  methods: Array<Method>;
}

export interface Constructor {
  argNames: Array<Identifier>;
  body: Block;
}

export interface Method {
  methodName: Identifier;
  argNames: Array<Identifier>;
  body: Block;
}

export type Expression =
  | BinaryOperation
  | UnaryOperation
  | NumberLiteral
  | BooleanLiteral
  | ObjectLiteral
  | NullLiteral
  | StringLiteral
  | FunctionCall
  | VariableRef
  | Getter;

interface BinaryOperation {
  expressionKind: "binOp";
  binOp: BinaryOperationKind;
  leftOperand: Expression;
  rightOperand: Expression;
}

export type BinaryOperationKind = ArithmeticBinaryOperation | LogicalBinaryOperation | RelationalOperation;

type ArithmeticBinaryOperation = "add" | "subtract" | "multiply" | "divide";

type LogicalBinaryOperation = "and" | "or";

type RelationalOperation = "lessThan" | "greaterThan" | "lessThanEquals" | "greaterThanEquals" | "equals" | "notEqual";

interface UnaryOperation {
  expressionKind: "unaryOp";
  unaryOp: LogicalUnaryOperation | ArithmeticUnaryOperation;
  operand: Expression;
}

export type LogicalUnaryOperation = "not";

type ArithmeticUnaryOperation = "negative";

interface NumberLiteral {
  expressionKind: "numberLit";
  value: number;
}

interface BooleanLiteral {
  expressionKind: "booleanLit";
  isTrue: boolean;
}

export interface ObjectLiteral {
  expressionKind: "objectLit";
  fields: Array<ObjectField>;
}

interface ObjectField {
  fieldName: Identifier;
  fieldValue: Expression;
}

interface NullLiteral {
  expressionKind: "nullLit";
}

interface StringLiteral {
  expressionKind: "stringLit";
  value: string;
}

interface FunctionCall {
  expressionKind: "funcCall";
  callee: Expression; // needs to be an expression to allow for multiple calls, i.e. f()()
  args: Array<Expression>;
}

interface VariableRef {
  expressionKind: "variableRef";
  variableName: Identifier;
}

interface Getter {
  expressionKind: "get";
  object: Expression;
  field: Identifier;
}

export interface ParseFailure {
  message: string;
}

export class ParseError extends Error {
  constructor(public readonly message: string) {
    super(message);
  }
}
