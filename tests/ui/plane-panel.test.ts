import { describe, it, expect } from "vitest";
import { buildPanelContent, showPanel, hidePanel } from "../../src/ui/plane-panel";
import type { FlightData, FlightLocation, FlightMetadata } from "../../src/types";

function makeLocation(overrides: Partial<FlightLocation> = {}): FlightLocation {
  return {
    id: "BAW123",
    lat: 51.47,
    lng: -0.45,
    altitude: 35000,
    groundSpeed: 450,
    heading: 135,
    verticalSpeed: 0,
    timestamp: Date.now(),
    ...overrides,
  };
}

function makeMetadata(overrides: Partial<FlightMetadata> = {}): FlightMetadata {
  return {
    id: "BAW123",
    callsign: "BAW123",
    registration: "G-EUPT",
    aircraftType: "A320",
    airline: "British Airways",
    origin: "LHR",
    destination: "CDG",
    squawk: "4521",
    ...overrides,
  };
}

function makeData(
  locOverrides: Partial<FlightLocation> = {},
  metaOverrides: Partial<FlightMetadata> | null = {}
): FlightData {
  return {
    location: makeLocation(locOverrides),
    metadata: metaOverrides === null ? null : makeMetadata(metaOverrides),
  };
}

describe("buildPanelContent", () => {
  it("renders callsign as title", () => {
    const fragment = buildPanelContent(makeData());
    const title = (fragment as unknown as DocumentFragment)
      .querySelector(".panel-title");
    expect(title?.textContent).toBe("BAW123");
  });

  it('shows "Unknown Flight" when no metadata', () => {
    const fragment = buildPanelContent(makeData({}, null));
    const title = (fragment as unknown as DocumentFragment)
      .querySelector(".panel-title");
    expect(title?.textContent).toBe("Unknown Flight");
  });

  it("includes route row", () => {
    const fragment = buildPanelContent(makeData());
    const container = document.createElement("div");
    container.appendChild(fragment);
    expect(container.textContent).toContain("LHR");
    expect(container.textContent).toContain("CDG");
  });

  it("includes altitude row", () => {
    const fragment = buildPanelContent(makeData({ altitude: 35000 }));
    const container = document.createElement("div");
    container.appendChild(fragment);
    expect(container.textContent).toContain("FL350");
  });

  it("includes speed row", () => {
    const fragment = buildPanelContent(makeData({ groundSpeed: 450 }));
    const container = document.createElement("div");
    container.appendChild(fragment);
    expect(container.textContent).toContain("450.0 kn");
  });

  it("includes close button", () => {
    const fragment = buildPanelContent(makeData());
    const closeBtn = (fragment as unknown as DocumentFragment)
      .querySelector(".panel-close");
    expect(closeBtn).not.toBeNull();
  });
});

describe("showPanel / hidePanel", () => {
  it("adds open class on show", () => {
    const panelEl = document.createElement("div");
    showPanel(panelEl, makeData(), () => {});
    expect(panelEl.classList.contains("open")).toBe(true);
  });

  it("removes open class on hide", () => {
    const panelEl = document.createElement("div");
    panelEl.classList.add("open");
    hidePanel(panelEl);
    expect(panelEl.classList.contains("open")).toBe(false);
  });

  it("calls onClose when close button is clicked", () => {
    const panelEl = document.createElement("div");
    let closed = false;
    showPanel(panelEl, makeData(), () => {
      closed = true;
    });

    const closeBtn = panelEl.querySelector(".panel-close") as HTMLElement;
    closeBtn.click();
    expect(closed).toBe(true);
  });
});
