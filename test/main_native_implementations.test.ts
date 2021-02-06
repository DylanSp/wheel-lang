import "jest";
import { Value } from "../src/evaluator_types";
import { clock, parseNum, print } from "../src/main_native_implementations";
import { Identifier, identifierIso } from "../src/universal_types";

describe("Native function implementations for main driver", () => {
  describe("clock", () => {
    it("Evaluates clock() to the current time as a number", () => {
      // Arrange
      jest.useFakeTimers("modern");
      const time = 5;
      jest.setSystemTime(time);

      // Act
      const result = clock();

      // Assert
      expect(result).toBe(time);

      // Cleanup
      jest.useRealTimers();
    });
  });

  describe("print", () => {
    it('Prints "1" with console.log when evaluating print(1)', () => {
      // Arrange
      const num = 1;
      const consoleLogSpy = jest.spyOn(global.console, "log").mockImplementation(() => {
        // intentional no-op
      });

      // Act
      print({
        valueKind: "number",
        value: num,
      });

      // Assert
      expect(consoleLogSpy).toBeCalledWith(num);

      // Cleanup
      consoleLogSpy.mockRestore();
    });

    it('Prints "true" with console.log when evaluating print(true)', () => {
      // Arrange
      const bool = true;
      const consoleLogSpy = jest.spyOn(global.console, "log").mockImplementation(() => {
        // intentional no-op
      });

      // Act
      print({
        valueKind: "boolean",
        isTrue: bool,
      });

      // Assert
      expect(consoleLogSpy).toBeCalledWith(bool);

      // Cleanup
      consoleLogSpy.mockRestore();
    });

    it('Prints "test" with console.log when evaluating print("test")', () => {
      // Arrange
      const str = "test";
      const consoleLogSpy = jest.spyOn(global.console, "log").mockImplementation(() => {
        // intentional no-op
      });

      // Act
      print({
        valueKind: "string",
        value: str,
      });

      // Assert
      expect(consoleLogSpy).toBeCalledWith(`"${str}"`);

      // Cleanup
      consoleLogSpy.mockRestore();
    });

    it('Prints "{}" with console.log when evaluating print({})', () => {
      // Arrange
      const consoleLogSpy = jest.spyOn(global.console, "log").mockImplementation(() => {
        // intentional no-op
      });

      // Act
      print({
        valueKind: "object",
        fields: new Map<Identifier, Value>(),
      });

      // Assert
      expect(consoleLogSpy).toBeCalledWith("{}");

      // Cleanup
      consoleLogSpy.mockRestore();
    });

    it('Prints "{ field: 1 }" with console.log when evaluating print({ field: 1 })', () => {
      // Arrange
      const consoleLogSpy = jest.spyOn(global.console, "log").mockImplementation(() => {
        // intentional no-op
      });
      const fields = new Map<Identifier, Value>();
      fields.set(identifierIso.wrap("field"), {
        valueKind: "number",
        value: 1,
      });

      // Act
      print({
        valueKind: "object",
        fields,
      });

      // Assert
      expect(consoleLogSpy).toBeCalledWith("{ field: 1 }");

      // Cleanup
      consoleLogSpy.mockRestore();
    });

    it('Prints "{ fieldA: 1, fieldB: true }" with console.log when evaluating print({ fieldA: 1, fieldB: true })', () => {
      // Arrange
      const consoleLogSpy = jest.spyOn(global.console, "log").mockImplementation(() => {
        // intentional no-op
      });
      const fields = new Map<Identifier, Value>();
      fields.set(identifierIso.wrap("fieldA"), {
        valueKind: "number",
        value: 1,
      });
      fields.set(identifierIso.wrap("fieldB"), {
        valueKind: "boolean",
        isTrue: true,
      });

      // Act
      print({
        valueKind: "object",
        fields,
      });

      // Assert
      expect(consoleLogSpy).toBeCalledWith("{ fieldA: 1, fieldB: true }");

      // Cleanup
      consoleLogSpy.mockRestore();
    });

    it('Prints "{ fieldA: 1, fieldB: true }" with console.log when evaluating print({ fieldB: true, fieldA: 1 }) (sorts object fields alphabetically by field name when printing', () => {
      // Arrange
      const consoleLogSpy = jest.spyOn(global.console, "log").mockImplementation(() => {
        // intentional no-op
      });
      const fields = new Map<Identifier, Value>();
      fields.set(identifierIso.wrap("fieldB"), {
        valueKind: "boolean",
        isTrue: true,
      });
      fields.set(identifierIso.wrap("fieldA"), {
        valueKind: "number",
        value: 1,
      });

      // Act
      print({
        valueKind: "object",
        fields,
      });

      // Assert
      expect(consoleLogSpy).toBeCalledWith("{ fieldA: 1, fieldB: true }");

      // Cleanup
      consoleLogSpy.mockRestore();
    });

    it('Prints "{ field: { nested: "value" } }" with console.log when evaluating print({ field: { nested: "value" } })', () => {
      // Arrange
      const consoleLogSpy = jest.spyOn(global.console, "log").mockImplementation(() => {
        // intentional no-op
      });
      const fields = new Map<Identifier, Value>();
      const innerFields = new Map<Identifier, Value>();
      innerFields.set(identifierIso.wrap("nested"), {
        valueKind: "string",
        value: "value",
      });
      fields.set(identifierIso.wrap("field"), {
        valueKind: "object",
        fields: innerFields,
      });

      // Act
      print({
        valueKind: "object",
        fields,
      });

      // Assert
      expect(consoleLogSpy).toBeCalledWith('{ field: { nested: "value" } }');

      // Cleanup
      consoleLogSpy.mockRestore();
    });
  });

  describe("parseNum", () => {
    it('Evaluates parseNum("1") to { isValid: true, value: 1 } (parseNum on integers)', () => {
      // Arrange - not needed

      // Act
      const result = parseNum({
        valueKind: "string",
        value: "1",
      });

      // Assert
      expect(result.get(identifierIso.wrap("isValid"))).toEqual({ valueKind: "boolean", isTrue: true });
      expect(result.get(identifierIso.wrap("value"))).toEqual({ valueKind: "number", value: 1 });
    });

    it('Evaluates parseNum("2.5") to { isValid: true, value: 2.5 } (parseNum on decimals)', () => {
      // Arrange - not needed

      // Act
      const result = parseNum({
        valueKind: "string",
        value: "2.5",
      });

      // Assert
      expect(result.get(identifierIso.wrap("isValid"))).toEqual({ valueKind: "boolean", isTrue: true });
      expect(result.get(identifierIso.wrap("value"))).toEqual({ valueKind: "number", value: 2.5 });
    });

    it('Evaluates parseNum("2.5") to { isValid: true, value: 2.5 } (parseNum on decimals)', () => {
      // Arrange - not needed

      // Act
      const result = parseNum({
        valueKind: "string",
        value: "test",
      });

      // Assert
      expect(result.get(identifierIso.wrap("isValid"))).toEqual({ valueKind: "boolean", isTrue: false });
    });
  });
});
