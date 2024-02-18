import * as table from "./table";
import * as schema from "./schema";
import { Static } from "@sinclair/typebox";

export type User = Static<typeof schema.user>;

export type Auth = Static<typeof schema.auth>;

export { table, schema };
