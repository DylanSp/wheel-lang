import "jest";
import { isRight, isLeft } from "fp-ts/lib/Either";
import { runProgram } from "../src/full_pipeline";

describe("Full interpretation pipeline", () => {
  describe("Correct programs", () => {
    it("Evaluates module Main { return 1; } to 1", () => {
      // Arrange
      const programText = "module Main { return 1; }";

      // Act
      const runResult = runProgram([programText]);

      // Assert
      if (!isRight(runResult)) {
        throw new Error("Program failed, should have succeeded");
      }

      if (runResult.right.valueKind !== "number") {
        throw new Error("Program did not return number");
      }

      expect(runResult.right.value).toBe(1);
    });

    it("Evaluates module Main { let x; x = 2; return x; } to 2", () => {
      // Arrange
      const programText = "module Main { let x; x = 2; return x; }";

      // Act
      const runResult = runProgram([programText]);

      // Assert
      if (!isRight(runResult)) {
        throw new Error("Program failed, should have succeeded");
      }

      if (runResult.right.valueKind !== "number") {
        throw new Error("Program did not return number");
      }

      expect(runResult.right.value).toBe(2);
    });

    it("Evaluates module Main { let x = 2; return x; } to 2", () => {
      // Arrange
      const programText = "module Main { let x = 2; return x; }";

      // Act
      const runResult = runProgram([programText]);

      // Assert
      if (!isRight(runResult)) {
        throw new Error("Program failed, should have succeeded");
      }

      if (runResult.right.valueKind !== "number") {
        throw new Error("Program did not return number");
      }

      expect(runResult.right.value).toBe(2);
    });

    it("Evaluates module Main { function f() { return 3; } return f(); } to 3", () => {
      // Arrange
      const programText = "module Main { function f() { return 3; } return f(); } ";

      // Act
      const runResult = runProgram([programText]);

      // Assert
      if (!isRight(runResult)) {
        throw new Error("Program failed, should have succeeded");
      }

      if (runResult.right.valueKind !== "number") {
        throw new Error("Program did not return number");
      }

      expect(runResult.right.value).toBe(3);
    });

    it("Evaluates module Main { function f(x) { return x + 1; } return f(4); } to 5", () => {
      // Arrange
      const programText = "module Main { function f(x) { return x + 1; } return f(4); }";

      // Act
      const runResult = runProgram([programText]);

      // Assert
      if (!isRight(runResult)) {
        throw new Error("Program failed, should have succeeded");
      }

      if (runResult.right.valueKind !== "number") {
        throw new Error("Program did not return number");
      }

      expect(runResult.right.value).toBe(5);
    });

    it("Evaluates module Main { return 6 + 7; } to 13", () => {
      // Arrange
      const programText = "module Main { return 6 + 7; }";

      // Act
      const runResult = runProgram([programText]);

      // Assert
      if (!isRight(runResult)) {
        throw new Error("Program failed, should have succeeded");
      }

      if (runResult.right.valueKind !== "number") {
        throw new Error("Program did not return number");
      }

      expect(runResult.right.value).toBe(13);
    });

    it("Evaluates module Main { function makeAdder(x) { function adder(y) { return x + y; } return adder; } let addOne; addOne = makeAdder(1); return addOne(2); } to 3", () => {
      // Arrange
      const programText =
        "module Main { function makeAdder(x) { function adder(y) { return x + y; } return adder; } let addOne; addOne = makeAdder(1); return addOne(2); }";

      // Act
      const runResult = runProgram([programText]);

      // Assert
      if (!isRight(runResult)) {
        throw new Error("Program failed, should have succeeded");
      }

      if (runResult.right.valueKind !== "number") {
        throw new Error("Program did not return number");
      }

      expect(runResult.right.value).toBe(3);
    });

    it("Evaluates module Main { while (false) { return 0; } if (false) { return 1; } else if (true) { return 2; } else { return 3; } } to 2", () => {
      // Arrange
      const programText =
        "module Main { while (false) { return 0; } if (false) { return 1; } else if (true) { return 2; } else { return 3; } }";

      // Act
      const runResult = runProgram([programText]);

      // Assert
      if (!isRight(runResult)) {
        throw new Error("Program failed, should have succeeded");
      }

      if (runResult.right.valueKind !== "number") {
        throw new Error("Program did not return number");
      }

      expect(runResult.right.value).toBe(2);
    });

    it("Evaluates module Main { let x = { field: 1 }; x.field = 2; return x.field; } to 2 ", () => {
      // Arrange
      const programText = "module Main { let x = { field: 1 }; x.field = 2; return x.field; }";

      // Act
      const runResult = runProgram([programText]);

      // Assert
      if (!isRight(runResult)) {
        throw new Error("Program failed, should have succeeded");
      }

      if (runResult.right.valueKind !== "number") {
        throw new Error("Program did not return number");
      }

      expect(runResult.right.value).toBe(2);
    });

    it("Evaluates module Source { let someNum = 1; } export someNum; module Main { import someNum from Source; return someNum; } to 1", () => {
      // Arrange
      const sourceModuleText = "module Source { let someNum = 1; } export someNum;";
      const mainModuleText = "module Main { import someNum from Source; return someNum; }";

      // Act
      const runResult = runProgram([sourceModuleText, mainModuleText]);

      // Assert
      if (!isRight(runResult)) {
        throw new Error("Program failed, should have succeeded");
      }

      if (runResult.right.valueKind !== "number") {
        throw new Error("Program did not return number");
      }

      expect(runResult.right.value).toBe(1);
    });
  });

  describe("Scan errors", () => {
    it("Reports a scan error on { # }", () => {
      // Arrange
      const programText = "{ # }";

      // Act
      const runResult = runProgram([programText]);

      // Assert
      if (!isLeft(runResult)) {
        throw new Error("Program succeeded, should have failed");
      }

      if (runResult.left.pipelineErrorKind !== "scan") {
        throw new Error(`${runResult.left.pipelineErrorKind} error reported instead of scan error`);
      }

      expect(runResult.left.scanErrors.map((error) => error.invalidLexeme)).toContain("#");
    });

    it("Reports multiple scan errors on { # @ }", () => {
      // Arrange
      const programText = "{ # @ }";

      // Act
      const runResult = runProgram([programText]);

      // Assert
      if (!isLeft(runResult)) {
        throw new Error("Program succeeded, should have failed");
      }

      if (runResult.left.pipelineErrorKind !== "scan") {
        throw new Error(`${runResult.left.pipelineErrorKind} error reported instead of scan error`);
      }

      expect(runResult.left.scanErrors.map((error) => error.invalidLexeme)).toContain("#");
      expect(runResult.left.scanErrors.map((error) => error.invalidLexeme)).toContain("@");
    });
  });

  describe("Parse errors", () => {
    it("Reports a parse error on module Main { function; }", () => {
      // Arrange
      const programText = "module Main { function; }";

      // Act
      const runResult = runProgram([programText]);

      // Assert
      if (!isLeft(runResult)) {
        throw new Error("Program succeeded, should have failed");
      }

      if (runResult.left.pipelineErrorKind !== "parse") {
        throw new Error(`${runResult.left.pipelineErrorKind} error reported instead of parse error`);
      }

      expect(runResult.left.parseErrors.some((parseErr) => /Expected identifier/.test(parseErr.message))).toBe(true);
    });
  });

  describe("Circular dependency errors", () => {
    it("Reports a circular dependency error on modules with circular dependencies", () => {
      // Arrange
      const aModuleText = "module A { import numB from B; printNum(numB); numA = 1; } export numA;";
      const bModuleText = "module B { import numA from A; printNum(numA); numB = 2; } export numB;";
      const mainModuleText = "module Main { import numA from A; printNum(0); }";

      // Act
      const runResult = runProgram([aModuleText, bModuleText, mainModuleText]);

      // Assert
      if (!isLeft(runResult)) {
        throw new Error("Program succeeded, should have failed");
      }

      expect(runResult.left.pipelineErrorKind).toBe("circularDep");
    });
  });

  describe("Evaluation errors", () => {
    it("Reports a NotInScope error for module Main { return x; }", () => {
      // Arrange
      const programText = "module Main { return x; }";

      // Act
      const runResult = runProgram([programText]);

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
