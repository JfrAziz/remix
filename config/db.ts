import { ENV } from "./env";
import postgres from "postgres";
import * as table from "./tables";
import type { Config } from "drizzle-kit";
import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";

declare global {
  // eslint-disable-next-line no-var
  var __db__: PostgresJsDatabase<typeof table>;
}

let db: PostgresJsDatabase<typeof table>;

/**
 * this is needed because in development we don't want to restart
 * the server with every change, but we want to make sure we don't
 * create a new connection to the DB with every change either.
 * in production, we'll have a single connection to the DB.
 */
if (ENV.NODE_ENV === "production") {
  db = drizzle(postgres(process.env.DATABASE_URL!), {
    schema: table,
    logger: ENV.DATABASE_DEBUG,
  });
} else {
  if (!global.__db__) {
    global.__db__ = drizzle(postgres(process.env.DATABASE_URL!), {
      schema: table,
      logger: ENV.DATABASE_DEBUG,
    });
  }

  db = global.__db__;
}

const config = {
  driver: "pg",
  out: "./migrations",
  schema: "./config/schema/table.ts",
  dbCredentials: { connectionString: ENV.DATABASE_URL },
} satisfies Config;

export { db };

export default config;
