import { promisify } from "util";
import { readFile as fsReadFile } from "fs";
import { runProgram } from "./full_pipeline";
import { isLeft } from "fp-ts/lib/Either";

const args = process.argv.slice(2); // ignore "node", JS filename

if (args.length < 1) {
  console.error("Usage: node dist/main.js [filename]");
  process.exit(1);
}

if (args.length > 1) {
  console.warn("More than 1 argument passed; ignoring all but the first");
}

const filename = args[0];
const readFile = promisify(fsReadFile);

try {
  (async (): Promise<void> => {
    const programText = await readFile(filename, "utf8");
    const runResult = runProgram(programText);

    if (isLeft(runResult)) {
      switch (runResult.left.pipelineErrorKind) {
        case "scan":
          console.log("Scan error(s). Invalid lexeme(s):");
          runResult.left.scanErrors.forEach((scanErr) => console.log(scanErr.invalidLexeme));
          break;
        case "parse":
          console.log("Parse error:");
          console.log(runResult.left.parseError.message);
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
  })();
} catch (err) {
  console.error(`Error reading ${filename}`);
  console.error(err);
  process.exit(2);
}
