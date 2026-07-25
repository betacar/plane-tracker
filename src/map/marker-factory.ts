import L from "leaflet";
import type { FlightLocation, FlightMetadata } from "../types";
import { getAircraftTypeInfo, type AircraftShape } from "../utils/aircraft-type";

// All SVGs are top-down views pointing UP (north) in a 32x32 viewBox,
// centered at (16, 16). Rotation handles the rest.
const OUTLINE = `stroke="rgba(0,0,0,0.55)" stroke-width="0.5" stroke-linejoin="round"`;

const PLANE_SVGS: Record<AircraftShape, string> = {
  // Widebody: long fuselage, full-span swept wings, engine nacelles
  widebody: `<path d="M16 1.5 Q18.2 3 18.2 6 L18.2 12 L31 19.5 L31 21.8 L18.2 17.8 L18.2 24 L22.5 27.2 L22.5 28.8 L16.7 27.4 L16 30.5 L15.3 27.4 L9.5 28.8 L9.5 27.2 L13.8 24 L13.8 17.8 L1 21.8 L1 19.5 L13.8 12 L13.8 6 Q13.8 3 16 1.5 Z" fill="COLOR" ${OUTLINE}/>
    <rect x="19.6" y="15.6" width="2.1" height="3.4" rx="1" fill="rgba(255,255,255,0.28)"/>
    <rect x="10.3" y="15.6" width="2.1" height="3.4" rx="1" fill="rgba(255,255,255,0.28)"/>`,

  // Narrowbody: standard jetliner, slimmer fuselage, engine nacelles
  narrowbody: `<path d="M16 2 Q17.6 3.4 17.6 6 L17.6 12.5 L30 19 L30 21 L17.6 17.5 L17.6 24.5 L21.5 27.5 L21.5 29 L16.6 27.7 L16 30 L15.4 27.7 L10.5 29 L10.5 27.5 L14.4 24.5 L14.4 17.5 L2 21 L2 19 L14.4 12.5 L14.4 6 Q14.4 3.4 16 2 Z" fill="COLOR" ${OUTLINE}/>
    <rect x="19.2" y="15.9" width="1.9" height="3" rx="0.9" fill="rgba(255,255,255,0.28)"/>
    <rect x="10.9" y="15.9" width="1.9" height="3" rx="0.9" fill="rgba(255,255,255,0.28)"/>`,

  // Regional: shorter span, gentler sweep
  regional: `<path d="M16 2.5 Q17.2 4 17.2 6.5 L17.2 13 L28 17.5 L28 19.5 L17.2 17.2 L17.2 24.8 L20.8 27.3 L20.8 28.8 L16.5 27.6 L16 29.8 L15.5 27.6 L11.2 28.8 L11.2 27.3 L14.8 24.8 L14.8 17.2 L4 19.5 L4 17.5 L14.8 13 L14.8 6.5 Q14.8 4 16 2.5 Z" fill="COLOR" ${OUTLINE}/>`,

  // Cargo: fat fuselage with a 747F-style nose hump
  cargo: `<path d="M16 1.5 Q18.6 3.2 18.6 6.5 L18.6 12 L31 19.5 L31 21.8 L18.6 17.8 L18.6 24 L22.5 27.2 L22.5 28.8 L16.7 27.4 L16 30.5 L15.3 27.4 L9.5 28.8 L9.5 27.2 L13.4 24 L13.4 17.8 L1 21.8 L1 19.5 L13.4 12 L13.4 6.5 Q13.4 3.2 16 1.5 Z" fill="COLOR" ${OUTLINE}/>
    <path d="M14.2 4.5 Q16 3 17.8 4.5 L17.8 9 L14.2 9 Z" fill="rgba(255,255,255,0.22)"/>`,

  // Helicopter: rotor disc + crossed blades over a cabin and tail boom
  helicopter: `<circle cx="16" cy="12.5" r="10" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.18)" stroke-width="0.5"/>
    <line x1="9" y1="5.5" x2="23" y2="19.5" stroke="rgba(255,255,255,0.5)" stroke-width="1.2" stroke-linecap="round"/>
    <line x1="23" y1="5.5" x2="9" y2="19.5" stroke="rgba(255,255,255,0.5)" stroke-width="1.2" stroke-linecap="round"/>
    <path d="M16 5.5 Q19 7.5 19 12 Q19 16.5 16 18 Q13 16.5 13 12 Q13 7.5 16 5.5 Z" fill="COLOR" stroke="rgba(0,0,0,0.55)" stroke-width="0.5"/>
    <path d="M15.4 17.8 L15.2 27.2 L16.8 27.2 L16.6 17.8 Z" fill="COLOR" stroke="rgba(0,0,0,0.4)" stroke-width="0.4"/>
    <line x1="14" y1="27.8" x2="18" y2="27.8" stroke="COLOR" stroke-width="1.2" stroke-linecap="round"/>
    <circle cx="16" cy="12.5" r="1.5" fill="rgba(255,255,255,0.5)"/>`,

  // Military: fighter with rear-set swept delta wings
  military: `<path d="M16 1 L17 5 L17.4 12 L26 20 L26 22.3 L17.4 18.5 L17.4 23.5 L20.5 26.5 L20.5 28.3 L16.6 27 L16 29.5 L15.4 27 L11.5 28.3 L11.5 26.5 L14.6 23.5 L14.6 18.5 L6 22.3 L6 20 L14.6 12 L15 5 Z" fill="COLOR" ${OUTLINE}/>`,

  // Light: straight tapered wings, Cessna-like, with cockpit dot
  light: `<path d="M16 3.5 Q17.2 4.8 17.2 7.5 L17.2 11.2 L28 12.2 L28 14.8 L17.2 14.8 L17.2 23.5 L21.2 26.2 L21.2 28.2 L16.6 27.2 L16 29.5 L15.4 27.2 L10.8 28.2 L10.8 26.2 L14.8 23.5 L14.8 14.8 L4 14.8 L4 12.2 L14.8 11.2 L14.8 7.5 Q14.8 4.8 16 3.5 Z" fill="COLOR" ${OUTLINE}/>
    <ellipse cx="16" cy="8.6" rx="1" ry="1.6" fill="rgba(255,255,255,0.3)"/>`,

  // Default: sleek arrowhead
  default: `<path d="M16 2 L25 28 Q16 22.5 7 28 Z" fill="COLOR" ${OUTLINE}/>`,
};

