import "jest";
import { Token } from "../src/scanner";
import { parse, Program } from "../src/parser";
import { isRight } from "fp-ts/lib/Either";

describe("Parser", () => {
  describe("Successful parses", () => {
    describe("Simple variable assignments", () => {
      it("Parses { x = 1 + 2; }", () => {
        // Arrange
        const tokens: Array<Token> = [
          {
            tokenKind: "leftBrace",
          },
          {
            tokenKind: "identifier",
            name: "x",
          },
          {
            tokenKind: "singleEquals",
          },
          {
            tokenKind: "number",
            value: 1,
          },
          {
            tokenKind: "operation",
            operation: "add",
          },
          {
            tokenKind: "number",
            value: 2,
          },
          {
            tokenKind: "semicolon",
          },
          {
            tokenKind: "rightBrace",
          },
        ];

        // Act
        const parseResult = parse(tokens);

        // Assert
        if (!isRight(parseResult)) {
          console.error(parseResult.left.message);
          throw new Error("Parse failed, should have succeeded");
        }

        const desiredResult: Program = [
          {
            statementKind: "assignment",
            variableName: {
              tokenKind: "identifier",
              name: "x",
            },
            variableValue: {
              expressionKind: "binOp",
              operation: "add",
              leftOperand: {
                expressionKind: "number",
                value: 1,
              },
              rightOperand: {
                expressionKind: "number",
                value: 2,
              },
            },
          },
        ];

        expect(parseResult.right).toEqual(desiredResult);
      });
    });
  });
});
