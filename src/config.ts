export const TILE_URL =
  "https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

export const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>';

export const MAP_CENTER: [number, number] = [40, -3];
export const MAP_ZOOM = 5;

export const AIRPLANES_LIVE_API_URL = "/api/airplanes-live/v2";

export const ADSB_FI_API_URL = "/api/adsb-fi/v2";

export const POLL_INTERVAL_MS = 10_000;
export const STALE_THRESHOLD_MS = 2 * 60_000;

export const MAX_QUERY_RADIUS_NM = 250;
