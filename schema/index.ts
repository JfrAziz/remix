import * as table from "config/tables";

/**
 * to make it easier, we create User type
 * from drizzle schema. instead creating new
 * User type.
 */

/**
 * user
 */
export type User = typeof table.users.$inferInsert;

/**
 * authentication for each user
 */
export type Auth = typeof table.auth.$inferInsert & {
  provider: "github" | "google";
};
