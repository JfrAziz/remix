import { Hono } from "hono";
import { updateUserSchema } from "validator/user";
import { getUser, updateUser } from "service/user";
import { HTTPException } from "hono/http-exception";
import { vValidator } from "@hono/valibot-validator";
import { handleResultError } from "server/utils/error";
import { isAuthenticated } from "server/middleware/auth";

export type UserAPI = typeof user;

export const user = new Hono()
  .basePath("/api/user")
  .use(isAuthenticated())
  .get("/", async (c) => {
    const payload = c.get("user");

    if (!payload) throw new HTTPException(401, { message: "unauthorized" });

    const user = await getUser(payload.id);

    if (user.error) return handleResultError(user.error);

    return c.json(user.value);
  })
  .post("/", vValidator("json", updateUserSchema), async (c) => {
    const user = c.get("user");

    const updated = await updateUser(user!.id, c.req.valid("json"));

    if (updated.error) return handleResultError(updated.error);

    return c.json(updated.value);
  });
