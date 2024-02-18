import { Api } from "server";
import { hc } from "hono/client";

const client = hc<Api>("http://localhost:3000/");

export const getAuthors = async (id: string) => {
  const res = await client.api.authors[":id"].$get({
    param: { id: id },
  });

  return res;
};
