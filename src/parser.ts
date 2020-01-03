import { Operation, Identifier, Token, OperationToken, NumberToken } from "./scanner";
import { Either, right, left } from "fp-ts/lib/Either";

/**
 * TYPES
 */

// TODO - do I want to reuse Identifier type from scanner, or have separate identifier type = string for parser?

export type Program = Block;

export type Block = Array<Statement>;

export type Statement = FunctionDeclaration | ReturnStatement | VariableAssignment;

export interface FunctionDeclaration {
  statementKind: "funcDecl";
  functionName: Identifier;
  args: Array<Identifier>;
  body: Block;
}

export interface ReturnStatement {
  statementKind: "return";
  returnedValue: Expression;
}

export interface VariableAssignment {
  statementKind: "assignment";
  variableName: Identifier;
  variableValue: Expression;
}

export type Expression = BinaryOperation | NumberExpr | FunctionCall | VariableRef;

export interface BinaryOperation {
  expressionKind: "binOp";
  operation: Operation;
  leftOperand: Expression;
  rightOperand: Expression;
}

export interface NumberExpr {
  expressionKind: "number";
  value: number;
}

export interface FunctionCall {
  expressionKind: "funcCall";
  functionName: Expression; // needs to be an expression to allow for multiple calls, i.e. f()()
  args: Array<Expression>;
}

export interface VariableRef {
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

        const functionName = input[position] as Identifier;
        position += 1; // move past identifier

        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        if (input[position]?.tokenKind !== "leftParen") {
          throw new ParseError("Expected (");
        }
        position += 1; // move past left paren

        const args: Array<Identifier> = [];
        while (input[position]?.tokenKind === "identifier") {
          args.push(input[position] as Identifier);
          position += 1;

          // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
          // @ts-ignore
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
          args,
          body,
        });
      } else if (input[position]?.tokenKind === "return") {
        position += 1; // move past "return"
        const expr = parseExpr();

        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        if (input[position]?.tokenKind !== "semicolon") {
          throw new ParseError("Expected ;");
        }
        position += 1; // move past semicolon

        statements.push({
          statementKind: "return",
          returnedValue: expr,
        });
      } else {
        const ident = input[position] as Identifier;
        position += 1; // move past identifier

        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        if (input[position]?.tokenKind !== "singleEquals") {
          throw new ParseError("Expected =");
        }

        position += 1; // move past "="
        const expr = parseExpr();

        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
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

    // position changes, so input[position] is different, but TypeScript doesn't recognize this
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    if (input[position]?.tokenKind !== "rightBrace") {
      throw new ParseError("Expected }");
    }

    position += 1; // move past right brace
    return statements;
  };

  /** Expression parsing */
  const parseExpr = (): Expression => {
    let expr: Expression = parseTerm();
    while (input[position]?.tokenKind === "operation") {
      // need the conditional access to .tokenKind in case this.position goes past input.length
      const opToken = input[position] as OperationToken; // cast should always succeed

      // TODO - this may not be needed; parseTerm() will consume all *'s and /'s, right now that leaves only + and -
      if (opToken.operation !== "add" && opToken.operation !== "subtract") {
        break; // TODO - throw error to indicate logic error instead?
      }

      position += 1;
      const rightSide = parseTerm();
      expr = {
        expressionKind: "binOp",
        operation: opToken.operation,
        leftOperand: expr,
        rightOperand: rightSide,
      };
    }

    return expr;
  };

  const parseTerm = (): Expression => {
    let term: Expression = parseFactor();
    while (input[position]?.tokenKind === "operation") {
      // need the conditional access to .tokenKind in case this.position goes past input.length
      const opToken = input[position] as OperationToken; // cast should always succeed
      if (opToken.operation !== "multiply" && opToken.operation !== "divide") {
        break;
      }

      position += 1;
      const rightSide = parseFactor();
      term = {
        expressionKind: "binOp",
        operation: opToken.operation,
        leftOperand: term,
        rightOperand: rightSide,
      };
    }

    return term;
  };

  const parseFactor = (): Expression => {
    if (input[position]?.tokenKind === "number") {
      // need the conditional access to .tokenKind in case this.position goes past input.length
      const numToken = input[position] as NumberToken; // cast should always succeed
      position += 1;
      return {
        expressionKind: "number",
        value: numToken.value,
      };
    }

    if (input[position]?.tokenKind === "leftParen") {
      position += 1; // move past left paren
      const expr = parseExpr();

      // typescript thinks this is same expression as above if condition, but this.position gets advanced by parseExpr()
      // so ignore TS error saying condition will always return true
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      if (input[position]?.tokenKind !== "rightParen") {
        throw new ParseError("Expected )");
      }
      position += 1; // move past right paren
      return expr;
    }

    if (input[position]?.tokenKind !== "identifier") {
      throw new ParseError("Expected identifier");
    }

    const ident = input[position] as Identifier;
    position += 1;

    // same issue with typescript thinking this is same expression as ident, but position is advanced
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    if (input[position]?.tokenKind === "leftParen") {
      // function call
      position += 1; // move past left paren

      // TODO similar code to parsing argument list in parseBlock(); is there a way to abstract out similarities?
      const args: Array<Expression> = [];
      while (input[position]?.tokenKind !== "rightParen") {
        args.push(parseExpr());

        if (input[position]?.tokenKind == "comma") {
          position += 1; // move past comma
        }
      }

      // we know from while loop condition that we're at a right paren, so just move past it
      position += 1;

      return {
        expressionKind: "funcCall",
        functionName: {
          expressionKind: "variableRef",
          variableName: ident,
        },
        args: args,
      };
    }

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
