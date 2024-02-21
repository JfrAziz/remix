import { Hono } from "hono";
import { ENV } from "config/env";
import { handleGithubAuth } from "service/auth";
import { HTTPException } from "hono/http-exception";
import { handleResultError } from "server/utils/error";
import { githubAuth } from "@hono/oauth-providers/github";
import { isNotAuthenticated, setAuth } from "server/middleware/auth";

const app = new Hono().use(isNotAuthenticated()).use(
  "/github",
  githubAuth({
    scope: ["read:user"],
    client_id: ENV.GITHUB_CLIENT_ID,
    client_secret: ENV.GITHUB_CLIENT_SECRET,
  }),
  async (c, next) => {
    const user = c.get("user-github");

    if (!user) throw new HTTPException(401, { message: "failed to login" });

    const result = await handleGithubAuth(user as Required<typeof user>);

    if (result.error) return handleResultError(result.error);

    return setAuth(result.value)(c, next);
  }
);

export default app;
