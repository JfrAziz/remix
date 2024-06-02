import { Hono } from "hono"
import { getUser, updateUser } from "service/user"
import { HTTPException } from "hono/http-exception"
import { handleResultError } from "api/utils/error"
import { vValidator } from "@hono/valibot-validator"
import { isAuthenticated } from "api/middleware/auth"
import { updateUserSchema } from "schema/validator/user"

export type UserAPI = typeof user

/**
 * Placing the basePath here instead of in index.ts has
 * specific purpose. currently, hc (hono/client) use
 * types generates from hono routes, when our route
 * became bigger and bigger, typescript cannot handle it
 * because it's too deep and too big. so I separate each API
 * endpoint to different file with basePath, also export the
 * type to use directly in hc instead singgle bih API types.
 *
 * @ref `app/rpc/user.ts`
 */
export const user = new Hono()
  .basePath("/api/user")
  .use(isAuthenticated())
  .get("/", async (c) => {
    const payload = c.get("user")

    if (!payload) throw new HTTPException(401, { message: "unauthorized" })

    const user = await getUser(payload.id)

    if (user.error) return handleResultError(user.error)

    return c.json(user.value)
  })
  .post("/", vValidator("json", updateUserSchema), async (c) => {
    const user = c.get("user")

    const updated = await updateUser(user!.id, c.req.valid("json"))

    if (updated.error) return handleResultError(updated.error)

    return c.json(updated.value)
  })
