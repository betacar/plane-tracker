import "./styles/main.css";
import { initMap } from "./map/map-init";
import { createMarkerManager } from "./map/marker-manager";
import { createAdsbFiSource } from "./api/adsb-fi";
import { showPanel, hidePanel } from "./ui/plane-panel";
import { STALE_THRESHOLD_MS } from "./config";
import type { BoundingBox } from "./types";

const map = initMap("map");
const panelEl = document.getElementById("plane-panel")!;
const countEl = document.querySelector("#plane-count span")!;
const loadingEl = document.getElementById("loading")!;

let firstDataReceived = false;

function updateCount(count: number): void {
  countEl.textContent = String(count);
}

function getMapBounds(): BoundingBox {
  const b = map.getBounds();
  return {
    south: b.getSouth(),
    west: b.getWest(),
    north: b.getNorth(),
    east: b.getEast(),
  };
}

function handlePlaneClick(id: string): void {
  const data = markerManager.getFlightData(id);
  if (!data) return;

  showPanel(panelEl, data, () => {
    hidePanel(panelEl);
  });
}

const markerManager = createMarkerManager(map, handlePlaneClick);

const source = createAdsbFiSource(
  (location) => {
    if (!firstDataReceived) {
      firstDataReceived = true;
      loadingEl.classList.add("hidden");
    }
    markerManager.updatePosition(location);
    updateCount(markerManager.getFlightCount());
  },
  (metadata) => {
    markerManager.updateMetadata(metadata);
  }
);

// Close panel when clicking the map
map.on("click", () => {
  hidePanel(panelEl);
});

// Update data source bounds on pan/zoom (debounced)
let boundsTimer: ReturnType<typeof setTimeout> | null = null;
map.on("moveend", () => {
  if (boundsTimer !== null) clearTimeout(boundsTimer);
  boundsTimer = setTimeout(() => {
    source.updateBounds(getMapBounds());
  }, 1000);
});

// Prune stale markers periodically
setInterval(() => {
  markerManager.pruneStale();
  updateCount(markerManager.getFlightCount());
}, STALE_THRESHOLD_MS);

// Leaflet needs the container to be sized before getBounds() works correctly.
// Use requestAnimationFrame to ensure CSS has been applied.
requestAnimationFrame(() => {
  map.invalidateSize();
  source.start(getMapBounds());
});
