import { Api } from "server";
import { hc } from "hono/client";

const client = hc<Api>(import.meta.env.BASE_URL);

export const getUser = async () => {
  const res = await client.api.user.$get();

  return res.json();
};
