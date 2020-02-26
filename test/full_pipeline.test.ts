import "jest";
import { runProgram } from "../src/full_pipeline";
import { isRight, isLeft } from "fp-ts/lib/Either";

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

  describe("Scan errors", () => {
    it("Reports a scan error on { # }", () => {
      // Arrange
      const programText = "{ # }";

      // Act
      const runResult = runProgram(programText);

      // Assert
      if (!isLeft(runResult)) {
        throw new Error("Program succeeded, should have failed");
      }

      if (runResult.left.pipelineErrorKind !== "scan") {
        throw new Error(`${runResult.left.pipelineErrorKind} error reported instead of scan error`);
      }

      expect(runResult.left.scanErrors.map((error) => error.invalidLexeme)).toContain("#");
    });

    it("Reports multiple scan errors on { # ! }", () => {
      // Arrange
      const programText = "{ # ! }";

      // Act
      const runResult = runProgram(programText);

      // Assert
      if (!isLeft(runResult)) {
        throw new Error("Program succeeded, should have failed");
      }

      if (runResult.left.pipelineErrorKind !== "scan") {
        throw new Error(`${runResult.left.pipelineErrorKind} error reported instead of scan error`);
      }

      expect(runResult.left.scanErrors.map((error) => error.invalidLexeme)).toContain("#");
      expect(runResult.left.scanErrors.map((error) => error.invalidLexeme)).toContain("!");
    });
  });

  describe("Parse errors", () => {
    it("Reports a parse error on { function; }", () => {
      // Arrange
      const programText = "{ function; }";

      // Act
      const runResult = runProgram(programText);

      // Assert
      if (!isLeft(runResult)) {
        throw new Error("Program succeeded, should have failed");
      }

      if (runResult.left.pipelineErrorKind !== "parse") {
        throw new Error(`${runResult.left.pipelineErrorKind} error reported instead of parse error`);
      }

      expect(runResult.left.parseError.message).toMatch(/Expected \(/);
    });
  });

  describe("Evaluation errors", () => {
    it("Reports a NotInScope error for { return x; }", () => {
      // Arrange
      const programText = "{ return x; }";

      // Act
      const runResult = runProgram(programText);

      // Assert
      if (!isLeft(runResult)) {
        throw new Error("Program succeeded, should have failed");
      }

      if (runResult.left.pipelineErrorKind !== "evaluation") {
        throw new Error(`${runResult.left.pipelineErrorKind} error reported instead of evaluation error`);
      }

      if (runResult.left.evalError.runtimeErrorKind !== "notInScope") {
        throw new Error(
          `${runResult.left.evalError.runtimeErrorKind} evaluation error reported instead of NotInScope error`,
        );
      }

      expect(runResult.left.evalError.outOfScopeIdentifier).toBe("x");
    });
  });
});
