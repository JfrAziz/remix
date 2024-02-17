import { Hono } from "hono";
import books from "./books";
import authors from "./authors";

const app = new Hono().route("/authors", authors).route("/books", books);

export default app;
