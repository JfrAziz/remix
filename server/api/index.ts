import { Hono } from "hono";
import auth from "./auth";
import books from "./books";
import authors from "./authors";

const app = new Hono()
  .route("/auth", auth)
  .route("/authors", authors)
  .route("/books", books);

export default app;
