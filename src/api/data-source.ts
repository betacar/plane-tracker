import type {
  FlightLocation,
  FlightMetadata,
  DataSource,
  BoundingBox,
} from "../types";
import { createAirplanesLiveSource } from "./airplanes-live";

export interface DataSourceResult {
  readonly source: DataSource;
}

export function createDataSource(
  onPosition: (loc: FlightLocation) => void,
  onMetadata: (meta: FlightMetadata) => void,
  _onFallback?: () => void
): DataSourceResult {
  const primary = createAirplanesLiveSource(onPosition, onMetadata);

  const source: DataSource = {
    start(bounds?: BoundingBox) {
      primary.start(bounds);
    },

    stop() {
      primary.stop();
    },

    updateBounds(bounds: BoundingBox) {
      primary.updateBounds?.(bounds);
    },
  };

  return { source };
}
