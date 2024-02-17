import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => c.json("list authors of books" + Math.random()));
app.post("/", (c) => c.json("create an author", 201));
app.get("/:id", (c) => c.json(`get ${c.req.param("id")}`));

export default app;
