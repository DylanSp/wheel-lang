import {
  ArithmeticBinaryOperation,
  IdentifierToken,
  Token,
  ArithmeticBinaryOperationToken,
  NumberToken,
} from "./scanner";
import { Either, right, left } from "fp-ts/lib/Either";
import { Identifier } from "./types";

/**
 * TYPES
 */

export type Program = Block;

export type Block = Array<Statement>;

type Statement = FunctionDeclaration | ReturnStatement | VariableAssignment;

interface FunctionDeclaration {
  statementKind: "funcDecl";
  functionName: Identifier;
  argNames: Array<Identifier>;
  body: Block;
}

interface ReturnStatement {
  statementKind: "return";
  returnedValue: Expression;
}

interface VariableAssignment {
  statementKind: "assignment";
  variableName: Identifier;
  variableValue: Expression;
}

export type Expression = BinaryOperation | NumberExpr | FunctionCall | VariableRef;

interface BinaryOperation {
  expressionKind: "binOp";
  operation: ArithmeticBinaryOperation;
  leftOperand: Expression;
  rightOperand: Expression;
}

interface NumberExpr {
  expressionKind: "number";
  value: number;
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

    while (
      input[position]?.tokenKind === "function" ||
      input[position]?.tokenKind === "return" ||
      input[position]?.tokenKind === "identifier"
    ) {
      if (input[position]?.tokenKind === "function") {
        position += 1; // move past "function"

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

          if (input[position]?.tokenKind === "comma") {
            position += 1; // move past comma
          }
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
      } else if (input[position]?.tokenKind === "return") {
        position += 1; // move past "return"
        const expr = parseExpr();

        if (input[position]?.tokenKind !== "semicolon") {
          throw new ParseError("Expected ;");
        }
        position += 1; // move past semicolon

        statements.push({
          statementKind: "return",
          returnedValue: expr,
        });
      } else {
        const ident = (input[position] as IdentifierToken).name;
        position += 1; // move past identifier

        if (input[position]?.tokenKind !== "singleEquals") {
          throw new ParseError("Expected =");
        }

        position += 1; // move past "="
        const expr = parseExpr();

        if (input[position]?.tokenKind !== "semicolon") {
          throw new ParseError("Expected ;");
        }
        position += 1; // move past semicolon

        statements.push({
          statementKind: "assignment",
          variableName: ident,
          variableValue: expr,
        });
      }
    }

    if (input[position]?.tokenKind !== "rightBrace") {
      throw new ParseError("Expected }");
    }

    position += 1; // move past right brace
    return statements;
  };

  /** Expression parsing */
  const parseExpr = (): Expression => {
    let expr: Expression = parseTerm();
    while (input[position]?.tokenKind === "arithBinaryOp") {
      // need the conditional access to .tokenKind in case this.position goes past input.length
      const opToken = input[position] as ArithmeticBinaryOperationToken; // cast should always succeed

      // this condition should never be true; parseTerm() should consume all *'s and /'s, right now that leaves only + and -
      if (opToken.arithBinaryOp !== "add" && opToken.arithBinaryOp !== "subtract") {
        throw new Error("Programming error when trying to parse an expression; detected an anomalous operation token");
      }

      position += 1;
      const rightSide = parseTerm();
      expr = {
        expressionKind: "binOp",
        operation: opToken.arithBinaryOp,
        leftOperand: expr,
        rightOperand: rightSide,
      };
    }

    return expr;
  };

  const parseTerm = (): Expression => {
    let term: Expression = parseFactor();
    while (input[position]?.tokenKind === "arithBinaryOp") {
      // need the conditional access to .tokenKind in case this.position goes past input.length
      const opToken = input[position] as ArithmeticBinaryOperationToken; // cast should always succeed
      if (opToken.arithBinaryOp !== "multiply" && opToken.arithBinaryOp !== "divide") {
        break;
      }

      position += 1;
      const rightSide = parseFactor();
      term = {
        expressionKind: "binOp",
        operation: opToken.arithBinaryOp,
        leftOperand: term,
        rightOperand: rightSide,
      };
    }

    return term;
  };

  const parseFactor = (): Expression => {
    // handle grouping parentheses (NOT function calls)
    if (input[position]?.tokenKind === "leftParen") {
      position += 1; // move past left paren
      const expr = parseExpr();

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
    let callee = parseNumberOrIdentifier();

    while (input[position]?.tokenKind === "leftParen") {
      position += 1;

      const args: Array<Expression> = [];
      while (input[position]?.tokenKind !== "rightParen") {
        args.push(parseExpr());

        if (input[position]?.tokenKind == "comma") {
          position += 1; // move past comma
        }
      }

      // we know from while loop condition that we're at a right paren, so just move past it
      position += 1;

      callee = {
        expressionKind: "funcCall",
        callee,
        args,
      };
    }

    return callee;
  };

  const parseNumberOrIdentifier = (): Expression => {
    if (input[position]?.tokenKind === "number") {
      // need the conditional access to .tokenKind in case this.position goes past input.length
      const numToken = input[position] as NumberToken; // cast should always succeed
      position += 1;
      return {
        expressionKind: "number",
        value: numToken.value,
      };
    }

    if (input[position]?.tokenKind !== "identifier") {
      throw new ParseError("Expected identifier");
    }

    const ident = (input[position] as IdentifierToken).name;
    position += 1;

    return {
      expressionKind: "variableRef",
      variableName: ident,
    };
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
