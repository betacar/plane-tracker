import { describe, it, expect, vi, afterEach } from "vitest";
import {
  fetchFlights,
  createAirplanesLiveSource,
} from "../../src/api/airplanes-live";
import fixture from "../fixtures/v2-aircraft.json";

describe("fetchFlights", () => {
  it("fetches and parses flights for given bounds", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(fixture),
    });

    const results = await fetchFlights(
      { south: 45, north: 55, west: -10, east: 15 },
      (mockFetch as unknown) as typeof fetch
    );

    expect(mockFetch).toHaveBeenCalledOnce();
    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain("/v2/point/");
    // 3 airborne out of 4 (one is ground)
    expect(results).toHaveLength(3);
    expect(results[0].location.id).toBe("DLH1234");
  });

  it("returns empty array on non-ok response", async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: false, status: 429 });
    const results = await fetchFlights(
      { south: 45, north: 55, west: -10, east: 15 },
      (mockFetch as unknown) as typeof fetch
    );
    expect(results).toEqual([]);
  });

  it("returns empty array when ac is null", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ msg: "No error", now: 0 }),
    });
    const results = await fetchFlights(
      { south: 45, north: 55, west: -10, east: 15 },
      (mockFetch as unknown) as typeof fetch
    );
    expect(results).toEqual([]);
  });
});

describe("createAirplanesLiveSource", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("calls onPosition and onMetadata for each airborne flight", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(fixture),
    });
    vi.stubGlobal("fetch", mockFetch);

    const onPosition = vi.fn();
    const onMetadata = vi.fn();
    const source = createAirplanesLiveSource(onPosition, onMetadata);

    source.start({ south: 45, north: 55, west: -10, east: 15 });
    await new Promise((r) => setTimeout(r, 50));

    expect(onPosition.mock.calls.length).toBeGreaterThanOrEqual(3);
    expect(onMetadata.mock.calls.length).toBeGreaterThanOrEqual(3);

    source.stop();
  });

  it("does not fetch when started without bounds", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(fixture),
    });
    vi.stubGlobal("fetch", mockFetch);

    const onPosition = vi.fn();
    const source = createAirplanesLiveSource(onPosition, vi.fn());
    source.start();
    await new Promise((r) => setTimeout(r, 50));

    expect(onPosition).not.toHaveBeenCalled();
    source.stop();
  });

  it("stops polling on stop()", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(fixture),
    });
    vi.stubGlobal("fetch", mockFetch);

    const source = createAirplanesLiveSource(vi.fn(), vi.fn());
    source.start({ south: 45, north: 55, west: -10, east: 15 });
    source.stop();

    await new Promise((r) => setTimeout(r, 100));
    expect(mockFetch.mock.calls.length).toBeLessThanOrEqual(2);
  });

  it("updates bounds via updateBounds", () => {
    const source = createAirplanesLiveSource(vi.fn(), vi.fn());
    source.start({ south: 45, north: 55, west: -10, east: 15 });
    source.updateBounds!({ south: 40, north: 50, west: -5, east: 10 });
    source.stop();
  });
});
