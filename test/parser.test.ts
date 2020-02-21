import "jest";
import { Token } from "../src/scanner";
import { parse, Program } from "../src/parser";
import { isRight, isLeft } from "fp-ts/lib/Either";

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
            variableName: "x",
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

      it("Parses { x = 1 * 2; }", () => {
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
            operation: "multiply",
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
            variableName: "x",
            variableValue: {
              expressionKind: "binOp",
              operation: "multiply",
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

      it("Parses { x = 1 * 2 - 3; } with proper precedence", () => {
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
            operation: "multiply",
          },
          {
            tokenKind: "number",
            value: 2,
          },
          {
            tokenKind: "operation",
            operation: "subtract",
          },
          {
            tokenKind: "number",
            value: 3,
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
            variableName: "x",
            variableValue: {
              expressionKind: "binOp",
              operation: "subtract",
              leftOperand: {
                expressionKind: "binOp",
                operation: "multiply",
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

        expect(parseResult.right).toEqual(desiredResult);
      });

      it("Parses { x = 4 + 5 / 6; } with proper precedence", () => {
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
            value: 4,
          },
          {
            tokenKind: "operation",
            operation: "add",
          },
          {
            tokenKind: "number",
            value: 5,
          },
          {
            tokenKind: "operation",
            operation: "divide",
          },
          {
            tokenKind: "number",
            value: 6,
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
            variableName: "x",
            variableValue: {
              expressionKind: "binOp",
              operation: "add",
              leftOperand: {
                expressionKind: "number",
                value: 4,
              },
              rightOperand: {
                expressionKind: "binOp",
                operation: "divide",
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

        expect(parseResult.right).toEqual(desiredResult);
      });

      it("Parses { x = (7 + 8) / 9; } with proper precedence", () => {
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
            tokenKind: "leftParen",
          },
          {
            tokenKind: "number",
            value: 7,
          },
          {
            tokenKind: "operation",
            operation: "add",
          },
          {
            tokenKind: "number",
            value: 8,
          },
          {
            tokenKind: "rightParen",
          },
          {
            tokenKind: "operation",
            operation: "divide",
          },
          {
            tokenKind: "number",
            value: 9,
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
            variableName: "x",
            variableValue: {
              expressionKind: "binOp",
              operation: "divide",
              leftOperand: {
                expressionKind: "binOp",
                operation: "add",
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

        expect(parseResult.right).toEqual(desiredResult);
      });

      it("Parses { x = f(); }", () => {
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
            tokenKind: "identifier",
            name: "f",
          },
          {
            tokenKind: "leftParen",
          },
          {
            tokenKind: "rightParen",
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
          throw new Error("Parse failed, should have succeeded");
        }

        const desiredResult: Program = [
          {
            statementKind: "assignment",
            variableName: "x",
            variableValue: {
              expressionKind: "funcCall",
              callee: {
                expressionKind: "variableRef",
                variableName: "f",
              },
              args: [],
            },
          },
        ];

        expect(parseResult.right).toEqual(desiredResult);
      });

      it("Parses { y = g(1); }", () => {
        // Arrange
        const tokens: Array<Token> = [
          {
            tokenKind: "leftBrace",
          },
          {
            tokenKind: "identifier",
            name: "y",
          },
          {
            tokenKind: "singleEquals",
          },
          {
            tokenKind: "identifier",
            name: "g",
          },
          {
            tokenKind: "leftParen",
          },
          {
            tokenKind: "number",
            value: 1,
          },
          {
            tokenKind: "rightParen",
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
          throw new Error("Parse failed, should have succeeded");
        }

        const desiredResult: Program = [
          {
            statementKind: "assignment",
            variableName: "y",
            variableValue: {
              expressionKind: "funcCall",
              callee: {
                expressionKind: "variableRef",
                variableName: "g",
              },
              args: [
                {
                  expressionKind: "number",
                  value: 1,
                },
              ],
            },
          },
        ];

        expect(parseResult.right).toEqual(desiredResult);
      });

      it("Parses { z = h(2, 3); }", () => {
        // Arrange
        const tokens: Array<Token> = [
          {
            tokenKind: "leftBrace",
          },
          {
            tokenKind: "identifier",
            name: "z",
          },
          {
            tokenKind: "singleEquals",
          },
          {
            tokenKind: "identifier",
            name: "h",
          },
          {
            tokenKind: "leftParen",
          },
          {
            tokenKind: "number",
            value: 2,
          },
          {
            tokenKind: "comma",
          },
          {
            tokenKind: "number",
            value: 3,
          },
          {
            tokenKind: "rightParen",
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
          throw new Error("Parse failed, should have succeeded");
        }

        const desiredResult: Program = [
          {
            statementKind: "assignment",
            variableName: "z",
            variableValue: {
              expressionKind: "funcCall",
              callee: {
                expressionKind: "variableRef",
                variableName: "h",
              },
              args: [
                {
                  expressionKind: "number",
                  value: 2,
                },
                {
                  expressionKind: "number",
                  value: 3,
                },
              ],
            },
          },
        ];

        expect(parseResult.right).toEqual(desiredResult);
      });

      it("Parses { i = f() + 1; }", () => {
        // Arrange
        const tokens: Array<Token> = [
          {
            tokenKind: "leftBrace",
          },
          {
            tokenKind: "identifier",
            name: "i",
          },
          {
            tokenKind: "singleEquals",
          },
          {
            tokenKind: "identifier",
            name: "f",
          },
          {
            tokenKind: "leftParen",
          },
          {
            tokenKind: "rightParen",
          },
          {
            tokenKind: "operation",
            operation: "add",
          },
          {
            tokenKind: "number",
            value: 1,
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
          throw new Error("Parse failed, should have succeeded");
        }

        const desiredResult: Program = [
          {
            statementKind: "assignment",
            variableName: "i",
            variableValue: {
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
                expressionKind: "number",
                value: 1,
              },
            },
          },
        ];

        expect(parseResult.right).toEqual(desiredResult);
      });

      it("Parses { j = 2 * f(); }", () => {
        // Arrange
        const tokens: Array<Token> = [
          {
            tokenKind: "leftBrace",
          },
          {
            tokenKind: "identifier",
            name: "j",
          },
          {
            tokenKind: "singleEquals",
          },
          {
            tokenKind: "number",
            value: 2,
          },
          {
            tokenKind: "operation",
            operation: "multiply",
          },
          {
            tokenKind: "identifier",
            name: "f",
          },
          {
            tokenKind: "leftParen",
          },
          {
            tokenKind: "rightParen",
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
          throw new Error("Parse failed, should have succeeded");
        }

        const desiredResult: Program = [
          {
            statementKind: "assignment",
            variableName: "j",
            variableValue: {
              expressionKind: "binOp",
              operation: "multiply",
              leftOperand: {
                expressionKind: "number",
                value: 2,
              },
              rightOperand: {
                expressionKind: "funcCall",
                callee: {
                  expressionKind: "variableRef",
                  variableName: "f",
                },
                args: [],
              },
            },
          },
        ];

        expect(parseResult.right).toEqual(desiredResult);
      });

      it("Parses { higherOrderResult = higher()(); }", () => {
        // Arrange
        const tokens: Array<Token> = [
          {
            tokenKind: "leftBrace",
          },
          {
            tokenKind: "identifier",
            name: "higherOrderResult",
          },
          {
            tokenKind: "singleEquals",
          },
          {
            tokenKind: "identifier",
            name: "higher",
          },
          {
            tokenKind: "leftParen",
          },
          {
            tokenKind: "rightParen",
          },
          {
            tokenKind: "leftParen",
          },
          {
            tokenKind: "rightParen",
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
            variableName: "higherOrderResult",
            variableValue: {
              expressionKind: "funcCall",
              callee: {
                expressionKind: "funcCall",
                callee: {
                  expressionKind: "variableRef",
                  variableName: "higher",
                },
                args: [],
              },
              args: [],
            },
          },
        ];

        expect(parseResult.right).toEqual(desiredResult);
      });
    });

    describe("Simple return statements", () => {
      it("Parses { return 1 + 2; }", () => {
        // Arrange
        const tokens: Array<Token> = [
          {
            tokenKind: "leftBrace",
          },
          {
            tokenKind: "return",
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
          throw new Error("Parse failed, should have succeeded");
        }

        const desiredResult: Program = [
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

        expect(parseResult.right).toEqual(desiredResult);
      });
    });

    describe("Simple function declarations", () => {
      it("Parses { function f() {} } function with no parameters or body)", () => {
        // Arrange
        const tokens: Array<Token> = [
          {
            tokenKind: "leftBrace",
          },
          {
            tokenKind: "function",
          },
          {
            tokenKind: "identifier",
            name: "f",
          },
          {
            tokenKind: "leftParen",
          },
          {
            tokenKind: "rightParen",
          },
          {
            tokenKind: "leftBrace",
          },
          {
            tokenKind: "rightBrace",
          },
          {
            tokenKind: "rightBrace",
          },
        ];

        // Act
        const parseResult = parse(tokens);

        // Assert
        if (!isRight(parseResult)) {
          throw new Error("Parse failed, should have succeeded");
        }

        const desiredResult: Program = [
          {
            statementKind: "funcDecl",
            functionName: "f",
            argNames: [],
            body: [],
          },
        ];

        expect(parseResult.right).toEqual(desiredResult);
      });

      it("Parses { function g(x) {} } (function with one parameter, no body)", () => {
        // Arrange
        const tokens: Array<Token> = [
          {
            tokenKind: "leftBrace",
          },
          {
            tokenKind: "function",
          },
          {
            tokenKind: "identifier",
            name: "g",
          },
          {
            tokenKind: "leftParen",
          },
          {
            tokenKind: "identifier",
            name: "x",
          },
          {
            tokenKind: "rightParen",
          },
          {
            tokenKind: "leftBrace",
          },
          {
            tokenKind: "rightBrace",
          },
          {
            tokenKind: "rightBrace",
          },
        ];

        // Act
        const parseResult = parse(tokens);

        // Assert
        if (!isRight(parseResult)) {
          throw new Error("Parse failed, should have succeeded");
        }

        const desiredResult: Program = [
          {
            statementKind: "funcDecl",
            functionName: "g",
            argNames: ["x"],
            body: [],
          },
        ];

        expect(parseResult.right).toEqual(desiredResult);
      });

      it("Parses { function h(x, y) {} } (function with multiple parameters, no body)", () => {
        // Arrange
        const tokens: Array<Token> = [
          {
            tokenKind: "leftBrace",
          },
          {
            tokenKind: "function",
          },
          {
            tokenKind: "identifier",
            name: "h",
          },
          {
            tokenKind: "leftParen",
          },
          {
            tokenKind: "identifier",
            name: "x",
          },
          {
            tokenKind: "comma",
          },
          {
            tokenKind: "identifier",
            name: "y",
          },
          {
            tokenKind: "rightParen",
          },
          {
            tokenKind: "leftBrace",
          },
          {
            tokenKind: "rightBrace",
          },
          {
            tokenKind: "rightBrace",
          },
        ];

        // Act
        const parseResult = parse(tokens);

        // Assert
        if (!isRight(parseResult)) {
          throw new Error("Parse failed, should have succeeded");
        }

        const desiredResult: Program = [
          {
            statementKind: "funcDecl",
            functionName: "h",
            argNames: ["x", "y"],
            body: [],
          },
        ];

        expect(parseResult.right).toEqual(desiredResult);
      });

      it("Parses { function foo() { return 1; } } function with no parameters, one statement in body)", () => {
        // Arrange
        const tokens: Array<Token> = [
          {
            tokenKind: "leftBrace",
          },
          {
            tokenKind: "function",
          },
          {
            tokenKind: "identifier",
            name: "foo",
          },
          {
            tokenKind: "leftParen",
          },
          {
            tokenKind: "rightParen",
          },
          {
            tokenKind: "leftBrace",
          },
          {
            tokenKind: "return",
          },
          {
            tokenKind: "number",
            value: 1,
          },
          {
            tokenKind: "semicolon",
          },
          {
            tokenKind: "rightBrace",
          },
          {
            tokenKind: "rightBrace",
          },
        ];

        // Act
        const parseResult = parse(tokens);

        // Assert
        if (!isRight(parseResult)) {
          throw new Error("Parse failed, should have succeeded");
        }

        const desiredResult: Program = [
          {
            statementKind: "funcDecl",
            functionName: "foo",
            argNames: [],
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
        ];

        expect(parseResult.right).toEqual(desiredResult);
      });

      it("Parses { function bar() { x = 1; return x; } } function with no parameters, multiple statements in body)", () => {
        // Arrange
        const tokens: Array<Token> = [
          {
            tokenKind: "leftBrace",
          },
          {
            tokenKind: "function",
          },
          {
            tokenKind: "identifier",
            name: "bar",
          },
          {
            tokenKind: "leftParen",
          },
          {
            tokenKind: "rightParen",
          },
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
            tokenKind: "semicolon",
          },
          {
            tokenKind: "return",
          },
          {
            tokenKind: "identifier",
            name: "x",
          },
          {
            tokenKind: "semicolon",
          },
          {
            tokenKind: "rightBrace",
          },
          {
            tokenKind: "rightBrace",
          },
        ];

        // Act
        const parseResult = parse(tokens);

        // Assert
        if (!isRight(parseResult)) {
          throw new Error("Parse failed, should have succeeded");
        }

        const desiredResult: Program = [
          {
            statementKind: "funcDecl",
            functionName: "bar",
            argNames: [],
            body: [
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
            ],
          },
        ];

        expect(parseResult.right).toEqual(desiredResult);
      });
    });

    describe("Multi-statement programs", () => {
      it("Parses { x = 1; return x; }", () => {
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
            tokenKind: "semicolon",
          },
          {
            tokenKind: "return",
          },
          {
            tokenKind: "identifier",
            name: "x",
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
          throw new Error("Parse failed, should have succeeded");
        }

        const desiredResult: Program = [
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
        expect(parseResult.right).toEqual(desiredResult);
      });
    });
  });

  describe("Parse errors", () => {
    it("Expects a semicolon after return statements", () => {
      // Arrange
      const tokens: Array<Token> = [
        {
          tokenKind: "leftBrace",
        },
        {
          tokenKind: "return",
        },
        {
          tokenKind: "number",
          value: 1,
        },
        {
          tokenKind: "rightBrace",
        },
      ];

      // Act
      const parseResult = parse(tokens);

      // Assert
      if (!isLeft(parseResult)) {
        throw new Error("Parse succeeded, should have failed");
      }

      expect(parseResult.left.message).toMatch(/Expected ;/);
    });

    it("Expects a semicolon after assignment statements", () => {
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
          tokenKind: "rightBrace",
        },
      ];

      // Act
      const parseResult = parse(tokens);

      // Assert
      if (!isLeft(parseResult)) {
        throw new Error("Parse succeeded, should have failed");
      }

      expect(parseResult.left.message).toMatch(/Expected ;/);
    });

    it("Expects a single equals sign after an identifier at the beginning of a statement", () => {
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
          tokenKind: "number",
          value: 1,
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
      if (!isLeft(parseResult)) {
        throw new Error("Parse succeeded, should have failed");
      }

      expect(parseResult.left.message).toMatch(/Expected =/);
    });

    it("Expects a left brace at the beginning of a block", () => {
      // Arrange
      const tokens: Array<Token> = [];

      // Act
      const parseResult = parse(tokens);

      // Assert
      if (!isLeft(parseResult)) {
        throw new Error("Parse succeeded, should have failed");
      }

      expect(parseResult.left.message).toMatch(/Expected {/);
    });

    it("Expects a right brace at the end of a block", () => {
      // Arrange
      const tokens: Array<Token> = [
        {
          tokenKind: "leftBrace",
        },
        {
          tokenKind: "return",
        },
        {
          tokenKind: "number",
          value: 1,
        },
        {
          tokenKind: "semicolon",
        },
      ];

      // Act
      const parseResult = parse(tokens);

      // Assert
      if (!isLeft(parseResult)) {
        throw new Error("Parse succeeded, should have failed");
      }

      expect(parseResult.left.message).toMatch(/Expected }/);
    });

    it("Expects a right parenthesis matching a left paren", () => {
      // Arrange
      const tokens: Array<Token> = [
        {
          tokenKind: "leftBrace",
        },
        {
          tokenKind: "return",
        },
        {
          tokenKind: "leftParen",
        },
        {
          tokenKind: "number",
          value: 1,
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
      if (!isLeft(parseResult)) {
        throw new Error("Parse succeeded, should have failed");
      }

      expect(parseResult.left.message).toMatch(/Expected \)/);
    });

    it("Expects parsing to consume all input", () => {
      // Arrange
      const tokens: Array<Token> = [
        {
          tokenKind: "leftBrace",
        },
        {
          tokenKind: "return",
        },
        {
          tokenKind: "number",
          value: 1,
        },
        {
          tokenKind: "semicolon",
        },
        {
          tokenKind: "rightBrace",
        },
        {
          tokenKind: "leftBrace",
        },
        {
          tokenKind: "return",
        },
        {
          tokenKind: "number",
          value: 1,
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
      if (!isLeft(parseResult)) {
        throw new Error("Parse succeeded, should have failed");
      }

      expect(parseResult.left.message).toMatch(/Expected end of input/);
    });

    it("Expects a left parenthesis after the function name in a function declaration", () => {
      // Arrange
      const tokens: Array<Token> = [
        {
          tokenKind: "leftBrace",
        },
        {
          tokenKind: "function",
        },
        {
          tokenKind: "identifier",
          name: "func",
        },
        {
          tokenKind: "identifier",
          name: "x",
        },
        {
          tokenKind: "rightParen",
        },
        {
          tokenKind: "leftBrace",
        },
        {
          tokenKind: "rightBrace",
        },
        {
          tokenKind: "rightBrace",
        },
      ];

      // Act
      const parseResult = parse(tokens);

      // Assert
      if (!isLeft(parseResult)) {
        throw new Error("Parse succeeded, should have failed");
      }

      expect(parseResult.left.message).toMatch(/Expected \(/);
    });

    it("Expects a right parenthesis after the list of arguments in a function declaration", () => {
      // Arrange
      const tokens: Array<Token> = [
        {
          tokenKind: "leftBrace",
        },
        {
          tokenKind: "function",
        },
        {
          tokenKind: "identifier",
          name: "func",
        },
        {
          tokenKind: "leftParen",
        },
        {
          tokenKind: "identifier",
          name: "x",
        },
        {
          tokenKind: "leftBrace",
        },
        {
          tokenKind: "rightBrace",
        },
        {
          tokenKind: "rightBrace",
        },
      ];

      // Act
      const parseResult = parse(tokens);

      // Assert
      if (!isLeft(parseResult)) {
        throw new Error("Parse succeeded, should have failed");
      }

      expect(parseResult.left.message).toMatch(/Expected \)/);
    });

    it("Expects an identifier in non-number, non-parenthesized primary expressions", () => {
      // Arrange
      const tokens: Array<Token> = [
        {
          tokenKind: "leftBrace",
        },
        {
          tokenKind: "return",
        },
        {
          tokenKind: "rightParen",
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
      if (!isLeft(parseResult)) {
        throw new Error("Parse succeeded, should have failed");
      }

      expect(parseResult.left.message).toMatch(/Expected identifier/);
    });
  });
});
