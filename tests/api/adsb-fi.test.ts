import { describe, it, expect, vi, afterEach } from "vitest";
import { fetchFlights, createAdsbFiSource } from "../../src/api/adsb-fi";
import fixture from "../fixtures/v2-aircraft.json";

describe("fetchFlights (adsb.fi)", () => {
  it("fetches using adsb.fi URL format", async () => {
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
    expect(url).toContain("/v2/lat/");
    expect(url).toContain("/lon/");
    expect(url).toContain("/dist/");
    expect(results).toHaveLength(3);
  });

  it("returns empty array on non-ok response", async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: false, status: 429 });
    const results = await fetchFlights(
      { south: 45, north: 55, west: -10, east: 15 },
      (mockFetch as unknown) as typeof fetch
    );
    expect(results).toEqual([]);
  });
});

describe("createAdsbFiSource", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("calls onPosition for each airborne flight", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(fixture),
    });
    vi.stubGlobal("fetch", mockFetch);

    const onPosition = vi.fn();
    const source = createAdsbFiSource(onPosition, vi.fn());

    source.start({ south: 45, north: 55, west: -10, east: 15 });
    await new Promise((r) => setTimeout(r, 50));

    expect(onPosition.mock.calls.length).toBeGreaterThanOrEqual(3);

    source.stop();
  });

  it("stops polling on stop()", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(fixture),
    });
    vi.stubGlobal("fetch", mockFetch);

    const source = createAdsbFiSource(vi.fn(), vi.fn());
    source.start({ south: 45, north: 55, west: -10, east: 15 });
    source.stop();

    await new Promise((r) => setTimeout(r, 100));
    expect(mockFetch.mock.calls.length).toBeLessThanOrEqual(2);
  });
});
