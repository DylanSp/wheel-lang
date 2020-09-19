import { Either, right, left } from "fp-ts/lib/Either";
import { none, Option, some, isSome } from "fp-ts/lib/Option";
import { IdentifierToken, Token, NumberToken, BooleanToken } from "./scanner";
import { Identifier } from "./types";

/**
 * TYPES
 */

export type Program = Block;

export type Block = Array<Statement>;

type Statement =
  | FunctionDeclaration
  | ReturnStatement
  | VariableDeclaration
  | VariableAssignment
  | IfStatement
  | WhileStatement
  | SetStatement
  | ExpressionStatement;

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

interface IfStatement {
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

export type Expression =
  | BinaryOperation
  | UnaryOperation
  | NumberLiteral
  | BooleanLiteral
  | ObjectLiteral
  | NullLiteral
  | FunctionCall
  | VariableRef
  | Getter;

interface BinaryOperation {
  expressionKind: "binOp";
  binOp: BinaryOperationKind;
  leftOperand: Expression;
  rightOperand: Expression;
}

type BinaryOperationKind = ArithmeticBinaryOperation | LogicalBinaryOperation | RelationalOperation;

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

interface ObjectLiteral {
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

class ParseError extends Error {
  constructor(public readonly message: string) {
    super(message);
  }
}

type Parse = (input: Array<Token>) => Either<ParseFailure, Program>;

export const parse: Parse = (input) => {
  let position = 0;

  /** Grammar entrypoint */
  const parseProgram = (): Program => {
    return parseBlock();
  };

  const parseBlock = (): Block => {
    if (input[position]?.tokenKind !== "leftBrace") {
      throw new ParseError("Expected {");
    }

    position += 1; // move past left brace

    const statements: Array<Statement> = [];

    while (input[position]?.tokenKind !== "rightBrace") {
      switch (input[position]?.tokenKind) {
        case "let": {
          position += 1; // move past "let"

          if (input[position]?.tokenKind !== "identifier") {
            throw new ParseError("Expected identifier");
          }
          const ident = (input[position] as IdentifierToken).name; // cast should always succeed
          position += 1; // move past identifier

          if (input[position]?.tokenKind === "semicolon") {
            position += 1; // move past semicolon

            statements.push({
              statementKind: "varDecl",
              variableName: ident,
            });

            break;
          } else if (input[position]?.tokenKind === "singleEquals") {
            position += 1; // move past "="

            statements.push({
              statementKind: "varDecl",
              variableName: ident,
            });

            const expr = parseLogicalExpr();

            if (input[position]?.tokenKind !== "semicolon") {
              throw new ParseError("Expected ;");
            }
            position += 1; // move past semicolon

            statements.push({
              statementKind: "assignment",
              variableName: ident,
              variableValue: expr,
            });

            break;
          } else {
            throw new ParseError("Expected ; or =");
          }
        }
        case "function": {
          position += 1; // move past "function"

          if (input[position]?.tokenKind !== "identifier") {
            throw new ParseError("Expected identifier");
          }

          const functionName = (input[position] as IdentifierToken).name;
          position += 1; // move past identifier

          if (input[position]?.tokenKind !== "leftParen") {
            throw new ParseError("Expected (");
          }
          position += 1; // move past left paren

          const args: Array<Identifier> = [];
          while (input[position]?.tokenKind === "identifier") {
            args.push((input[position] as IdentifierToken).name);
            position += 1;

            if (input[position]?.tokenKind === "rightParen") {
              break;
            }

            if (input[position]?.tokenKind !== "comma") {
              throw new ParseError("Expected ,");
            }

            position += 1; // move past comma
          }

          if (input[position]?.tokenKind !== "rightParen") {
            throw new ParseError("Expected )");
          }
          position += 1; // move past right paren

          const body = parseBlock();
          statements.push({
            statementKind: "funcDecl",
            functionName,
            argNames: args,
            body,
          });
          break;
        }
        case "return": {
          position += 1; // move past "return"

          if (input[position]?.tokenKind === "semicolon") {
            // empty return
            position += 1; // move past semicolon

            statements.push({
              statementKind: "return",
            });
          } else {
            // returning expression
            const expr = parseLogicalExpr();
            if (input[position]?.tokenKind !== "semicolon") {
              throw new ParseError("Expected ;");
            }
            position += 1; // move past semicolon

            statements.push({
              statementKind: "return",
              returnedValue: expr,
            });
          }

          break;
        }
        case "identifier": {
          const expression = parsePotentialCall();

          if (input[position]?.tokenKind === "semicolon") {
            // standalone function call or variable ref (expression statement)
            position += 1; // move past semicolon

            statements.push({
              statementKind: "expression",
              expression,
            });
          } else if (input[position]?.tokenKind === "singleEquals") {
            position += 1; // move past "="

            const expr = parseLogicalExpr();

            if (input[position]?.tokenKind !== "semicolon") {
              throw new ParseError("Expected ;");
            }
            position += 1; // move past semicolon

            if (expression.expressionKind === "variableRef") {
              statements.push({
                statementKind: "assignment",
                variableName: expression.variableName,
                variableValue: expr,
              });
            } else if (expression.expressionKind === "get") {
              // indicates we're parsing a setter statement
              statements.push({
                statementKind: "set",
                object: expression.object,
                field: expression.field,
                value: expr,
              });
            } else {
              throw new Error("Programming error - trying to parse setter, lhs was neither variableRef nor get");
            }
          } else {
            throw new ParseError("Expected = or ;");
          }

          break;
        }
        case "if": {
          statements.push(parseIfStatement());
          break;
        }
        case "while": {
          position += 1; // move past "while"

          if (input[position]?.tokenKind !== "leftParen") {
            throw new ParseError("Expected (");
          }
          position += 1; // move past left paren

          const condition = parseLogicalExpr();

          if (input[position]?.tokenKind !== "rightParen") {
            throw new ParseError("Expected )");
          }
          position += 1; // move past right paren

          const body = parseBlock();

          statements.push({
            statementKind: "while",
            condition,
            body,
          });
          break;
        }
        case "number":
        case "boolean": {
          const expression = parseLogicalExpr();

          if (input[position]?.tokenKind !== "semicolon") {
            throw new ParseError("Expected ;");
          }

          position += 1; // move past semicolon
          statements.push({
            statementKind: "expression",
            expression,
          });
          break;
        }
        default: {
          throw new ParseError("Expected start of statement or expression");
        }
      }
    }

    position += 1; // move past right brace (we know it's there by while-loop condition)
    return statements;
  };

  const parseIfStatement = (): IfStatement => {
    position += 1; // move past "if"

    if (input[position]?.tokenKind !== "leftParen") {
      throw new ParseError("Expected (");
    }
    position += 1; // move past left paren

    const condition = parseLogicalExpr();

    if (input[position]?.tokenKind !== "rightParen") {
      throw new ParseError("Expected )");
    }
    position += 1; // move past right paren

    const trueBody = parseBlock();

    if (input[position]?.tokenKind !== "else") {
      throw new ParseError('Expected "else"');
    }
    position += 1; // move past "else"

    let falseBody: Block;
    if (input[position]?.tokenKind === "if") {
      falseBody = [parseIfStatement()];
    } else {
      falseBody = parseBlock();
    }

    return {
      statementKind: "if",
      condition,
      trueBody,
      falseBody,
    };
  };

  /** Expression parsing */
  const parseLogicalExpr = (): Expression => {
    let logicalExpr: Expression = parseLogicalTerm();
    while (input[position]?.tokenKind === "verticalBar") {
      position += 1;
      const rightSide = parseLogicalTerm();
      logicalExpr = {
        expressionKind: "binOp",
        binOp: "or",
        leftOperand: logicalExpr,
        rightOperand: rightSide,
      };
    }

    return logicalExpr;
  };

  const parseLogicalTerm = (): Expression => {
    let logicalTerm: Expression = parseRelation();
    while (input[position]?.tokenKind === "ampersand") {
      position += 1;
      const rightSide = parseRelation();
      logicalTerm = {
        expressionKind: "binOp",
        binOp: "and",
        leftOperand: logicalTerm,
        rightOperand: rightSide,
      };
    }

    return logicalTerm;
  };

  const parseRelation = (): Expression => {
    let relation = parseExpr();

    let relOp: Option<BinaryOperationKind>;
    switch (input[position]?.tokenKind) {
      case "lessThan":
        relOp = some("lessThan");
        break;
      case "lessThanEquals":
        relOp = some("lessThanEquals");
        break;
      case "greaterThan":
        relOp = some("greaterThan");
        break;
      case "greaterThanEquals":
        relOp = some("greaterThanEquals");
        break;
      case "doubleEquals":
        relOp = some("equals");
        break;
      case "notEqual":
        relOp = some("notEqual");
        break;
      default:
        relOp = none;
    }

    if (isSome(relOp)) {
      position += 1;
      const rightSide = parseExpr();
      relation = {
        expressionKind: "binOp",
        binOp: relOp.value,
        leftOperand: relation,
        rightOperand: rightSide,
      };
    }

    return relation;
  };

  const parseExpr = (): Expression => {
    let expr: Expression = parseTerm();
    while (input[position]?.tokenKind === "plus" || input[position]?.tokenKind === "minus") {
      const opTokenKind = input[position]?.tokenKind;
      position += 1;
      const rightSide = parseTerm();
      expr = {
        expressionKind: "binOp",
        binOp: opTokenKind === "plus" ? "add" : "subtract",
        leftOperand: expr,
        rightOperand: rightSide,
      };
    }

    return expr;
  };

  const parseTerm = (): Expression => {
    let term: Expression = parseUnaryFactor();
    while (input[position]?.tokenKind === "asterisk" || input[position]?.tokenKind === "forwardSlash") {
      const opTokenKind = input[position]?.tokenKind;
      position += 1;
      const rightSide = parseUnaryFactor();
      term = {
        expressionKind: "binOp",
        binOp: opTokenKind === "asterisk" ? "multiply" : "divide",
        leftOperand: term,
        rightOperand: rightSide,
      };
    }

    return term;
  };

  const parseUnaryFactor = (): Expression => {
    if (input[position]?.tokenKind === "exclamationPoint") {
      position += 1;
      const factor = parseFactor();
      return {
        expressionKind: "unaryOp",
        unaryOp: "not",
        operand: factor,
      };
    } else if (input[position]?.tokenKind === "minus") {
      position += 1;
      const factor = parseFactor();
      return {
        expressionKind: "unaryOp",
        unaryOp: "negative",
        operand: factor,
      };
    }

    return parseFactor();
  };

  const parseFactor = (): Expression => {
    // handle grouping parentheses (NOT function calls)
    if (input[position]?.tokenKind === "leftParen") {
      position += 1; // move past left paren
      const expr = parseLogicalExpr();

      if (input[position]?.tokenKind !== "rightParen") {
        throw new ParseError("Expected )");
      }
      position += 1; // move past right paren
      return expr;
    }

    return parsePotentialCall();
  };

  // could be a call, could just be a number/identifier
  const parsePotentialCall = (): Expression => {
    let callee = parseLiteralOrIdentifier();

    while (input[position]?.tokenKind === "leftParen" || input[position]?.tokenKind === "period") {
      if (input[position].tokenKind === "leftParen") {
        position += 1; // move past left paren

        const args: Array<Expression> = [];
        while (input[position]?.tokenKind !== "rightParen") {
          args.push(parseLogicalExpr());

          if (input[position]?.tokenKind === "rightParen") {
            break;
          }

          if (input[position]?.tokenKind !== "comma") {
            throw new ParseError("Expected ,");
          }

          position += 1; // move past comma
        }

        // we know from while loop condition that we're at a right paren, so just move past it
        position += 1;

        callee = {
          expressionKind: "funcCall",
          callee,
          args,
        };
      } else {
        position += 1; // move past period

        if (input[position]?.tokenKind !== "identifier") {
          throw new ParseError("Expected identifier");
        }

        const ident = (input[position] as IdentifierToken).name; // cast should always succeed

        position += 1; // move past identifier

        callee = {
          expressionKind: "get",
          object: callee,
          field: ident,
        };
      }
    }

    return callee;
  };

  const parseLiteralOrIdentifier = (): Expression => {
    if (input[position]?.tokenKind === "number") {
      // need the conditional access to .tokenKind in case this.position goes past input.length
      const numToken = input[position] as NumberToken; // cast should always succeed
      position += 1;
      return {
        expressionKind: "numberLit",
        value: numToken.value,
      };
    } else if (input[position]?.tokenKind === "boolean") {
      const boolToken = input[position] as BooleanToken; // cast should always succeed
      position += 1;
      return {
        expressionKind: "booleanLit",
        isTrue: boolToken.isTrue,
      };
    } else if (input[position]?.tokenKind === "null") {
      position += 1;
      return {
        expressionKind: "nullLit",
      };
    } else if (input[position]?.tokenKind === "leftBrace") {
      position += 1; // move past opening brace
      const objectLit: ObjectLiteral = {
        expressionKind: "objectLit",
        fields: [],
      };

      while (input[position]?.tokenKind === "identifier") {
        const fieldName = (input[position] as IdentifierToken).name; // cast should always succeed
        position += 1;

        if (input[position]?.tokenKind !== "colon") {
          throw new ParseError("Expected :");
        }
        position += 1; // move past colon

        const fieldValue = parseLogicalExpr();

        objectLit.fields.push({
          fieldName,
          fieldValue,
        });

        if (input[position]?.tokenKind === "rightBrace") {
          break;
        }

        if (input[position]?.tokenKind !== "comma") {
          throw new ParseError("Expected ,");
        }

        position += 1; // move past comma
      }

      if (input[position]?.tokenKind !== "rightBrace") {
        throw new ParseError("Expected }");
      }

      position += 1; // move past right brace

      return objectLit;
    } else if (input[position]?.tokenKind !== "identifier") {
      throw new ParseError("Expected identifier");
    } else {
      const ident = (input[position] as IdentifierToken).name;
      position += 1;

      return {
        expressionKind: "variableRef",
        variableName: ident,
      };
    }
  };

  /** Converting thrown parse errors to Left case of Either<ParseFailure, Program> */
  try {
    const parseResult = parseProgram();
    if (position !== input.length) {
      throw new ParseError("Expected end of input");
    }

    return right(parseResult);
  } catch (err) {
    if (err instanceof ParseError) {
      return left({
        message: err.message,
      });
    } else {
      throw err;
    }
  }
};
