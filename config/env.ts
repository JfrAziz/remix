import { Value } from "@sinclair/typebox/value";
import { Type, Static } from "@sinclair/typebox";

const schema = Type.Object(
  {
    DATABASE_URL: Type.String({ minLength: 1 }),

    DATABASE_DEBUG: Type.Boolean({ default: false }),

    SESSION_SECRET: Type.String({ minLength: 1 }),

    // GOOGLE_CLIENT_ID: Type.String({ minLength: 1 }),

    // GOOGLE_SECRET_ID: Type.String({ minLength: 1 }),

    // GITHUB_CLIENT_ID: Type.String({ minLength: 1 }),

    // GITHUB_SECRET_ID: Type.String({ minLength: 1 }),

    HOST: Type.String({ minLength: 1, default: "127.0.0.1" }),

    PORT: Type.Number({ default: 5173 }),

    NODE_ENV: Type.Union(
      [Type.Literal("production"), Type.Literal("development")],
      { default: "production" }
    ),
  },
  { additionalProperties: true }
);

export const parse = (env: object): Static<typeof schema> => {
  const converted = Value.Default(schema, Value.Convert(schema, env));

  if (Value.Check(schema, converted))
    return Value.Cast({ ...schema, additionalProperties: false }, converted);

  const error = Value.Errors(schema, converted).First()!;

  throw new Error(`[ENV] Parse: ${error.path} ${error.message} ${error.value}`);
};

export const ENV = parse(process.env);