import { Hono } from "hono";
import { getUser } from "service/user";
import { HTTPException } from "hono/http-exception";
import { isAuthenticated } from "server/middleware/auth";
import { handleResultError } from "server/utils/error";

const app = new Hono().use(isAuthenticated()).get("/", async (c) => {
  const payload = c.get("user");

  if (!payload) throw new HTTPException(401, { message: "unauthorized" });

  const user = await getUser(payload.id);

  if (user.error) return handleResultError(user.error);

  return c.json(user.value);
});

export default app;
