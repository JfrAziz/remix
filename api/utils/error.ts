import { ENV } from "config/env"
import { Err } from "utils/result"
import { StatusCode } from "hono/utils/http-status"
import { HTTPException } from "hono/http-exception"

const ERROR_MAP: Record<string, StatusCode> = {
  SERVICE_ERROR: 400,
  DATABASE_ERROR: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
}

export const handleResultError = (err: Err) => {
  const code = ERROR_MAP[err.code]

  if (code) throw new HTTPException(code, { message: err.message || "error" })

  /**
   * fallback
   */
  throw new HTTPException(400, {
    message: "unhandled error",
    ...(ENV.NODE_ENV === "production" && { cause: err }),
  })
}
