import {
  union,
  string,
  number,
  object,
  Output,
  coerce,
  boolean,
  literal,
  optional,
  toTrimmed,
  safeParse,
} from "valibot";

const schema = object({
  SECRET: string("secret must exist", [toTrimmed()]),

  DATABASE_URL: string(),

  DATABASE_DEBUG: coerce(optional(boolean(), false), Boolean),

  // GOOGLE_CLIENT_ID: Type.String({ minLength: 1 }),

  // GOOGLE_SECRET_ID: Type.String({ minLength: 1 }),

  GITHUB_CLIENT_ID: string(),

  GITHUB_CLIENT_SECRET: string(),

  HOST: optional(string(), "127.0.0.1"),

  PORT: optional(coerce(number(), Number), 5173),

  NODE_ENV: optional(
    union([literal("production"), literal("development")]),
    "production"
  ),
});

export const parse = (env: object): Output<typeof schema> => {
  const value = safeParse(schema, env);

  if (value.success) return value.output;

  for (const issue of value.issues) {
    console.log(`[ENV] error : ${issue.path?.[0].key} ${issue.message}`);
  }

  throw new Error(`[ENV] Parsing error`);
};

export const ENV = parse(process.env);
