import { ENV } from "config/env";
import { User } from "config/schema";
import { getCookie, setCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { sign, verify } from "hono/jwt";
import { handleResultError } from "server/utils/error";
import { Err, Ok, Result } from "utils/result";

declare module "hono" {
  interface ContextVariableMap {
    user?: UserPayload;
  }
}

const AUTH_COOKIE_KEY = "auth";

export interface UserPayload {
  id: string;
  user_name: string;
  full_name: string;
}

const createUserJWTPayload = (user: User): UserPayload => ({
  id: user.id,
  full_name: user.full_name,
  user_name: user.user_name,
});

const encodeToken = async (
  user: User
): Promise<Result<string, Err<"UNAUTHORIZED">>> => {
  try {
    return Ok(await sign(createUserJWTPayload(user), ENV.SECRET));
  } catch (error) {
    return Err("UNAUTHORIZED");
  }
};

const decodeToken = async (
  token: string
): Promise<Result<UserPayload | null>> => {
  try {
    return Ok(await verify(token, ENV.SECRET));
  } catch (error) {
    return Ok(null);
  }
};

/**
 * handle JWT creation from user data
 *
 * @param user
 * @returns
 */
export const setAuth = (user: User) =>
  createMiddleware(async (c) => {
    const token = await encodeToken(user);

    if (token.error) return handleResultError(token.error);

    setCookie(c, AUTH_COOKIE_KEY, token.value);

    return c.redirect("/");
  });

/**
 * check & verify JWT token in cookies
 *
 * @returns
 */
export const checkAuth = () =>
  createMiddleware(async (c, next) => {
    const token = getCookie(c, AUTH_COOKIE_KEY);

    if (token) {
      const payload = await decodeToken(token);

      c.set("user", payload.value);
    }

    return next();
  });

/**
 * check if user is authenticated, must be called after
 * checkAuth
 *
 * @returns
 */
export const isAuthenticated = () =>
  createMiddleware(async (c, next) => {
    const payload = c.get("user");

    if (!payload) throw new HTTPException(401, { message: "unauthorized" });

    return next();
  });

/**
 * must not be authenticated
 *
 * @returns
 */
export const isNotAuthenticated = () =>
  createMiddleware(async (c, next) => {
    const payload = c.get("user");

    if (!payload) return next();

    return c.redirect("/");
  });
