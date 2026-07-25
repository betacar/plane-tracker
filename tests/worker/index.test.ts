import { describe, it, expect, vi, afterEach } from "vitest";
import worker from "../../worker/index";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("worker fetch", () => {
  it("proxies /api/airplanes-live/* to the upstream API, stripping the prefix", async () => {
    const upstream = new Response(JSON.stringify({ ac: [] }), { status: 200 });
    const mockFetch = vi.fn().mockResolvedValue(upstream);
    vi.stubGlobal("fetch", mockFetch);

    const request = new Request(
      "https://pt.example.com/api/airplanes-live/v2/point/50/8/50?extra=1"
    );
    const env = { ASSETS: { fetch: vi.fn() } };

    const response = await worker.fetch(request, env);

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.airplanes.live/v2/point/50/8/50?extra=1",
      { headers: { Accept: "application/json" } }
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/json");
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
    expect(env.ASSETS.fetch).not.toHaveBeenCalled();
  });

  it("passes through upstream error status codes", async () => {
    const upstream = new Response(null, { status: 503 });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(upstream));

    const request = new Request("https://pt.example.com/api/airplanes-live/v2/point/1/2/3");
    const response = await worker.fetch(request, { ASSETS: { fetch: vi.fn() } });

    expect(response.status).toBe(503);
  });

  it("delegates non-proxy paths to the static asset binding", async () => {
    const assetResponse = new Response("<!doctype html>");
    const assetsFetch = vi.fn().mockResolvedValue(assetResponse);
    const request = new Request("https://pt.example.com/index.html");

    const response = await worker.fetch(request, { ASSETS: { fetch: assetsFetch } });

    expect(assetsFetch).toHaveBeenCalledWith(request);
    expect(response).toBe(assetResponse);
  });
});
