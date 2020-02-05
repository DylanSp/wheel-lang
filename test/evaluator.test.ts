import "jest";
import { Program } from "../src/parser";
import { evaluate } from "../src/evaluator";
import { isRight } from "fp-ts/lib/Either";

describe("Evaluator", () => {
  describe("Successful evaluations", () => {
    describe("Simple programs with no functions or variables", () => {
      it("Evaluates { return 1; } to 1", () => {
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

      it("Evaluates { return 2; } to 2", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "number",
              value: 2,
            },
          },
        ];

        // Act
        const evalResult = evaluate(ast);

        // Assert
        if (!isRight(evalResult)) {
          throw new Error("Evaluation failed, should have succeeded");
        }

        expect(evalResult.right).toBe(2);
      });

      it("Evaluates { return 1 + 2; } to 3", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
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

        // Act
        const evalResult = evaluate(ast);

        // Assert
        if (!isRight(evalResult)) {
          throw new Error("Evaluation failed, should have succeeded");
        }

        expect(evalResult.right).toBe(3);
      });

      it("Evaluates { return 3 - 4; } to -1", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "binOp",
              operation: "subtract",
              leftOperand: {
                expressionKind: "number",
                value: 3,
              },
              rightOperand: {
                expressionKind: "number",
                value: 4,
              },
            },
          },
        ];

        // Act
        const evalResult = evaluate(ast);

        // Assert
        if (!isRight(evalResult)) {
          throw new Error("Evaluation failed, should have succeeded");
        }

        expect(evalResult.right).toBe(-1);
      });

      it("Evaluates { return 5 * 6; } to 30", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "binOp",
              operation: "multiply",
              leftOperand: {
                expressionKind: "number",
                value: 5,
              },
              rightOperand: {
                expressionKind: "number",
                value: 6,
              },
            },
          },
        ];

        // Act
        const evalResult = evaluate(ast);

        // Assert
        if (!isRight(evalResult)) {
          throw new Error("Evaluation failed, should have succeeded");
        }

        expect(evalResult.right).toBe(30);
      });

      it("Evaluates { return 8 / 2; } to 4", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "binOp",
              operation: "divide",
              leftOperand: {
                expressionKind: "number",
                value: 8,
              },
              rightOperand: {
                expressionKind: "number",
                value: 2,
              },
            },
          },
        ];

        // Act
        const evalResult = evaluate(ast);

        // Assert
        if (!isRight(evalResult)) {
          throw new Error("Evaluation failed, should have succeeded");
        }

        expect(evalResult.right).toBe(4);
      });

      it("Evaluates { return 1 + 2 + 3; } to 6", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "binOp",
              operation: "add",
              leftOperand: {
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
              rightOperand: {
                expressionKind: "number",
                value: 3,
              },
            },
          },
        ];

        // Act
        const evalResult = evaluate(ast);

        // Assert
        if (!isRight(evalResult)) {
          throw new Error("Evaluation failed, should have succeeded");
        }

        expect(evalResult.right).toBe(6);
      });

      it("Evaluates { return 4 + 5 * 6; } to 34", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "binOp",
              operation: "add",
              leftOperand: {
                expressionKind: "number",
                value: 4,
              },
              rightOperand: {
                expressionKind: "binOp",
                operation: "multiply",
                leftOperand: {
                  expressionKind: "number",
                  value: 5,
                },
                rightOperand: {
                  expressionKind: "number",
                  value: 6,
                },
              },
            },
          },
        ];

        // Act
        const evalResult = evaluate(ast);

        // Assert
        if (!isRight(evalResult)) {
          throw new Error("Evaluation failed, should have succeeded");
        }

        expect(evalResult.right).toBe(34);
      });

      it("Evaluates { return 7 * 8 - 9; } to 47", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "binOp",
              operation: "subtract",
              leftOperand: {
                expressionKind: "binOp",
                operation: "multiply",
                leftOperand: {
                  expressionKind: "number",
                  value: 7,
                },
                rightOperand: {
                  expressionKind: "number",
                  value: 8,
                },
              },
              rightOperand: {
                expressionKind: "number",
                value: 9,
              },
            },
          },
        ];

        // Act
        const evalResult = evaluate(ast);

        // Assert
        if (!isRight(evalResult)) {
          throw new Error("Evaluation failed, should have succeeded");
        }

        expect(evalResult.right).toBe(47);
      });
    });

    describe("Programs with simple variable use", () => {
      it("Evaluates { x = 1; return x; } to 1", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "assignment",
            variableName: "x",
            variableValue: {
              expressionKind: "number",
              value: 1,
            },
          },
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "variableRef",
              variableName: "x",
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

      it("Evaluates { x = 2; return x; } to 2", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "assignment",
            variableName: "x",
            variableValue: {
              expressionKind: "number",
              value: 2,
            },
          },
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "variableRef",
              variableName: "x",
            },
          },
        ];

        // Act
        const evalResult = evaluate(ast);

        // Assert
        if (!isRight(evalResult)) {
          throw new Error("Evaluation failed, should have succeeded");
        }

        expect(evalResult.right).toBe(2);
      });

      it("Evaluates { x = 1; y = 2; return x; } to 1", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "assignment",
            variableName: "x",
            variableValue: {
              expressionKind: "number",
              value: 1,
            },
          },
          {
            statementKind: "assignment",
            variableName: "y",
            variableValue: {
              expressionKind: "number",
              value: 2,
            },
          },
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "variableRef",
              variableName: "x",
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

      it("Evaluates { x = 1; y = 2; return y; } to 2", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "assignment",
            variableName: "x",
            variableValue: {
              expressionKind: "number",
              value: 1,
            },
          },
          {
            statementKind: "assignment",
            variableName: "y",
            variableValue: {
              expressionKind: "number",
              value: 2,
            },
          },
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "variableRef",
              variableName: "y",
            },
          },
        ];

        // Act
        const evalResult = evaluate(ast);

        // Assert
        if (!isRight(evalResult)) {
          throw new Error("Evaluation failed, should have succeeded");
        }

        expect(evalResult.right).toBe(2);
      });
    });
  });
});
