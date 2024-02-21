import { db } from "config/db";
import { eq } from "drizzle-orm";
import { User, table } from "config/schema";
import { Err, Ok, Result } from "utils/result";
import { DatabaseError, NotFoundError } from "utils/error";

/**
 * insert or update the users data
 */
export const saveOrUpdateUser = async (
  user: User
): Promise<Result<User, DatabaseError>> => {
  try {
    const saved = { ...user, updated_at: new Date() };

    const result = await db
      .insert(table.users)
      .values(saved)
      .onConflictDoUpdate({
        set: saved,
        where: eq(table.users.id, user.id),
        target: [table.users.id],
      })
      .returning({
        id: table.users.id,
        full_name: table.users.full_name,
        user_name: table.users.user_name,
        created_at: table.users.created_at,
        updated_at: table.users.updated_at,
      });

    return Ok(result[0]);
  } catch (error) {
    console.log(error)
    return Err("DATABASE_ERROR");
  }
};

/**
 * check username already taken or not
 */
export const checkUserName = async (
  username: string
): Promise<Result<boolean>> => {
  const result = await db.query.users.findFirst({
    columns: { id: true },
    where: eq(table.users.user_name, username),
  });

  return result ? Ok(true) : Ok(false);
};

/**
 * find by user,
 */
export const findUserById = async (
  id: string
): Promise<Result<User, NotFoundError>> => {
  const result = await db.query.users.findFirst({
    where: eq(table.users.id, id),
  });

  return result ? Ok(result as User) : Err("NOT_FOUND");
};
