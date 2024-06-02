import { createId } from "utils/uid"
import { relations } from "drizzle-orm"
import { text, boolean, pgTable, varchar, timestamp } from "drizzle-orm/pg-core"

/**
 * authentication table schema fro postgresql databases
 * with drizzle
 */
export const auth = pgTable("auth", {
  id: varchar("id", { length: 32 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => createId()),

  provider: text("provider").notNull(),

  provider_id: text("provider_id").notNull(),

  user_id: varchar("user_id", { length: 32 })
    .notNull()
    .references(() => users.id, { onDelete: "no action" }),

  verified: boolean("verified").default(false),

  created_at: timestamp("created_at").defaultNow(),

  updated_at: timestamp("updated_at").defaultNow(),
})

/**
 * relationship between auth and users, many to one
 */
export const auth_relations = relations(auth, ({ one }) => ({
  user: one(users, {
    fields: [auth.user_id],
    references: [users.id],
  }),
}))

/**
 * users table schema for postgresql database with drizzle
 */
export const users = pgTable("users", {
  id: varchar("id", { length: 32 }).unique().notNull().primaryKey(),

  user_name: text("user_name").notNull().unique(),

  full_name: text("full_name").notNull(),

  job: text("job"),

  bio: text("bio"),

  email: text("email"),

  company: text("company"),

  location: text("location"),

  avatar_url: text("avatar_url"),

  created_at: timestamp("created_at").defaultNow(),

  updated_at: timestamp("updated_at").defaultNow(),
})
