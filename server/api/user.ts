import { Hono } from "hono";
import { getUser } from "service/user";
import { updateUserSchema } from "validator/user";
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
  .post("/", vValidator("json", updateUserSchema), (c) => {
    const user = c.get("user");

    const result = c.req.valid("json");

    return c.json({ ...user, ...result });
  });
