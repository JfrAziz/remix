import { hc } from "hono/client";
import { type UserAPI } from "server/api/user";
import { type UpdateUserSchema } from "validator/user";

const client = hc<UserAPI>(import.meta.env.BASE_URL);

export const getUser = async () => {
  const res = await client.api.user.$get();

  return res.json();
};

export const updateUser = async (user: UpdateUserSchema) => {
  const res = await client.api.user.$post({ json: user });

  return res.json();
};
