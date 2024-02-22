import * as table from "./table";
import { picklist } from "valibot";
import { createInsertSchema } from "drizzle-valibot";

/**
 * user validation schema, for user creation and user update
 */
export const user = createInsertSchema(table.users);

/**
 * this schema will be user for data validation, data creation, etc
 */
export const auth = createInsertSchema(table.auth, {
  provider: picklist(["github", "google"] as const),
});
