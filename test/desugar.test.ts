import "jest";
import { Block, Module } from "../src/parser_types";
import { identifierIso } from "../src/universal_types";
import { desugar } from "../src/desugar";

const TEST_MODULE_NAME = identifierIso.wrap("TestModule");

const wrapBlock = (body: Block): Module => {
  return {
    name: TEST_MODULE_NAME,
    body,
    exports: [],
  };
};

const desiredConstructorPrologue: Block = [
  {
    statementKind: "varDecl",
    variableName: identifierIso.wrap("this"),
  },
  {
    statementKind: "assignment",
    variableName: identifierIso.wrap("this"),
    variableValue: {
      expressionKind: "objectLit",
      fields: [],
    },
  },
];

const desiredConstructorEpilogue: Block = [
  {
    statementKind: "return",
    returnedValue: {
      expressionKind: "variableRef",
      variableName: identifierIso.wrap("this"),
    },
  },
];

describe("Desugaring", () => {
  describe("Class declarations", () => {
    it("Desugars class with no explicit constructor and no methods", () => {
      // Arrange
      const className = identifierIso.wrap("Dog");
      const constructorBody: Block = [];

      const sugared: Block = [
        {
          statementKind: "classDecl",
          className,
          constructor: {
            argNames: [],
            body: constructorBody,
          },
          methods: [],
        },
      ];

      // Act
      const desugared = desugar(wrapBlock(sugared));

      // Assert
      const desiredBlock: Block = [
        {
          statementKind: "funcDecl",
          functionName: className,
          argNames: [],
          body: [...desiredConstructorPrologue, ...constructorBody, ...desiredConstructorEpilogue],
        },
      ];

      expect(desugared.body).toEqual(desiredBlock);
    });

    it("Desugars class with constructor and no methods", () => {
      // Arrange
      const className = identifierIso.wrap("Dog");
      const constructorBody: Block = [
        {
          statementKind: "set",
          object: {
            expressionKind: "variableRef",
            variableName: identifierIso.wrap("this"),
          },
          field: identifierIso.wrap("name"),
          value: {
            expressionKind: "variableRef",
            variableName: identifierIso.wrap("name"),
          },
        },
      ];

      const sugared: Block = [
        {
          statementKind: "classDecl",
          className,
          constructor: {
            argNames: [identifierIso.wrap("name")],
            body: constructorBody,
          },
          methods: [],
        },
      ];

      // Act
      const desugared = desugar(wrapBlock(sugared));

      // Assert
      const desiredBlock: Block = [
        {
          statementKind: "funcDecl",
          functionName: className,
          argNames: [identifierIso.wrap("name")],
          body: [...desiredConstructorPrologue, ...constructorBody, ...desiredConstructorEpilogue],
        },
      ];

      expect(desugared.body).toEqual(desiredBlock);
    });

    it("Desugars class with no explicit constructor and one method", () => {
      // Arrange
      const className = identifierIso.wrap("Dog");
      const constructorBody: Block = [];

      const methodName = "addOne";
      const methodBody: Block = [
        {
          statementKind: "return",
          returnedValue: {
            expressionKind: "binOp",
            binOp: "add",
            leftOperand: {
              expressionKind: "variableRef",
              variableName: identifierIso.wrap("num"),
            },
            rightOperand: {
              expressionKind: "numberLit",
              value: 1,
            },
          },
        },
      ];

      const sugared: Block = [
        {
          statementKind: "classDecl",
          className,
          constructor: {
            argNames: [],
            body: constructorBody,
          },
          methods: [
            {
              methodName: identifierIso.wrap(methodName),
              argNames: [identifierIso.wrap("num")],
              body: methodBody,
            },
          ],
        },
      ];

      // Act
      const desugared = desugar(wrapBlock(sugared));

      // Assert
      const desugaredMethodName = identifierIso.wrap(`#${className}#${methodName}`);
      const desiredBlock: Block = [
        {
          statementKind: "funcDecl",
          functionName: desugaredMethodName,
          argNames: [identifierIso.wrap("this")],
          body: [
            {
              statementKind: "funcDecl",
              functionName: identifierIso.wrap("inner"),
              argNames: [identifierIso.wrap("num")],
              body: methodBody,
            },
            {
              statementKind: "return",
              returnedValue: {
                expressionKind: "variableRef",
                variableName: identifierIso.wrap("inner"),
              },
            },
          ],
        },
        {
          statementKind: "funcDecl",
          functionName: className,
          argNames: [],
          body: [
            ...desiredConstructorPrologue,
            ...constructorBody,
            {
              statementKind: "set",
              object: {
                expressionKind: "variableRef",
                variableName: identifierIso.wrap("this"),
              },
              field: identifierIso.wrap(methodName),
              value: {
                expressionKind: "funcCall",
                callee: {
                  expressionKind: "variableRef",
                  variableName: desugaredMethodName,
                },
                args: [
                  {
                    expressionKind: "variableRef",
                    variableName: identifierIso.wrap("this"),
                  },
                ],
              },
            },
            ...desiredConstructorEpilogue,
          ],
        },
      ];

      expect(desugared.body).toEqual(desiredBlock);
    });
  });
});
