import { Either, left, right } from "fp-ts/lib/Either";

/**
 * TYPES
 */

export type Token =
  | LeftBrace
  | RightBrace
  | LeftParen
  | RightParen
  | SingleEquals
  | FunctionKeyword
  | ReturnKeyword
  | Semicolon
  | Comma
  | NumberToken
  | OperationToken
  | Identifier;

export interface LeftBrace {
  tokenKind: "leftBrace";
}

export interface RightBrace {
  tokenKind: "rightBrace";
}

export interface LeftParen {
  tokenKind: "leftParen";
}

export interface RightParen {
  tokenKind: "rightParen";
}

export interface SingleEquals {
  tokenKind: "singleEquals";
}

export interface FunctionKeyword {
  tokenKind: "function";
}

export interface ReturnKeyword {
  tokenKind: "return";
}

export interface Semicolon {
  tokenKind: "semicolon";
}

export interface Comma {
  tokenKind: "comma";
}

export interface NumberToken {
  tokenKind: "number";
  value: number;
}

type Operation = "add" | "subtract" | "multiply" | "divide";

export interface OperationToken {
  tokenKind: "operation";
  operation: Operation;
}

export interface Identifier {
  tokenKind: "identifier";
  name: string;
}

export interface ScanError {
  invalidLexeme: string;
}

type Scan = (input: string) => Either<Array<ScanError>, Array<Token>>;

/**
 * SCANNING
 */

export const scan: Scan = (input: string) => {
  const errors: Array<ScanError> = [];
  const tokens: Array<Token> = [];

  let position = 0;
  while (position < input.length) {
    const char = input[position];

    switch (char) {
      case "(":
        tokens.push({
          tokenKind: "leftParen",
        });
        break;
      case ")":
        tokens.push({
          tokenKind: "rightParen",
        });
        break;
      case "{":
        tokens.push({
          tokenKind: "leftBrace",
        });
        break;
      case "}":
        tokens.push({
          tokenKind: "rightBrace",
        });
        break;
      case "=":
        tokens.push({
          tokenKind: "singleEquals",
        });
        break;
      case ",":
        tokens.push({
          tokenKind: "comma",
        });
        break;
      case ";":
        tokens.push({
          tokenKind: "semicolon",
        });
        break;
    }

    position += 1;
  }

  if (errors.length > 0) {
    return left(errors);
  }

  return right(tokens);
};
