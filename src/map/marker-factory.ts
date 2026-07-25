import L from "leaflet";
import type { FlightLocation, FlightMetadata } from "../types";
import { getAircraftTypeInfo, type AircraftShape } from "../utils/aircraft-type";

// All SVGs are top-down views pointing UP (north). Rotation handles the rest.
// Viewbox: 20x28, anchor at center (10, 14).
const PLANE_SVGS: Record<AircraftShape, string> = {
  // Widebody: wide fuselage, swept wings, 4 engines
  widebody: `<path d="M9 27 L9 16 L1 19 L1 17 L9 12 L9 3 Q10 0 11 3 L11 12 L19 17 L19 19 L11 16 L11 27 L14 28 L14 28 L6 28 L6 28 Z" fill="COLOR" stroke="rgba(0,0,0,0.6)" stroke-width="0.6"/>
    <rect x="3" y="16.5" width="2" height="1" rx="0.3" fill="rgba(255,255,255,0.3)"/>
    <rect x="15" y="16.5" width="2" height="1" rx="0.3" fill="rgba(255,255,255,0.3)"/>`,

  // Narrowbody: standard jetliner, 2 engines under swept wings
  narrowbody: `<path d="M9 27 L9 16 L2 19 L2 17.5 L9 12 L9 3 Q10 0 11 3 L11 12 L18 17.5 L18 19 L11 16 L11 27 L13 28 L7 28 Z" fill="COLOR" stroke="rgba(0,0,0,0.6)" stroke-width="0.6"/>
    <rect x="5" y="16" width="1.5" height="1" rx="0.3" fill="rgba(255,255,255,0.3)"/>
    <rect x="13.5" y="16" width="1.5" height="1" rx="0.3" fill="rgba(255,255,255,0.3)"/>`,

  // Regional: smaller body, slightly swept wings
  regional: `<path d="M9.2 26 L9.2 16 L3 18.5 L3 17.5 L9.2 13 L9.2 4 Q10 1 10.8 4 L10.8 13 L17 17.5 L17 18.5 L10.8 16 L10.8 26 L12 27 L8 27 Z" fill="COLOR" stroke="rgba(0,0,0,0.6)" stroke-width="0.6"/>`,

  // Cargo: wide body with hump (like 747F)
  cargo: `<path d="M9 27 L9 16 L1 19 L1 17 L9 12 L9 5 Q9 2 10 1 Q11 2 11 5 L11 12 L19 17 L19 19 L11 16 L11 27 L13 28 L7 28 Z" fill="COLOR" stroke="rgba(0,0,0,0.6)" stroke-width="0.6"/>
    <path d="M9 5 Q9.5 3 10 2 Q10.5 3 11 5 L11 7 L9 7 Z" fill="rgba(255,255,255,0.2)"/>`,

  // Helicopter: circle body with rotor cross
  helicopter: `<circle cx="10" cy="14" r="4" fill="COLOR" stroke="rgba(0,0,0,0.6)" stroke-width="0.6"/>
    <line x1="10" y1="4" x2="10" y2="24" stroke="COLOR" stroke-width="1" opacity="0.7"/>
    <line x1="4" y1="14" x2="16" y2="14" stroke="COLOR" stroke-width="1" opacity="0.7"/>
    <circle cx="10" cy="14" r="1.5" fill="rgba(255,255,255,0.3)"/>
    <path d="M9 18 L8 22 L12 22 L11 18" fill="COLOR" stroke="rgba(0,0,0,0.4)" stroke-width="0.4"/>`,

  // Military: delta/swept wing fighter
  military: `<path d="M10 0 L11 10 L19 22 L17 23 L11 18 L11 26 L13 28 L7 28 L9 26 L9 18 L3 23 L1 22 L9 10 Z" fill="COLOR" stroke="rgba(0,0,0,0.6)" stroke-width="0.6"/>`,

  // Light: high-wing Cessna-like
  light: `<path d="M9.5 26 L9.5 17 L4 18.5 L4 17.5 L9.5 14 L9.5 5 Q10 2 10.5 5 L10.5 14 L16 17.5 L16 18.5 L10.5 17 L10.5 26 L12 27 L8 27 Z" fill="COLOR" stroke="rgba(0,0,0,0.6)" stroke-width="0.6"/>`,

  // Default: simple arrow/chevron
  default: `<path d="M10 0 L18 24 L10 20 L2 24 Z" fill="COLOR" stroke="rgba(0,0,0,0.6)" stroke-width="0.6"/>`,
};

export function createPlaneIcon(
  color: string,
  shape: AircraftShape,
  heading: number
): L.DivIcon {
  const svg = PLANE_SVGS[shape].replace(/COLOR/g, color);
  return L.divIcon({
    className: "plane-marker",
    html: `<svg width="20" height="28" viewBox="0 0 20 28" xmlns="http://www.w3.org/2000/svg" style="transform: rotate(${heading}deg)">${svg}</svg>`,
    iconSize: [20, 28],
    iconAnchor: [10, 14],
  });
}

export function createPlaneMarker(
  location: FlightLocation,
  onClick: (id: string) => void
): L.Marker {
  const info = getAircraftTypeInfo("");

  const marker = L.marker([location.lat, location.lng], {
    icon: createPlaneIcon(info.color, info.shape, location.heading),
  });

  marker.bindTooltip(location.id, {
    direction: "top",
    offset: [0, -14],
    className: "plane-tooltip",
  });

  marker.on("click", () => onClick(location.id));

  return marker;
}

export function updatePlaneMarker(
  marker: L.Marker,
  location: FlightLocation,
  metadata: FlightMetadata | null
): void {
  marker.setLatLng([location.lat, location.lng]);

  if (metadata) {
    const info = getAircraftTypeInfo(metadata.aircraftType);
    marker.setIcon(createPlaneIcon(info.color, info.shape, location.heading));
    marker.setTooltipContent(metadata.callsign || location.id);
    return;
  }

  const svg = marker.getElement()?.querySelector("svg");
  if (svg) svg.style.transform = `rotate(${location.heading}deg)`;
}
