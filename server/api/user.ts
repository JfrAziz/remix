import { Hono } from "hono";
import { isAuthenticated } from "server/middleware/auth";

const app = new Hono()
  .use(isAuthenticated())
  .get("/", async (c) => {
    const payload = c.get("user");

    return c.json({ value: payload });
  })
  .get("/404", isAuthenticated(), (c) => {
    const payload = c.get("user");

    return c.json(payload);
  });

export default app;
