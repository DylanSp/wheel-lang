import "jest";
import { Token } from "../src/scanner";
import { parse, Program } from "../src/parser";
import { isRight, isLeft } from "fp-ts/lib/Either";
import { identifierIso } from "../src/types";

describe("Parser", () => {
  describe("Successful parses", () => {
    describe("Simple variable declarations", () => {
      it("Parses { let x; }", () => {
        // Arrange
        const tokens: Array<Token> = [
          {
            tokenKind: "leftBrace",
          },
          {
            tokenKind: "let",
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
          console.error(parseResult.left.message);
          throw new Error("Parse failed, should have succeeded");
        }

        const desiredResult: Program = [
          {
            statementKind: "varDecl",
            variableName: identifierIso.wrap("x"),
          },
        ];

        expect(parseResult.right).toEqual(desiredResult);
      });
    });

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
            tokenKind: "plus",
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
            tokenKind: "plus",
          },
          {
            tokenKind: "number",
            value: 2,
          },
          {
            tokenKind: "plus",
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
            tokenKind: "asterisk",
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
              binOp: "multiply",
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
            tokenKind: "asterisk",
          },
          {
            tokenKind: "number",
            value: 2,
          },
          {
            tokenKind: "minus",
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
              binOp: "subtract",
              leftOperand: {
                expressionKind: "binOp",
                binOp: "multiply",
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
            tokenKind: "plus",
          },
          {
            tokenKind: "number",
            value: 5,
          },
          {
            tokenKind: "forwardSlash",
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
              binOp: "add",
              leftOperand: {
                expressionKind: "numberLit",
                value: 4,
              },
              rightOperand: {
                expressionKind: "binOp",
                binOp: "divide",
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
            tokenKind: "plus",
          },
          {
            tokenKind: "number",
            value: 8,
          },
          {
            tokenKind: "rightParen",
          },
          {
            tokenKind: "forwardSlash",
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
              binOp: "divide",
              leftOperand: {
                expressionKind: "binOp",
                binOp: "add",
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
                  expressionKind: "numberLit",
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
                  expressionKind: "numberLit",
                  value: 2,
                },
                {
                  expressionKind: "numberLit",
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
            tokenKind: "plus",
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
                expressionKind: "numberLit",
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
            tokenKind: "asterisk",
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
              binOp: "multiply",
              leftOperand: {
                expressionKind: "numberLit",
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

      it("Parses { x = true; }", () => {
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
            tokenKind: "boolean",
            isTrue: true,
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
              expressionKind: "booleanLit",
              isTrue: true,
            },
          },
        ];

        expect(parseResult.right).toEqual(desiredResult);
      });

      it("Parses { x = true & false; }", () => {
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
            tokenKind: "boolean",
            isTrue: true,
          },
          {
            tokenKind: "ampersand",
          },
          {
            tokenKind: "boolean",
            isTrue: false,
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

        expect(parseResult.right).toEqual(desiredResult);
      });

      it("Parses { x = false | true; }", () => {
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
            tokenKind: "boolean",
            isTrue: false,
          },
          {
            tokenKind: "verticalBar",
          },
          {
            tokenKind: "boolean",
            isTrue: true,
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

        expect(parseResult.right).toEqual(desiredResult);
      });

      it("Parses { x = 1 < 2; }", () => {
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
            tokenKind: "lessThan",
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
            statementKind: "assignment",
            variableName: identifierIso.wrap("x"),
            variableValue: {
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

        expect(parseResult.right).toEqual(desiredResult);
      });

      it("Parses { x = 3 > 4; }", () => {
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
            value: 3,
          },
          {
            tokenKind: "greaterThan",
          },
          {
            tokenKind: "number",
            value: 4,
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

        expect(parseResult.right).toEqual(desiredResult);
      });

      it("Parses { x = 5 <= 6; }", () => {
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
            value: 5,
          },
          {
            tokenKind: "lessThanEquals",
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
          throw new Error("Parse failed, should have succeeded");
        }

        const desiredResult: Program = [
          {
            statementKind: "assignment",
            variableName: identifierIso.wrap("x"),
            variableValue: {
              expressionKind: "binOp",
              binOp: "lessThanEquals",
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

        expect(parseResult.right).toEqual(desiredResult);
      });

      it("Parses { x = 7 >= 8; }", () => {
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
            value: 7,
          },
          {
            tokenKind: "greaterThanEquals",
          },
          {
            tokenKind: "number",
            value: 8,
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
              expressionKind: "binOp",
              binOp: "greaterThanEquals",
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

        expect(parseResult.right).toEqual(desiredResult);
      });

      it("Parses { x = true == 9; }", () => {
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
            tokenKind: "boolean",
            isTrue: true,
          },
          {
            tokenKind: "doubleEquals",
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
          throw new Error("Parse failed, should have succeeded");
        }

        const desiredResult: Program = [
          {
            statementKind: "assignment",
            variableName: identifierIso.wrap("x"),
            variableValue: {
              expressionKind: "binOp",
              binOp: "equals",
              leftOperand: {
                expressionKind: "booleanLit",
                isTrue: true,
              },
              rightOperand: {
                expressionKind: "numberLit",
                value: 9,
              },
            },
          },
        ];

        expect(parseResult.right).toEqual(desiredResult);
      });

      it("Parses { x = false /= 10; }", () => {
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
            tokenKind: "boolean",
            isTrue: false,
          },
          {
            tokenKind: "notEqual",
          },
          {
            tokenKind: "number",
            value: 10,
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
              expressionKind: "binOp",
              binOp: "notEqual",
              leftOperand: {
                expressionKind: "booleanLit",
                isTrue: false,
              },
              rightOperand: {
                expressionKind: "numberLit",
                value: 10,
              },
            },
          },
        ];

        expect(parseResult.right).toEqual(desiredResult);
      });

      it("Parses { x = !true; }", () => {
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
            tokenKind: "exclamationPoint",
          },
          {
            tokenKind: "boolean",
            isTrue: true,
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
              expressionKind: "unaryOp",
              unaryOp: "not",
              operand: {
                expressionKind: "booleanLit",
                isTrue: true,
              },
            },
          },
        ];

        expect(parseResult.right).toEqual(desiredResult);
      });

      it("Parses { x = !f(); } with proper precedence", () => {
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
            tokenKind: "exclamationPoint",
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
              expressionKind: "unaryOp",
              unaryOp: "not",
              operand: {
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

      it("Parses { x = 2 * f(); } with proper precedence", () => {
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
            value: 2,
          },
          {
            tokenKind: "asterisk",
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
              expressionKind: "binOp",
              binOp: "multiply",
              leftOperand: {
                expressionKind: "numberLit",
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

      it("Parses { x = 1 + f(); } with proper precedence", () => {
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
            tokenKind: "plus",
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
              expressionKind: "binOp",
              binOp: "add",
              leftOperand: {
                expressionKind: "numberLit",
                value: 1,
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

      it("Parses { x = 3 < f(); } with proper precedence", () => {
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
            value: 3,
          },
          {
            tokenKind: "lessThan",
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
              expressionKind: "binOp",
              binOp: "lessThan",
              leftOperand: {
                expressionKind: "numberLit",
                value: 3,
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

      it("Parses { x = true & f(); } with proper precedence", () => {
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
            tokenKind: "boolean",
            isTrue: true,
          },
          {
            tokenKind: "ampersand",
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
              expressionKind: "binOp",
              binOp: "and",
              leftOperand: {
                expressionKind: "booleanLit",
                isTrue: true,
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

      it("Parses { x = false | f(); } with proper precedence", () => {
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
            tokenKind: "boolean",
            isTrue: false,
          },
          {
            tokenKind: "verticalBar",
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
              expressionKind: "binOp",
              binOp: "or",
              leftOperand: {
                expressionKind: "booleanLit",
                isTrue: false,
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

      it("Parses { x = 4 / !true; } with proper precedence", () => {
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
            tokenKind: "forwardSlash",
          },
          {
            tokenKind: "exclamationPoint",
          },
          {
            tokenKind: "boolean",
            isTrue: true,
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
              expressionKind: "binOp",
              binOp: "divide",
              leftOperand: {
                expressionKind: "numberLit",
                value: 4,
              },
              rightOperand: {
                expressionKind: "unaryOp",
                unaryOp: "not",
                operand: {
                  expressionKind: "booleanLit",
                  isTrue: true,
                },
              },
            },
          },
        ];

        expect(parseResult.right).toEqual(desiredResult);
      });

      it("Parses { x = 5 - !6; } with proper precedence", () => {
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
            value: 5,
          },
          {
            tokenKind: "minus",
          },
          {
            tokenKind: "exclamationPoint",
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
          throw new Error("Parse failed, should have succeeded");
        }

        const desiredResult: Program = [
          {
            statementKind: "assignment",
            variableName: identifierIso.wrap("x"),
            variableValue: {
              expressionKind: "binOp",
              binOp: "subtract",
              leftOperand: {
                expressionKind: "numberLit",
                value: 5,
              },
              rightOperand: {
                expressionKind: "unaryOp",
                unaryOp: "not",
                operand: {
                  expressionKind: "numberLit",
                  value: 6,
                },
              },
            },
          },
        ];

        expect(parseResult.right).toEqual(desiredResult);
      });

      it("Parses { x = 7 < !8; } with proper precedence", () => {
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
            value: 7,
          },
          {
            tokenKind: "lessThan",
          },
          {
            tokenKind: "exclamationPoint",
          },
          {
            tokenKind: "number",
            value: 8,
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
              expressionKind: "binOp",
              binOp: "lessThan",
              leftOperand: {
                expressionKind: "numberLit",
                value: 7,
              },
              rightOperand: {
                expressionKind: "unaryOp",
                unaryOp: "not",
                operand: {
                  expressionKind: "numberLit",
                  value: 8,
                },
              },
            },
          },
        ];

        expect(parseResult.right).toEqual(desiredResult);
      });

      it("Parses { x = false & !true; } with proper precedence", () => {
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
            tokenKind: "boolean",
            isTrue: false,
          },
          {
            tokenKind: "ampersand",
          },
          {
            tokenKind: "exclamationPoint",
          },
          {
            tokenKind: "boolean",
            isTrue: true,
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
              expressionKind: "binOp",
              binOp: "and",
              leftOperand: {
                expressionKind: "booleanLit",
                isTrue: false,
              },
              rightOperand: {
                expressionKind: "unaryOp",
                unaryOp: "not",
                operand: {
                  expressionKind: "booleanLit",
                  isTrue: true,
                },
              },
            },
          },
        ];

        expect(parseResult.right).toEqual(desiredResult);
      });

      it("Parses { x = true | !false; } with proper precedence", () => {
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
            tokenKind: "boolean",
            isTrue: true,
          },
          {
            tokenKind: "verticalBar",
          },
          {
            tokenKind: "exclamationPoint",
          },
          {
            tokenKind: "boolean",
            isTrue: false,
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
              expressionKind: "binOp",
              binOp: "or",
              leftOperand: {
                expressionKind: "booleanLit",
                isTrue: true,
              },
              rightOperand: {
                expressionKind: "unaryOp",
                unaryOp: "not",
                operand: {
                  expressionKind: "booleanLit",
                  isTrue: false,
                },
              },
            },
          },
        ];

        expect(parseResult.right).toEqual(desiredResult);
      });

      it("Parses { x = 9 > 10 * 11; } with proper precedence", () => {
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
            value: 9,
          },
          {
            tokenKind: "greaterThan",
          },
          {
            tokenKind: "number",
            value: 10,
          },
          {
            tokenKind: "asterisk",
          },
          {
            tokenKind: "number",
            value: 11,
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
              expressionKind: "binOp",
              binOp: "greaterThan",
              leftOperand: {
                expressionKind: "numberLit",
                value: 9,
              },
              rightOperand: {
                expressionKind: "binOp",
                binOp: "multiply",
                leftOperand: {
                  expressionKind: "numberLit",
                  value: 10,
                },
                rightOperand: {
                  expressionKind: "numberLit",
                  value: 11,
                },
              },
            },
          },
        ];

        expect(parseResult.right).toEqual(desiredResult);
      });

      it("Parses { x = true & 12 * 13; } with proper precedence", () => {
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
            tokenKind: "boolean",
            isTrue: true,
          },
          {
            tokenKind: "ampersand",
          },
          {
            tokenKind: "number",
            value: 12,
          },
          {
            tokenKind: "asterisk",
          },
          {
            tokenKind: "number",
            value: 13,
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
              expressionKind: "binOp",
              binOp: "and",
              leftOperand: {
                expressionKind: "booleanLit",
                isTrue: true,
              },
              rightOperand: {
                expressionKind: "binOp",
                binOp: "multiply",
                leftOperand: {
                  expressionKind: "numberLit",
                  value: 12,
                },
                rightOperand: {
                  expressionKind: "numberLit",
                  value: 13,
                },
              },
            },
          },
        ];

        expect(parseResult.right).toEqual(desiredResult);
      });

      it("Parses { x = 14 | 15 / 16; } with proper precedence", () => {
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
            value: 14,
          },
          {
            tokenKind: "verticalBar",
          },
          {
            tokenKind: "number",
            value: 15,
          },
          {
            tokenKind: "forwardSlash",
          },
          {
            tokenKind: "number",
            value: 16,
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
              expressionKind: "binOp",
              binOp: "or",
              leftOperand: {
                expressionKind: "numberLit",
                value: 14,
              },
              rightOperand: {
                expressionKind: "binOp",
                binOp: "divide",
                leftOperand: {
                  expressionKind: "numberLit",
                  value: 15,
                },
                rightOperand: {
                  expressionKind: "numberLit",
                  value: 16,
                },
              },
            },
          },
        ];

        expect(parseResult.right).toEqual(desiredResult);
      });

      it("Parses { x = 17 >= 18 + 19; } with proper precedence", () => {
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
            value: 17,
          },
          {
            tokenKind: "greaterThanEquals",
          },
          {
            tokenKind: "number",
            value: 18,
          },
          {
            tokenKind: "plus",
          },
          {
            tokenKind: "number",
            value: 19,
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
              expressionKind: "binOp",
              binOp: "greaterThanEquals",
              leftOperand: {
                expressionKind: "numberLit",
                value: 17,
              },
              rightOperand: {
                expressionKind: "binOp",
                binOp: "add",
                leftOperand: {
                  expressionKind: "numberLit",
                  value: 18,
                },
                rightOperand: {
                  expressionKind: "numberLit",
                  value: 19,
                },
              },
            },
          },
        ];

        expect(parseResult.right).toEqual(desiredResult);
      });

      it("Parses { x = false & 20 - 21; } with proper precedence", () => {
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
            tokenKind: "boolean",
            isTrue: false,
          },
          {
            tokenKind: "ampersand",
          },
          {
            tokenKind: "number",
            value: 20,
          },
          {
            tokenKind: "minus",
          },
          {
            tokenKind: "number",
            value: 21,
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
              expressionKind: "binOp",
              binOp: "and",
              leftOperand: {
                expressionKind: "booleanLit",
                isTrue: false,
              },
              rightOperand: {
                expressionKind: "binOp",
                binOp: "subtract",
                leftOperand: {
                  expressionKind: "numberLit",
                  value: 20,
                },
                rightOperand: {
                  expressionKind: "numberLit",
                  value: 21,
                },
              },
            },
          },
        ];

        expect(parseResult.right).toEqual(desiredResult);
      });

      it("Parses { x = true | 22 + 23; } with proper precedence", () => {
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
            tokenKind: "boolean",
            isTrue: true,
          },
          {
            tokenKind: "verticalBar",
          },
          {
            tokenKind: "number",
            value: 22,
          },
          {
            tokenKind: "plus",
          },
          {
            tokenKind: "number",
            value: 23,
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
              expressionKind: "binOp",
              binOp: "or",
              leftOperand: {
                expressionKind: "booleanLit",
                isTrue: true,
              },
              rightOperand: {
                expressionKind: "binOp",
                binOp: "add",
                leftOperand: {
                  expressionKind: "numberLit",
                  value: 22,
                },
                rightOperand: {
                  expressionKind: "numberLit",
                  value: 23,
                },
              },
            },
          },
        ];

        expect(parseResult.right).toEqual(desiredResult);
      });

      it("Parses { x = true & 24 >= 25; } with proper precedence", () => {
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
            tokenKind: "boolean",
            isTrue: true,
          },
          {
            tokenKind: "ampersand",
          },
          {
            tokenKind: "number",
            value: 24,
          },
          {
            tokenKind: "greaterThanEquals",
          },
          {
            tokenKind: "number",
            value: 25,
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
              expressionKind: "binOp",
              binOp: "and",
              leftOperand: {
                expressionKind: "booleanLit",
                isTrue: true,
              },
              rightOperand: {
                expressionKind: "binOp",
                binOp: "greaterThanEquals",
                leftOperand: {
                  expressionKind: "numberLit",
                  value: 24,
                },
                rightOperand: {
                  expressionKind: "numberLit",
                  value: 25,
                },
              },
            },
          },
        ];

        expect(parseResult.right).toEqual(desiredResult);
      });

      it("Parses { x = false | 26 <= 27; } with proper precedence", () => {
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
            tokenKind: "boolean",
            isTrue: false,
          },
          {
            tokenKind: "verticalBar",
          },
          {
            tokenKind: "number",
            value: 26,
          },
          {
            tokenKind: "lessThanEquals",
          },
          {
            tokenKind: "number",
            value: 27,
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
              expressionKind: "binOp",
              binOp: "or",
              leftOperand: {
                expressionKind: "booleanLit",
                isTrue: false,
              },
              rightOperand: {
                expressionKind: "binOp",
                binOp: "lessThanEquals",
                leftOperand: {
                  expressionKind: "numberLit",
                  value: 26,
                },
                rightOperand: {
                  expressionKind: "numberLit",
                  value: 27,
                },
              },
            },
          },
        ];

        expect(parseResult.right).toEqual(desiredResult);
      });

      it("Parses { x = true & true | false; } with proper precedence", () => {
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
            tokenKind: "boolean",
            isTrue: true,
          },
          {
            tokenKind: "ampersand",
          },
          {
            tokenKind: "boolean",
            isTrue: true,
          },
          {
            tokenKind: "verticalBar",
          },
          {
            tokenKind: "boolean",
            isTrue: false,
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
              expressionKind: "binOp",
              binOp: "or",
              leftOperand: {
                expressionKind: "binOp",
                binOp: "and",
                leftOperand: {
                  expressionKind: "booleanLit",
                  isTrue: true,
                },
                rightOperand: {
                  expressionKind: "booleanLit",
                  isTrue: true,
                },
              },
              rightOperand: {
                expressionKind: "booleanLit",
                isTrue: false,
              },
            },
          },
        ];

        expect(parseResult.right).toEqual(desiredResult);
      });

      it("Parses { x = 1 < 2 & 3 > 4 | 5 + 6 * 7 /= 8 & !f(); } with proper precedence", () => {
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
            tokenKind: "lessThan",
          },
          {
            tokenKind: "number",
            value: 2,
          },
          {
            tokenKind: "ampersand",
          },
          {
            tokenKind: "number",
            value: 3,
          },
          {
            tokenKind: "greaterThan",
          },
          {
            tokenKind: "number",
            value: 4,
          },
          {
            tokenKind: "verticalBar",
          },
          {
            tokenKind: "number",
            value: 5,
          },
          {
            tokenKind: "plus",
          },
          {
            tokenKind: "number",
            value: 6,
          },
          {
            tokenKind: "asterisk",
          },
          {
            tokenKind: "number",
            value: 7,
          },
          {
            tokenKind: "notEqual",
          },
          {
            tokenKind: "number",
            value: 8,
          },
          {
            tokenKind: "ampersand",
          },
          {
            tokenKind: "exclamationPoint",
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
              expressionKind: "binOp",
              binOp: "or",
              leftOperand: {
                expressionKind: "binOp",
                binOp: "and",
                leftOperand: {
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
                rightOperand: {
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
              rightOperand: {
                expressionKind: "binOp",
                binOp: "and",
                leftOperand: {
                  expressionKind: "binOp",
                  binOp: "notEqual",
                  leftOperand: {
                    expressionKind: "binOp",
                    binOp: "add",
                    leftOperand: {
                      expressionKind: "numberLit",
                      value: 5,
                    },
                    rightOperand: {
                      expressionKind: "binOp",
                      binOp: "multiply",
                      leftOperand: {
                        expressionKind: "numberLit",
                        value: 6,
                      },
                      rightOperand: {
                        expressionKind: "numberLit",
                        value: 7,
                      },
                    },
                  },
                  rightOperand: {
                    expressionKind: "numberLit",
                    value: 8,
                  },
                },
                rightOperand: {
                  expressionKind: "unaryOp",
                  unaryOp: "not",
                  operand: {
                    expressionKind: "funcCall",
                    callee: {
                      expressionKind: "variableRef",
                      variableName: identifierIso.wrap("f"),
                    },
                    args: [],
                  },
                },
              },
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
            tokenKind: "plus",
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
                  expressionKind: "numberLit",
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
        expect(parseResult.right).toEqual(desiredResult);
      });

      it("Parses { if (true) { return 1; } else {} } (program with if statement, empty else block)", () => {
        // Arrange
        const tokens: Array<Token> = [
          {
            tokenKind: "leftBrace",
          },
          {
            tokenKind: "if",
          },
          {
            tokenKind: "leftParen",
          },
          {
            tokenKind: "boolean",
            isTrue: true,
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
            tokenKind: "else",
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
            falseBody: [],
          },
        ];

        expect(parseResult.right).toEqual(desiredResult);
      });

      it("Parses { if (false) {} else { return 2; } } (program with if statement, empty then block", () => {
        // Arrange
        const tokens: Array<Token> = [
          {
            tokenKind: "leftBrace",
          },
          {
            tokenKind: "if",
          },
          {
            tokenKind: "leftParen",
          },
          {
            tokenKind: "boolean",
            isTrue: false,
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
            tokenKind: "else",
          },
          {
            tokenKind: "leftBrace",
          },
          {
            tokenKind: "return",
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
            statementKind: "if",
            condition: {
              expressionKind: "booleanLit",
              isTrue: false,
            },
            trueBody: [],
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

        expect(parseResult.right).toEqual(desiredResult);
      });

      it("Parses { if (1 < 2) { return 3; } else { return 4; } } (program with if statement, statements in both blocks", () => {
        // Arrange
        const tokens: Array<Token> = [
          {
            tokenKind: "leftBrace",
          },
          {
            tokenKind: "if",
          },
          {
            tokenKind: "leftParen",
          },
          {
            tokenKind: "number",
            value: 1,
          },
          {
            tokenKind: "lessThan",
          },
          {
            tokenKind: "number",
            value: 2,
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
            value: 3,
          },
          {
            tokenKind: "semicolon",
          },
          {
            tokenKind: "rightBrace",
          },
          {
            tokenKind: "else",
          },
          {
            tokenKind: "leftBrace",
          },
          {
            tokenKind: "return",
          },
          {
            tokenKind: "number",
            value: 4,
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
            statementKind: "if",
            condition: {
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
            trueBody: [
              {
                statementKind: "return",
                returnedValue: {
                  expressionKind: "numberLit",
                  value: 3,
                },
              },
            ],
            falseBody: [
              {
                statementKind: "return",
                returnedValue: {
                  expressionKind: "numberLit",
                  value: 4,
                },
              },
            ],
          },
        ];

        expect(parseResult.right).toEqual(desiredResult);
      });

      it("Parses { while (true) { x = 1; } } (program with while statement)", () => {
        // Arrange
        const tokens: Array<Token> = [
          {
            tokenKind: "leftBrace",
          },
          {
            tokenKind: "while",
          },
          {
            tokenKind: "leftParen",
          },
          {
            tokenKind: "boolean",
            isTrue: true,
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
            statementKind: "while",
            condition: {
              expressionKind: "booleanLit",
              isTrue: true,
            },
            body: [
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

    it('Expects an identifier after the "let" keyword', () => {
      // Arrange
      const tokens: Array<Token> = [
        {
          tokenKind: "leftBrace",
        },
        {
          tokenKind: "let",
        },
        {
          tokenKind: "number",
          value: 1,
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

    it("Expects a semicolon after variable declaration statements", () => {
      // Arrange
      const tokens: Array<Token> = [
        {
          tokenKind: "leftBrace",
        },
        {
          tokenKind: "let",
        },
        {
          tokenKind: "identifier",
          name: identifierIso.wrap("x"),
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

    it('Expects a left parenthesis after "if"', () => {
      // Arrange
      const tokens: Array<Token> = [
        {
          tokenKind: "leftBrace",
        },
        {
          tokenKind: "if",
        },
        {
          tokenKind: "rightParen",
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

    it("Expects a right parenthesis following the expression in an if statement's condition", () => {
      // Arrange
      const tokens: Array<Token> = [
        {
          tokenKind: "leftBrace",
        },
        {
          tokenKind: "if",
        },
        {
          tokenKind: "leftParen",
        },
        {
          tokenKind: "boolean",
          isTrue: true,
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

    it("Expects a block to start with a left brace after the condition in an if statement", () => {
      // Arrange
      const tokens: Array<Token> = [
        {
          tokenKind: "leftBrace",
        },
        {
          tokenKind: "if",
        },
        {
          tokenKind: "leftParen",
        },
        {
          tokenKind: "boolean",
          isTrue: true,
        },
        {
          tokenKind: "rightParen",
        },
        {
          tokenKind: "identifier",
          name: identifierIso.wrap("x"),
        },
      ];

      // Act
      const parseResult = parse(tokens);

      // Assert
      if (!isLeft(parseResult)) {
        throw new Error("Parse succeeded, should have failed");
      }

      expect(parseResult.left.message).toMatch(/Expected {/);
    });

    it('Expects an "else" after the first block in an if statement', () => {
      // Arrange
      const tokens: Array<Token> = [
        {
          tokenKind: "leftBrace",
        },
        {
          tokenKind: "if",
        },
        {
          tokenKind: "leftParen",
        },
        {
          tokenKind: "boolean",
          isTrue: true,
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
          tokenKind: "leftBrace",
        },
      ];

      // Act
      const parseResult = parse(tokens);

      // Assert
      if (!isLeft(parseResult)) {
        throw new Error("Parse succeeded, should have failed");
      }

      expect(parseResult.left.message).toMatch(/Expected "else"/);
    });

    it('Expects a block to start with a left brace after the "else" in an if statement', () => {
      // Arrange
      const tokens: Array<Token> = [
        {
          tokenKind: "leftBrace",
        },
        {
          tokenKind: "if",
        },
        {
          tokenKind: "leftParen",
        },
        {
          tokenKind: "boolean",
          isTrue: true,
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
          tokenKind: "else",
        },
        {
          tokenKind: "identifier",
          name: identifierIso.wrap("x"),
        },
      ];

      // Act
      const parseResult = parse(tokens);

      // Assert
      if (!isLeft(parseResult)) {
        throw new Error("Parse succeeded, should have failed");
      }

      expect(parseResult.left.message).toMatch(/Expected {/);
    });

    it('Expects a left parenthesis after "while"', () => {
      // Arrange
      const tokens: Array<Token> = [
        {
          tokenKind: "leftBrace",
        },
        {
          tokenKind: "while",
        },
        {
          tokenKind: "rightParen",
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

    it("Expects a right parenthesis following the expression in a while statement's condition", () => {
      // Arrange
      const tokens: Array<Token> = [
        {
          tokenKind: "leftBrace",
        },
        {
          tokenKind: "while",
        },
        {
          tokenKind: "leftParen",
        },
        {
          tokenKind: "boolean",
          isTrue: true,
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

    it("Expects a block to start with a left brace after the condition in a while statement", () => {
      // Arrange
      const tokens: Array<Token> = [
        {
          tokenKind: "leftBrace",
        },
        {
          tokenKind: "while",
        },
        {
          tokenKind: "leftParen",
        },
        {
          tokenKind: "boolean",
          isTrue: true,
        },
        {
          tokenKind: "rightParen",
        },
        {
          tokenKind: "identifier",
          name: identifierIso.wrap("x"),
        },
      ];

      // Act
      const parseResult = parse(tokens);

      // Assert
      if (!isLeft(parseResult)) {
        throw new Error("Parse succeeded, should have failed");
      }

      expect(parseResult.left.message).toMatch(/Expected {/);
    });

    it('Expects an identifier after "function"', () => {
      // Arrange
      const tokens: Array<Token> = [
        {
          tokenKind: "leftBrace",
        },
        {
          tokenKind: "function",
        },
        {
          tokenKind: "function",
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
