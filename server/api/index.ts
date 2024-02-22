import auth from "./auth";
import user from "./user";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

const app = new Hono()
  .route("/auth", auth)
  .route("/user", user)
  .onError((err, c) => {
    if (err instanceof HTTPException)
      return c.json({ code: err.status, message: err.message }, err.status);

    return c.json({ code: 500, message: "something wrong" }, 500);
  });

export default app;
