import { readFileSync } from "fs";
import { EOL } from "os";
import { insertAt } from "fp-ts/lib/Map";
import { prompt } from "readline-sync";
import { ObjectValue, StringValue, Value } from "./evaluator";
import { eqIdentifier, Identifier, identifierIso, ordIdentifier } from "./types";

export const clock = (): number => Date.now();

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

export const print = (value: Value): void => {
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

export const parseNum = (str: StringValue): Map<Identifier, Value> => {
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

export const defineReadString = (): (() => string) => {
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

  return readStringBody;
};
