import "jest";
import { Token } from "../src/scanner";
import { parse, Program } from "../src/parser";
import { isRight, isLeft } from "fp-ts/lib/Either";
import { identifierIso } from "../src/types";

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
            name: identifierIso.wrap("x"),
          },
          {
            tokenKind: "singleEquals",
          },
          {
            tokenKind: "number",
            value: 1,
          },
          {
            tokenKind: "arithBinaryOp",
            arithBinaryOp: "add",
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
            variableName: identifierIso.wrap("x"),
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

      it("Parses { x = 1 + 2 + 3; } with proper associativity", () => {
        // Arrange
        const tokens: Array<Token> = [
          {
            tokenKind: "leftBrace",
          },
          {
            tokenKind: "identifier",
            name: identifierIso.wrap("x"),
          },
          {
            tokenKind: "singleEquals",
          },
          {
            tokenKind: "number",
            value: 1,
          },
          {
            tokenKind: "arithBinaryOp",
            arithBinaryOp: "add",
          },
          {
            tokenKind: "number",
            value: 2,
          },
          {
            tokenKind: "arithBinaryOp",
            arithBinaryOp: "add",
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
            variableName: identifierIso.wrap("x"),
            variableValue: {
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
            name: identifierIso.wrap("x"),
          },
          {
            tokenKind: "singleEquals",
          },
          {
            tokenKind: "number",
            value: 1,
          },
          {
            tokenKind: "arithBinaryOp",
            arithBinaryOp: "multiply",
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
            variableName: identifierIso.wrap("x"),
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
            name: identifierIso.wrap("x"),
          },
          {
            tokenKind: "singleEquals",
          },
          {
            tokenKind: "number",
            value: 1,
          },
          {
            tokenKind: "arithBinaryOp",
            arithBinaryOp: "multiply",
          },
          {
            tokenKind: "number",
            value: 2,
          },
          {
            tokenKind: "arithBinaryOp",
            arithBinaryOp: "subtract",
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
            variableName: identifierIso.wrap("x"),
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
            name: identifierIso.wrap("x"),
          },
          {
            tokenKind: "singleEquals",
          },
          {
            tokenKind: "number",
            value: 4,
          },
          {
            tokenKind: "arithBinaryOp",
            arithBinaryOp: "add",
          },
          {
            tokenKind: "number",
            value: 5,
          },
          {
            tokenKind: "arithBinaryOp",
            arithBinaryOp: "divide",
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
            variableName: identifierIso.wrap("x"),
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
            name: identifierIso.wrap("x"),
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
            tokenKind: "arithBinaryOp",
            arithBinaryOp: "add",
          },
          {
            tokenKind: "number",
            value: 8,
          },
          {
            tokenKind: "rightParen",
          },
          {
            tokenKind: "arithBinaryOp",
            arithBinaryOp: "divide",
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
            variableName: identifierIso.wrap("x"),
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

      it("Parses { x = f(); } (function call with no arguments)", () => {
        // Arrange
        const tokens: Array<Token> = [
          {
            tokenKind: "leftBrace",
          },
          {
            tokenKind: "identifier",
            name: identifierIso.wrap("x"),
          },
          {
            tokenKind: "singleEquals",
          },
          {
            tokenKind: "identifier",
            name: identifierIso.wrap("f"),
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
            variableName: identifierIso.wrap("x"),
            variableValue: {
              expressionKind: "funcCall",
              callee: {
                expressionKind: "variableRef",
                variableName: identifierIso.wrap("f"),
              },
              args: [],
            },
          },
        ];

        expect(parseResult.right).toEqual(desiredResult);
      });

      it("Parses { y = g(1); } (function call with one argument)", () => {
        // Arrange
        const tokens: Array<Token> = [
          {
            tokenKind: "leftBrace",
          },
          {
            tokenKind: "identifier",
            name: identifierIso.wrap("y"),
          },
          {
            tokenKind: "singleEquals",
          },
          {
            tokenKind: "identifier",
            name: identifierIso.wrap("g"),
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
            variableName: identifierIso.wrap("y"),
            variableValue: {
              expressionKind: "funcCall",
              callee: {
                expressionKind: "variableRef",
                variableName: identifierIso.wrap("g"),
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

      it("Parses { z = h(2, 3); } (function call with >1 argument)", () => {
        // Arrange
        const tokens: Array<Token> = [
          {
            tokenKind: "leftBrace",
          },
          {
            tokenKind: "identifier",
            name: identifierIso.wrap("z"),
          },
          {
            tokenKind: "singleEquals",
          },
          {
            tokenKind: "identifier",
            name: identifierIso.wrap("h"),
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
            variableName: identifierIso.wrap("z"),
            variableValue: {
              expressionKind: "funcCall",
              callee: {
                expressionKind: "variableRef",
                variableName: identifierIso.wrap("h"),
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

      it("Parses { i = f() + 1; } (function call with operation after it)", () => {
        // Arrange
        const tokens: Array<Token> = [
          {
            tokenKind: "leftBrace",
          },
          {
            tokenKind: "identifier",
            name: identifierIso.wrap("i"),
          },
          {
            tokenKind: "singleEquals",
          },
          {
            tokenKind: "identifier",
            name: identifierIso.wrap("f"),
          },
          {
            tokenKind: "leftParen",
          },
          {
            tokenKind: "rightParen",
          },
          {
            tokenKind: "arithBinaryOp",
            arithBinaryOp: "add",
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
            variableName: identifierIso.wrap("i"),
            variableValue: {
              expressionKind: "binOp",
              operation: "add",
              leftOperand: {
                expressionKind: "funcCall",
                callee: {
                  expressionKind: "variableRef",
                  variableName: identifierIso.wrap("f"),
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

      it("Parses { j = 2 * f(); } (function call with operation before it)", () => {
        // Arrange
        const tokens: Array<Token> = [
          {
            tokenKind: "leftBrace",
          },
          {
            tokenKind: "identifier",
            name: identifierIso.wrap("j"),
          },
          {
            tokenKind: "singleEquals",
          },
          {
            tokenKind: "number",
            value: 2,
          },
          {
            tokenKind: "arithBinaryOp",
            arithBinaryOp: "multiply",
          },
          {
            tokenKind: "identifier",
            name: identifierIso.wrap("f"),
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
            variableName: identifierIso.wrap("j"),
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
                  variableName: identifierIso.wrap("f"),
                },
                args: [],
              },
            },
          },
        ];

        expect(parseResult.right).toEqual(desiredResult);
      });

      it("Parses { higherOrderResult = higher()(); } (higher-order function call)", () => {
        // Arrange
        const tokens: Array<Token> = [
          {
            tokenKind: "leftBrace",
          },
          {
            tokenKind: "identifier",
            name: identifierIso.wrap("higherOrderResult"),
          },
          {
            tokenKind: "singleEquals",
          },
          {
            tokenKind: "identifier",
            name: identifierIso.wrap("higher"),
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
            variableName: identifierIso.wrap("higherOrderResult"),
            variableValue: {
              expressionKind: "funcCall",
              callee: {
                expressionKind: "funcCall",
                callee: {
                  expressionKind: "variableRef",
                  variableName: identifierIso.wrap("higher"),
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
      it("Parses { return 1 + 2; } (return of operation)", () => {
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
            tokenKind: "arithBinaryOp",
            arithBinaryOp: "add",
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
      it("Parses { function f() {} } (function with no parameters or body)", () => {
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
            name: identifierIso.wrap("f"),
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
            functionName: identifierIso.wrap("f"),
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
            name: identifierIso.wrap("g"),
          },
          {
            tokenKind: "leftParen",
          },
          {
            tokenKind: "identifier",
            name: identifierIso.wrap("x"),
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
            functionName: identifierIso.wrap("g"),
            argNames: [identifierIso.wrap("x")],
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
            name: identifierIso.wrap("h"),
          },
          {
            tokenKind: "leftParen",
          },
          {
            tokenKind: "identifier",
            name: identifierIso.wrap("x"),
          },
          {
            tokenKind: "comma",
          },
          {
            tokenKind: "identifier",
            name: identifierIso.wrap("y"),
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
            functionName: identifierIso.wrap("h"),
            argNames: [identifierIso.wrap("x"), identifierIso.wrap("y")],
            body: [],
          },
        ];

        expect(parseResult.right).toEqual(desiredResult);
      });

      it("Parses { function foo() { return 1; } } (function with no parameters, one statement in body)", () => {
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
            name: identifierIso.wrap("foo"),
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
            functionName: identifierIso.wrap("foo"),
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

      it("Parses { function bar() { x = 1; return x; } } (function with no parameters, multiple statements in body)", () => {
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
            name: identifierIso.wrap("bar"),
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
            name: identifierIso.wrap("x"),
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
            name: identifierIso.wrap("x"),
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
            functionName: identifierIso.wrap("bar"),
            argNames: [],
            body: [
              {
                statementKind: "assignment",
                variableName: identifierIso.wrap("x"),
                variableValue: {
                  expressionKind: "number",
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
            ],
          },
        ];

        expect(parseResult.right).toEqual(desiredResult);
      });
    });

    describe("Multi-statement programs", () => {
      it("Parses { x = 1; return x; } (program with multiple simple statements)", () => {
        // Arrange
        const tokens: Array<Token> = [
          {
            tokenKind: "leftBrace",
          },
          {
            tokenKind: "identifier",
            name: identifierIso.wrap("x"),
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
            name: identifierIso.wrap("x"),
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
            variableName: identifierIso.wrap("x"),
            variableValue: {
              expressionKind: "number",
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
          name: identifierIso.wrap("x"),
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
          name: identifierIso.wrap("x"),
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
          name: identifierIso.wrap("func"),
        },
        {
          tokenKind: "identifier",
          name: identifierIso.wrap("x"),
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
          name: identifierIso.wrap("func"),
        },
        {
          tokenKind: "leftParen",
        },
        {
          tokenKind: "identifier",
          name: identifierIso.wrap("x"),
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
