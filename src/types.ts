export interface FlightLocation {
  readonly id: string;
  readonly lat: number;
  readonly lng: number;
  readonly altitude: number;
  readonly groundSpeed: number;
  readonly heading: number;
  readonly verticalSpeed: number;
  readonly timestamp: number;
}

export interface FlightMetadata {
  readonly id: string;
  readonly callsign: string;
  readonly registration: string;
  readonly aircraftType: string;
  readonly squawk: string;
}

export interface FlightData {
  readonly location: FlightLocation;
  readonly metadata: FlightMetadata | null;
}

export interface BoundingBox {
  readonly south: number;
  readonly west: number;
  readonly north: number;
  readonly east: number;
}

export interface DataSource {
  readonly start: (bounds?: BoundingBox) => void;
  readonly stop: () => void;
  readonly updateBounds: (bounds: BoundingBox) => void;
}

export type Fetcher = typeof fetch;
