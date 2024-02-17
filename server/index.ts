import api from "./api";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { serve } from "@hono/node-server";
import { cache } from "./middleware/cache";
import { serveStatic } from "@hono/node-server/serve-static";
import { remixMiddleware, remixSession } from "./middleware/remix";

const app = new Hono().use(logger()).route("/api", api);

app.use(
  "/assets/*",
  cache(60 * 60 * 24 * 365), // 1 year
  serveStatic({ root: "./build/client" })
);

/**
 * do not cache for API routes
 */
app.use("/api/*", cache(0));

/**
 * Serve public files
 */
app.use("*", cache(60 * 60), serveStatic({ root: "./build/client" })); // 1 hour

/**
 * remix handler
 */
app.use("*", remixSession());

app.use("*", remixMiddleware());

export type Server = typeof app;

export default app;

const mode =
  process.env.NODE_ENV === "test" ? "development" : process.env.NODE_ENV;

/**
 * Serve assets files from build/client/assets
 */
if (mode === "production") {
  serve(
    {
      ...app,
      port: Number(process.env.PORT) || 3000,
    },
    async (info) => console.log(`🚀 Server started on port ${info.port}`)
  );
}
