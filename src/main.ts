import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import { EOL } from "os";
import { isLeft } from "fp-ts/lib/Either";
import yargs from "yargs";
import { prompt } from "readline-sync";
import { insertAt } from "fp-ts/lib/Map";
import { runProgram } from "./full_pipeline";
import { NativeFunctionImplementations, ObjectValue, StringValue, Value } from "./evaluator";
import { eqIdentifier, Identifier, identifierIso, ordIdentifier } from "./types";

const rawArgs = process.argv.slice(2); // ignore "node", JS filename

const processedArgs = yargs(rawArgs)
  .options({
    files: { alias: "f", type: "array" },
    args: { alias: "a", type: "array" },
  })
  .demandOption("files").argv;

const stringifiedArgs = {
  files: processedArgs.files.map((fileName) => fileName.toString()),
  args: processedArgs.args?.map((arg) => arg.toString()),
};

const createArgsText = (args: Array<string> | undefined): Array<string> => {
  const modulePrologue = `
    module Args
    {
      import LinkedList from StdCollections;

      let args = LinkedList();
    `;

  const argInitializationText: Array<string> = [];
  args?.forEach((arg) => {
    argInitializationText.push(`
      args.pushEnd("${arg}");
    `);
  });

  const moduleEpilogue = `
    }
    export args;
    `;

  return [modulePrologue + argInitializationText.join("\n") + moduleEpilogue];
};

// standalone function so it can be called recursively (for nested objects)
const objectToString = (objVal: ObjectValue): string => {
  let str = "";

  str += "{";
  if (objVal.fields.size > 0) {
    str += " ";
  }

  const fields = Array.from(objVal.fields);
  fields.sort(([fieldId1], [fieldId2]) => ordIdentifier.compare(fieldId1, fieldId2));

  const allFields: Array<string> = [];
  fields.forEach(([fieldName, fieldValue]) => {
    let fieldStr = "";
    fieldStr += fieldName;
    fieldStr += ": ";
    switch (fieldValue.valueKind) {
      case "number":
        fieldStr += fieldValue.value;
        break;
      case "boolean":
        fieldStr += fieldValue.isTrue;
        break;
      case "string":
        fieldStr += '"';
        fieldStr += fieldValue.value;
        fieldStr += '"';
        break;
      case "null":
        fieldStr += "null";
        break;
      case "object":
        fieldStr += objectToString(fieldValue);
        break;
      case "closure":
        fieldStr += "<closure>";
        break;
      case "nativeFunc":
        fieldStr += "<native function>";
        break;
    }
    allFields.push(fieldStr);
  });

  str += allFields.join(", ");

  if (objVal.fields.size > 0) {
    str += " ";
  }
  str += "}";

  return str;
};

const print = (value: Value): void => {
  switch (value.valueKind) {
    case "boolean":
      console.log(value.isTrue);
      break;
    case "number":
      console.log(value.value);
      break;
    case "string":
      console.log(`"${value.value}"`);
      break;
    case "object":
      console.log(objectToString(value));
      break;
    case "null":
      console.log("null");
      break;
    case "closure":
      console.log("<closure>");
      break;
    case "nativeFunc":
      console.log("<native function>");
      break;
  }
};

const parseNum = (str: StringValue): Map<Identifier, Value> => {
  const parsed = parseFloat(str.value);

  let result = new Map<Identifier, Value>();
  const validityIdent = identifierIso.wrap("isValid");
  const valueIdent = identifierIso.wrap("value");

  if (isNaN(parsed)) {
    result = insertAt(eqIdentifier)<Value>(validityIdent, {
      valueKind: "boolean",
      isTrue: false,
    })(result);
  } else {
    result = insertAt(eqIdentifier)<Value>(validityIdent, {
      valueKind: "boolean",
      isTrue: true,
    })(result);
    result = insertAt(eqIdentifier)<Value>(valueIdent, {
      valueKind: "number",
      value: parsed,
    })(result);
  }
  return result;
};

// if not a TTY, consume input from stdin line-by-line
let lineNumber = 0;
const input = process.stdin.isTTY ? "" : readFileSync(0).toString(); // 0 = file descriptor for stdin
const lines = input.split(EOL);

const readStringBody = process.stdin.isTTY
  ? (): string => prompt()
  : (): string => {
      const line = lines[lineNumber];
      lineNumber++;
      return line;
    };

const nativeFunctions: NativeFunctionImplementations = {
  clock: () => Date.now(),
  print,
  parseNum,
  readString: readStringBody,
};

try {
  const stdlibTexts = readdirSync(join(__dirname, "..", "wheel_stdlib")).map((filename) =>
    readFileSync(join(__dirname, "..", "wheel_stdlib", filename), "utf8"),
  );

  const userProgramTexts = stringifiedArgs.files.map((filename) => readFileSync(filename, "utf8"));
  const argsText = createArgsText(stringifiedArgs.args);
  const programTexts = stdlibTexts.concat(argsText).concat(userProgramTexts);

  const runResult = runProgram(nativeFunctions)(programTexts);

  if (isLeft(runResult)) {
    switch (runResult.left.pipelineErrorKind) {
      case "scan":
        console.log("Scan error(s). Invalid lexeme(s):");
        runResult.left.scanErrors.forEach((scanErr) => console.log(scanErr.invalidLexeme));
        break;
      case "parse":
        console.log("Parse error(s):");
        runResult.left.parseErrors.forEach((parseErr) => console.log(parseErr.message));
        break;
      case "circularDep":
        console.log("Circular dependencies detected");
        break;
      case "evaluation":
        console.log("Evaluation error:");
        console.log(runResult.left.evalError);
        break;
    }
  } else {
    console.log("Successful evaluation.");
    switch (runResult.right.valueKind) {
      case "number":
        console.log(`Result: ${runResult.right.value}`);
        break;
      case "closure":
        console.log("Result: <closure>");
    }
  }
} catch (err) {
  console.error(`Error reading files`);
  console.error(err);
  process.exit(2);
}
