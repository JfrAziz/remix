import { ENV } from './env';
import postgres from 'postgres';
import { table } from "./schema";
import type { Config } from "drizzle-kit";
import { drizzle } from "drizzle-orm/postgres-js";

const client = postgres(ENV.DATABASE_URL);

export const db = drizzle(client, { schema: table, logger: ENV.DATABASE_DEBUG });

export default {
  driver: "pg",
  out: "./migrations",
  schema: "./config/schema/table.ts",
  dbCredentials: { connectionString: ENV.DATABASE_URL },
} satisfies Config;