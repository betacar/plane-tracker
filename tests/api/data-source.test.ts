import { describe, it, expect, vi, afterEach } from "vitest";
import { createDataSource } from "../../src/api/data-source";
import fixture from "../fixtures/v2-aircraft.json";

describe("createDataSource", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("returns a source with start, stop, and updateBounds", () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(fixture),
    });
    vi.stubGlobal("fetch", mockFetch);

    const { source } = createDataSource(vi.fn(), vi.fn());
    expect(typeof source.start).toBe("function");
    expect(typeof source.stop).toBe("function");
    expect(typeof source.updateBounds).toBe("function");
  });

  it("uses airplanes.live as primary source", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(fixture),
    });
    vi.stubGlobal("fetch", mockFetch);

    const onPosition = vi.fn();
    const { source } = createDataSource(onPosition, vi.fn());

    source.start({ south: 50, north: 53, west: -2, east: 1 });
    await new Promise((r) => setTimeout(r, 50));

    expect(onPosition).toHaveBeenCalled();
    expect(onPosition.mock.calls[0][0].id).toBe("DLH1234");

    source.stop();
  });

  it("uses default bounds when start is called without bounds", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(fixture),
    });
    vi.stubGlobal("fetch", mockFetch);

    const { source } = createDataSource(vi.fn(), vi.fn());
    source.start();
    await new Promise((r) => setTimeout(r, 50));

    source.stop();
  });

  it("routes updateBounds to primary", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(fixture),
    });
    vi.stubGlobal("fetch", mockFetch);

    const { source } = createDataSource(vi.fn(), vi.fn());
    source.start({ south: 50, north: 53, west: -2, east: 1 });
    await new Promise((r) => setTimeout(r, 50));

    source.updateBounds!({ south: 40, north: 45, west: -5, east: 3 });
    source.stop();
  });
});
