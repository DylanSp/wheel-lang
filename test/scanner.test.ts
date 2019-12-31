import "jest";
import { scan } from "../src/scanner";
import { isRight } from "fp-ts/lib/Either";

describe("Scanner", () => {
  describe("Successful scans", () => {
    test.each([
      ["(", "leftParen"],
      [")", "rightParen"],
      ["{", "leftBrace"],
      ["}", "rightBrace"],
      ["=", "singleEquals"],
      [",", "comma"],
      [";", "semicolon"],
      // ["function", "function"],
      // ["return", "return"],
    ])("Recognizes %s", (input, tokenKind) => {
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
});
