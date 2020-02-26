import "jest";
import { scan } from "../src/scanner";
import { isRight, isLeft } from "fp-ts/lib/Either";

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
        ["function", "function"],
        ["return", "return"],
        ["if", "if"],
        ["else", "else"],
        ["while", "while"],
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

    describe("Arithmetic binary operations", () => {
      test.each([
        ["+", "add"],
        ["-", "subtract"],
        ["*", "multiply"],
        ["/", "divide"],
      ])('Recognizes "%s"', (input, operationKind) => {
        // Act
        const scanResult = scan(input);

        // Assert
        if (!isRight(scanResult)) {
          throw new Error("Scan failed, should have succeeded");
        }

        expect(scanResult.right).toHaveLength(1);

        if (scanResult.right[0].tokenKind !== "arithBinaryOp") {
          throw new Error(`Scan produced ${scanResult.right[0].tokenKind} instead of arithmetic binary operation`);
        }

        expect(scanResult.right[0].arithBinaryOp).toBe(operationKind);
      });
    });

    describe("Logical binary operations", () => {
      test.each([
        ["&", "and"],
        ["|", "or"],
      ])('Recognizes "%s"', (input, operationKind) => {
        // Act
        const scanResult = scan(input);

        // Assert
        if (!isRight(scanResult)) {
          throw new Error("Scan failed, should have succeeded");
        }

        expect(scanResult.right).toHaveLength(1);

        if (scanResult.right[0].tokenKind !== "logicalBinaryOp") {
          throw new Error(`Scan produced ${scanResult.right[0].tokenKind} instead of logical binary operation`);
        }

        expect(scanResult.right[0].logicalBinaryOp).toBe(operationKind);
      });
    });

    describe("Logical unary operations", () => {
      it("Recognizes !", () => {
        // Arrange
        const input = "!";

        // Act
        const scanResult = scan(input);

        // Assert
        if (!isRight(scanResult)) {
          throw new Error("Scan failed, should have succeeded");
        }

        expect(scanResult.right).toHaveLength(1);

        if (scanResult.right[0].tokenKind !== "logicalUnaryOp") {
          throw new Error(`Scan produced ${scanResult.right[0].tokenKind} instead of logical unary operation`);
        }

        expect(scanResult.right[0].logicalUnaryOp).toBe("not");
      });
    });

    describe("Relational operations", () => {
      test.each([
        ["<", "lessThan"],
        [">", "greaterThan"],
      ])('Recognizes "%s"', (input, operationKind) => {
        // Act
        const scanResult = scan(input);

        // Assert
        if (!isRight(scanResult)) {
          throw new Error("Scan failed, should have succeeded");
        }

        expect(scanResult.right).toHaveLength(1);

        if (scanResult.right[0].tokenKind !== "relationalOp") {
          throw new Error(`Scan produced ${scanResult.right[0].tokenKind} instead of relational operation`);
        }

        expect(scanResult.right[0].relationalOp).toBe(operationKind);
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
    it("Reports error on numbers with more than one decimal point", () => {
      // Arrange
      const inputStr = "12.34.56";

      // Act
      const scanResult = scan(inputStr);

      // Assert
      if (!isLeft(scanResult)) {
        // type narrowing
        throw new Error("Scan succeeded, should have failed");
      }

      expect(scanResult.left.map((error) => error.invalidLexeme)).toContain(".56");
    });

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
