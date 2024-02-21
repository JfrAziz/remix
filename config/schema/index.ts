import * as table from "./table";
import * as schema from "./schema";
import { Output } from "valibot";

export type User = Output<typeof schema.user>;

export type Auth = Output<typeof schema.auth>;

export { table, schema };
