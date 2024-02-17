import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { unstable_vitePlugin as remix } from "@remix-run/dev";
import devServer, { defaultOptions } from "@hono/vite-dev-server";

export default defineConfig({
  plugins: [
    remix({
      serverBuildFile: "remix.js",
    }),
    tsconfigPaths(),
    devServer({
      injectClientScript: false,
      entry: "./server/index.ts", // The file path of your server.
      exclude: [/^\/(app)\/.+/, ...defaultOptions.exclude],
    }),
  ],
});
