import "jest";
import { testValue } from "../src/main";

describe("Basic test", () => {
  it("verifies 1=1", () => {
    expect(testValue).toBe(1);
  });
});
