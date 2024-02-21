import { Hono } from "hono";
import { ENV } from "config/env";
import { setSignedCookie } from "hono/cookie";
import { handleGithubAuth } from "service/auth";
import { HTTPException } from "hono/http-exception";
import { handleResultError } from "server/utils/error";
import { githubAuth } from "@hono/oauth-providers/github";

const app = new Hono().use(
  "/github",
  githubAuth({
    scope: ["read:user"],
    client_id: ENV.GITHUB_CLIENT_ID,
    client_secret: ENV.GITHUB_CLIENT_SECRET,
  }),
  async (c) => {
    const user = c.get("user-github");

    if (!user) throw new HTTPException(401, { message: "failed to login" });

    const result = await handleGithubAuth(user as Required<typeof user>);

    console.log(result.error)

    if (result.error) return handleResultError(result.error);

    setSignedCookie(c, "auth", ENV.SECRET, result.value.user_name);

    return c.json(result.value);
  }
);

export default app;
