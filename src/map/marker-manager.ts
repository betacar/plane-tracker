import type L from "leaflet";
import type { FlightLocation, FlightMetadata, FlightData } from "../types";
import { createPlaneMarker, updatePlaneMarker } from "./marker-factory";
import { STALE_THRESHOLD_MS } from "../config";

interface MarkerEntry {
  marker: L.Marker;
  location: FlightLocation;
  metadata: FlightMetadata | null;
  lastUpdate: number;
}

export interface MarkerManager {
  readonly updatePosition: (location: FlightLocation) => void;
  readonly updateMetadata: (metadata: FlightMetadata) => void;
  readonly getFlightData: (id: string) => FlightData | null;
  readonly getFlightCount: () => number;
  readonly pruneStale: () => void;
}

export function createMarkerManager(
  map: L.Map,
  onPlaneClick: (id: string) => void
): MarkerManager {
  const entries = new Map<string, MarkerEntry>();

  function updatePosition(location: FlightLocation): void {
    const existing = entries.get(location.id);

    if (existing) {
      const updatedEntry: MarkerEntry = {
        ...existing,
        location,
        lastUpdate: Date.now(),
      };
      updatePlaneMarker(existing.marker, location, existing.metadata);
      entries.set(location.id, updatedEntry);
    } else {
      const marker = createPlaneMarker(location, null, onPlaneClick);
      marker.addTo(map);
      entries.set(location.id, {
        marker,
        location,
        metadata: null,
        lastUpdate: Date.now(),
      });
    }
  }

  function updateMetadata(metadata: FlightMetadata): void {
    const existing = entries.get(metadata.id);
    if (!existing) return;

    const updatedEntry: MarkerEntry = {
      ...existing,
      metadata,
    };
    updatePlaneMarker(existing.marker, existing.location, metadata);
    entries.set(metadata.id, updatedEntry);
  }

  function getFlightData(id: string): FlightData | null {
    const entry = entries.get(id);
    if (!entry) return null;
    return { location: entry.location, metadata: entry.metadata };
  }

  function getFlightCount(): number {
    return entries.size;
  }

  function pruneStale(): void {
    const now = Date.now();
    for (const [id, entry] of entries) {
      if (now - entry.lastUpdate > STALE_THRESHOLD_MS) {
        entry.marker.remove();
        entries.delete(id);
      }
    }
  }

  return {
    updatePosition,
    updateMetadata,
    getFlightData,
    getFlightCount,
    pruneStale,
  };
}
