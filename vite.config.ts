import { defineConfig } from "vitest/config";

export default defineConfig({
  server: {
    proxy: {
      "/api/airplanes-live/": {
        target: "https://api.airplanes.live/",
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api\/airplanes-live\//, ""),
      },
    },
  },
  test: {
    environment: "jsdom",
    coverage: {
      provider: "istanbul",
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
      include: ["src/**/*.ts"],
      exclude: ["src/main.ts", "src/map/map-init.ts"],
    },
  },
});
