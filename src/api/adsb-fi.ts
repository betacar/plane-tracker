import { ADSB_FI_API_URL, POLL_INTERVAL_MS, MAX_QUERY_RADIUS_NM } from "../config";
import type {
  FlightLocation,
  FlightMetadata,
  DataSource,
  BoundingBox,
  Fetcher,
} from "../types";
import { parseV2Aircraft, boundsToCenter, type V2Response } from "./adsb-v2";

function buildUrl(bounds: BoundingBox): string {
  const { lat, lng, radiusNm } = boundsToCenter(bounds, MAX_QUERY_RADIUS_NM);
  return `${ADSB_FI_API_URL}/lat/${lat.toFixed(4)}/lon/${lng.toFixed(4)}/dist/${Math.round(radiusNm)}`;
}

export async function fetchFlights(
  bounds: BoundingBox,
  fetcher: Fetcher = fetch
): Promise<readonly { location: FlightLocation; metadata: FlightMetadata }[]> {
  const response = await fetcher(buildUrl(bounds));
  if (!response.ok) return [];

  const data: V2Response = await response.json();
  if (!data.ac) return [];

  const results: { location: FlightLocation; metadata: FlightMetadata }[] = [];
  for (const ac of data.ac) {
    const parsed = parseV2Aircraft(ac);
    if (parsed) results.push(parsed);
  }
  return results;
}

export function createAdsbFiSource(
  onPosition: (loc: FlightLocation) => void,
  onMetadata: (meta: FlightMetadata) => void
): DataSource {
  let intervalId: ReturnType<typeof setInterval> | null = null;
  let currentBounds: BoundingBox | undefined;

  async function poll(): Promise<void> {
    if (!currentBounds) return;
    try {
      const flights = await fetchFlights(currentBounds);
      for (const { location, metadata } of flights) {
        onPosition(location);
        onMetadata(metadata);
      }
    } catch {
      // Fetch failed — will retry on next interval
    }
  }

  function start(bounds?: BoundingBox): void {
    currentBounds = bounds;
    poll();
    intervalId = setInterval(poll, POLL_INTERVAL_MS);
  }

  function stop(): void {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function updateBounds(bounds: BoundingBox): void {
    currentBounds = bounds;
  }

  return { start, stop, updateBounds };
}
