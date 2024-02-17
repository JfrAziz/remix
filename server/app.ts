import api from "./api";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { cache } from "./middleware/cache";
import { serveStatic } from "@hono/node-server/serve-static";
import { remixMiddleware, remixSession } from "./middleware/remix";

const app = new Hono();

/**
 * Serve assets files from build/client/assets
 */
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
 * Add logger middleware
 */
app.use("*", logger( ));

app.route("/api", api);

/**
 * remix handler
 */
app.use("*", remixSession());
app.use("*", remixMiddleware());

export default app;
