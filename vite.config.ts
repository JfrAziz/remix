import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"
import { vitePlugin as remix } from "@remix-run/dev"
import devServer, { defaultOptions } from "@hono/vite-dev-server"

export default defineConfig({
  server: {
    hmr: {
      port: 3555,
    },
  },
  plugins: [
    remix({ serverBuildFile: "remix.js" }),
    tsconfigPaths(),
    devServer({
      injectClientScript: false,
      entry: "./api/index.ts", // The file path of your server.
      exclude: [/^\/(app)\/.+/, ...defaultOptions.exclude],
    }),
  ],
})
