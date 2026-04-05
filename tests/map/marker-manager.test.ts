import { describe, it, expect, vi, beforeEach } from "vitest";
import { createMarkerManager } from "../../src/map/marker-manager";
import type { FlightLocation, FlightMetadata } from "../../src/types";

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

function makeMetadata(
  overrides: Partial<FlightMetadata> = {}
): FlightMetadata {
  return {
    id: "BAW123",
    callsign: "BAW123",
    registration: "G-EUPT",
    aircraftType: "A320",
    airline: "British Airways",
    origin: "LHR",
    destination: "CDG",
    squawk: "4521",
    ...overrides,
  };
}

function createMockMap() {
  return {
    addLayer: vi.fn(),
    removeLayer: vi.fn(),
  } as unknown as import("leaflet").Map;
}

describe("createMarkerManager", () => {
  let map: import("leaflet").Map;
  let onClick: (id: string) => void;

  beforeEach(() => {
    map = createMockMap();
    onClick = vi.fn<(id: string) => void>();
  });

  it("starts with zero flights", () => {
    const manager = createMarkerManager(map, onClick);
    expect(manager.getFlightCount()).toBe(0);
  });

  it("adds a new flight on first position update", () => {
    const manager = createMarkerManager(map, onClick);
    manager.updatePosition(makeLocation());
    expect(manager.getFlightCount()).toBe(1);
  });

  it("updates existing flight without duplicating", () => {
    const manager = createMarkerManager(map, onClick);
    manager.updatePosition(makeLocation({ lat: 51.0 }));
    manager.updatePosition(makeLocation({ lat: 52.0 }));
    expect(manager.getFlightCount()).toBe(1);
  });

  it("tracks multiple flights by ID", () => {
    const manager = createMarkerManager(map, onClick);
    manager.updatePosition(makeLocation({ id: "BAW123" }));
    manager.updatePosition(makeLocation({ id: "RYR456" }));
    manager.updatePosition(makeLocation({ id: "DLH789" }));
    expect(manager.getFlightCount()).toBe(3);
  });

  it("returns flight data after position update", () => {
    const manager = createMarkerManager(map, onClick);
    manager.updatePosition(makeLocation({ id: "BAW123" }));

    const data = manager.getFlightData("BAW123");
    expect(data).not.toBeNull();
    expect(data!.location.id).toBe("BAW123");
    expect(data!.metadata).toBeNull();
  });

  it("returns null for unknown ID", () => {
    const manager = createMarkerManager(map, onClick);
    expect(manager.getFlightData("UNKNOWN")).toBeNull();
  });

  it("attaches metadata to existing flight", () => {
    const manager = createMarkerManager(map, onClick);
    manager.updatePosition(makeLocation({ id: "BAW123" }));
    manager.updateMetadata(makeMetadata({ id: "BAW123" }));

    const data = manager.getFlightData("BAW123");
    expect(data!.metadata).not.toBeNull();
    expect(data!.metadata!.airline).toBe("British Airways");
  });

  it("ignores metadata for unknown flight", () => {
    const manager = createMarkerManager(map, onClick);
    manager.updateMetadata(makeMetadata({ id: "UNKNOWN" }));
    expect(manager.getFlightCount()).toBe(0);
  });

  it("prunes stale entries", () => {
    const manager = createMarkerManager(map, onClick);
    manager.updatePosition(makeLocation({ id: "BAW123" }));
    expect(manager.getFlightCount()).toBe(1);

    // Fast-forward past stale threshold (2 min)
    vi.spyOn(Date, "now").mockReturnValue(Date.now() + 3 * 60_000);
    manager.pruneStale();
    expect(manager.getFlightCount()).toBe(0);

    vi.restoreAllMocks();
  });

  it("keeps recent entries when pruning", () => {
    const manager = createMarkerManager(map, onClick);
    manager.updatePosition(makeLocation({ id: "BAW123" }));

    // Only 30 seconds — not stale
    vi.spyOn(Date, "now").mockReturnValue(Date.now() + 30_000);
    manager.pruneStale();
    expect(manager.getFlightCount()).toBe(1);

    vi.restoreAllMocks();
  });
});
