import { describe, it, expect } from "vitest";
import { getSquawkLabel } from "../../src/utils/squawk.js";

describe("getSquawkLabel", () => {
  it("returns Hijack for 7500", () => {
    expect(getSquawkLabel("7500")).toBe("Hijack");
  });

  it("returns Radio Failure for 7600", () => {
    expect(getSquawkLabel("7600")).toBe("Radio Failure");
  });

  it("returns Emergency for 7700", () => {
    expect(getSquawkLabel("7700")).toBe("Emergency");
  });

  it("returns the code itself for normal squawk", () => {
    expect(getSquawkLabel("1200")).toBe("1200");
  });

  it("returns N/A for empty string", () => {
    expect(getSquawkLabel("")).toBe("N/A");
  });

  it("returns the code for other values", () => {
    expect(getSquawkLabel("4521")).toBe("4521");
  });
});
