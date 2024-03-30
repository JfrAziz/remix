import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import { vitePlugin as remix } from "@remix-run/dev";

export default defineConfig({
  server: {
    hmr: {
      port: 3555,
    },
  },
  test: {
    reporters: ["verbose", "default"],
    coverage: {
      exclude: ["build"],
      provider: "istanbul",
      reporter: ["text", "html", "json-summary", "json", "cobertura"],
    },
  },
  plugins: [remix({ serverBuildFile: "remix.js" }), tsconfigPaths()],
});
