import { describe, it, expect } from "vitest";
import { parseV2Aircraft, boundsToCenter, type V2Aircraft } from "../../src/api/adsb-v2";
import fixture from "../fixtures/v2-aircraft.json";

const ac = fixture.ac as unknown as V2Aircraft[];

describe("parseV2Aircraft", () => {
  it("uses trimmed flight as id", () => {
    const result = parseV2Aircraft(ac[0])!;
    expect(result.location.id).toBe("DLH1234");
  });

  it("falls back to hex when flight is missing", () => {
    const result = parseV2Aircraft(ac[3])!;
    expect(result.location.id).toBe("ff1234");
  });

  it("extracts position data", () => {
    const result = parseV2Aircraft(ac[0])!;
    expect(result.location.lat).toBe(50.0333);
    expect(result.location.lng).toBe(8.5432);
    expect(result.location.altitude).toBe(35000);
    expect(result.location.groundSpeed).toBe(467.5);
    expect(result.location.heading).toBe(134.2);
    expect(result.location.verticalSpeed).toBe(0);
  });

  it("prefers true_heading over track", () => {
    const result = parseV2Aircraft(ac[0])!;
    expect(result.location.heading).toBe(134.2);
  });

  it("falls back to track when true_heading is missing", () => {
    const result = parseV2Aircraft(ac[1])!;
    expect(result.location.heading).toBe(280.0);
  });

  it("extracts metadata", () => {
    const result = parseV2Aircraft(ac[0])!;
    expect(result.metadata.callsign).toBe("DLH1234");
    expect(result.metadata.registration).toBe("D-AIMA");
    expect(result.metadata.aircraftType).toBe("A380");
    expect(result.metadata.squawk).toBe("7000");
  });

  it("handles missing metadata fields", () => {
    const result = parseV2Aircraft(ac[3])!;
    expect(result.metadata.registration).toBe("");
    expect(result.metadata.aircraftType).toBe("");
    expect(result.metadata.squawk).toBe("");
  });

  it("returns null for ground aircraft", () => {
    const result = parseV2Aircraft(ac[2]);
    expect(result).toBeNull();
  });

  it("returns null when lat/lon is missing", () => {
    const result = parseV2Aircraft({ hex: "aaa", alt_baro: 5000 });
    expect(result).toBeNull();
  });

  it("extracts negative vertical speed", () => {
    const result = parseV2Aircraft(ac[1])!;
    expect(result.location.verticalSpeed).toBe(-1200);
  });
});

describe("boundsToCenter", () => {
  it("computes center of bounding box", () => {
    const result = boundsToCenter(
      { south: 40, north: 50, west: -10, east: 10 },
      250
    );
    expect(result.lat).toBe(45);
    expect(result.lng).toBe(0);
  });

  it("caps radius at max", () => {
    const result = boundsToCenter(
      { south: -90, north: 90, west: -180, east: 180 },
      250
    );
    expect(result.radiusNm).toBe(250);
  });

  it("computes reasonable radius for small area", () => {
    const result = boundsToCenter(
      { south: 50, north: 51, west: 0, east: 1 },
      250
    );
    expect(result.radiusNm).toBeGreaterThan(0);
    expect(result.radiusNm).toBeLessThan(60);
  });
});
