import { describe, it, expect, vi } from "vitest";
import L from "leaflet";
import {
  createPlaneIcon,
  createPlaneMarker,
  updatePlaneMarker,
} from "../../src/map/marker-factory";
import type { FlightLocation } from "../../src/types";

function makeLocation(overrides: Partial<FlightLocation> = {}): FlightLocation {
  return {
    id: "BAW123",
    lat: 51.47,
    lng: -0.45,
    altitude: 35000,
    groundSpeed: 450,
    heading: 90,
    verticalSpeed: 0,
    timestamp: Date.now(),
    ...overrides,
  };
}

// Real leaflet map so markers get a real DOM icon element (needed to
// exercise the CSS-rotation update path, which reads marker.getElement()).
function addToRealMap(marker: L.Marker): void {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const map = L.map(container, { center: [0, 0], zoom: 2 });
  marker.addTo(map);
}

describe("createPlaneIcon", () => {
  it("creates an icon with the given color", () => {
    const icon = createPlaneIcon("#3498db", "widebody", 0);
    expect(icon.options.className).toBe("plane-marker");
    expect(icon.options.iconSize).toEqual([20, 28]);
    expect(icon.options.iconAnchor).toEqual([10, 14]);
  });

  it("embeds color into SVG", () => {
    const icon = createPlaneIcon("#2ecc71", "narrowbody", 0);
    const html = (icon.options as { html: string }).html;
    expect(html).toContain("#2ecc71");
  });

  it("embeds heading rotation into SVG", () => {
    const icon = createPlaneIcon("#95a5a6", "default", 135);
    const html = (icon.options as { html: string }).html;
    expect(html).toContain("rotate(135deg)");
  });
});

describe("createPlaneMarker", () => {
  it("places the marker at the flight's coordinates", () => {
    const marker = createPlaneMarker(makeLocation({ lat: 12.3, lng: -45.6 }), vi.fn());
    expect(marker.getLatLng()).toEqual(L.latLng(12.3, -45.6));
  });

  it("invokes onClick with the flight id when clicked", () => {
    const onClick = vi.fn();
    const marker = createPlaneMarker(makeLocation({ id: "RYR456" }), onClick);
    marker.fire("click");
    expect(onClick).toHaveBeenCalledWith("RYR456");
  });
});

describe("updatePlaneMarker", () => {
  it("swaps icon and tooltip content when metadata arrives", () => {
    const marker = createPlaneMarker(makeLocation({ id: "BAW123" }), vi.fn());
    updatePlaneMarker(marker, makeLocation({ id: "BAW123" }), {
      id: "BAW123",
      callsign: "SPEEDBIRD1",
      registration: "G-EUPT",
      aircraftType: "A320",
      squawk: "1200",
    });
    expect(marker.getTooltip()?.getContent()).toBe("SPEEDBIRD1");
  });

  it("falls back to the flight id as tooltip content when callsign is blank", () => {
    const marker = createPlaneMarker(makeLocation({ id: "BAW123" }), vi.fn());
    updatePlaneMarker(marker, makeLocation({ id: "BAW123" }), {
      id: "BAW123",
      callsign: "",
      registration: "",
      aircraftType: "",
      squawk: "",
    });
    expect(marker.getTooltip()?.getContent()).toBe("BAW123");
  });

  it("rotates the existing SVG in place via CSS when metadata is unavailable", () => {
    const marker = createPlaneMarker(makeLocation({ heading: 10 }), vi.fn());
    addToRealMap(marker);

    updatePlaneMarker(marker, makeLocation({ heading: 250 }), null);

    const svg = marker.getElement()?.querySelector("svg") as SVGElement;
    expect(svg.style.transform).toBe("rotate(250deg)");
  });

  it("updates position regardless of metadata presence", () => {
    const marker = createPlaneMarker(makeLocation(), vi.fn());
    updatePlaneMarker(marker, makeLocation({ lat: 1, lng: 2 }), null);
    expect(marker.getLatLng()).toEqual(L.latLng(1, 2));
  });
});
