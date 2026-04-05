import { describe, it, expect } from "vitest";
import {
  getEffectiveHeading,
  createPlaneIcon,
} from "../../src/map/marker-factory";
import type { FlightLocation } from "../../src/types";

function makeLocation(overrides: Partial<FlightLocation> = {}): FlightLocation {
  return {
    id: "BAW123",
    lat: 51.47,
    lng: -0.45,
    altitude: 35000,
    groundSpeed: 450,
    heading: 135,
    verticalSpeed: 0,
    timestamp: Date.now(),
    ...overrides,
  };
}

describe("getEffectiveHeading", () => {
  it("returns heading directly", () => {
    expect(getEffectiveHeading(makeLocation({ heading: 270 }))).toBe(270);
  });

  it("returns 0 as valid north heading", () => {
    expect(getEffectiveHeading(makeLocation({ heading: 0 }))).toBe(0);
  });
});

describe("createPlaneIcon", () => {
  it("creates an icon with the given color", () => {
    const icon = createPlaneIcon("#3498db", "widebody");
    expect(icon.options.className).toBe("plane-marker");
    expect(icon.options.iconSize).toEqual([20, 28]);
    expect(icon.options.iconAnchor).toEqual([10, 14]);
  });

  it("embeds color into SVG", () => {
    const icon = createPlaneIcon("#2ecc71", "narrowbody");
    const html = (icon.options as { html: string }).html;
    expect(html).toContain("#2ecc71");
  });

  it("handles default shape", () => {
    const icon = createPlaneIcon("#95a5a6", "default");
    const html = (icon.options as { html: string }).html;
    expect(html).toContain("svg");
  });
});
