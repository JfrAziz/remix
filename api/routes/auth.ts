import { Hono } from "hono";
import { ENV } from "config/env";
import { getGithubEmail, handleGithubAuth } from "service/auth";
import { HTTPException } from "hono/http-exception";
import { handleResultError } from "api/utils/error";
import { githubAuth } from "@hono/oauth-providers/github";
import { setAuth, removeAuth, isNotAuthenticated } from "api/middleware/auth";

export type AuthAPI = typeof auth;

export const auth = new Hono()
  .basePath("/api/auth")
  .get("/logout", removeAuth())
  .use(
    "/github",
    isNotAuthenticated(),
    githubAuth({
      /**
       * we need users data and their's email
       */
      oauthApp: true,
      scope: ["read:user", "user:email"],
      client_id: ENV.GITHUB_CLIENT_ID,
      client_secret: ENV.GITHUB_CLIENT_SECRET,
    }),
    async (c, next) => {
      const user = c.get("user-github");

      if (!user) throw new HTTPException(401, { message: "failed to login" });

      if (!user.email)
        user.email = (await getGithubEmail(c.get("token")!.token)).value;

      const result = await handleGithubAuth(user as Required<typeof user>);

      if (result.error) return handleResultError(result.error);

      return setAuth(result.value)(c, next);
    }
  );
