import { remix } from "remix-hono/handler";
import { session } from "remix-hono/session";
import { Env, MiddlewareHandler } from "hono";
import { createMiddleware } from "hono/factory";
import {
  ServerBuild,
  AppLoadContext,
  createCookieSessionStorage,
} from "@remix-run/node";

/**
 * Declare our loaders and actions context type
 */
declare module "@remix-run/node" {
  interface AppLoadContext {
    /**
     * The app version from the build assets
     */
    readonly appVersion: string;
  }
}

const mode =
  process.env.NODE_ENV === "test" ? "development" : process.env.NODE_ENV;

const isProductionMode = mode === "production";

/**
 * Load the dev server build and force reload it
 * @returns An up to date server build
 */
export async function importDevBuild() {
  /**
   * This server is only used to load the dev server build
   */
  const viteDevServer =
    process.env.NODE_ENV === "production"
      ? undefined
      : await import("vite").then((vite) =>
          vite.createServer({
            server: { middlewareMode: true },
          })
        );

  return viteDevServer?.ssrLoadModule(
    "virtual:remix/server-build" + "?t=" + Date.now()
  );
}

export function remixMiddleware() {
  return createMiddleware(async (c, next) => {
    const build = (isProductionMode
      ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        // eslint-disable-next-line import/no-unresolved
        await import("../../build/server/remix.js")
      : await importDevBuild()) as unknown as ServerBuild;

    

    const rmx = remix({
      build,
      mode,
      getLoadContext() {
        return {
          appVersion: isProductionMode ? build.assets.version : "dev",
        } satisfies AppLoadContext;
      },
    });

    return rmx(c as unknown as Parameters<typeof rmx>[0], next);
  });
}

export function remixSession() {
  return session({
    autoCommit: true,
    createSessionStorage() {
      if (!process.env.SESSION_SECRET)
        throw new Error("SESSION_SECRET is not defined");

      const sessionStorage = createCookieSessionStorage({
        cookie: {
          name: "session",
          httpOnly: true,
          path: "/",
          sameSite: "lax",
          secrets: [process.env.SESSION_SECRET],
          secure: process.env.NODE_ENV === "production",
        },
      });

      return {
        ...sessionStorage,
        // If a user doesn't come back to the app within 30 days, their session will be deleted.
        async commitSession(session) {
          return sessionStorage.commitSession(session, {
            maxAge: 60 * 60 * 24 * 30, // 30 days
          });
        },
      };
    },
  }) as unknown as MiddlewareHandler<Env, "*", object>;
}
