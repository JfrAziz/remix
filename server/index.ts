import api from "./api";
import { Hono } from "hono";
import { ENV } from "config/env";
import { logger } from "hono/logger";
import { serve } from "@hono/node-server";
import { cache } from "./middleware/cache";
import { checkAuth } from "./middleware/auth";
import { remixMiddleware } from "./middleware/remix";
import { serveStatic } from "@hono/node-server/serve-static";

const app = new Hono();

app.use(logger());

app.use(
  "/assets/*",
  serveStatic({ root: "./build/client" })
);

app.use(checkAuth());

/**
 * do not cache for API routes
 */
app.use("/api/*", cache(0));

/**
 * Serve public files
 */
app.use("*", serveStatic({ root: "./build/client" })); // 1 hour

/**
 * mount all api routes and
 * export type for hono client
 */
const apiRoutes = app.route("/api", api);

export type Api = typeof apiRoutes;

/**
 * remix handler
 */
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
