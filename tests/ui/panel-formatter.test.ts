import { describe, it, expect } from "vitest";
import {
  formatAltitude,
  formatSpeed,
  formatHeading,
  formatVerticalSpeed,
  formatSquawk,
  formatRoute,
  formatAircraftType,
} from "../../src/ui/panel-formatter";

describe("formatAltitude", () => {
  it("returns flight level for altitudes >= 18000 ft", () => {
    expect(formatAltitude(35000)).toBe("FL350");
  });

  it("returns flight level rounded to nearest 100", () => {
    expect(formatAltitude(36050)).toBe("FL361");
  });

  it("returns feet with commas below 18000", () => {
    expect(formatAltitude(12500)).toBe("12,500 ft");
  });

  it("returns 0 ft for ground level", () => {
    expect(formatAltitude(0)).toBe("0 ft");
  });

  it("returns feet for low altitudes", () => {
    expect(formatAltitude(1500)).toBe("1,500 ft");
  });
});

describe("formatSpeed", () => {
  it("formats speed with 1 decimal", () => {
    expect(formatSpeed(450)).toBe("450.0 kn");
  });

  it("formats zero speed", () => {
    expect(formatSpeed(0)).toBe("0.0 kn");
  });
});

describe("formatHeading", () => {
  it("formats heading with compass direction", () => {
    expect(formatHeading(0)).toBe("0.0\u00B0 (N)");
  });

  it("formats south heading", () => {
    expect(formatHeading(180)).toBe("180.0\u00B0 (S)");
  });

  it("formats SSW heading", () => {
    const result = formatHeading(205);
    expect(result).toContain("SSW");
  });
});

describe("formatVerticalSpeed", () => {
  it("formats positive vertical speed with + sign", () => {
    expect(formatVerticalSpeed(1200)).toBe("+1,200 ft/min");
  });

  it("formats negative vertical speed", () => {
    expect(formatVerticalSpeed(-800)).toBe("-800 ft/min");
  });

  it("formats zero vertical speed", () => {
    expect(formatVerticalSpeed(0)).toBe("0 ft/min");
  });
});

describe("formatSquawk", () => {
  it("appends Emergency label for 7700", () => {
    expect(formatSquawk("7700")).toBe("7700 (Emergency)");
  });

  it("appends Hijack label for 7500", () => {
    expect(formatSquawk("7500")).toBe("7500 (Hijack)");
  });

  it("appends Radio Failure label for 7600", () => {
    expect(formatSquawk("7600")).toBe("7600 (Radio Failure)");
  });

  it("returns just the code for normal squawk", () => {
    expect(formatSquawk("1200")).toBe("1200");
  });

  it("returns N/A for empty squawk", () => {
    expect(formatSquawk("")).toBe("N/A");
  });
});

describe("formatRoute", () => {
  it("formats origin to destination", () => {
    expect(formatRoute("LHR", "CDG")).toBe("LHR \u2192 CDG");
  });

  it("returns N/A when both are empty", () => {
    expect(formatRoute("", "")).toBe("N/A");
  });

  it("shows origin only when destination is empty", () => {
    expect(formatRoute("LHR", "")).toBe("LHR \u2192 ?");
  });

  it("shows destination only when origin is empty", () => {
    expect(formatRoute("", "CDG")).toBe("? \u2192 CDG");
  });
});

describe("formatAircraftType", () => {
  it("returns label for known type", () => {
    expect(formatAircraftType("B738")).toBe("Boeing 737-800");
  });

  it("returns Unknown for unknown type", () => {
    expect(formatAircraftType("ZZZZ")).toBe("Unknown");
  });

  it("returns Unknown for empty string", () => {
    expect(formatAircraftType("")).toBe("Unknown");
  });
});
