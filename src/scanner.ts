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
  | NullKeyword
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
      case ".":
        tokens.push({
          tokenKind: "period",
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
      case '"':
        position += 1; // advance past starting quote
        const endingQuoteRelativePosition = input.substring(position).indexOf('"');

        if (endingQuoteRelativePosition === -1) {
          errors.push({
            invalidLexeme: 'unmatched "',
          });
          position = input.length; // advance to end to stop scanning
        } else {
          const value = input.substr(position, endingQuoteRelativePosition);
          tokens.push({
            tokenKind: "string",
            value,
          });
          position = position + endingQuoteRelativePosition + 1;
        }

        break;
      default:
        // check for whitespace; if present, skip past it
        if (/\s/.test(char)) {
          position += 1;
          break;
        }

        if (/\d{1}/.test(char)) {
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
          break;
        }

        const keywords: Array<[string, Token]> = [
          [
            "let",
            {
              tokenKind: "let",
            },
          ],
          [
            "function",
            {
              tokenKind: "function",
            },
          ],
          [
            "return",
            {
              tokenKind: "return",
            },
          ],
          [
            "if",
            {
              tokenKind: "if",
            },
          ],
          [
            "else",
            {
              tokenKind: "else",
            },
          ],
          [
            "while",
            {
              tokenKind: "while",
            },
          ],
          [
            "true",
            {
              tokenKind: "boolean",
              isTrue: true,
            },
          ],
          [
            "false",
            {
              tokenKind: "boolean",
              isTrue: false,
            },
          ],
          [
            "null",
            {
              tokenKind: "null",
            },
          ],
          [
            "module",
            {
              tokenKind: "module",
            },
          ],
          [
            "import",
            {
              tokenKind: "import",
            },
          ],
          [
            "export",
            {
              tokenKind: "export",
            },
          ],
          [
            "from",
            {
              tokenKind: "from",
            },
          ],
        ];

        let keywordMatched = false;
        for (const [keyword, token] of keywords) {
          if (
            input.substring(position, position + keyword.length) === keyword &&
            !/^[a-zA-Z0-9]/.test(input.substring(position + keyword.length)) // make sure we don't accidentally match an identifier starting with a keyword
          ) {
            tokens.push(token);
            position += keyword.length;
            keywordMatched = true;
            break;
          }
        }

        if (keywordMatched) {
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

  if (errors.length > 0) {
    return left(errors);
  }

  return right(tokens);
};
