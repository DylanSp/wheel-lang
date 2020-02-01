import "jest";
import { Program } from "../src/parser";
import { evaluate } from "../src/evaluator";
import { isRight } from "fp-ts/lib/Either";

describe("Evaluator", () => {
  describe("Successful evaluations", () => {
    describe("Simple programs with no functions", () => {
      it("Evaluates { return 1; }", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "number",
              value: 1,
            },
          },
        ];

        // Act
        const evalResult = evaluate(ast);

        // Assert
        if (!isRight(evalResult)) {
          throw new Error("Evaluation failed, should have succeeded");
        }

        expect(evalResult.right).toBe(1);
      });
    });
  });
});
