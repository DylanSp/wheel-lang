import { pipe } from "fp-ts/lib/function";
import { Block, Module, Statement, THIS_IDENTIFIER } from "./parser_types";
import { Identifier, identifierIso } from "./universal_types";

export const desugar = (module: Module): Module => {
  return pipe(module, desugarClassDeclarations);
};

const desugarClassDeclarations = (module: Module): Module => {
  const desugaredModule: Module = {
    name: module.name,
    body: [],
    exports: module.exports,
  };

  module.body.forEach((statement) => {
    if (statement.statementKind !== "classDecl") {
      desugaredModule.body.push(statement);
      return;
    }

    // first identifier is method name, second identifier is desugared function name
    const desugaredMethodNames: Array<[Identifier, Identifier]> = [];

    statement.methods.forEach((method) => {
      const desugaredMethodName = identifierIso.wrap(`#${statement.className}#${method.methodName}`);
      const desugaredMethod: Statement = {
        statementKind: "funcDecl",
        functionName: desugaredMethodName,
        argNames: [THIS_IDENTIFIER],
        body: [
          {
            statementKind: "funcDecl",
            functionName: identifierIso.wrap("inner"),
            argNames: method.argNames,
            body: method.body,
          },
          {
            statementKind: "return",
            returnedValue: {
              expressionKind: "variableRef",
              variableName: identifierIso.wrap("inner"),
            },
          },
        ],
      };

      desugaredModule.body.push(desugaredMethod);
      desugaredMethodNames.push([method.methodName, desugaredMethodName]);
    });

    const methodSetup: Block = desugaredMethodNames.map(([methodName, desugaredMethodName]) => ({
      statementKind: "set",
      object: {
        expressionKind: "variableRef",
        variableName: THIS_IDENTIFIER,
      },
      field: methodName,
      value: {
        expressionKind: "funcCall",
        callee: {
          expressionKind: "variableRef",
          variableName: desugaredMethodName,
        },
        args: [
          {
            expressionKind: "variableRef",
            variableName: THIS_IDENTIFIER,
          },
        ],
      },
    }));

    const constructorFunction: Statement = {
      statementKind: "funcDecl",
      functionName: statement.className,
      argNames: statement.constructor.argNames,
      body: [
        {
          statementKind: "varDecl",
          variableName: THIS_IDENTIFIER,
        },
        {
          statementKind: "assignment",
          variableName: THIS_IDENTIFIER,
          variableValue: {
            expressionKind: "objectLit",
            fields: [],
          },
        },
        ...statement.constructor.body,
        ...methodSetup,
        {
          statementKind: "return",
          returnedValue: {
            expressionKind: "variableRef",
            variableName: THIS_IDENTIFIER,
          },
        },
      ],
    };

    desugaredModule.body.push(constructorFunction);
  });

  return desugaredModule;
};
