import { Either, left, right } from "fp-ts/lib/Either";
import { Identifier, identifierIso } from "./types";

/**
 * TYPES
 */

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
  | Semicolon
  | Colon
  | Comma
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
  | NumberToken
  | BooleanToken
  | IdentifierToken;

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

interface Semicolon {
  tokenKind: "semicolon";
}

interface Colon {
  tokenKind: "colon";
}

interface Comma {
  tokenKind: "comma";
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
    const peekAhead = input[position + 1];

    // TODO add general way of recognizing keywords? same logic for "let"/"function"/"return"/"if"/"else"/"while"
    if (/^let/.test(input.substring(position)) && !/^[a-zA-Z0-9]/.test(input.substring(position + "let".length))) {
      tokens.push({
        tokenKind: "let",
      });
      position += "let".length;
    } else if (
      /^function/.test(input.substring(position)) &&
      !/^[a-zA-Z0-9]/.test(input.substring(position + "function".length))
    ) {
      tokens.push({
        tokenKind: "function",
      });
      position += "function".length;
    } else if (
      /^return/.test(input.substring(position)) &&
      !/^[a-zA-Z0-9]/.test(input.substring(position + "return".length))
    ) {
      tokens.push({
        tokenKind: "return",
      });
      position += "return".length;
    } else if (/^if/.test(input.substring(position)) && !/^[a-zA-Z0-9]/.test(input.substring(position + "if".length))) {
      tokens.push({
        tokenKind: "if",
      });
      position += "if".length;
    } else if (
      /^else/.test(input.substring(position)) &&
      !/^[a-zA-Z0-9]/.test(input.substring(position + "else".length))
    ) {
      tokens.push({
        tokenKind: "else",
      });
      position += "else".length;
    } else if (
      /^while/.test(input.substring(position)) &&
      !/^[a-zA-Z0-9]/.test(input.substring(position + "while".length))
    ) {
      tokens.push({
        tokenKind: "while",
      });
      position += "while".length;
    } else if (
      /^true/.test(input.substring(position)) &&
      !/^[a-zA-Z0-9]/.test(input.substring(position + "true".length))
    ) {
      tokens.push({
        tokenKind: "boolean",
        isTrue: true,
      });
      position += "true".length;
    } else if (
      /^false/.test(input.substring(position)) &&
      !/^[a-zA-Z0-9]/.test(input.substring(position + "false".length))
    ) {
      tokens.push({
        tokenKind: "boolean",
        isTrue: false,
      });
      position += "false".length;
    } else if (/\d{1}/.test(char)) {
      const numberMatches = input.substring(position).match(/^[\d]+([.][\d]+)?/);
      if (numberMatches === null) {
        throw new Error("Programming error when trying to scan a number"); // shouldn't get here; the regex for the whole number should find something if the /\d{1}/ regex matched
      }
      const value = parseFloat(numberMatches[0]);
      tokens.push({
        tokenKind: "number",
        value,
      });
      position += numberMatches[0].length; // advance past the number we just scanned
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
          if (peekAhead === "=") {
            tokens.push({
              tokenKind: "doubleEquals",
            });
            position += 2;
          } else {
            tokens.push({
              tokenKind: "singleEquals",
            });
            position += 1;
          }
          break;
        case "<":
          if (peekAhead === "=") {
            tokens.push({
              tokenKind: "lessThanEquals",
            });
            position += 2;
          } else {
            tokens.push({
              tokenKind: "lessThan",
            });
            position += 1;
          }
          break;
        case ">":
          if (peekAhead === "=") {
            tokens.push({
              tokenKind: "greaterThanEquals",
            });
            position += 2;
          } else {
            tokens.push({
              tokenKind: "greaterThan",
            });
            position += 1;
          }
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
        case ":":
          tokens.push({
            tokenKind: "colon",
          });
          position += 1;
          break;
        case "+":
          tokens.push({
            tokenKind: "plus",
          });
          position += 1;
          break;
        case "-":
          tokens.push({
            tokenKind: "minus",
          });
          position += 1;
          break;
        case "*":
          tokens.push({
            tokenKind: "asterisk",
          });
          position += 1;
          break;
        case "/":
          if (peekAhead === "=") {
            tokens.push({
              tokenKind: "notEqual",
            });
            position += 2;
          } else {
            tokens.push({
              tokenKind: "forwardSlash",
            });
            position += 1;
          }
          break;
        case "&":
          tokens.push({
            tokenKind: "ampersand",
          });
          position += 1;
          break;
        case "|":
          tokens.push({
            tokenKind: "verticalBar",
          });
          position += 1;
          break;
        case "!":
          tokens.push({
            tokenKind: "exclamationPoint",
          });
          position += 1;
          break;
        default:
          // check for whitespace; if present, skip past it
          if (/\s/.test(char)) {
            position += 1;
            break;
          }

          // check for valid identifier; if doesn't match, lexeme is invalid
          const matches = input.substring(position).match(/^[a-zA-Z][a-zA-Z0-9]*/);
          if (matches === null) {
            const badMatches = input.substring(position).match(/^[^\s]+/);
            if (badMatches === null) {
              throw new Error(
                `Programming error; ${input.substring(
                  position,
                )} begins with neither a valid identifier nor an invalid lexeme`,
              );
            }
            errors.push({
              invalidLexeme: badMatches[0],
            });
            position += badMatches[0].length;
          } else {
            const name = matches[0];

            tokens.push({
              tokenKind: "identifier",
              name: identifierIso.wrap(name),
            });
            position += name.length;
          }
      }
    }
  }

  if (errors.length > 0) {
    return left(errors);
  }

  return right(tokens);
};
