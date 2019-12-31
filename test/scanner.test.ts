import "jest";
import { scan } from "../src/scanner";
import { isRight } from "fp-ts/lib/Either";

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
    });
  });
});
