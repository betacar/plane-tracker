import { getAircraftTypeInfo } from "../utils/aircraft-type";
import { getSquawkLabel } from "../utils/squawk";

export function formatAltitude(feet: number): string {
  if (feet >= 18000) {
    const fl = Math.round(feet / 100);
    return `FL${fl}`;
  }
  return `${feet.toLocaleString("en-US", { maximumFractionDigits: 0 })} ft`;
}

export function formatSpeed(knots: number): string {
  return `${knots.toFixed(1)} kn`;
}

export function formatHeading(degrees: number): string {
  const dirs = [
    "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
    "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW",
  ];
  const index = Math.round(degrees / 22.5) % 16;
  return `${degrees.toFixed(1)}\u00B0 (${dirs[index]})`;
}

export function formatVerticalSpeed(fpm: number): string {
  const rounded = Math.round(fpm);
  const formatted = Math.abs(rounded).toLocaleString("en-US");
  if (rounded > 0) return `+${formatted} ft/min`;
  if (rounded < 0) return `-${formatted} ft/min`;
  return `0 ft/min`;
}

export function formatSquawk(code: string): string {
  if (code === "") return "N/A";
  const label = getSquawkLabel(code);
  if (label !== code) return `${code} (${label})`;
  return code;
}

export function formatRoute(origin: string, destination: string): string {
  if (!origin && !destination) return "N/A";
  const from = origin || "?";
  const to = destination || "?";
  return `${from} \u2192 ${to}`;
}

export function formatAircraftType(code: string): string {
  return getAircraftTypeInfo(code).label;
}
