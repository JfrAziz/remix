import {
  union,
  string,
  number,
  object,
  Output,
  boolean,
  literal,
  optional,
  toTrimmed,
  safeParse,
  coerce,
} from "valibot";

let called = 0;

const schema = object({
  SECRET: string("secret must exist", [toTrimmed()]),

  DATABASE_URL: string(),

  DATABASE_DEBUG: coerce(optional(boolean(), false), Boolean),

  // GOOGLE_CLIENT_ID: Type.String({ minLength: 1 }),

  // GOOGLE_SECRET_ID: Type.String({ minLength: 1 }),

  GITHUB_CLIENT_ID: string(),

  GITHUB_CLIENT_SECRET: string(),

  HOST: optional(string(), "127.0.0.1"),

  PORT: coerce(optional(number(), 5173), Number),

  NODE_ENV: optional(
    union([literal("production"), literal("development")]),
    "production"
  ),
});

export const parse = (env: object): Output<typeof schema> => {
  const value = safeParse(schema, env);

  console.log(called++);

  if (value.success) return value.output;

  console.log(value.issues);

  throw new Error(`[ENV] Parse:`);
};

export const ENV = parse(process.env);
