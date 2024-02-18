import * as table from "./table";
import { Type } from "@sinclair/typebox";
import { createInsertSchema } from "drizzle-typebox";

/**
 * user validation schema, for user creation and user update
 */
export const user = createInsertSchema(table.users);

/**
 * this schema will be user for data validation, data creation, etc
 */
export const auth = createInsertSchema(table.auth, {
  provider: Type.Union([Type.Literal("github"), Type.Literal("google")]),
});
