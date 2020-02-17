import "jest";
import { runProgram } from "../src/full_pipeline";
import { isRight } from "fp-ts/lib/Either";

describe("Full interpretation pipeline", () => {
  describe("Correct programs", () => {
    it("Evaluates { return 1; } to 1", () => {
      // Arrange
      const programText = "{ return 1; }";

      // Act
      const runResult = runProgram(programText);

      // Assert
      if (!isRight(runResult)) {
        throw new Error("Program failed, should have succeeded");
      }

      if (runResult.right.valueKind !== "number") {
        throw new Error("Program did not return number");
      }

      expect(runResult.right.value).toBe(1);
    });

    it("Evaluates { x = 2; return x; } to 1", () => {
      // Arrange
      const programText = "{ x = 2; return x; }";

      // Act
      const runResult = runProgram(programText);

      // Assert
      if (!isRight(runResult)) {
        throw new Error("Program failed, should have succeeded");
      }

      if (runResult.right.valueKind !== "number") {
        throw new Error("Program did not return number");
      }

      expect(runResult.right.value).toBe(2);
    });

    it("Evaluates { function f() { return 3; } return f(); } to 3", () => {
      // Arrange
      const programText = "{ function f() { return 3; } return f(); } ";

      // Act
      const runResult = runProgram(programText);

      // Assert
      if (!isRight(runResult)) {
        throw new Error("Program failed, should have succeeded");
      }

      if (runResult.right.valueKind !== "number") {
        throw new Error("Program did not return number");
      }

      expect(runResult.right.value).toBe(3);
    });

    it("Evaluates { function f(x) { return x + 1; } return f(4); } to 5", () => {
      // Arrange
      const programText = "{ function f(x) { return x + 1; } return f(4); }";

      // Act
      const runResult = runProgram(programText);

      // Assert
      if (!isRight(runResult)) {
        console.log(runResult.left.pipelineErrorKind);
        if (runResult.left.pipelineErrorKind === "scan") {
          runResult.left.scanErrors.forEach((err) => console.log(err.invalidLexeme));
        }
        throw new Error("Program failed, should have succeeded");
      }

      if (runResult.right.valueKind !== "number") {
        throw new Error("Program did not return number");
      }

      expect(runResult.right.value).toBe(5);
    });

    it("Evaluates { return 6 + 7; } to 13", () => {
      // Arrange
      const programText = "{ return 6 + 7; }";

      // Act
      const runResult = runProgram(programText);

      // Assert
      if (!isRight(runResult)) {
        throw new Error("Program failed, should have succeeded");
      }

      if (runResult.right.valueKind !== "number") {
        throw new Error("Program did not return number");
      }

      expect(runResult.right.value).toBe(13);
    });

    it("Evaluates { function makeAdder(x) { function adder(y) { return x + y; } return adder; } addOne = makeAdder(1); return addOne(2); } to 3", () => {
      // Arrange
      const programText =
        "{ function makeAdder(x) { function adder(y) { return x + y; } return adder; } addOne = makeAdder(1); return addOne(2); }";

      // Act
      const runResult = runProgram(programText);

      // Assert
      if (!isRight(runResult)) {
        throw new Error("Program failed, should have succeeded");
      }

      if (runResult.right.valueKind !== "number") {
        throw new Error("Program did not return number");
      }

      expect(runResult.right.value).toBe(3);
    });
  });
});
