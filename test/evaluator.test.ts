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

        if (evalResult.right.valueKind !== "number") {
          throw new Error("Evaluated to non-numeric value");
        }

        expect(evalResult.right.value).toBe(1);
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

        if (evalResult.right.valueKind !== "number") {
          throw new Error("Evaluated to non-numeric value");
        }

        expect(evalResult.right.value).toBe(2);
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

        if (evalResult.right.valueKind !== "number") {
          throw new Error("Evaluated to non-numeric value");
        }

        expect(evalResult.right.value).toBe(3);
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

        if (evalResult.right.valueKind !== "number") {
          throw new Error("Evaluated to non-numeric value");
        }

        expect(evalResult.right.value).toBe(-1);
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

        if (evalResult.right.valueKind !== "number") {
          throw new Error("Evaluated to non-numeric value");
        }

        expect(evalResult.right.value).toBe(30);
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

        if (evalResult.right.valueKind !== "number") {
          throw new Error("Evaluated to non-numeric value");
        }

        expect(evalResult.right.value).toBe(4);
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

        if (evalResult.right.valueKind !== "number") {
          throw new Error("Evaluated to non-numeric value");
        }

        expect(evalResult.right.value).toBe(6);
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

        if (evalResult.right.valueKind !== "number") {
          throw new Error("Evaluated to non-numeric value");
        }

        expect(evalResult.right.value).toBe(34);
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

        if (evalResult.right.valueKind !== "number") {
          throw new Error("Evaluated to non-numeric value");
        }

        expect(evalResult.right.value).toBe(47);
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

        if (evalResult.right.valueKind !== "number") {
          throw new Error("Evaluated to non-numeric value");
        }

        expect(evalResult.right.value).toBe(1);
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

        if (evalResult.right.valueKind !== "number") {
          throw new Error("Evaluated to non-numeric value");
        }

        expect(evalResult.right.value).toBe(2);
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

        if (evalResult.right.valueKind !== "number") {
          throw new Error("Evaluated to non-numeric value");
        }

        expect(evalResult.right.value).toBe(1);
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

        if (evalResult.right.valueKind !== "number") {
          throw new Error("Evaluated to non-numeric value");
        }

        expect(evalResult.right.value).toBe(2);
      });

      it("Evaluates { x = 1; y = 2; return x + y; } to 3", () => {
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
              expressionKind: "binOp",
              operation: "add",
              leftOperand: {
                expressionKind: "variableRef",
                variableName: "x",
              },
              rightOperand: {
                expressionKind: "variableRef",
                variableName: "y",
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

        if (evalResult.right.valueKind !== "number") {
          throw new Error("Evaluated to non-numeric value");
        }

        expect(evalResult.right.value).toBe(3);
      });
    });

    describe("Programs with simple first-order functions", () => {
      it("Evaluates { function f() { return 1; } return f(); } to 1", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "funcDecl",
            functionName: "f",
            args: [],
            body: [
              {
                statementKind: "return",
                returnedValue: {
                  expressionKind: "number",
                  value: 1,
                },
              },
            ],
          },
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "funcCall",
              callee: {
                expressionKind: "variableRef",
                variableName: "f",
              },
              args: [],
            },
          },
        ];

        // Act
        const evalResult = evaluate(ast);

        // Assert
        if (!isRight(evalResult)) {
          throw new Error("Evaluation failed, should have succeeded");
        }

        if (evalResult.right.valueKind !== "number") {
          throw new Error("Evaluated to non-numeric value");
        }

        expect(evalResult.right.value).toBe(1);
      });

      it("Evaluates { function f() { return 1; } function g() { return 2; } return f() + g(); } to 3", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "funcDecl",
            functionName: "f",
            args: [],
            body: [
              {
                statementKind: "return",
                returnedValue: {
                  expressionKind: "number",
                  value: 1,
                },
              },
            ],
          },
          {
            statementKind: "funcDecl",
            functionName: "g",
            args: [],
            body: [
              {
                statementKind: "return",
                returnedValue: {
                  expressionKind: "number",
                  value: 2,
                },
              },
            ],
          },
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "binOp",
              operation: "add",
              leftOperand: {
                expressionKind: "funcCall",
                callee: {
                  expressionKind: "variableRef",
                  variableName: "f",
                },
                args: [],
              },
              rightOperand: {
                expressionKind: "funcCall",
                callee: {
                  expressionKind: "variableRef",
                  variableName: "g",
                },
                args: [],
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

        if (evalResult.right.valueKind !== "number") {
          throw new Error("Evaluated to non-numeric value");
        }

        expect(evalResult.right.value).toBe(3);
      });

      it("Evaluates { x = 1; function f(y) { return y; } return f(x); } to 1", () => {
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
            statementKind: "funcDecl",
            functionName: "f",
            args: ["y"],
            body: [
              {
                statementKind: "return",
                returnedValue: {
                  expressionKind: "variableRef",
                  variableName: "y",
                },
              },
            ],
          },
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "funcCall",
              callee: {
                expressionKind: "variableRef",
                variableName: "f",
              },
              args: [
                {
                  expressionKind: "variableRef",
                  variableName: "x",
                },
              ],
            },
          },
        ];

        // Act
        const evalResult = evaluate(ast);

        // Assert
        if (!isRight(evalResult)) {
          throw new Error("Evaluation failed, should have succeeded");
        }

        if (evalResult.right.valueKind !== "number") {
          throw new Error("Evaluated to non-numeric value");
        }

        expect(evalResult.right.value).toBe(1);
      });

      it("Evaluates { x = 1; function f(y) { return x + y; } return f(2); } to 3", () => {
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
            statementKind: "funcDecl",
            functionName: "f",
            args: ["y"],
            body: [
              {
                statementKind: "return",
                returnedValue: {
                  expressionKind: "binOp",
                  operation: "add",
                  leftOperand: {
                    expressionKind: "variableRef",
                    variableName: "x",
                  },
                  rightOperand: {
                    expressionKind: "variableRef",
                    variableName: "y",
                  },
                },
              },
            ],
          },
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "funcCall",
              callee: {
                expressionKind: "variableRef",
                variableName: "f",
              },
              args: [
                {
                  expressionKind: "number",
                  value: 2,
                },
              ],
            },
          },
        ];

        // Act
        const evalResult = evaluate(ast);

        // Assert
        if (!isRight(evalResult)) {
          throw new Error("Evaluation failed, should have succeeded");
        }

        if (evalResult.right.valueKind !== "number") {
          throw new Error("Evaluated to non-numeric value");
        }

        expect(evalResult.right.value).toBe(3);
      });
    });

    describe("Programs with higher-order functions", () => {
      it("Evaluates { function f() { function g() { return 1; } return g; } return f()(); } to 1", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "funcDecl",
            functionName: "f",
            args: [],
            body: [
              {
                statementKind: "funcDecl",
                functionName: "g",
                args: [],
                body: [
                  {
                    statementKind: "return",
                    returnedValue: {
                      expressionKind: "number",
                      value: 1,
                    },
                  },
                ],
              },
              {
                statementKind: "return",
                returnedValue: {
                  expressionKind: "variableRef",
                  variableName: "g",
                },
              },
            ],
          },
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "funcCall",
              args: [],
              callee: {
                expressionKind: "funcCall",
                args: [],
                callee: {
                  expressionKind: "variableRef",
                  variableName: "f",
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

        if (evalResult.right.valueKind !== "number") {
          throw new Error("Evaluated to non-numeric value");
        }

        expect(evalResult.right.value).toBe(1);
      });

      it("Evaluates { function makeAdder(x) { function adder(y) { return x + y; } return adder; } addOne = makeAdder(1); return addOne(2); } to 3", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "funcDecl",
            functionName: "makeAdder",
            args: ["x"],
            body: [
              {
                statementKind: "funcDecl",
                functionName: "adder",
                args: ["y"],
                body: [
                  {
                    statementKind: "return",
                    returnedValue: {
                      expressionKind: "binOp",
                      operation: "add",
                      leftOperand: {
                        expressionKind: "variableRef",
                        variableName: "x",
                      },
                      rightOperand: {
                        expressionKind: "variableRef",
                        variableName: "y",
                      },
                    },
                  },
                ],
              },
              {
                statementKind: "return",
                returnedValue: {
                  expressionKind: "variableRef",
                  variableName: "adder",
                },
              },
            ],
          },
          {
            statementKind: "assignment",
            variableName: "addOne",
            variableValue: {
              expressionKind: "funcCall",
              args: [
                {
                  expressionKind: "number",
                  value: 1,
                },
              ],
              callee: {
                expressionKind: "variableRef",
                variableName: "makeAdder",
              },
            },
          },
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "funcCall",
              args: [
                {
                  expressionKind: "number",
                  value: 2,
                },
              ],
              callee: {
                expressionKind: "variableRef",
                variableName: "addOne",
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

        if (evalResult.right.valueKind !== "number") {
          throw new Error("Evaluated to non-numeric value");
        }

        expect(evalResult.right.value).toBe(3);
      });
    });
  });
});
