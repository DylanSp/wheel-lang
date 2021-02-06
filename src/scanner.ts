import { Either, left, right } from "fp-ts/lib/Either";
import { ScanError, Token } from "./scanner_types";
import { identifierIso } from "./universal_types";

export const scan = (input: string): Either<Array<ScanError>, Array<Token>> => {
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
          [
            "class",
            {
              tokenKind: "class",
            },
          ],
          [
            "constructor",
            {
              tokenKind: "constructor",
            },
          ],
          [
            "this",
            {
              tokenKind: "this",
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
