export interface Env {
  ASSETS: Fetcher;
}

const ADSB_FI_PREFIX = "/api/adsb-fi/";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith(ADSB_FI_PREFIX)) {
      const targetPath = url.pathname.slice(ADSB_FI_PREFIX.length);
      const upstream = await fetch(
        `https://opendata.adsb.fi/api/${targetPath}${url.search}`,
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
