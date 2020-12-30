import { readFileSync } from "fs";
import { isLeft } from "fp-ts/lib/Either";
import { runProgram } from "./full_pipeline";

const args = process.argv.slice(2); // ignore "node", JS filename

if (args.length < 1) {
  console.error("Usage: node dist/main.js [filename]");
  process.exit(1);
}

try {
  const programTexts = args.map((filename) => readFileSync(filename, "utf8"));
  const runResult = runProgram(programTexts);

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
