import { ENV } from "config/env"
import { UserPayload } from "./auth"
import { remix } from "remix-hono/handler"
import { createMiddleware } from "hono/factory"
import { ServerBuild, AppLoadContext } from "@remix-run/node"

/**
 * we pass user as context in renix, so
 * to get user data in loaders or in actions.
 * just call context.user
 */
declare module "@remix-run/node" {
  interface AppLoadContext {
    readonly user?: UserPayload
  }
}

/**
 * Load the dev server build and force reload it
 * @returns An up to date server build
 */
export async function importDevBuild() {
  /**
   * This server is only used to load the dev server build
   */
  const viteDevServer =
    ENV.NODE_ENV === "production"
      ? undefined
      : await import("vite").then((vite) =>
          vite.createServer({
            server: { middlewareMode: true },
          })
        )

  return viteDevServer?.ssrLoadModule(
    "virtual:remix/server-build" + "?t=" + Date.now()
  )
}

export function remixMiddleware() {
  return createMiddleware(async (c, next) => {
    const build = (ENV.NODE_ENV === "production"
      ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        // eslint-disable-next-line import/no-unresolved
        await import("../../build/server/remix.js")
      : await importDevBuild()) as unknown as ServerBuild

    const rmx = remix({
      build: build,
      mode: ENV.NODE_ENV as "production" | "development",
      /**
       * this we pass user data from hono context
       * to remix context. `c.get("user")` has user vaklue
       * becase we user checkAuth middleware.
       */
      getLoadContext() {
        return {
          user: c.get("user"),
        } satisfies AppLoadContext
      },
    })

    return rmx(c as unknown as Parameters<typeof rmx>[0], next)
  })
}
