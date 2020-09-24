import "jest";
import { isRight, isLeft } from "fp-ts/lib/Either";
import readlineSync from "readline-sync";
import { Program } from "../src/parser";
import { evaluate } from "../src/evaluator";
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

      it("Evaluates { return null; } to null (evaluating null literals)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "nullLit",
            },
          },
        ];

        // Act
        const evalResult = evaluate(ast);

        // Assert
        if (!isRight(evalResult)) {
          throw new Error("Evaluation failed, should have succeeded");
        }

        expect(evalResult.right.valueKind).toBe("null");
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

      it("Evaluates { return -1; } to -1 (evaluating unary negation)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "unaryOp",
              unaryOp: "negative",
              operand: {
                expressionKind: "numberLit",
                value: 1,
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

      it("Evaluates { return 2 - -3; } to 5 (evaluating unary negation as part of a larger expression)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "binOp",
              binOp: "subtract",
              leftOperand: {
                expressionKind: "numberLit",
                value: 2,
              },
              rightOperand: {
                expressionKind: "unaryOp",
                unaryOp: "negative",
                operand: {
                  expressionKind: "numberLit",
                  value: 3,
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

        expect(evalResult.right.value).toBe(5);
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

      it("Evaluates { return null == null; } to true (evaluating equals operator with null)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "binOp",
              binOp: "equals",
              leftOperand: {
                expressionKind: "nullLit",
              },
              rightOperand: {
                expressionKind: "nullLit",
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

      it("Evaluates { return null /= { a: 1 }; } to true (evaluating not-equals operator with null)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "binOp",
              binOp: "notEqual",
              leftOperand: {
                expressionKind: "nullLit",
              },
              rightOperand: {
                expressionKind: "objectLit",
                fields: [
                  {
                    fieldName: identifierIso.wrap("a"),
                    fieldValue: {
                      expressionKind: "numberLit",
                      value: 1,
                    },
                  },
                ],
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

      it("Evaluates { return { a: 1 } == null; } to false (evaluating equals operator with object and null", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "binOp",
              binOp: "equals",
              leftOperand: {
                expressionKind: "objectLit",
                fields: [
                  {
                    fieldName: identifierIso.wrap("a"),
                    fieldValue: {
                      expressionKind: "numberLit",
                      value: 1,
                    },
                  },
                ],
              },
              rightOperand: {
                expressionKind: "nullLit",
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

      it("Evaluates { return; } to null (evaluating top-level empty returns)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
          },
        ];

        // Act
        const evalResult = evaluate(ast);

        // Assert
        if (!isRight(evalResult)) {
          throw new Error("Evaluation failed, should have succeeded");
        }

        expect(evalResult.right.valueKind).toBe("null");
      });

      it("Evaluates { } to null (evaluating lack of top-level explicit return)", () => {
        // Arrange
        const ast: Program = [];

        // Act
        const evalResult = evaluate(ast);

        // Assert
        if (!isRight(evalResult)) {
          throw new Error("Evaluation failed, should have succeeded");
        }

        expect(evalResult.right.valueKind).toBe("null");
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

      it("Evaluates { function f() { return; } return f(); } to null (checking evaluation of empty returns from functions)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "funcDecl",
            functionName: identifierIso.wrap("f"),
            argNames: [],
            body: [
              {
                statementKind: "return",
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

        expect(evalResult.right.valueKind).toBe("null");
      });

      it("Evaluates { function f() { printNum(1); return; } f(); return 2; } to 2 (Evaluates programs with standalone function calls)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "funcDecl",
            functionName: identifierIso.wrap("f"),
            argNames: [],
            body: [
              {
                statementKind: "expression",
                expression: {
                  expressionKind: "funcCall",
                  args: [
                    {
                      expressionKind: "numberLit",
                      value: 1,
                    },
                  ],
                  callee: {
                    expressionKind: "variableRef",
                    variableName: identifierIso.wrap("printNum"),
                  },
                },
              },
              {
                statementKind: "return",
              },
            ],
          },
          {
            statementKind: "expression",
            expression: {
              expressionKind: "funcCall",
              args: [],
              callee: {
                expressionKind: "variableRef",
                variableName: identifierIso.wrap("f"),
              },
            },
          },
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "numberLit",
              value: 2,
            },
          },
        ];
        const consoleLogSpy = jest.spyOn(global.console, "log").mockImplementation(() => {
          /* intentional no-op */
        });

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

        // Cleanup
        consoleLogSpy.mockRestore();
      });

      it("Evaluates { function f() { printNum(3); } f(); return 4; } to 4 (Evaluates programs with function calls with no explicit return)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "funcDecl",
            functionName: identifierIso.wrap("f"),
            argNames: [],
            body: [
              {
                statementKind: "expression",
                expression: {
                  expressionKind: "funcCall",
                  args: [
                    {
                      expressionKind: "numberLit",
                      value: 3,
                    },
                  ],
                  callee: {
                    expressionKind: "variableRef",
                    variableName: identifierIso.wrap("printNum"),
                  },
                },
              },
            ],
          },
          {
            statementKind: "expression",
            expression: {
              expressionKind: "funcCall",
              args: [],
              callee: {
                expressionKind: "variableRef",
                variableName: identifierIso.wrap("f"),
              },
            },
          },
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "numberLit",
              value: 4,
            },
          },
        ];
        const consoleLogSpy = jest.spyOn(global.console, "log").mockImplementation(() => {
          /* intentional no-op */
        });

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

        // Cleanup
        consoleLogSpy.mockRestore();
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

      it("Evaluates { function makeAdder(x) { function adder(y) { return x + y; } return adder; } let addOne; addOne = makeAdder(1); return addOne(2); } to 3 (checking call of higher-order function over multiple statements", () => {
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
            statementKind: "varDecl",
            variableName: identifierIso.wrap("addOne"),
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

    describe("Object usage", () => {
      it("Evaluates { let x = { field: 1 }; return x.field; } to 1 (basic getter usage)", () => {
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
              expressionKind: "objectLit",
              fields: [
                {
                  fieldName: identifierIso.wrap("field"),
                  fieldValue: {
                    expressionKind: "numberLit",
                    value: 1,
                  },
                },
              ],
            },
          },
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "get",
              object: {
                expressionKind: "variableRef",
                variableName: identifierIso.wrap("x"),
              },
              field: identifierIso.wrap("field"),
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

      it("Evaluates { let x = { field: 1 }; x.field = 2; return x.field; } to 2 (basic setter usage)", () => {
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
              expressionKind: "objectLit",
              fields: [
                {
                  fieldName: identifierIso.wrap("field"),
                  fieldValue: {
                    expressionKind: "numberLit",
                    value: 1,
                  },
                },
              ],
            },
          },
          {
            statementKind: "set",
            object: {
              expressionKind: "variableRef",
              variableName: identifierIso.wrap("x"),
            },
            field: identifierIso.wrap("field"),
            value: {
              expressionKind: "numberLit",
              value: 2,
            },
          },
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "get",
              object: {
                expressionKind: "variableRef",
                variableName: identifierIso.wrap("x"),
              },
              field: identifierIso.wrap("field"),
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

      it("Evaluates { let nested = { outer: { inner: 1 } }; return nested.outer.inner; } to 1 (chained getters)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "varDecl",
            variableName: identifierIso.wrap("nested"),
          },
          {
            statementKind: "assignment",
            variableName: identifierIso.wrap("nested"),
            variableValue: {
              expressionKind: "objectLit",
              fields: [
                {
                  fieldName: identifierIso.wrap("outer"),
                  fieldValue: {
                    expressionKind: "objectLit",
                    fields: [
                      {
                        fieldName: identifierIso.wrap("inner"),
                        fieldValue: {
                          expressionKind: "numberLit",
                          value: 1,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "get",
              object: {
                expressionKind: "get",
                object: {
                  expressionKind: "variableRef",
                  variableName: identifierIso.wrap("nested"),
                },
                field: identifierIso.wrap("outer"),
              },
              field: identifierIso.wrap("inner"),
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

      it("Evaluates { let nested = { outer: { inner: 1 } }; nested.outer.inner = 2; return nested.outer.inner; } to 2 (nested setter)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "varDecl",
            variableName: identifierIso.wrap("nested"),
          },
          {
            statementKind: "assignment",
            variableName: identifierIso.wrap("nested"),
            variableValue: {
              expressionKind: "objectLit",
              fields: [
                {
                  fieldName: identifierIso.wrap("outer"),
                  fieldValue: {
                    expressionKind: "objectLit",
                    fields: [
                      {
                        fieldName: identifierIso.wrap("inner"),
                        fieldValue: {
                          expressionKind: "numberLit",
                          value: 1,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            statementKind: "set",
            object: {
              expressionKind: "get",
              object: {
                expressionKind: "variableRef",
                variableName: identifierIso.wrap("nested"),
              },
              field: identifierIso.wrap("outer"),
            },
            field: identifierIso.wrap("inner"),
            value: {
              expressionKind: "numberLit",
              value: 2,
            },
          },
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "get",
              object: {
                expressionKind: "get",
                object: {
                  expressionKind: "variableRef",
                  variableName: identifierIso.wrap("nested"),
                },
                field: identifierIso.wrap("outer"),
              },
              field: identifierIso.wrap("inner"),
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

      it("Evaluates { let x = { a: 1 }; return x.b; } to null (nonexistent property on object)", () => {
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
              expressionKind: "objectLit",
              fields: [
                {
                  fieldName: identifierIso.wrap("a"),
                  fieldValue: {
                    expressionKind: "numberLit",
                    value: 1,
                  },
                },
              ],
            },
          },

          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "get",
              object: {
                expressionKind: "variableRef",
                variableName: identifierIso.wrap("x"),
              },
              field: identifierIso.wrap("b"),
            },
          },
        ];

        // Act
        const evalResult = evaluate(ast);

        // Assert
        if (!isRight(evalResult)) {
          throw new Error("Evaluation failed, should have succeeded");
        }

        expect(evalResult.right.valueKind).toBe("null");
      });

      it("Evaluates { let x = { a: { b: 1 } }; x.a = null; return x.a; } to null (assignment of null via setter)", () => {
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
              expressionKind: "objectLit",
              fields: [
                {
                  fieldName: identifierIso.wrap("a"),
                  fieldValue: {
                    expressionKind: "objectLit",
                    fields: [
                      {
                        fieldName: identifierIso.wrap("b"),
                        fieldValue: {
                          expressionKind: "numberLit",
                          value: 1,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            statementKind: "set",
            object: {
              expressionKind: "variableRef",
              variableName: identifierIso.wrap("x"),
            },
            field: identifierIso.wrap("a"),
            value: {
              expressionKind: "nullLit",
            },
          },
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "get",
              object: {
                expressionKind: "variableRef",
                variableName: identifierIso.wrap("x"),
              },
              field: identifierIso.wrap("a"),
            },
          },
        ];

        // Act
        const evalResult = evaluate(ast);

        // Assert
        if (!isRight(evalResult)) {
          throw new Error("Evaluation failed, should have succeeded");
        }

        expect(evalResult.right.valueKind).toBe("null");
      });

      it("Evaluates { return {} == {}; } to true (empty objects are equal to each other)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "binOp",
              binOp: "equals",
              leftOperand: {
                expressionKind: "objectLit",
                fields: [],
              },
              rightOperand: {
                expressionKind: "objectLit",
                fields: [],
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

      it("Evaluates { return { a: 1 } == {}; } to false (nonempty objects aren't equal to empty objects", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "binOp",
              binOp: "equals",
              leftOperand: {
                expressionKind: "objectLit",
                fields: [
                  {
                    fieldName: identifierIso.wrap("a"),
                    fieldValue: {
                      expressionKind: "numberLit",
                      value: 1,
                    },
                  },
                ],
              },
              rightOperand: {
                expressionKind: "objectLit",
                fields: [],
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

      it("Evaluates { return { a: 1} == { a: 1}; } to true (objects with same fields and same values are equal)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "binOp",
              binOp: "equals",
              leftOperand: {
                expressionKind: "objectLit",
                fields: [
                  {
                    fieldName: identifierIso.wrap("a"),
                    fieldValue: {
                      expressionKind: "numberLit",
                      value: 1,
                    },
                  },
                ],
              },
              rightOperand: {
                expressionKind: "objectLit",
                fields: [
                  {
                    fieldName: identifierIso.wrap("a"),
                    fieldValue: {
                      expressionKind: "numberLit",
                      value: 1,
                    },
                  },
                ],
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

      it("Evaluates { return { a: 1 } == { a: 2 }; } to false (objects with same fields but different values are nonequal", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "binOp",
              binOp: "equals",
              leftOperand: {
                expressionKind: "objectLit",
                fields: [
                  {
                    fieldName: identifierIso.wrap("a"),
                    fieldValue: {
                      expressionKind: "numberLit",
                      value: 1,
                    },
                  },
                ],
              },
              rightOperand: {
                expressionKind: "objectLit",
                fields: [
                  {
                    fieldName: identifierIso.wrap("a"),
                    fieldValue: {
                      expressionKind: "numberLit",
                      value: 2,
                    },
                  },
                ],
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

      it("Evaluates { return { a: 1, b: 2 } == { a: 1 }; } to false (extra fields cause objects to be nonequal)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "binOp",
              binOp: "equals",
              leftOperand: {
                expressionKind: "objectLit",
                fields: [
                  {
                    fieldName: identifierIso.wrap("a"),
                    fieldValue: {
                      expressionKind: "numberLit",
                      value: 1,
                    },
                  },
                  {
                    fieldName: identifierIso.wrap("b"),
                    fieldValue: {
                      expressionKind: "numberLit",
                      value: 2,
                    },
                  },
                ],
              },
              rightOperand: {
                expressionKind: "objectLit",
                fields: [
                  {
                    fieldName: identifierIso.wrap("a"),
                    fieldValue: {
                      expressionKind: "numberLit",
                      value: 1,
                    },
                  },
                ],
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

      it("Evaluates { return { a: 1, b: 2 } == { a: 1, b: 2 }; } to true (objects with multiple, identical fields are equal)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "binOp",
              binOp: "equals",
              leftOperand: {
                expressionKind: "objectLit",
                fields: [
                  {
                    fieldName: identifierIso.wrap("a"),
                    fieldValue: {
                      expressionKind: "numberLit",
                      value: 1,
                    },
                  },
                  {
                    fieldName: identifierIso.wrap("b"),
                    fieldValue: {
                      expressionKind: "numberLit",
                      value: 2,
                    },
                  },
                ],
              },
              rightOperand: {
                expressionKind: "objectLit",
                fields: [
                  {
                    fieldName: identifierIso.wrap("a"),
                    fieldValue: {
                      expressionKind: "numberLit",
                      value: 1,
                    },
                  },
                  {
                    fieldName: identifierIso.wrap("b"),
                    fieldValue: {
                      expressionKind: "numberLit",
                      value: 2,
                    },
                  },
                ],
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

      it("Evaluates { return { a: 1, b: 2} == { a: 1, c: 2 }; } to false (objects with same number of fields but different names are nonequal)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "binOp",
              binOp: "equals",
              leftOperand: {
                expressionKind: "objectLit",
                fields: [
                  {
                    fieldName: identifierIso.wrap("a"),
                    fieldValue: {
                      expressionKind: "numberLit",
                      value: 1,
                    },
                  },
                  {
                    fieldName: identifierIso.wrap("b"),
                    fieldValue: {
                      expressionKind: "numberLit",
                      value: 2,
                    },
                  },
                ],
              },
              rightOperand: {
                expressionKind: "objectLit",
                fields: [
                  {
                    fieldName: identifierIso.wrap("a"),
                    fieldValue: {
                      expressionKind: "numberLit",
                      value: 1,
                    },
                  },
                  {
                    fieldName: identifierIso.wrap("c"),
                    fieldValue: {
                      expressionKind: "numberLit",
                      value: 2,
                    },
                  },
                ],
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

      it("Evaluates { return {} /= {}; } to false (empty objects are equal to each other)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "binOp",
              binOp: "notEqual",
              leftOperand: {
                expressionKind: "objectLit",
                fields: [],
              },
              rightOperand: {
                expressionKind: "objectLit",
                fields: [],
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

      it("Evaluates { return { a: 1 } /= {}; } to true (nonempty objects aren't equal to empty objects", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "binOp",
              binOp: "notEqual",
              leftOperand: {
                expressionKind: "objectLit",
                fields: [
                  {
                    fieldName: identifierIso.wrap("a"),
                    fieldValue: {
                      expressionKind: "numberLit",
                      value: 1,
                    },
                  },
                ],
              },
              rightOperand: {
                expressionKind: "objectLit",
                fields: [],
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

      it("Evaluates { return { a: 1} /= { a: 1}; } to false (objects with same fields and same values are equal)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "binOp",
              binOp: "notEqual",
              leftOperand: {
                expressionKind: "objectLit",
                fields: [
                  {
                    fieldName: identifierIso.wrap("a"),
                    fieldValue: {
                      expressionKind: "numberLit",
                      value: 1,
                    },
                  },
                ],
              },
              rightOperand: {
                expressionKind: "objectLit",
                fields: [
                  {
                    fieldName: identifierIso.wrap("a"),
                    fieldValue: {
                      expressionKind: "numberLit",
                      value: 1,
                    },
                  },
                ],
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

      it("Evaluates { return { a: 1 } /= { a: 2 }; } to true (objects with same fields but different values are nonequal", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "binOp",
              binOp: "notEqual",
              leftOperand: {
                expressionKind: "objectLit",
                fields: [
                  {
                    fieldName: identifierIso.wrap("a"),
                    fieldValue: {
                      expressionKind: "numberLit",
                      value: 1,
                    },
                  },
                ],
              },
              rightOperand: {
                expressionKind: "objectLit",
                fields: [
                  {
                    fieldName: identifierIso.wrap("a"),
                    fieldValue: {
                      expressionKind: "numberLit",
                      value: 2,
                    },
                  },
                ],
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

      it("Evaluates { return { a: 1, b: 2 } /= { a: 1 }; } to true (extra fields cause objects to be nonequal)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "binOp",
              binOp: "notEqual",
              leftOperand: {
                expressionKind: "objectLit",
                fields: [
                  {
                    fieldName: identifierIso.wrap("a"),
                    fieldValue: {
                      expressionKind: "numberLit",
                      value: 1,
                    },
                  },
                  {
                    fieldName: identifierIso.wrap("b"),
                    fieldValue: {
                      expressionKind: "numberLit",
                      value: 2,
                    },
                  },
                ],
              },
              rightOperand: {
                expressionKind: "objectLit",
                fields: [
                  {
                    fieldName: identifierIso.wrap("a"),
                    fieldValue: {
                      expressionKind: "numberLit",
                      value: 1,
                    },
                  },
                ],
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

      it("Evaluates { return { a: 1, b: 2 } /= { a: 1, b: 2 }; } to false (objects with multiple, identical fields are equal)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "binOp",
              binOp: "notEqual",
              leftOperand: {
                expressionKind: "objectLit",
                fields: [
                  {
                    fieldName: identifierIso.wrap("a"),
                    fieldValue: {
                      expressionKind: "numberLit",
                      value: 1,
                    },
                  },
                  {
                    fieldName: identifierIso.wrap("b"),
                    fieldValue: {
                      expressionKind: "numberLit",
                      value: 2,
                    },
                  },
                ],
              },
              rightOperand: {
                expressionKind: "objectLit",
                fields: [
                  {
                    fieldName: identifierIso.wrap("a"),
                    fieldValue: {
                      expressionKind: "numberLit",
                      value: 1,
                    },
                  },
                  {
                    fieldName: identifierIso.wrap("b"),
                    fieldValue: {
                      expressionKind: "numberLit",
                      value: 2,
                    },
                  },
                ],
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
    });

    describe("Native functions", () => {
      it("Evaluates { return clock(); } to the current time as a number using Date.now()", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "funcCall",
              args: [],
              callee: {
                expressionKind: "variableRef",
                variableName: identifierIso.wrap("clock"),
              },
            },
          },
        ];

        jest.useFakeTimers("modern");
        const time = 5;
        jest.setSystemTime(time);

        // Act
        const evalResult = evaluate(ast);

        // Assert
        if (!isRight(evalResult)) {
          throw new Error("Evaluation failed, should have succeeded");
        }

        if (evalResult.right.valueKind !== "number") {
          throw new Error("Evaluated to non-numeric value");
        }

        expect(evalResult.right.value).toBe(time);

        // Cleanup
        jest.useRealTimers();
      });

      it('Prints "1" with console.log when evaluating { printNum(1); }', () => {
        // Arrange
        const num = 1;
        const ast: Program = [
          {
            statementKind: "expression",
            expression: {
              expressionKind: "funcCall",
              args: [
                {
                  expressionKind: "numberLit",
                  value: num,
                },
              ],
              callee: {
                expressionKind: "variableRef",
                variableName: identifierIso.wrap("printNum"),
              },
            },
          },
        ];
        const consoleLogSpy = jest.spyOn(global.console, "log").mockImplementation(() => {
          /* intentional no-op */
        });

        // Act
        const evalResult = evaluate(ast);

        // Assert
        if (!isRight(evalResult)) {
          throw new Error("Evaluation failed, should have succeeded");
        }

        expect(consoleLogSpy).toBeCalledWith(num);

        // Cleanup
        consoleLogSpy.mockRestore();
      });

      it('Prints "true" with console.log when evaluating { printBool(true); }', () => {
        // Arrange
        const bool = true;
        const ast: Program = [
          {
            statementKind: "expression",
            expression: {
              expressionKind: "funcCall",
              args: [
                {
                  expressionKind: "booleanLit",
                  isTrue: bool,
                },
              ],
              callee: {
                expressionKind: "variableRef",
                variableName: identifierIso.wrap("printBool"),
              },
            },
          },
        ];
        const consoleLogSpy = jest.spyOn(global.console, "log").mockImplementation(() => {
          /* intentional no-op */
        });

        // Act
        const evalResult = evaluate(ast);

        // Assert
        if (!isRight(evalResult)) {
          throw new Error("Evaluation failed, should have succeeded");
        }

        expect(consoleLogSpy).toBeCalledWith(bool);

        // Cleanup
        consoleLogSpy.mockRestore();
      });

      it('Given input of "1.2", evaluates { let readResult = readNum(); if (readResult.isValid) { return readResult.value; } else { return 0; } } to 1.2', () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "varDecl",
            variableName: identifierIso.wrap("readResult"),
          },
          {
            statementKind: "assignment",
            variableName: identifierIso.wrap("readResult"),
            variableValue: {
              expressionKind: "funcCall",
              args: [],
              callee: {
                expressionKind: "variableRef",
                variableName: identifierIso.wrap("readNum"),
              },
            },
          },
          {
            statementKind: "if",
            condition: {
              expressionKind: "get",
              object: {
                expressionKind: "variableRef",
                variableName: identifierIso.wrap("readResult"),
              },
              field: identifierIso.wrap("isValid"),
            },
            trueBody: [
              {
                statementKind: "return",
                returnedValue: {
                  expressionKind: "get",
                  object: {
                    expressionKind: "variableRef",
                    variableName: identifierIso.wrap("readResult"),
                  },
                  field: identifierIso.wrap("value"),
                },
              },
            ],
            falseBody: [
              {
                statementKind: "return",
                returnedValue: {
                  expressionKind: "numberLit",
                  value: 0,
                },
              },
            ],
          },
        ];
        const inputValue = 1.2;
        const promptSpy = jest.spyOn(readlineSync, "prompt").mockImplementation(() => inputValue.toString());

        // Act
        const evalResult = evaluate(ast);

        // Assert
        if (!isRight(evalResult)) {
          throw new Error("Evaluation failed, should have succeeded");
        }

        if (evalResult.right.valueKind !== "number") {
          throw new Error("Evaluated to non-numeric value");
        }

        expect(evalResult.right.value).toBe(inputValue);

        // Cleanup
        promptSpy.mockRestore();
      });

      it('Given input of "notANumber", evaluates { let readResult = readNum(); return readResult.isValid; } to false', () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "varDecl",
            variableName: identifierIso.wrap("readResult"),
          },
          {
            statementKind: "assignment",
            variableName: identifierIso.wrap("readResult"),
            variableValue: {
              expressionKind: "funcCall",
              args: [],
              callee: {
                expressionKind: "variableRef",
                variableName: identifierIso.wrap("readNum"),
              },
            },
          },
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "get",
              object: {
                expressionKind: "variableRef",
                variableName: identifierIso.wrap("readResult"),
              },
              field: identifierIso.wrap("isValid"),
            },
          },
        ];
        const promptSpy = jest.spyOn(readlineSync, "prompt").mockImplementation(() => "notANumber");

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

        // Cleanup
        promptSpy.mockRestore();
      });

      it('Given input of "true", evaluates { let readResult = readBool(); if (readResult.isValid) { return readResult.value; } else { return 0; } } to true', () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "varDecl",
            variableName: identifierIso.wrap("readResult"),
          },
          {
            statementKind: "assignment",
            variableName: identifierIso.wrap("readResult"),
            variableValue: {
              expressionKind: "funcCall",
              args: [],
              callee: {
                expressionKind: "variableRef",
                variableName: identifierIso.wrap("readBool"),
              },
            },
          },
          {
            statementKind: "if",
            condition: {
              expressionKind: "get",
              object: {
                expressionKind: "variableRef",
                variableName: identifierIso.wrap("readResult"),
              },
              field: identifierIso.wrap("isValid"),
            },
            trueBody: [
              {
                statementKind: "return",
                returnedValue: {
                  expressionKind: "get",
                  object: {
                    expressionKind: "variableRef",
                    variableName: identifierIso.wrap("readResult"),
                  },
                  field: identifierIso.wrap("value"),
                },
              },
            ],
            falseBody: [
              {
                statementKind: "return",
                returnedValue: {
                  expressionKind: "numberLit",
                  value: 0,
                },
              },
            ],
          },
        ];
        const inputValue = true;
        const promptSpy = jest.spyOn(readlineSync, "prompt").mockImplementation(() => inputValue.toString());

        // Act
        const evalResult = evaluate(ast);

        // Assert
        if (!isRight(evalResult)) {
          throw new Error("Evaluation failed, should have succeeded");
        }

        if (evalResult.right.valueKind !== "boolean") {
          throw new Error("Evaluated to non-boolean value");
        }

        expect(evalResult.right.isTrue).toBe(inputValue);

        // Cleanup
        promptSpy.mockRestore();
      });

      it('Given input of "false", evaluates { let readResult = readBool(); if (readResult.isValid) { return readResult.value; } else { return 0; } } to false', () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "varDecl",
            variableName: identifierIso.wrap("readResult"),
          },
          {
            statementKind: "assignment",
            variableName: identifierIso.wrap("readResult"),
            variableValue: {
              expressionKind: "funcCall",
              args: [],
              callee: {
                expressionKind: "variableRef",
                variableName: identifierIso.wrap("readBool"),
              },
            },
          },
          {
            statementKind: "if",
            condition: {
              expressionKind: "get",
              object: {
                expressionKind: "variableRef",
                variableName: identifierIso.wrap("readResult"),
              },
              field: identifierIso.wrap("isValid"),
            },
            trueBody: [
              {
                statementKind: "return",
                returnedValue: {
                  expressionKind: "get",
                  object: {
                    expressionKind: "variableRef",
                    variableName: identifierIso.wrap("readResult"),
                  },
                  field: identifierIso.wrap("value"),
                },
              },
            ],
            falseBody: [
              {
                statementKind: "return",
                returnedValue: {
                  expressionKind: "numberLit",
                  value: 0,
                },
              },
            ],
          },
        ];
        const inputValue = false;
        const promptSpy = jest.spyOn(readlineSync, "prompt").mockImplementation(() => inputValue.toString());

        // Act
        const evalResult = evaluate(ast);

        // Assert
        if (!isRight(evalResult)) {
          throw new Error("Evaluation failed, should have succeeded");
        }

        if (evalResult.right.valueKind !== "boolean") {
          throw new Error("Evaluated to non-boolean value");
        }

        expect(evalResult.right.isTrue).toBe(inputValue);

        // Cleanup
        promptSpy.mockRestore();
      });

      it('Given input of "notABool", evaluates { let readResult = readBool(); return readResult.isValid; } to false', () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "varDecl",
            variableName: identifierIso.wrap("readResult"),
          },
          {
            statementKind: "assignment",
            variableName: identifierIso.wrap("readResult"),
            variableValue: {
              expressionKind: "funcCall",
              args: [],
              callee: {
                expressionKind: "variableRef",
                variableName: identifierIso.wrap("readBool"),
              },
            },
          },
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "get",
              object: {
                expressionKind: "variableRef",
                variableName: identifierIso.wrap("readResult"),
              },
              field: identifierIso.wrap("isValid"),
            },
          },
        ];
        const promptSpy = jest.spyOn(readlineSync, "prompt").mockImplementation(() => "notABool");

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

        // Cleanup
        promptSpy.mockRestore();
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

      it("Evaluates { let x; if (true) { x = 1; } else { } return x; } to 1 (variables can be declared in an outer scope and assigned in an inner scope) ", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "varDecl",
            variableName: identifierIso.wrap("x"),
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
                  value: 1,
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

      // similar to the error in https://craftinginterpreters.com/resolving-and-binding.html
      // program is the same as examples/closure_shadowing_interaction.wheel
      it("Does *not* let shadowing variables modify existing closures", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "varDecl",
            variableName: identifierIso.wrap("accumulator"),
          },
          {
            statementKind: "assignment",
            variableName: identifierIso.wrap("accumulator"),
            variableValue: {
              expressionKind: "numberLit",
              value: 0,
            },
          },
          {
            statementKind: "varDecl",
            variableName: identifierIso.wrap("a"),
          },
          {
            statementKind: "assignment",
            variableName: identifierIso.wrap("a"),
            variableValue: {
              expressionKind: "numberLit",
              value: 0,
            },
          },
          {
            statementKind: "funcDecl",
            functionName: identifierIso.wrap("addByA"),
            argNames: [],
            body: [
              {
                statementKind: "assignment",
                variableName: identifierIso.wrap("accumulator"),
                variableValue: {
                  expressionKind: "binOp",
                  binOp: "add",
                  leftOperand: {
                    expressionKind: "variableRef",
                    variableName: identifierIso.wrap("accumulator"),
                  },
                  rightOperand: {
                    expressionKind: "variableRef",
                    variableName: identifierIso.wrap("a"),
                  },
                },
              },
              {
                statementKind: "return",
                returnedValue: {
                  expressionKind: "numberLit",
                  value: 0,
                },
              },
            ],
          },
          {
            statementKind: "varDecl",
            variableName: identifierIso.wrap("throwaway1"),
          },
          {
            statementKind: "assignment",
            variableName: identifierIso.wrap("throwaway1"),
            variableValue: {
              expressionKind: "funcCall",
              args: [],
              callee: {
                expressionKind: "variableRef",
                variableName: identifierIso.wrap("addByA"),
              },
            },
          },
          {
            statementKind: "funcDecl",
            functionName: identifierIso.wrap("inner"),
            argNames: [],
            body: [
              {
                statementKind: "varDecl",
                variableName: identifierIso.wrap("a"),
              },
              {
                statementKind: "assignment",
                variableName: identifierIso.wrap("a"),
                variableValue: {
                  expressionKind: "numberLit",
                  value: 99,
                },
              },
              {
                statementKind: "varDecl",
                variableName: identifierIso.wrap("throwaway2"),
              },
              {
                statementKind: "assignment",
                variableName: identifierIso.wrap("throwaway2"),
                variableValue: {
                  expressionKind: "funcCall",
                  args: [],
                  callee: {
                    expressionKind: "variableRef",
                    variableName: identifierIso.wrap("addByA"),
                  },
                },
              },
              {
                statementKind: "return",
                returnedValue: {
                  expressionKind: "numberLit",
                  value: 0,
                },
              },
            ],
          },
          {
            statementKind: "varDecl",
            variableName: identifierIso.wrap("throwaway3"),
          },
          {
            statementKind: "assignment",
            variableName: identifierIso.wrap("throwaway3"),
            variableValue: {
              expressionKind: "funcCall",
              args: [],
              callee: {
                expressionKind: "variableRef",
                variableName: identifierIso.wrap("inner"),
              },
            },
          },
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "variableRef",
              variableName: identifierIso.wrap("accumulator"),
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

        // returning 99 indicates that a = 99 was used when inner() called
        expect(evalResult.right.value).toBe(0);
      });
    });
  });

  describe("Failed evaluations", () => {
    describe("NotInScope errors", () => {
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

      it("Recognizes a NotInScope error for { x = 1; } (undeclared variable)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "assignment",
            variableName: identifierIso.wrap("x"),
            variableValue: {
              expressionKind: "numberLit",
              value: 1,
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

      it("Recognizes a NotInScope error for { if (true) { let x; x = 1; } else {} return x; } (variables declared in an if statement's true block's scope don't exist in outer scopes)", () => {
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
        if (!isLeft(evalResult)) {
          throw new Error("Evaluation succeeded, should have failed");
        }

        if (evalResult.left.runtimeErrorKind !== "notInScope") {
          throw new Error(`Detected ${evalResult.left.runtimeErrorKind} error instead of NotInScope error`);
        }

        expect(evalResult.left.outOfScopeIdentifier).toBe("x");
      });

      it("Recognizes a NotInScope error for { if (false) {} else { let x; x = 1; } return x; } (variables declared in an if statement's false block's scope don't exist in outer scopes)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "if",
            condition: {
              expressionKind: "booleanLit",
              isTrue: false,
            },
            trueBody: [],
            falseBody: [
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
        if (!isLeft(evalResult)) {
          throw new Error("Evaluation succeeded, should have failed");
        }

        if (evalResult.left.runtimeErrorKind !== "notInScope") {
          throw new Error(`Detected ${evalResult.left.runtimeErrorKind} error instead of NotInScope error`);
        }

        expect(evalResult.left.outOfScopeIdentifier).toBe("x");
      });

      it("Recognizes a NotInScope error for { let x; x = 0; while (x < 1) { let y; x = x + 1; } return y; } (variables declared in a while statement's block's scope don't exist in outer scopes)", () => {
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
                value: 1,
              },
            },
            body: [
              {
                statementKind: "varDecl",
                variableName: identifierIso.wrap("y"),
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
        if (!isLeft(evalResult)) {
          throw new Error("Evaluation succeeded, should have failed");
        }

        if (evalResult.left.runtimeErrorKind !== "notInScope") {
          throw new Error(`Detected ${evalResult.left.runtimeErrorKind} error instead of NotInScope error`);
        }

        expect(evalResult.left.outOfScopeIdentifier).toBe("y");
      });

      it("Recognizes a NotInScope error for { function f() { let x; return 1; } return f() + x; } (variables declared local to a function don't exist in outer scopes)", () => {
        // Arrange
        const ast: Program = [
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
                expressionKind: "variableRef",
                variableName: identifierIso.wrap("x"),
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
    });

    describe("NotFunction errors", () => {
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
    });

    describe("TypeMismatch errors", () => {
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

      it("Recognizes a TypeMismatch error for { return -true; } (non-number in unary negation)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "unaryOp",
              unaryOp: "negative",
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
        if (!isLeft(evalResult)) {
          throw new Error("Evaluation succeeded, should have failed");
        }

        if (evalResult.left.runtimeErrorKind !== "typeMismatch") {
          throw new Error(`Detected ${evalResult.left.runtimeErrorKind} error instead of TypeMismatch error`);
        }

        expect(evalResult.left.expectedTypes).toEqual(["number"]);
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

      it("Recognizes a TypeMismatch error for { return clock == 1; } (native function on LHS of equals expression)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "binOp",
              binOp: "equals",
              leftOperand: {
                expressionKind: "variableRef",
                variableName: identifierIso.wrap("clock"),
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
        expect(evalResult.left.actualType).toBe("nativeFunc");
      });

      it("Recognizes a TypeMismatch error for { return 1 == clock; } (native function on RHS of equals expression)", () => {
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
                expressionKind: "variableRef",
                variableName: identifierIso.wrap("clock"),
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
        expect(evalResult.left.actualType).toBe("nativeFunc");
      });

      it("Recognizes a TypeMismatch error for { return clock /= 1; } (native function on LHS of not-equal expression)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "binOp",
              binOp: "notEqual",
              leftOperand: {
                expressionKind: "variableRef",
                variableName: identifierIso.wrap("clock"),
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
        expect(evalResult.left.actualType).toBe("nativeFunc");
      });

      it("Recognizes a TypeMismatch error for { return 1 /= clock; } (native function on RHS of not-equal expression)", () => {
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
                expressionKind: "variableRef",
                variableName: identifierIso.wrap("clock"),
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
        expect(evalResult.left.actualType).toBe("nativeFunc");
      });

      it("Recognizes a TypeMismatch error for { return 1 == null; } (comparison of null on LHS to non-object)", () => {
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
                expressionKind: "nullLit",
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

        expect(evalResult.left.expectedTypes).toContain("object");
        expect(evalResult.left.expectedTypes).toContain("null");
        expect(evalResult.left.actualType).toBe("number");
      });

      it("Recognizes a TypeMismatch error for { return null == 1; } (comparison of null on RHS to non-object)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "binOp",
              binOp: "equals",
              leftOperand: {
                expressionKind: "nullLit",
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

        expect(evalResult.left.expectedTypes).toContain("object");
        expect(evalResult.left.expectedTypes).toContain("null");
        expect(evalResult.left.actualType).toBe("number");
      });
    });

    describe("ArityMismatch errors", () => {
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

      it("Recognizes an arity mismatch (too many arguments to native function) for { return clock(1); }", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "funcCall",
              args: [
                {
                  expressionKind: "numberLit",
                  value: 1,
                },
              ],
              callee: {
                expressionKind: "variableRef",
                variableName: identifierIso.wrap("clock"),
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

    describe("UnassignedVariable errors", () => {
      it("Recognizes an UnassignedVariable error for { let x; return x; } (variable used before assigning it a value)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "varDecl",
            variableName: identifierIso.wrap("x"),
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
        if (!isLeft(evalResult)) {
          throw new Error("Evaluation succeeded, should have failed");
        }

        if (evalResult.left.runtimeErrorKind !== "unassignedVariable") {
          throw new Error(`Detected ${evalResult.left.runtimeErrorKind} error instead of ArityMismatch error`);
        }

        expect(evalResult.left.unassignedIdentifier).toBe("x");
      });
    });

    describe("NotObject errors", () => {
      it("Recognizes a NotObject error for { return 1.field; } (attempting to call getter on non-object)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "get",
              object: {
                expressionKind: "numberLit",
                value: 1,
              },
              field: identifierIso.wrap("field"),
            },
          },
        ];

        // Act
        const evalResult = evaluate(ast);

        // Assert
        if (!isLeft(evalResult)) {
          throw new Error("Evaluation succeeded, should have failed");
        }

        if (evalResult.left.runtimeErrorKind !== "notObject") {
          throw new Error(`Detected ${evalResult.left.runtimeErrorKind} error instead of NotObject error`);
        }

        expect(evalResult.left.nonObjectType).toBe("number");
      });

      it("Recognizes a NotObject error for { 1.field = 2; } (attempting to call setter on non-object)", () => {
        // Arrange
        const ast: Program = [
          {
            statementKind: "set",
            object: {
              expressionKind: "numberLit",
              value: 1,
            },
            field: identifierIso.wrap("field"),
            value: {
              expressionKind: "numberLit",
              value: 2,
            },
          },
        ];

        // Act
        const evalResult = evaluate(ast);

        // Assert
        if (!isLeft(evalResult)) {
          throw new Error("Evaluation succeeded, should have failed");
        }

        if (evalResult.left.runtimeErrorKind !== "notObject") {
          throw new Error(`Detected ${evalResult.left.runtimeErrorKind} error instead of NotObject error`);
        }

        expect(evalResult.left.nonObjectType).toBe("number");
      });
    });
  });
});
