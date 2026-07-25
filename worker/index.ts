export interface Env {
  ASSETS: Fetcher;
}

const AIRPLANES_LIVE_PREFIX = "/api/airplanes-live/";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith(AIRPLANES_LIVE_PREFIX)) {
      const targetPath = url.pathname.slice(AIRPLANES_LIVE_PREFIX.length);
      const upstream = await fetch(
        `https://api.airplanes.live/${targetPath}${url.search}`,
        { headers: { Accept: "application/json" } }
      );
      return new Response(upstream.body, {
        status: upstream.status,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    return env.ASSETS.fetch(request);
  },
};
