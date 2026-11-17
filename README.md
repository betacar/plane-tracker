# PlaneTracker

Real-time flight tracking on a dark-themed map. Displays ADS-B aircraft positions with rotated heading indicators, colored by aircraft type, and detailed flight information on click.

## Features

- Full-screen dark map (OpenStreetMap tiles, inverted)
- Aircraft markers rotated to heading, colored by type (widebody, narrowbody, regional, cargo, helicopter, military, light)
- Real-time position updates via adsb.fi REST API
- Click any plane for details: callsign, registration, aircraft type, altitude, speed, heading, vertical speed, squawk
- 120+ ICAO aircraft type codes mapped to categories and SVG silhouettes
- URL state persistence (pan/zoom survives refresh)
- Stale marker pruning (2-minute threshold)

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). No API key required.

## Data Sources

| Source | Coverage | Auth | Protocol |
|--------|----------|------|----------|
| [adsb.fi](https://adsb.fi) | Global | None | REST (10s polling, ADS-B Exchange v2 format) |

adsb.fi provides unfiltered ADS-B data from community feeders worldwide. The v2 format includes hex ID, callsign, registration, aircraft type, position, altitude, speed, heading, vertical speed, squawk, and integrity fields.

## Deploy

Deployed to Cloudflare Workers with a CORS proxy for the upstream API:

```bash
npm run deploy
```

## Testing

```bash
npm test          # Run all tests
npm run coverage  # Run with coverage (80% threshold)
```

## Tech Stack

- Vite + vanilla TypeScript
- Leaflet + leaflet-rotatedmarker
- Vitest + jsdom (107 tests, 90%+ coverage)
- Cloudflare Workers (production)

## License

MIT. Data: [adsb.fi](https://adsb.fi). Map tiles: [OpenStreetMap](https://www.openstreetmap.org/copyright).
