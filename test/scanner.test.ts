import "jest";
import { isRight, isLeft } from "fp-ts/lib/Either";
import { scan } from "../src/scanner";

describe("Scanner", () => {
  describe("Successful scans", () => {
    describe("Simple tokens", () => {
      test.each([
        ["(", "leftParen"],
        [")", "rightParen"],
        ["{", "leftBrace"],
        ["}", "rightBrace"],
        ["=", "singleEquals"],
        [",", "comma"],
        [";", "semicolon"],
        [":", "colon"],
        [".", "period"],
        ["+", "plus"],
        ["-", "minus"],
        ["*", "asterisk"],
        ["/", "forwardSlash"],
        ["!", "exclamationPoint"],
        ["==", "doubleEquals"],
        ["/=", "notEqual"],
        ["&", "ampersand"],
        ["|", "verticalBar"],
        ["<", "lessThan"],
        ["<=", "lessThanEquals"],
        [">", "greaterThan"],
        [">=", "greaterThanEquals"],
        ["function", "function"],
        ["return", "return"],
        ["if", "if"],
        ["else", "else"],
        ["while", "while"],
        ["let", "let"],
        ["null", "null"],
        ["module", "module"],
        ["import", "import"],
        ["export", "export"],
      ])('Recognizes "%s"', (input, tokenKind) => {
        // Act
        const scanResult = scan(input);

        // Assert
        if (!isRight(scanResult)) {
          throw new Error("Scan failed, should have succeeded");
        }

        expect(scanResult.right).toHaveLength(1);
        expect(scanResult.right[0].tokenKind).toBe(tokenKind);
      });
    });

    describe("Identifiers", () => {
      it("Recognizes a generic word as an identifier", () => {
        // Arrange
        const input = "someWord";

        // Act
        const scanResult = scan(input);

        // Assert
        if (!isRight(scanResult)) {
          throw new Error("Scan failed, should have succeeded");
        }

        expect(scanResult.right).toHaveLength(1);

        if (scanResult.right[0].tokenKind !== "identifier") {
          throw new Error(`${input} not recognized as identifier`);
        }
        expect(scanResult.right[0].name).toBe(input);
      });

      it("Recognizes a word with digits in it as an identifier", () => {
        // Arrange
        const input = "var0";

        // Act
        const scanResult = scan(input);

        // Assert
        if (!isRight(scanResult)) {
          throw new Error("Scan failed, should have succeeded");
        }

        expect(scanResult.right).toHaveLength(1);

        if (scanResult.right[0].tokenKind !== "identifier") {
          throw new Error(`${input} not recognized as identifier`);
        }
        expect(scanResult.right[0].name).toBe(input);
      });

      it('Recognizes a word with "let" in it as an identifier', () => {
        // Arrange
        const input = "sublet";

        // Act
        const scanResult = scan(input);

        // Assert
        if (!isRight(scanResult)) {
          throw new Error("Scan failed, should have succeeded");
        }

        expect(scanResult.right).toHaveLength(1);
        expect(scanResult.right[0].tokenKind).toBe("identifier");
      });

      it('Recognizes a word beginning with "let" as an identifier', () => {
        // Arrange
        const input = "letter";

        // Act
        const scanResult = scan(input);

        // Assert
        if (!isRight(scanResult)) {
          throw new Error("Scan failed, should have succeeded");
        }

        expect(scanResult.right).toHaveLength(1);
        expect(scanResult.right[0].tokenKind).toBe("identifier");
      });

      it('Recognizes a word with "function" in it as an identifier', () => {
        // Arrange
        const input = "subfunction";

        // Act
        const scanResult = scan(input);

        // Assert
        if (!isRight(scanResult)) {
          throw new Error("Scan failed, should have succeeded");
        }

        expect(scanResult.right).toHaveLength(1);
        expect(scanResult.right[0].tokenKind).toBe("identifier");
      });

      it('Recognizes a word beginning with "function" as an identifier', () => {
        // Arrange
        const input = "functional";

        // Act
        const scanResult = scan(input);

        // Assert
        if (!isRight(scanResult)) {
          throw new Error("Scan failed, should have succeeded");
        }

        expect(scanResult.right).toHaveLength(1);
        expect(scanResult.right[0].tokenKind).toBe("identifier");
      });

      it('Recognizes a word with "return" in it as an identifier', () => {
        // Arrange
        const input = "subreturn";

        // Act
        const scanResult = scan(input);

        // Assert
        if (!isRight(scanResult)) {
          throw new Error("Scan failed, should have succeeded");
        }

        expect(scanResult.right).toHaveLength(1);
        expect(scanResult.right[0].tokenKind).toBe("identifier");
      });

      it('Recognizes a word beginning with "return" as an identifier', () => {
        // Arrange
        const input = "returning";

        // Act
        const scanResult = scan(input);

        // Assert
        if (!isRight(scanResult)) {
          throw new Error("Scan failed, should have succeeded");
        }

        expect(scanResult.right).toHaveLength(1);
        expect(scanResult.right[0].tokenKind).toBe("identifier");
      });

      it('Recognizes a word with "if" in it as an identifier', () => {
        // Arrange
        const input = "apertif";

        // Act
        const scanResult = scan(input);

        // Assert
        if (!isRight(scanResult)) {
          throw new Error("Scan failed, should have succeeded");
        }

        expect(scanResult.right).toHaveLength(1);
        expect(scanResult.right[0].tokenKind).toBe("identifier");
      });

      it('Recognizes a word beginning with "if" as an identifier', () => {
        // Arrange
        const input = "ifIAmATaco";

        // Act
        const scanResult = scan(input);

        // Assert
        if (!isRight(scanResult)) {
          throw new Error("Scan failed, should have succeeded");
        }

        expect(scanResult.right).toHaveLength(1);
        expect(scanResult.right[0].tokenKind).toBe("identifier");
      });

      it('Recognizes a word with "else" in it as an identifier', () => {
        // Arrange
        const input = "orElse";

        // Act
        const scanResult = scan(input);

        // Assert
        if (!isRight(scanResult)) {
          throw new Error("Scan failed, should have succeeded");
        }

        expect(scanResult.right).toHaveLength(1);
        expect(scanResult.right[0].tokenKind).toBe("identifier");
      });

      it('Recognizes a word beginning with "else" as an identifier', () => {
        // Arrange
        const input = "elsewhere";

        // Act
        const scanResult = scan(input);

        // Assert
        if (!isRight(scanResult)) {
          throw new Error("Scan failed, should have succeeded");
        }

        expect(scanResult.right).toHaveLength(1);
        expect(scanResult.right[0].tokenKind).toBe("identifier");
      });

      it('Recognizes a word with "while" in it as an identifier', () => {
        // Arrange
        const input = "meanwhile";

        // Act
        const scanResult = scan(input);

        // Assert
        if (!isRight(scanResult)) {
          throw new Error("Scan failed, should have succeeded");
        }

        expect(scanResult.right).toHaveLength(1);
        expect(scanResult.right[0].tokenKind).toBe("identifier");
      });

      it('Recognizes a word beginning with "while" as an identifier', () => {
        // Arrange
        const input = "whiled";

        // Act
        const scanResult = scan(input);

        // Assert
        if (!isRight(scanResult)) {
          throw new Error("Scan failed, should have succeeded");
        }

        expect(scanResult.right).toHaveLength(1);
        expect(scanResult.right[0].tokenKind).toBe("identifier");
      });
    });

    describe("Numbers", () => {
      it("Scans a simple number", () => {
        // Arrange
        const inputVal = 123;
        const input = inputVal.toString(10);

        // Act
        const scanResult = scan(input);

        // Assert
        if (!isRight(scanResult)) {
          throw new Error("Scan failed, should have succeeded");
        }

        expect(scanResult.right).toHaveLength(1);

        if (scanResult.right[0].tokenKind !== "number") {
          throw new Error(`${input} not recognized as number`);
        }

        expect(scanResult.right[0].value).toBe(inputVal);
      });

      it("Scans a number with a decimal point", () => {
        // Arrange
        const inputVal = 123.45;
        const input = inputVal.toString(10);

        // Act
        const scanResult = scan(input);

        // Assert
        if (!isRight(scanResult)) {
          throw new Error("Scan failed, should have succeeded");
        }

        expect(scanResult.right).toHaveLength(1);

        if (scanResult.right[0].tokenKind !== "number") {
          throw new Error(`${input} not recognized as number`);
        }

        expect(scanResult.right[0].value).toBe(inputVal);
      });
    });

    describe("Boolean literals", () => {
      it('Scans "true"', () => {
        // Arrange
        const input = "true";

        // Act
        const scanResult = scan(input);

        // Assert
        if (!isRight(scanResult)) {
          throw new Error("Scan failed, should have succeeded");
        }

        expect(scanResult.right).toHaveLength(1);

        if (scanResult.right[0].tokenKind !== "boolean") {
          throw new Error(`${input} not recognized as boolean literal`);
        }

        expect(scanResult.right[0].isTrue).toBe(true);
      });

      it('Scans "false"', () => {
        // Arrange
        const input = "false";

        // Act
        const scanResult = scan(input);

        // Assert
        if (!isRight(scanResult)) {
          throw new Error("Scan failed, should have succeeded");
        }

        expect(scanResult.right).toHaveLength(1);

        if (scanResult.right[0].tokenKind !== "boolean") {
          throw new Error(`${input} not recognized as boolean literal`);
        }

        expect(scanResult.right[0].isTrue).toBe(false);
      });
    });

    describe("Multiple tokens", () => {
      it("Recognizes whitespace as a separator", () => {
        // Arrange
        const inputStr = "1 2";

        // Act
        const scanResult = scan(inputStr);

        // Assert
        if (!isRight(scanResult)) {
          // type narrowing
          throw new Error("Scan failed, should have succeeded");
        }

        expect(scanResult.right).toHaveLength(2);

        if (scanResult.right[0].tokenKind !== "number") {
          throw new Error('"1" not recognized as number token');
        }

        if (scanResult.right[1].tokenKind !== "number") {
          throw new Error('"2" not recognized as number token');
        }

        expect(scanResult.right[0].value).toBe(1);
        expect(scanResult.right[1].value).toBe(2);
      });

      it('Recognizes "((" as two distinct tokens', () => {
        // Arrange
        const inputStr = "((";

        // Act
        const scanResult = scan(inputStr);

        // Assert
        if (!isRight(scanResult)) {
          throw new Error("Scan failed, should have succeeded");
        }

        expect(scanResult.right).toHaveLength(2);
        scanResult.right.forEach((token) => {
          expect(token.tokenKind).toBe("leftParen");
        });
      });

      it('Recognizes "if 1" as two distinct tokens', () => {
        // Arrange
        const inputStr = "if 1";

        // Act
        const scanResult = scan(inputStr);

        // Assert
        if (!isRight(scanResult)) {
          throw new Error("Scan failed, should have succeeded");
        }

        expect(scanResult.right).toHaveLength(2);
        expect(scanResult.right[0].tokenKind).toBe("if");
        expect(scanResult.right[1].tokenKind).toBe("number");
      });
    });
  });

  describe("Scan errors", () => {
    it("Reports error on special characters", () => {
      // Arrange
      const inputStr = "#";

      // Act
      const scanResult = scan(inputStr);

      // Assert
      if (!isLeft(scanResult)) {
        throw new Error("Scan succeeded, should have failed");
      }

      expect(scanResult.left.map((error) => error.invalidLexeme)).toContain(inputStr);
    });

    it("Reports multiple errors for multiple bad lexemes", () => {
      // Arrange
      const bad1 = "#";
      const bad2 = "@";

      // Act
      const scanResult = scan(`${bad1} ${bad2}`);

      // Assert
      if (!isLeft(scanResult)) {
        // use this instead of expect(), so we get type narrowing on scanResult
        throw new Error("Scan succeeded, should have failed");
      }

      const invalidLexemes = scanResult.left.map((error) => error.invalidLexeme);
      expect(invalidLexemes).toContain(bad1);
      expect(invalidLexemes).toContain(bad2);
    });
  });
});
