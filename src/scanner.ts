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

    if (/^function/.test(input.substring(position))) {
      tokens.push({
        tokenKind: "function",
      });
      position += "function".length;
    } else if (/^return/.test(input.substring(position))) {
      tokens.push({
        tokenKind: "return",
      });
      position += "return".length;
    } else {
      switch (char) {
        case "(":
          tokens.push({
            tokenKind: "leftParen",
          });
          position += 1;
          break;
        case ")":
          tokens.push({
            tokenKind: "rightParen",
          });
          position += 1;
          break;
        case "{":
          tokens.push({
            tokenKind: "leftBrace",
          });
          position += 1;
          break;
        case "}":
          tokens.push({
            tokenKind: "rightBrace",
          });
          position += 1;
          break;
        case "=":
          tokens.push({
            tokenKind: "singleEquals",
          });
          position += 1;
          break;
        case ",":
          tokens.push({
            tokenKind: "comma",
          });
          position += 1;
          break;
        case ";":
          tokens.push({
            tokenKind: "semicolon",
          });
          position += 1;
          break;
        default:
          // case for identifiers
          const matches = input.substring(position).match(/^[a-zA-Z][a-zA-Z0-9]*/);
          if (matches === null) {
            throw new Error("Someone had blunder'd"); // TODO more specific error
          }
          const name = matches[0];

          if (name === undefined) {
            throw new Error("Someone had blunder'd"); // TODO more specific error
          }

          tokens.push({
            tokenKind: "identifier",
            name,
          });
          position += name.length;
      }
    }
  }

  if (errors.length > 0) {
    return left(errors);
  }

  return right(tokens);
};
