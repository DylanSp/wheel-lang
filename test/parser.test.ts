import "jest";
import { Token } from "../src/scanner";
import { parse, Program } from "../src/parser";
import { isRight, isLeft } from "fp-ts/lib/Either";

// TODO - put string representations of inputs in comments by declarations of tokens?
// TODO - data-driven tests?
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
            variableName: {
              tokenKind: "identifier",
              name: "x",
            },
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
            variableName: {
              tokenKind: "identifier",
              name: "x",
            },
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
            variableName: {
              tokenKind: "identifier",
              name: "x",
            },
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
            variableName: {
              tokenKind: "identifier",
              name: "x",
            },
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
            functionName: {
              tokenKind: "identifier",
              name: "f",
            },
            args: [],
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
            functionName: {
              tokenKind: "identifier",
              name: "g",
            },
            args: [
              {
                tokenKind: "identifier",
                name: "x",
              },
            ],
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
            functionName: {
              tokenKind: "identifier",
              name: "h",
            },
            args: [
              {
                tokenKind: "identifier",
                name: "x",
              },
              {
                tokenKind: "identifier",
                name: "y",
              },
            ],
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
            functionName: {
              tokenKind: "identifier",
              name: "foo",
            },
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
            functionName: {
              tokenKind: "identifier",
              name: "bar",
            },
            args: [],
            body: [
              {
                statementKind: "assignment",
                variableName: {
                  tokenKind: "identifier",
                  name: "x",
                },
                variableValue: {
                  expressionKind: "number",
                  value: 1,
                },
              },
              {
                statementKind: "return",
                returnedValue: {
                  expressionKind: "variableRef",
                  variableName: {
                    tokenKind: "identifier",
                    name: "x",
                  },
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
            variableName: {
              tokenKind: "identifier",
              name: "x",
            },
            variableValue: {
              expressionKind: "number",
              value: 1,
            },
          },
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "variableRef",
              variableName: {
                tokenKind: "identifier",
                name: "x",
              },
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
  });
});
