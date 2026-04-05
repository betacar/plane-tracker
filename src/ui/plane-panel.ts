import type { FlightData } from "../types";
import {
  formatAltitude,
  formatSpeed,
  formatHeading,
  formatVerticalSpeed,
  formatSquawk,
  formatRoute,
  formatAircraftType,
} from "./panel-formatter";

function createRow(label: string, value: string): HTMLDivElement {
  const row = document.createElement("div");
  row.className = "panel-row";

  const labelEl = document.createElement("span");
  labelEl.className = "panel-label";
  labelEl.textContent = label;

  const valueEl = document.createElement("span");
  valueEl.className = "panel-value";
  valueEl.textContent = value;

  row.appendChild(labelEl);
  row.appendChild(valueEl);
  return row;
}

function createDivider(): HTMLDivElement {
  const div = document.createElement("div");
  div.className = "panel-divider";
  return div;
}

export function buildPanelContent(data: FlightData): DocumentFragment {
  const { location, metadata } = data;
  const title = metadata?.callsign || "Unknown Flight";

  const fragment = document.createDocumentFragment();

  // Header
  const header = document.createElement("div");
  header.className = "panel-header";

  const titleEl = document.createElement("h2");
  titleEl.className = "panel-title";
  titleEl.textContent = title;

  const closeBtn = document.createElement("button");
  closeBtn.className = "panel-close";
  closeBtn.setAttribute("aria-label", "Close");
  closeBtn.textContent = "\u00D7";

  header.appendChild(titleEl);
  header.appendChild(closeBtn);
  fragment.appendChild(header);

  // Body
  const body = document.createElement("div");
  body.className = "panel-body";

  // Identity section
  if (metadata) {
    body.appendChild(createRow("Registration", metadata.registration || "N/A"));
    body.appendChild(
      createRow("Aircraft", formatAircraftType(metadata.aircraftType))
    );
    body.appendChild(createRow("Airline", metadata.airline || "N/A"));
  }

  body.appendChild(createDivider());

  // Route section
  if (metadata) {
    body.appendChild(
      createRow("Route", formatRoute(metadata.origin, metadata.destination))
    );
  }

  body.appendChild(createDivider());

  // Position section
  body.appendChild(createRow("Altitude", formatAltitude(location.altitude)));
  body.appendChild(createRow("Speed", formatSpeed(location.groundSpeed)));
  body.appendChild(createRow("Heading", formatHeading(location.heading)));
  body.appendChild(
    createRow("Vertical Speed", formatVerticalSpeed(location.verticalSpeed))
  );

  body.appendChild(createDivider());

  // Status section
  if (metadata) {
    body.appendChild(createRow("Squawk", formatSquawk(metadata.squawk)));
  }

  fragment.appendChild(body);
  return fragment;
}

export function showPanel(
  panelEl: HTMLElement,
  data: FlightData,
  onClose: () => void
): void {
  panelEl.replaceChildren(buildPanelContent(data));
  panelEl.classList.add("open");

  const closeBtn = panelEl.querySelector(".panel-close");
  closeBtn?.addEventListener("click", () => {
    hidePanel(panelEl);
    onClose();
  });
}

export function hidePanel(panelEl: HTMLElement): void {
  panelEl.classList.remove("open");
}
