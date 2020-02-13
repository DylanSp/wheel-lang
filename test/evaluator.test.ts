import "jest";
import { Program } from "../src/parser";
import { evaluate } from "../src/evaluator";
import { isRight, isLeft } from "fp-ts/lib/Either";

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

    describe("Other complex programs", () => {
      it("Evaluates { x = 1; function f() { x = 2; return x; } return x + f(); } to 3", () => {
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
            args: [],
            body: [
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
            ],
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

        expect(evalResult.right.value).toBe(3);
      });

      it("Evaluates { x = 1; function returnX() { return x; } y = x; x = 2; return y + returnX(); } to 2 (not 3)", () => {
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
            functionName: "returnX",
            args: [],
            body: [
              {
                statementKind: "return",
                returnedValue: {
                  expressionKind: "variableRef",
                  variableName: "x",
                },
              },
            ],
          },
          {
            statementKind: "assignment",
            variableName: "y",
            variableValue: {
              expressionKind: "variableRef",
              variableName: "x",
            },
          },
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
              expressionKind: "binOp",
              operation: "add",
              leftOperand: {
                expressionKind: "variableRef",
                variableName: "y",
              },
              rightOperand: {
                expressionKind: "funcCall",
                args: [],
                callee: {
                  expressionKind: "variableRef",
                  variableName: "returnX",
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

        expect(evalResult.right.value).toBe(2);
      });
    });

    describe("Corner cases", () => {
      it("Evaluates { function f() { return x; } return 1; } to 1, despite x not being in scope in f's definition", () => {
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
                  expressionKind: "variableRef",
                  variableName: "x",
                },
              },
            ],
          },
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
    });
  });

  describe("Failed evaluations", () => {
    it("Recognizes a NotInScope error for { return x; }", () => {
      // Arrange
      const ast: Program = [
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
      if (!isLeft(evalResult)) {
        throw new Error("Evaluation succeeded, should have failed");
      }

      if (evalResult.left.runtimeErrorKind !== "notInScope") {
        throw new Error(`Detected ${evalResult.left.runtimeErrorKind} error instead of NotInScope error`);
      }

      expect(evalResult.left.outOfScopeIdentifier).toBe("x");
    });

    it("Recognizes a NotInScope error for { function f() { return x; } return f(); }", () => {
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
                expressionKind: "variableRef",
                variableName: "x",
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
              expressionKind: "variableRef",
              variableName: "f",
            },
          },
        },
      ];

      // Act
      const evalResult = evaluate(ast);

      // Assert
      if (!isLeft(evalResult)) {
        throw new Error("Evaluation succeeded, should have failed");
      }

      if (evalResult.left.runtimeErrorKind !== "notInScope") {
        throw new Error(`Detected ${evalResult.left.runtimeErrorKind} error instead of NotInScope error`);
      }

      expect(evalResult.left.outOfScopeIdentifier).toBe("x");
    });

    it("Recognizes a NotFunction error for { return 1(); }", () => {
      // Arrange
      const ast: Program = [
        {
          statementKind: "return",
          returnedValue: {
            expressionKind: "funcCall",
            args: [],
            callee: {
              expressionKind: "number",
              value: 1,
            },
          },
        },
      ];

      // Act
      const evalResult = evaluate(ast);

      // Assert
      if (!isLeft(evalResult)) {
        throw new Error("Evaluation succeeded, should have failed");
      }

      if (evalResult.left.runtimeErrorKind !== "notFunction") {
        throw new Error(`Detected ${evalResult.left.runtimeErrorKind} error instead of NotFunction error`);
      }

      expect(evalResult.left.nonFunctionType).toBe("number");
    });

    it("Recognizes a TypeMismatch error for { function f() {} return 1 + f; }", () => {
      // Arrange
      const ast: Program = [
        {
          statementKind: "funcDecl",
          functionName: "f",
          args: [],
          body: [],
        },
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
              expressionKind: "variableRef",
              variableName: "f",
            },
          },
        },
      ];

      // Act
      const evalResult = evaluate(ast);

      // Assert
      if (!isLeft(evalResult)) {
        throw new Error("Evaluation succeeded, should have failed");
      }

      if (evalResult.left.runtimeErrorKind !== "typeMismatch") {
        throw new Error(`Detected ${evalResult.left.runtimeErrorKind} error instead of TypeMismatch error`);
      }

      expect(evalResult.left.expectedType).toBe("number");
      expect(evalResult.left.actualType).toBe("closure");
    });

    it("Recognizes a TypeMismatch error for { function f() {} return f + 1; }", () => {
      // Arrange
      const ast: Program = [
        {
          statementKind: "funcDecl",
          functionName: "f",
          args: [],
          body: [],
        },
        {
          statementKind: "return",
          returnedValue: {
            expressionKind: "binOp",
            operation: "add",
            leftOperand: {
              expressionKind: "variableRef",
              variableName: "f",
            },
            rightOperand: {
              expressionKind: "number",
              value: 1,
            },
          },
        },
      ];

      // Act
      const evalResult = evaluate(ast);

      // Assert
      if (!isLeft(evalResult)) {
        throw new Error("Evaluation succeeded, should have failed");
      }

      if (evalResult.left.runtimeErrorKind !== "typeMismatch") {
        throw new Error(`Detected ${evalResult.left.runtimeErrorKind} error instead of TypeMismatch error`);
      }

      expect(evalResult.left.expectedType).toBe("number");
      expect(evalResult.left.actualType).toBe("closure");
    });

    it("Recognizes a NoReturn error for {}", () => {
      // Arrange
      const ast: Program = [];

      // Act
      const evalResult = evaluate(ast);

      // Assert
      if (!isLeft(evalResult)) {
        throw new Error("Evaluation succeeded, should have failed");
      }

      if (evalResult.left.runtimeErrorKind !== "noReturn") {
        throw new Error(`Detected ${evalResult.left.runtimeErrorKind} error instead of NoReturn error`);
      }
    });
  });
});