const ICON_SIZE = 26;

export function createPlaneIcon(
  color: string,
  shape: AircraftShape,
  heading: number
): L.DivIcon {
  const svg = PLANE_SVGS[shape].replace(/COLOR/g, color);
  return L.divIcon({
    className: "plane-marker",
    html: `<svg width="${ICON_SIZE}" height="${ICON_SIZE}" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style="transform: rotate(${heading}deg); filter: drop-shadow(0 1px 2px rgba(0,0,0,0.6))">${svg}</svg>`,
    iconSize: [ICON_SIZE, ICON_SIZE],
    iconAnchor: [ICON_SIZE / 2, ICON_SIZE / 2],
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
    offset: [0, -ICON_SIZE / 2],
    className: "plane-tooltip",
  });

  marker.on("click", () => onClick(location.id));

  return marker;
}

export function updatePlaneMarker(
  marker: L.Marker,
  location: FlightLocation
): void {
  marker.setLatLng([location.lat, location.lng]);

  const svg = marker.getElement()?.querySelector("svg");
  if (svg) svg.style.transform = `rotate(${location.heading}deg)`;
}

export function applyPlaneMetadata(
  marker: L.Marker,
  location: FlightLocation,
  metadata: FlightMetadata
): void {
  const info = getAircraftTypeInfo(metadata.aircraftType);
  marker.setIcon(createPlaneIcon(info.color, info.shape, location.heading));
  marker.setTooltipContent(metadata.callsign || location.id);
}
