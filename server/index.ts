import api from "./api";
import { Hono } from "hono";
import { ENV } from "config/env";
import { logger } from "hono/logger";
import { serve } from "@hono/node-server";
import { cache } from "./middleware/cache";
import { serveStatic } from "@hono/node-server/serve-static";
import { remixMiddleware, remixSession } from "./middleware/remix";

const app = new Hono();

app.use(logger());

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
 * mount all api routes and
 * export type for hono client
 */
const apiRoutes = app.route("/api", api);

export type Api = typeof apiRoutes;

/**
 * remix handler
 */
app.use("*", remixSession());

app.use("*", remixMiddleware());

/**
 * Serve assets files from build/client/assets
 */
if (ENV.NODE_ENV === "production") {
  serve({ ...app, port: ENV.PORT, hostname: ENV.HOST }, async (info) => {
    console.log(`🚀 Server started on http://${info.address}:${info.port}`);
  });
}

/**
 * export as default so we can use
 * vite dev server to run it in development
 */
export default app;
