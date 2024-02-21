import { db } from "config/db";
import { and, eq } from "drizzle-orm";
import { Auth, table } from "config/schema";
import { Err, Ok, Result } from "utils/result";
import { DatabaseError, NotFoundError } from "utils/error";

/**
 * save auth settings
 *
 * @param project
 * @returns
 */
export const updateAuthData = async (
  auth: Auth
): Promise<Result<Auth, DatabaseError>> => {
  try {
    const result = await db
      .insert(table.auth)
      .values({ ...auth, updated_at: new Date() })
      .onConflictDoUpdate({
        target: [table.auth.id],
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
    where: and(
      eq(table.auth.provider, provider),
      eq(table.auth.provider_id, provider_id)
    ),
  });

  return result ? Ok(result as Auth) : Err("NOT_FOUND");
};
