import { describe, it, expect } from "vitest";
import { getAircraftTypeInfo } from "../../src/utils/aircraft-type.js";

describe("getAircraftTypeInfo", () => {
  it("returns widebody for B744", () => {
    const info = getAircraftTypeInfo("B744");
    expect(info.shape).toBe("widebody");
    expect(info.color).toBe("#3498db");
    expect(info.label).toBe("Boeing 747-400");
  });

  it("returns widebody for A380", () => {
    const info = getAircraftTypeInfo("A380");
    expect(info.shape).toBe("widebody");
  });

  it("returns widebody for B789", () => {
    const info = getAircraftTypeInfo("B789");
    expect(info.shape).toBe("widebody");
  });

  it("returns narrowbody for B738", () => {
    const info = getAircraftTypeInfo("B738");
    expect(info.shape).toBe("narrowbody");
    expect(info.color).toBe("#2ecc71");
  });

  it("returns narrowbody for A320", () => {
    const info = getAircraftTypeInfo("A320");
    expect(info.shape).toBe("narrowbody");
  });

  it("returns narrowbody for A20N", () => {
    const info = getAircraftTypeInfo("A20N");
    expect(info.shape).toBe("narrowbody");
  });

  it("returns narrowbody for A21N", () => {
    const info = getAircraftTypeInfo("A21N");
    expect(info.shape).toBe("narrowbody");
  });

  it("returns regional for CRJ9", () => {
    const info = getAircraftTypeInfo("CRJ9");
    expect(info.shape).toBe("regional");
    expect(info.color).toBe("#f39c12");
  });

  it("returns regional for E175", () => {
    const info = getAircraftTypeInfo("E175");
    expect(info.shape).toBe("regional");
  });

  it("returns regional for AT72", () => {
    const info = getAircraftTypeInfo("AT72");
    expect(info.shape).toBe("regional");
  });

  it("returns regional for DH8D", () => {
    const info = getAircraftTypeInfo("DH8D");
    expect(info.shape).toBe("regional");
  });

  it("returns cargo for C17", () => {
    const info = getAircraftTypeInfo("C17");
    expect(info.shape).toBe("cargo");
    expect(info.color).toBe("#e67e22");
  });

  it("returns cargo for C130", () => {
    const info = getAircraftTypeInfo("C130");
    expect(info.shape).toBe("cargo");
  });

  it("returns helicopter for H135", () => {
    const info = getAircraftTypeInfo("H135");
    expect(info.shape).toBe("helicopter");
    expect(info.color).toBe("#9b59b6");
  });

  it("returns helicopter for EC35", () => {
    const info = getAircraftTypeInfo("EC35");
    expect(info.shape).toBe("helicopter");
  });

  it("returns helicopter for R44", () => {
    const info = getAircraftTypeInfo("R44");
    expect(info.shape).toBe("helicopter");
  });

  it("returns military for F16", () => {
    const info = getAircraftTypeInfo("F16");
    expect(info.shape).toBe("military");
    expect(info.color).toBe("#7f8c8d");
  });

  it("returns military for F18", () => {
    const info = getAircraftTypeInfo("F18");
    expect(info.shape).toBe("military");
  });

  it("returns military for EUFI", () => {
    const info = getAircraftTypeInfo("EUFI");
    expect(info.shape).toBe("military");
  });

  it("returns light for C172", () => {
    const info = getAircraftTypeInfo("C172");
    expect(info.shape).toBe("light");
    expect(info.color).toBe("#1abc9c");
  });

  it("returns light for SR22", () => {
    const info = getAircraftTypeInfo("SR22");
    expect(info.shape).toBe("light");
  });

  it("returns light for PA28", () => {
    const info = getAircraftTypeInfo("PA28");
    expect(info.shape).toBe("light");
  });

  it("returns default for unknown type", () => {
    const info = getAircraftTypeInfo("ZZZZ");
    expect(info.shape).toBe("default");
    expect(info.color).toBe("#95a5a6");
    expect(info.label).toBe("Unknown");
  });

  it("handles empty string", () => {
    const info = getAircraftTypeInfo("");
    expect(info.shape).toBe("default");
  });
});
