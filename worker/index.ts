export interface Env {
  ASSETS: Fetcher;
}

const PROXY_MAP: Record<string, string> = {
  "/api/airplanes-live/": "https://api.airplanes.live/",
  "/api/adsb-fi/": "https://opendata.adsb.fi/api/",
};

async function handleProxy(
  request: Request,
  pathPrefix: string,
  targetBase: string
): Promise<Response> {
  const url = new URL(request.url);
  const targetPath = url.pathname.slice(pathPrefix.length);
  const targetUrl = `${targetBase}${targetPath}${url.search}`;

  const response = await fetch(targetUrl, {
    headers: { Accept: "application/json" },
  });

  return new Response(response.body, {
    status: response.status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    for (const [prefix, target] of Object.entries(PROXY_MAP)) {
      if (url.pathname.startsWith(prefix)) {
        return handleProxy(request, prefix, target);
      }
    }

    // Serve static assets, fall back to index.html for SPA routing
    const assetResponse = await env.ASSETS.fetch(request);
    if (assetResponse.status !== 404) {
      return assetResponse;
    }

    // SPA fallback: serve index.html for non-asset paths
    const indexRequest = new Request(new URL("/", request.url), request);
    return env.ASSETS.fetch(indexRequest);
  },
};
