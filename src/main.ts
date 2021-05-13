import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import { isLeft } from "fp-ts/lib/Either";
import yargs from "yargs";
import { runProgram } from "./full_pipeline";
import { NativeFunctionImplementations } from "./evaluator";
import { clock, defineReadString, parseNum, print } from "./main_native_implementations";

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

try {
  const stdlibTexts = readdirSync(join(__dirname, "..", "wheel_stdlib")).map((filename) =>
    readFileSync(join(__dirname, "..", "wheel_stdlib", filename), "utf8"),
  );

  const userProgramTexts = stringifiedArgs.files.map((filename) => readFileSync(filename, "utf8"));
  const argsText = createArgsText(stringifiedArgs.args);
  const programTexts = stdlibTexts.concat(argsText).concat(userProgramTexts);

  const implementations: NativeFunctionImplementations = {
    clock,
    print,
    parseNum,
    readString: defineReadString(),
  };

  const runResult = runProgram(implementations)(programTexts);

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
