import type {
  FlightLocation,
  FlightMetadata,
  BoundingBox,
} from "../types";

export interface V2Aircraft {
  readonly hex: string;
  readonly flight?: string;
  readonly r?: string;
  readonly t?: string;
  readonly alt_baro?: number | "ground";
  readonly alt_geom?: number;
  readonly gs?: number;
  readonly track?: number;
  readonly true_heading?: number;
  readonly mag_heading?: number;
  readonly baro_rate?: number;
  readonly geom_rate?: number;
  readonly squawk?: string;
  readonly category?: string;
  readonly lat?: number;
  readonly lon?: number;
  readonly seen_pos?: number;
  readonly seen?: number;
  readonly dbFlags?: number;
}

export interface V2Response {
  readonly ac: readonly V2Aircraft[];
  readonly msg?: string;
  readonly now?: number;
  readonly total?: number;
}

function resolveId(ac: V2Aircraft): string {
  const flight = ac.flight?.trim();
  if (flight) return flight;
  return ac.hex;
}

export function parseV2Aircraft(
  ac: V2Aircraft
): { location: FlightLocation; metadata: FlightMetadata } | null {
  if (ac.lat == null || ac.lon == null) return null;
  if (ac.alt_baro === "ground") return null;

  const id = resolveId(ac);
  const altitude = ac.alt_baro ?? ac.alt_geom ?? 0;
  const heading = ac.true_heading ?? ac.mag_heading ?? ac.track ?? 0;
  const verticalSpeed = ac.baro_rate ?? ac.geom_rate ?? 0;

  return {
    location: {
      id,
      lat: ac.lat,
      lng: ac.lon,
      altitude,
      groundSpeed: ac.gs ?? 0,
      heading,
      verticalSpeed,
      timestamp: Date.now(),
    },
    metadata: {
      id,
      callsign: ac.flight?.trim() ?? "",
      registration: ac.r ?? "",
      aircraftType: ac.t ?? "",
      airline: "",
      origin: "",
      destination: "",
      squawk: ac.squawk ?? "",
    },
  };
}

export interface QueryCenter {
  readonly lat: number;
  readonly lng: number;
  readonly radiusNm: number;
}

export function boundsToCenter(bounds: BoundingBox, maxRadius: number): QueryCenter {
  const lat = (bounds.south + bounds.north) / 2;
  const lng = (bounds.west + bounds.east) / 2;

  const latSpan = bounds.north - bounds.south;
  const lngSpan = bounds.east - bounds.west;
  const avgLatRad = (lat * Math.PI) / 180;
  const latNm = (latSpan / 2) * 60;
  const lngNm = (lngSpan / 2) * 60 * Math.cos(avgLatRad);
  const radiusNm = Math.min(Math.max(latNm, lngNm), maxRadius);

  return { lat, lng, radiusNm };
}
