import { Auth } from "schema";
import { db } from "config/db";
import { auth } from "config/tables";
import { and, eq } from "drizzle-orm";
import { Err, Ok, Result } from "utils/result";
import { DatabaseError, NotFoundError } from "utils/error";

/**
 * save auth settings
 *
 * @param project
 * @returns
 */
export const updateAuthData = async (
  data: Auth
): Promise<Result<Auth, DatabaseError>> => {
  try {
    const result = await db
      .insert(auth)
      .values({ ...data, updated_at: new Date() })
      .onConflictDoUpdate({
        target: [auth.id],
        set: { updated_at: new Date() },
      })
      .returning();

    return Ok(result[0] as Auth);
  } catch (error) {
    return Err("DATABASE_ERROR", "failed to save the authentication data");
  }
};

/**
 * find auth data from specific provider for specific account
 *
 * @param provider
 * @param provider_id
 * @returns
 */
export const findByProviderAndId = async (
  provider: "github" | "google",
  provider_id: string
): Promise<Result<Auth, NotFoundError>> => {
  const result = await db.query.auth.findFirst({
    where: and(eq(auth.provider, provider), eq(auth.provider_id, provider_id)),
  });

  return result ? Ok(result as Auth) : Err("NOT_FOUND");
};
