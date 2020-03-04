import "jest";
import { Program } from "../src/parser";
import { evaluate } from "../src/evaluator";
import { isRight, isLeft } from "fp-ts/lib/Either";
import { identifierIso } from "../src/types";

describe("Evaluator", () => {
  describe("Successful evaluations", () => {
    describe("Simple programs with no functions or variables", () => {
      it("Evaluates { return 1; } to 1 (evaluating numeric literals)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "numberLit",
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

      it("Evaluates { return 2; } to 2 (evaluating numeric literals)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "numberLit",
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

      it("Evaluates { return true; } to true (evaluating boolean literals)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "booleanLit",
              isTrue: true,
            },
          },
        ];

        // Act
        const evalResult = evaluate(ast);

        // Assert
        if (!isRight(evalResult)) {
          throw new Error("Evaluation failed, should have succeeded");
        }

        if (evalResult.right.valueKind !== "boolean") {
          throw new Error("Evaluated to non-boolean value");
        }

        expect(evalResult.right.isTrue).toBe(true);
      });

      it("Evaluates { return false; } to false (evaluating boolean literals)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "booleanLit",
              isTrue: false,
            },
          },
        ];

        // Act
        const evalResult = evaluate(ast);

        // Assert
        if (!isRight(evalResult)) {
          throw new Error("Evaluation failed, should have succeeded");
        }

        if (evalResult.right.valueKind !== "boolean") {
          throw new Error("Evaluated to non-boolean value");
        }

        expect(evalResult.right.isTrue).toBe(false);
      });

      it("Evaluates { return 1 + 2; } to 3 (evaluating addition)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "binOp",
              binOp: "add",
              leftOperand: {
                expressionKind: "numberLit",
                value: 1,
              },
              rightOperand: {
                expressionKind: "numberLit",
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

      it("Evaluates { return 3 - 4; } to -1 (evaluating subtraction)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "binOp",
              binOp: "subtract",
              leftOperand: {
                expressionKind: "numberLit",
                value: 3,
              },
              rightOperand: {
                expressionKind: "numberLit",
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

      it("Evaluates { return 5 * 6; } to 30 (evaluating multiplication)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "binOp",
              binOp: "multiply",
              leftOperand: {
                expressionKind: "numberLit",
                value: 5,
              },
              rightOperand: {
                expressionKind: "numberLit",
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

      it("Evaluates { return 8 / 2; } to 4 (evaluating division)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "binOp",
              binOp: "divide",
              leftOperand: {
                expressionKind: "numberLit",
                value: 8,
              },
              rightOperand: {
                expressionKind: "numberLit",
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

      it("Evaluates { return 1 + 2 + 3; } to 6 (evaluating multiple additions in one expression)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "binOp",
              binOp: "add",
              leftOperand: {
                expressionKind: "binOp",
                binOp: "add",
                leftOperand: {
                  expressionKind: "numberLit",
                  value: 1,
                },
                rightOperand: {
                  expressionKind: "numberLit",
                  value: 2,
                },
              },
              rightOperand: {
                expressionKind: "numberLit",
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

      it("Evaluates { return 4 + 5 * 6; } to 34 (evaluating expressions with different precedence)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "binOp",
              binOp: "add",
              leftOperand: {
                expressionKind: "numberLit",
                value: 4,
              },
              rightOperand: {
                expressionKind: "binOp",
                binOp: "multiply",
                leftOperand: {
                  expressionKind: "numberLit",
                  value: 5,
                },
                rightOperand: {
                  expressionKind: "numberLit",
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

      it("Evaluates { return 7 * 8 - 9; } to 47 (evaluating expressions with different precedence)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "binOp",
              binOp: "subtract",
              leftOperand: {
                expressionKind: "binOp",
                binOp: "multiply",
                leftOperand: {
                  expressionKind: "numberLit",
                  value: 7,
                },
                rightOperand: {
                  expressionKind: "numberLit",
                  value: 8,
                },
              },
              rightOperand: {
                expressionKind: "numberLit",
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

      it("Evaluates { return true & false; } to false (evaluating logical and)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "binOp",
              binOp: "and",
              leftOperand: {
                expressionKind: "booleanLit",
                isTrue: true,
              },
              rightOperand: {
                expressionKind: "booleanLit",
                isTrue: false,
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

        if (evalResult.right.valueKind !== "boolean") {
          throw new Error("Evaluated to non-boolean value");
        }

        expect(evalResult.right.isTrue).toBe(false);
      });

      it("Evaluates { return false | true; } to true (evaluating logical or)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "binOp",
              binOp: "or",
              leftOperand: {
                expressionKind: "booleanLit",
                isTrue: false,
              },
              rightOperand: {
                expressionKind: "booleanLit",
                isTrue: true,
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

        if (evalResult.right.valueKind !== "boolean") {
          throw new Error("Evaluated to non-boolean value");
        }

        expect(evalResult.right.isTrue).toBe(true);
      });

      it("Evaluates { return !true; } to false (evaluating logical not)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "unaryOp",
              unaryOp: "not",
              operand: {
                expressionKind: "booleanLit",
                isTrue: true,
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

        if (evalResult.right.valueKind !== "boolean") {
          throw new Error("Evaluated to non-boolean value");
        }

        expect(evalResult.right.isTrue).toBe(false);
      });

      it("Evaluates { return true | true & false } to true (evaluating logical expressions with correct precedence)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "binOp",
              binOp: "or",
              leftOperand: {
                expressionKind: "booleanLit",
                isTrue: true,
              },
              rightOperand: {
                expressionKind: "binOp",
                binOp: "and",
                leftOperand: {
                  expressionKind: "booleanLit",
                  isTrue: true,
                },
                rightOperand: {
                  expressionKind: "booleanLit",
                  isTrue: false,
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

        if (evalResult.right.valueKind !== "boolean") {
          throw new Error("Evaluated to non-boolean value");
        }

        expect(evalResult.right.isTrue).toBe(true);
      });

      it("Evaluates { return 1 < 2; } to true (evaluating less-than operator)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "binOp",
              binOp: "lessThan",
              leftOperand: {
                expressionKind: "numberLit",
                value: 1,
              },
              rightOperand: {
                expressionKind: "numberLit",
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

        if (evalResult.right.valueKind !== "boolean") {
          throw new Error("Evaluated to non-boolean value");
        }

        expect(evalResult.right.isTrue).toBe(true);
      });

      it("Evaluates { return 3 > 4; } to false (evaluating greater-than operator)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "binOp",
              binOp: "greaterThan",
              leftOperand: {
                expressionKind: "numberLit",
                value: 3,
              },
              rightOperand: {
                expressionKind: "numberLit",
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

        if (evalResult.right.valueKind !== "boolean") {
          throw new Error("Evaluated to non-boolean value");
        }

        expect(evalResult.right.isTrue).toBe(false);
      });

      it("Evaluates { return 5 <= 5; } to true (evaluating less-than-or-equals operator)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "binOp",
              binOp: "lessThanEquals",
              leftOperand: {
                expressionKind: "numberLit",
                value: 5,
              },
              rightOperand: {
                expressionKind: "numberLit",
                value: 5,
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

        if (evalResult.right.valueKind !== "boolean") {
          throw new Error("Evaluated to non-boolean value");
        }

        expect(evalResult.right.isTrue).toBe(true);
      });

      it("Evaluates { return 6 >= 6; } to true (evaluating greater-than-or-equals operator)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "binOp",
              binOp: "greaterThanEquals",
              leftOperand: {
                expressionKind: "numberLit",
                value: 6,
              },
              rightOperand: {
                expressionKind: "numberLit",
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

        if (evalResult.right.valueKind !== "boolean") {
          throw new Error("Evaluated to non-boolean value");
        }

        expect(evalResult.right.isTrue).toBe(true);
      });

      it("Evaluates { return 7 == 8; } to false (evaluating equals operator with numbers)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "binOp",
              binOp: "equals",
              leftOperand: {
                expressionKind: "numberLit",
                value: 7,
              },
              rightOperand: {
                expressionKind: "numberLit",
                value: 8,
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

        if (evalResult.right.valueKind !== "boolean") {
          throw new Error("Evaluated to non-boolean value");
        }

        expect(evalResult.right.isTrue).toBe(false);
      });

      it("Evaluates { return 9 /= 10; } to true (evaluating not-equals operator with numbers)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "binOp",
              binOp: "notEqual",
              leftOperand: {
                expressionKind: "numberLit",
                value: 9,
              },
              rightOperand: {
                expressionKind: "numberLit",
                value: 10,
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

        if (evalResult.right.valueKind !== "boolean") {
          throw new Error("Evaluated to non-boolean value");
        }

        expect(evalResult.right.isTrue).toBe(true);
      });

      it("Evaluates { return true == true; } to true (evaluating equals operator with booleans)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "binOp",
              binOp: "equals",
              leftOperand: {
                expressionKind: "booleanLit",
                isTrue: true,
              },
              rightOperand: {
                expressionKind: "booleanLit",
                isTrue: true,
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

        if (evalResult.right.valueKind !== "boolean") {
          throw new Error("Evaluated to non-boolean value");
        }

        expect(evalResult.right.isTrue).toBe(true);
      });

      it("Evaluates { return false /= true; } to true (evaluating not-equals operator with booleans)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "binOp",
              binOp: "notEqual",
              leftOperand: {
                expressionKind: "booleanLit",
                isTrue: false,
              },
              rightOperand: {
                expressionKind: "booleanLit",
                isTrue: true,
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

        if (evalResult.right.valueKind !== "boolean") {
          throw new Error("Evaluated to non-boolean value");
        }

        expect(evalResult.right.isTrue).toBe(true);
      });
    });

    describe("Programs with simple variable use", () => {
      it("Evaluates { let x; x = 1; return x; } to 1 (assigning numeric literal expression to a variable)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "varDecl",
            variableName: identifierIso.wrap("x"),
          },
          {
            statementKind: "assignment",
            variableName: identifierIso.wrap("x"),
            variableValue: {
              expressionKind: "numberLit",
              value: 1,
            },
          },
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "variableRef",
              variableName: identifierIso.wrap("x"),
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

      it("Evaluates { let x; x = 2; return x; } to 2 (assigning numeric literal expression to a variable)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "varDecl",
            variableName: identifierIso.wrap("x"),
          },
          {
            statementKind: "assignment",
            variableName: identifierIso.wrap("x"),
            variableValue: {
              expressionKind: "numberLit",
              value: 2,
            },
          },
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "variableRef",
              variableName: identifierIso.wrap("x"),
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

      it("Evaluates { let x; x = 1; let y; y = 2; return x; } to 1 (checking that the correct variable's value is used)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "varDecl",
            variableName: identifierIso.wrap("x"),
          },
          {
            statementKind: "assignment",
            variableName: identifierIso.wrap("x"),
            variableValue: {
              expressionKind: "numberLit",
              value: 1,
            },
          },
          {
            statementKind: "varDecl",
            variableName: identifierIso.wrap("y"),
          },
          {
            statementKind: "assignment",
            variableName: identifierIso.wrap("y"),
            variableValue: {
              expressionKind: "numberLit",
              value: 2,
            },
          },
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "variableRef",
              variableName: identifierIso.wrap("x"),
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

      it("Evaluates { let x; x = 1; let y; y = 2; return y; } to 2 (checking that the correct variable's value is used)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "varDecl",
            variableName: identifierIso.wrap("x"),
          },
          {
            statementKind: "assignment",
            variableName: identifierIso.wrap("x"),
            variableValue: {
              expressionKind: "numberLit",
              value: 1,
            },
          },
          {
            statementKind: "varDecl",
            variableName: identifierIso.wrap("y"),
          },
          {
            statementKind: "assignment",
            variableName: identifierIso.wrap("y"),
            variableValue: {
              expressionKind: "numberLit",
              value: 2,
            },
          },
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "variableRef",
              variableName: identifierIso.wrap("y"),
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

      it("Evaluates { let x; x = 1; let y; y = 2; return x + y; } to 3 (checking operations with variables)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "varDecl",
            variableName: identifierIso.wrap("x"),
          },
          {
            statementKind: "assignment",
            variableName: identifierIso.wrap("x"),
            variableValue: {
              expressionKind: "numberLit",
              value: 1,
            },
          },
          {
            statementKind: "varDecl",
            variableName: identifierIso.wrap("y"),
          },
          {
            statementKind: "assignment",
            variableName: identifierIso.wrap("y"),
            variableValue: {
              expressionKind: "numberLit",
              value: 2,
            },
          },
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "binOp",
              binOp: "add",
              leftOperand: {
                expressionKind: "variableRef",
                variableName: identifierIso.wrap("x"),
              },
              rightOperand: {
                expressionKind: "variableRef",
                variableName: identifierIso.wrap("y"),
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
      it("Evaluates { function f() { return 1; } return f(); } to 1 (checking single function call evaluation)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "funcDecl",
            functionName: identifierIso.wrap("f"),
            argNames: [],
            body: [
              {
                statementKind: "return",
                returnedValue: {
                  expressionKind: "numberLit",
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
                variableName: identifierIso.wrap("f"),
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

      it("Evaluates { function f() { return 1; } function g() { return 2; } return f() + g(); } to 3 (checking evaluation of expression with multiple function calls)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "funcDecl",
            functionName: identifierIso.wrap("f"),
            argNames: [],
            body: [
              {
                statementKind: "return",
                returnedValue: {
                  expressionKind: "numberLit",
                  value: 1,
                },
              },
            ],
          },
          {
            statementKind: "funcDecl",
            functionName: identifierIso.wrap("g"),
            argNames: [],
            body: [
              {
                statementKind: "return",
                returnedValue: {
                  expressionKind: "numberLit",
                  value: 2,
                },
              },
            ],
          },
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "binOp",
              binOp: "add",
              leftOperand: {
                expressionKind: "funcCall",
                callee: {
                  expressionKind: "variableRef",
                  variableName: identifierIso.wrap("f"),
                },
                args: [],
              },
              rightOperand: {
                expressionKind: "funcCall",
                callee: {
                  expressionKind: "variableRef",
                  variableName: identifierIso.wrap("g"),
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

      it("Evaluates { let x; x = 1; function f(y) { return y; } return f(x); } to 1 (checking function called with a variable as argument)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "varDecl",
            variableName: identifierIso.wrap("x"),
          },
          {
            statementKind: "assignment",
            variableName: identifierIso.wrap("x"),
            variableValue: {
              expressionKind: "numberLit",
              value: 1,
            },
          },
          {
            statementKind: "funcDecl",
            functionName: identifierIso.wrap("f"),
            argNames: [identifierIso.wrap("y")],
            body: [
              {
                statementKind: "return",
                returnedValue: {
                  expressionKind: "variableRef",
                  variableName: identifierIso.wrap("y"),
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
                variableName: identifierIso.wrap("f"),
              },
              args: [
                {
                  expressionKind: "variableRef",
                  variableName: identifierIso.wrap("x"),
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

      it("Evaluates { let x; x = 1; function f(y) { return x + y; } return f(2); } to 3 (checking calling function which uses an operation)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "varDecl",
            variableName: identifierIso.wrap("x"),
          },
          {
            statementKind: "assignment",
            variableName: identifierIso.wrap("x"),
            variableValue: {
              expressionKind: "numberLit",
              value: 1,
            },
          },
          {
            statementKind: "funcDecl",
            functionName: identifierIso.wrap("f"),
            argNames: [identifierIso.wrap("y")],
            body: [
              {
                statementKind: "return",
                returnedValue: {
                  expressionKind: "binOp",
                  binOp: "add",
                  leftOperand: {
                    expressionKind: "variableRef",
                    variableName: identifierIso.wrap("x"),
                  },
                  rightOperand: {
                    expressionKind: "variableRef",
                    variableName: identifierIso.wrap("y"),
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
                variableName: identifierIso.wrap("f"),
              },
              args: [
                {
                  expressionKind: "numberLit",
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
      it("Evaluates { function f() { function g() { return 1; } return g; } return f()(); } to 1 (checking call of higher-order function in single statement)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "funcDecl",
            functionName: identifierIso.wrap("f"),
            argNames: [],
            body: [
              {
                statementKind: "funcDecl",
                functionName: identifierIso.wrap("g"),
                argNames: [],
                body: [
                  {
                    statementKind: "return",
                    returnedValue: {
                      expressionKind: "numberLit",
                      value: 1,
                    },
                  },
                ],
              },
              {
                statementKind: "return",
                returnedValue: {
                  expressionKind: "variableRef",
                  variableName: identifierIso.wrap("g"),
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
                  variableName: identifierIso.wrap("f"),
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

      it("Evaluates { function makeAdder(x) { function adder(y) { return x + y; } return adder; } addOne = makeAdder(1); return addOne(2); } to 3 (checking call of higher-order function over multiple statements", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "funcDecl",
            functionName: identifierIso.wrap("makeAdder"),
            argNames: [identifierIso.wrap("x")],
            body: [
              {
                statementKind: "funcDecl",
                functionName: identifierIso.wrap("adder"),
                argNames: [identifierIso.wrap("y")],
                body: [
                  {
                    statementKind: "return",
                    returnedValue: {
                      expressionKind: "binOp",
                      binOp: "add",
                      leftOperand: {
                        expressionKind: "variableRef",
                        variableName: identifierIso.wrap("x"),
                      },
                      rightOperand: {
                        expressionKind: "variableRef",
                        variableName: identifierIso.wrap("y"),
                      },
                    },
                  },
                ],
              },
              {
                statementKind: "return",
                returnedValue: {
                  expressionKind: "variableRef",
                  variableName: identifierIso.wrap("adder"),
                },
              },
            ],
          },
          {
            statementKind: "assignment",
            variableName: identifierIso.wrap("addOne"),
            variableValue: {
              expressionKind: "funcCall",
              args: [
                {
                  expressionKind: "numberLit",
                  value: 1,
                },
              ],
              callee: {
                expressionKind: "variableRef",
                variableName: identifierIso.wrap("makeAdder"),
              },
            },
          },
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "funcCall",
              args: [
                {
                  expressionKind: "numberLit",
                  value: 2,
                },
              ],
              callee: {
                expressionKind: "variableRef",
                variableName: identifierIso.wrap("addOne"),
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

    describe("Programs with if statements", () => {
      it("Evaluates { if (true) { return 1; } else { return 2; } } to 1 (evaluating true block of if statements)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "if",
            condition: {
              expressionKind: "booleanLit",
              isTrue: true,
            },
            trueBody: [
              {
                statementKind: "return",
                returnedValue: {
                  expressionKind: "numberLit",
                  value: 1,
                },
              },
            ],
            falseBody: [
              {
                statementKind: "return",
                returnedValue: {
                  expressionKind: "numberLit",
                  value: 2,
                },
              },
            ],
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

      it("Evaluates { if (false) { return 1; } else { return 2; } } to 2 (evaluating false block of if statements)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "if",
            condition: {
              expressionKind: "booleanLit",
              isTrue: false,
            },
            trueBody: [
              {
                statementKind: "return",
                returnedValue: {
                  expressionKind: "numberLit",
                  value: 1,
                },
              },
            ],
            falseBody: [
              {
                statementKind: "return",
                returnedValue: {
                  expressionKind: "numberLit",
                  value: 2,
                },
              },
            ],
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

      it("Evaluates { let x; x = 0; if (true) { x = x + 1; } else { } return x; } to 1 (evaluating if statements with side effects in true block", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "varDecl",
            variableName: identifierIso.wrap("x"),
          },
          {
            statementKind: "assignment",
            variableName: identifierIso.wrap("x"),
            variableValue: {
              expressionKind: "numberLit",
              value: 0,
            },
          },
          {
            statementKind: "if",
            condition: {
              expressionKind: "booleanLit",
              isTrue: true,
            },
            trueBody: [
              {
                statementKind: "assignment",
                variableName: identifierIso.wrap("x"),
                variableValue: {
                  expressionKind: "binOp",
                  binOp: "add",
                  leftOperand: {
                    expressionKind: "variableRef",
                    variableName: identifierIso.wrap("x"),
                  },
                  rightOperand: {
                    expressionKind: "numberLit",
                    value: 1,
                  },
                },
              },
            ],
            falseBody: [],
          },
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "variableRef",
              variableName: identifierIso.wrap("x"),
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

      it("Evaluates { let x; x = 0; if (false) { x = x + 1; } else { x = x + 2; } return x; } to 2 (evaluating if statements with side effects in else block", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "varDecl",
            variableName: identifierIso.wrap("x"),
          },
          {
            statementKind: "assignment",
            variableName: identifierIso.wrap("x"),
            variableValue: {
              expressionKind: "numberLit",
              value: 0,
            },
          },
          {
            statementKind: "if",
            condition: {
              expressionKind: "booleanLit",
              isTrue: false,
            },
            trueBody: [
              {
                statementKind: "assignment",
                variableName: identifierIso.wrap("x"),
                variableValue: {
                  expressionKind: "binOp",
                  binOp: "add",
                  leftOperand: {
                    expressionKind: "variableRef",
                    variableName: identifierIso.wrap("x"),
                  },
                  rightOperand: {
                    expressionKind: "numberLit",
                    value: 1,
                  },
                },
              },
            ],
            falseBody: [
              {
                statementKind: "assignment",
                variableName: identifierIso.wrap("x"),
                variableValue: {
                  expressionKind: "binOp",
                  binOp: "add",
                  leftOperand: {
                    expressionKind: "variableRef",
                    variableName: identifierIso.wrap("x"),
                  },
                  rightOperand: {
                    expressionKind: "numberLit",
                    value: 2,
                  },
                },
              },
            ],
          },
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "variableRef",
              variableName: identifierIso.wrap("x"),
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

    describe("Programs with while statements", () => {
      it("Evaluates { while (true) { return 1; } } to 1 (evaluating while statement with return)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "while",
            condition: {
              expressionKind: "booleanLit",
              isTrue: true,
            },
            body: [
              {
                statementKind: "return",
                returnedValue: {
                  expressionKind: "numberLit",
                  value: 1,
                },
              },
            ],
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

      it("Evaluates { let x; x = 0; let y; y = 0; while (x < 2) { y = y + 5; x = x + 1; } return y; } to 10 (evaluating side-effecting while statements)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "varDecl",
            variableName: identifierIso.wrap("x"),
          },
          {
            statementKind: "assignment",
            variableName: identifierIso.wrap("x"),
            variableValue: {
              expressionKind: "numberLit",
              value: 0,
            },
          },
          {
            statementKind: "varDecl",
            variableName: identifierIso.wrap("y"),
          },
          {
            statementKind: "assignment",
            variableName: identifierIso.wrap("y"),
            variableValue: {
              expressionKind: "numberLit",
              value: 0,
            },
          },
          {
            statementKind: "while",
            condition: {
              expressionKind: "binOp",
              binOp: "lessThan",
              leftOperand: {
                expressionKind: "variableRef",
                variableName: identifierIso.wrap("x"),
              },
              rightOperand: {
                expressionKind: "numberLit",
                value: 2,
              },
            },
            body: [
              {
                statementKind: "assignment",
                variableName: identifierIso.wrap("y"),
                variableValue: {
                  expressionKind: "binOp",
                  binOp: "add",
                  leftOperand: {
                    expressionKind: "variableRef",
                    variableName: identifierIso.wrap("y"),
                  },
                  rightOperand: {
                    expressionKind: "numberLit",
                    value: 5,
                  },
                },
              },
              {
                statementKind: "assignment",
                variableName: identifierIso.wrap("x"),
                variableValue: {
                  expressionKind: "binOp",
                  binOp: "add",
                  leftOperand: {
                    expressionKind: "variableRef",
                    variableName: identifierIso.wrap("x"),
                  },
                  rightOperand: {
                    expressionKind: "numberLit",
                    value: 1,
                  },
                },
              },
            ],
          },
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "variableRef",
              variableName: identifierIso.wrap("y"),
            },
          },
        ];

        // Act
        const evalResult = evaluate(ast);

        // Assert
        if (!isRight(evalResult)) {
          console.error(evalResult.left.runtimeErrorKind);
          throw new Error("Evaluation failed, should have succeeded");
        }

        if (evalResult.right.valueKind !== "number") {
          throw new Error("Evaluated to non-numeric value");
        }

        expect(evalResult.right.value).toBe(10);
      });
    });

    describe("Recursive functions", () => {
      it("Evaluates { function factorial(n) if (n == 0) { return 1; } else { return n * factorial(n - 1); } return factorial(3); } to 6 (checking recursive function evaluation)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "funcDecl",
            functionName: identifierIso.wrap("factorial"),
            argNames: [identifierIso.wrap("n")],
            body: [
              {
                statementKind: "if",
                condition: {
                  expressionKind: "binOp",
                  binOp: "equals",
                  leftOperand: {
                    expressionKind: "variableRef",
                    variableName: identifierIso.wrap("n"),
                  },
                  rightOperand: {
                    expressionKind: "numberLit",
                    value: 0,
                  },
                },
                trueBody: [
                  {
                    statementKind: "return",
                    returnedValue: {
                      expressionKind: "numberLit",
                      value: 1,
                    },
                  },
                ],
                falseBody: [
                  {
                    statementKind: "return",
                    returnedValue: {
                      expressionKind: "binOp",
                      binOp: "multiply",
                      leftOperand: {
                        expressionKind: "variableRef",
                        variableName: identifierIso.wrap("n"),
                      },
                      rightOperand: {
                        expressionKind: "funcCall",
                        callee: {
                          expressionKind: "variableRef",
                          variableName: identifierIso.wrap("factorial"),
                        },
                        args: [
                          {
                            expressionKind: "binOp",
                            binOp: "subtract",
                            leftOperand: {
                              expressionKind: "variableRef",
                              variableName: identifierIso.wrap("n"),
                            },
                            rightOperand: {
                              expressionKind: "numberLit",
                              value: 1,
                            },
                          },
                        ],
                      },
                    },
                  },
                ],
              },
            ],
          },
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "funcCall",
              callee: {
                expressionKind: "variableRef",
                variableName: identifierIso.wrap("factorial"),
              },
              args: [
                {
                  expressionKind: "numberLit",
                  value: 3,
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

        expect(evalResult.right.value).toBe(6);
      });
    });

    describe("Other complex programs", () => {
      it("Evaluates { let x; x = 1; function f() { let x; x = 2; return x; } return x + f(); } to 3 (checking that local variables shadow variables in outer scopes)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "varDecl",
            variableName: identifierIso.wrap("x"),
          },
          {
            statementKind: "assignment",
            variableName: identifierIso.wrap("x"),
            variableValue: {
              expressionKind: "numberLit",
              value: 1,
            },
          },
          {
            statementKind: "funcDecl",
            functionName: identifierIso.wrap("f"),
            argNames: [],
            body: [
              {
                statementKind: "varDecl",
                variableName: identifierIso.wrap("x"),
              },
              {
                statementKind: "assignment",
                variableName: identifierIso.wrap("x"),
                variableValue: {
                  expressionKind: "numberLit",
                  value: 2,
                },
              },
              {
                statementKind: "return",
                returnedValue: {
                  expressionKind: "variableRef",
                  variableName: identifierIso.wrap("x"),
                },
              },
            ],
          },
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "binOp",
              binOp: "add",
              leftOperand: {
                expressionKind: "variableRef",
                variableName: identifierIso.wrap("x"),
              },
              rightOperand: {
                expressionKind: "funcCall",
                args: [],
                callee: {
                  expressionKind: "variableRef",
                  variableName: identifierIso.wrap("f"),
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

      it("Evaluates { let x; x = 1; function returnX() { return x; } x = 2; return returnX(); } to 2 (not 1) (checking that closures capture reference to mutable variables)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "varDecl",
            variableName: identifierIso.wrap("x"),
          },
          {
            statementKind: "assignment",
            variableName: identifierIso.wrap("x"),
            variableValue: {
              expressionKind: "numberLit",
              value: 1,
            },
          },
          {
            statementKind: "funcDecl",
            functionName: identifierIso.wrap("returnX"),
            argNames: [],
            body: [
              {
                statementKind: "return",
                returnedValue: {
                  expressionKind: "variableRef",
                  variableName: identifierIso.wrap("x"),
                },
              },
            ],
          },
          {
            statementKind: "assignment",
            variableName: identifierIso.wrap("x"),
            variableValue: {
              expressionKind: "numberLit",
              value: 2,
            },
          },
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "funcCall",
              args: [],
              callee: {
                expressionKind: "variableRef",
                variableName: identifierIso.wrap("returnX"),
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
            functionName: identifierIso.wrap("f"),
            argNames: [],
            body: [
              {
                statementKind: "return",
                returnedValue: {
                  expressionKind: "variableRef",
                  variableName: identifierIso.wrap("x"),
                },
              },
            ],
          },
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "numberLit",
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

      it("Evaluates { let x; x = 1; if (true) { x = 2; } else {} return x; } to 2 (changes to non-shadowed variables propagate to outer scopes)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "varDecl",
            variableName: identifierIso.wrap("x"),
          },
          {
            statementKind: "assignment",
            variableName: identifierIso.wrap("x"),
            variableValue: {
              expressionKind: "numberLit",
              value: 1,
            },
          },
          {
            statementKind: "if",
            condition: {
              expressionKind: "booleanLit",
              isTrue: true,
            },
            trueBody: [
              {
                statementKind: "assignment",
                variableName: identifierIso.wrap("x"),
                variableValue: {
                  expressionKind: "numberLit",
                  value: 2,
                },
              },
            ],
            falseBody: [],
          },
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "variableRef",
              variableName: identifierIso.wrap("x"),
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
  });

  describe("Failed evaluations", () => {
    it("Recognizes a NotInScope error for { return x; }", () => {
      // Arrange
      const ast: Program = [
        {
          statementKind: "return",
          returnedValue: {
            expressionKind: "variableRef",
            variableName: identifierIso.wrap("x"),
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
          functionName: identifierIso.wrap("f"),
          argNames: [],
          body: [
            {
              statementKind: "return",
              returnedValue: {
                expressionKind: "variableRef",
                variableName: identifierIso.wrap("x"),
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
              variableName: identifierIso.wrap("f"),
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
              expressionKind: "numberLit",
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

    test.each([["add" as const], ["subtract" as const], ["multiply" as const], ["divide" as const]])(
      "Recognizes a TypeMismatch error for non-numbers on LHS of %s operations",
      (binOp) => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "funcDecl",
            functionName: identifierIso.wrap("f"),
            argNames: [],
            body: [],
          },
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "binOp",
              binOp,
              leftOperand: {
                expressionKind: "variableRef",
                variableName: identifierIso.wrap("f"),
              },
              rightOperand: {
                expressionKind: "numberLit",
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

        expect(evalResult.left.expectedTypes).toEqual(["number"]);
        expect(evalResult.left.actualType).toBe("closure");
      },
    );

    test.each([["add" as const], ["subtract" as const], ["multiply" as const], ["divide" as const]])(
      "Recognizes a TypeMismatch error for non-numbers on RHS of %s operations",
      (binOp) => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "funcDecl",
            functionName: identifierIso.wrap("f"),
            argNames: [],
            body: [],
          },
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "binOp",
              binOp,
              leftOperand: {
                expressionKind: "numberLit",
                value: 1,
              },
              rightOperand: {
                expressionKind: "variableRef",
                variableName: identifierIso.wrap("f"),
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

        expect(evalResult.left.expectedTypes).toEqual(["number"]);
        expect(evalResult.left.actualType).toBe("closure");
      },
    );

    it("Recognizes a TypeMismatch error for { if(1) {} else {} } (non-boolean in if statement's condition", () => {
      // Arrange
      const ast: Program = [
        {
          statementKind: "if",
          condition: {
            expressionKind: "numberLit",
            value: 1,
          },
          trueBody: [],
          falseBody: [],
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

      expect(evalResult.left.expectedTypes).toEqual(["boolean"]);
    });

    it("Recognizes a TypeMismatch error for { while(2) {} } (non-boolean in while statement's condition", () => {
      // Arrange
      const ast: Program = [
        {
          statementKind: "while",
          condition: {
            expressionKind: "numberLit",
            value: 2,
          },
          body: [],
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

      expect(evalResult.left.expectedTypes).toEqual(["boolean"]);
    });

    test.each([
      ["lessThan" as const],
      ["greaterThan" as const],
      ["lessThanEquals" as const],
      ["greaterThanEquals" as const],
    ])("Recognizes a TypeMismatch error for non-numbers in %s relations", (binOp) => {
      // Arrange
      const ast: Program = [
        {
          statementKind: "return",
          returnedValue: {
            expressionKind: "binOp",
            binOp,
            leftOperand: {
              expressionKind: "numberLit",
              value: 1,
            },
            rightOperand: {
              expressionKind: "booleanLit",
              isTrue: true,
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

      expect(evalResult.left.expectedTypes).toEqual(["number"]);
    });

    it("Recognizes a TypeMismatch error for { return true & 1; } (non-boolean in logical and)", () => {
      // Arrange
      const ast: Program = [
        {
          statementKind: "return",
          returnedValue: {
            expressionKind: "binOp",
            binOp: "and",
            leftOperand: {
              expressionKind: "booleanLit",
              isTrue: true,
            },
            rightOperand: {
              expressionKind: "numberLit",
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

      expect(evalResult.left.expectedTypes).toEqual(["boolean"]);
    });

    it("Recognizes a TypeMismatch error for { return false | 2; } (non-boolean in logical or)", () => {
      // Arrange
      const ast: Program = [
        {
          statementKind: "return",
          returnedValue: {
            expressionKind: "binOp",
            binOp: "or",
            leftOperand: {
              expressionKind: "booleanLit",
              isTrue: false,
            },
            rightOperand: {
              expressionKind: "numberLit",
              value: 2,
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

      expect(evalResult.left.expectedTypes).toEqual(["boolean"]);
    });

    it("Recognizes a TypeMismatch error for { return !3; } (non-boolean in logical not)", () => {
      // Arrange
      const ast: Program = [
        {
          statementKind: "return",
          returnedValue: {
            expressionKind: "unaryOp",
            unaryOp: "not",
            operand: {
              expressionKind: "numberLit",
              value: 3,
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

      expect(evalResult.left.expectedTypes).toEqual(["boolean"]);
    });

    it("Recognizes a TypeMismatch error for { return 1 == true; } (mismatched types in equals expression)", () => {
      // Arrange
      const ast: Program = [
        {
          statementKind: "return",
          returnedValue: {
            expressionKind: "binOp",
            binOp: "equals",
            leftOperand: {
              expressionKind: "numberLit",
              value: 1,
            },
            rightOperand: {
              expressionKind: "booleanLit",
              isTrue: true,
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

      expect(evalResult.left.expectedTypes).toEqual(["number"]);
    });

    it("Recognizes a TypeMismatch error for { return true == 1; } (mismatched types in equals expression)", () => {
      // Arrange
      const ast: Program = [
        {
          statementKind: "return",
          returnedValue: {
            expressionKind: "binOp",
            binOp: "equals",
            leftOperand: {
              expressionKind: "booleanLit",
              isTrue: true,
            },
            rightOperand: {
              expressionKind: "numberLit",
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

      expect(evalResult.left.expectedTypes).toEqual(["boolean"]);
    });

    it("Recognizes a TypeMismatch error for { return 1 /= true; } (mismatched types in not-equal expression)", () => {
      // Arrange
      const ast: Program = [
        {
          statementKind: "return",
          returnedValue: {
            expressionKind: "binOp",
            binOp: "notEqual",
            leftOperand: {
              expressionKind: "numberLit",
              value: 1,
            },
            rightOperand: {
              expressionKind: "booleanLit",
              isTrue: true,
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

      expect(evalResult.left.expectedTypes).toEqual(["number"]);
    });

    it("Recognizes a TypeMismatch error for { return true /= 1; } (mismatched types in not-equal expression)", () => {
      // Arrange
      const ast: Program = [
        {
          statementKind: "return",
          returnedValue: {
            expressionKind: "binOp",
            binOp: "notEqual",
            leftOperand: {
              expressionKind: "booleanLit",
              isTrue: true,
            },
            rightOperand: {
              expressionKind: "numberLit",
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

      expect(evalResult.left.expectedTypes).toEqual(["boolean"]);
    });

    it("Recognizes a TypeMismatch error for { function f() {} return f == 1; } (closure on LHS of equals expression)", () => {
      // Arrange
      const ast: Program = [
        {
          statementKind: "funcDecl",
          functionName: identifierIso.wrap("f"),
          argNames: [],
          body: [],
        },
        {
          statementKind: "return",
          returnedValue: {
            expressionKind: "binOp",
            binOp: "equals",
            leftOperand: {
              expressionKind: "variableRef",
              variableName: identifierIso.wrap("f"),
            },
            rightOperand: {
              expressionKind: "numberLit",
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

      expect(evalResult.left.expectedTypes).toContain("boolean");
      expect(evalResult.left.expectedTypes).toContain("number");
      expect(evalResult.left.actualType).toBe("closure");
    });

    it("Recognizes a TypeMismatch error for { function f() {} return 1 == f; } (closure on RHS of equals expression)", () => {
      // Arrange
      const ast: Program = [
        {
          statementKind: "funcDecl",
          functionName: identifierIso.wrap("f"),
          argNames: [],
          body: [],
        },
        {
          statementKind: "return",
          returnedValue: {
            expressionKind: "binOp",
            binOp: "equals",
            leftOperand: {
              expressionKind: "numberLit",
              value: 1,
            },
            rightOperand: {
              expressionKind: "variableRef",
              variableName: identifierIso.wrap("f"),
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

      expect(evalResult.left.expectedTypes).toContain("boolean");
      expect(evalResult.left.expectedTypes).toContain("number");
      expect(evalResult.left.actualType).toBe("closure");
    });

    it("Recognizes a TypeMismatch error for { function f() {} return f /= 1; } (closure on LHS of not-equal expression)", () => {
      // Arrange
      const ast: Program = [
        {
          statementKind: "funcDecl",
          functionName: identifierIso.wrap("f"),
          argNames: [],
          body: [],
        },
        {
          statementKind: "return",
          returnedValue: {
            expressionKind: "binOp",
            binOp: "notEqual",
            leftOperand: {
              expressionKind: "variableRef",
              variableName: identifierIso.wrap("f"),
            },
            rightOperand: {
              expressionKind: "numberLit",
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

      expect(evalResult.left.expectedTypes).toContain("boolean");
      expect(evalResult.left.expectedTypes).toContain("number");
      expect(evalResult.left.actualType).toBe("closure");
    });

    it("Recognizes a TypeMismatch error for { function f() {} return 1 /= f; } (closure on RHS of not-equal expression)", () => {
      // Arrange
      const ast: Program = [
        {
          statementKind: "funcDecl",
          functionName: identifierIso.wrap("f"),
          argNames: [],
          body: [],
        },
        {
          statementKind: "return",
          returnedValue: {
            expressionKind: "binOp",
            binOp: "notEqual",
            leftOperand: {
              expressionKind: "numberLit",
              value: 1,
            },
            rightOperand: {
              expressionKind: "variableRef",
              variableName: identifierIso.wrap("f"),
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

      expect(evalResult.left.expectedTypes).toContain("boolean");
      expect(evalResult.left.expectedTypes).toContain("number");
      expect(evalResult.left.actualType).toBe("closure");
    });

    it("Recognizes a NoReturn error for {} (no return at top level)", () => {
      // Arrange
      const ast: Program = [];

      // Act
      const evalResult = evaluate(ast);

      // Assert
      if (!isLeft(evalResult)) {
        throw new Error("Evaluation succeeded, should have failed");
      }

      expect(evalResult.left.runtimeErrorKind).toBe("noReturn");
    });

    it("Recognizes a NoReturn error for { function f() {} return f(); } (no return in function declaration)", () => {
      // Arrange
      const ast: Program = [
        {
          statementKind: "funcDecl",
          functionName: identifierIso.wrap("f"),
          argNames: [],
          body: [],
        },
        {
          statementKind: "return",
          returnedValue: {
            expressionKind: "funcCall",
            callee: {
              expressionKind: "variableRef",
              variableName: identifierIso.wrap("f"),
            },
            args: [],
          },
        },
      ];

      // Act
      const evalResult = evaluate(ast);

      // Assert
      if (!isLeft(evalResult)) {
        throw new Error("Evaluation succeeded, should have failed");
      }

      expect(evalResult.left.runtimeErrorKind).toBe("noReturn");
    });

    it("Recognizes an arity mismatch (too few arguments) for { function f(x) { return x; } return f(); }", () => {
      // Arrange
      const ast: Program = [
        {
          statementKind: "funcDecl",
          functionName: identifierIso.wrap("f"),
          argNames: [identifierIso.wrap("x")],
          body: [
            {
              statementKind: "return",
              returnedValue: {
                expressionKind: "variableRef",
                variableName: identifierIso.wrap("x"),
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
              variableName: identifierIso.wrap("f"),
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

      if (evalResult.left.runtimeErrorKind !== "arityMismatch") {
        throw new Error(`Detected ${evalResult.left.runtimeErrorKind} error instead of ArityMismatch error`);
      }

      expect(evalResult.left.expectedNumArgs).toBe(1);
      expect(evalResult.left.actualNumArgs).toBe(0);
    });

    it("Recognizes an arity mismatch (too many arguments) for { function f() { return 1; } return f(2); }", () => {
      // Arrange
      const ast: Program = [
        {
          statementKind: "funcDecl",
          functionName: identifierIso.wrap("f"),
          argNames: [],
          body: [
            {
              statementKind: "return",
              returnedValue: {
                expressionKind: "numberLit",
                value: 1,
              },
            },
          ],
        },
        {
          statementKind: "return",
          returnedValue: {
            expressionKind: "funcCall",
            args: [
              {
                expressionKind: "numberLit",
                value: 2,
              },
            ],
            callee: {
              expressionKind: "variableRef",
              variableName: identifierIso.wrap("f"),
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

      if (evalResult.left.runtimeErrorKind !== "arityMismatch") {
        throw new Error(`Detected ${evalResult.left.runtimeErrorKind} error instead of ArityMismatch error`);
      }

      expect(evalResult.left.expectedNumArgs).toBe(0);
      expect(evalResult.left.actualNumArgs).toBe(1);
    });
  });
});
