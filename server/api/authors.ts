import { Hono } from "hono";

const app = new Hono()
  .get("/", (c) => c.json("list authors of books"))
  .post("/", (c) => c.json("create an author", 201))
  .get("/:id", (c) => c.json(`get ${c.req.param("id")}`));

export default app;
