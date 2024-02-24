import * as table from "config/tables";

export type User = typeof table.users.$inferInsert;

export type Auth = typeof table.auth.$inferInsert & {
  provider: "github" | "google";
};
