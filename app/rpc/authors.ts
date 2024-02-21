import { Api } from "server";
import { hc } from "hono/client";

const client = hc<Api>(import.meta.env.BASE_URL);

export const getAuthors = async (id: string) => {
  const res = await client.api.user.$get({
    param: { id: id },
  });

  return res;
};
