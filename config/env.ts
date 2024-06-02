import z from "zod"

const schema = z.object({
  HOST: z.coerce.string().default("127.0.0.1"),

  PORT: z.coerce.number().default(5173),

  NODE_ENV: z.enum(["development", "production", "test"]).default("production"),

  SECRET: z.string().trim(),

  DATABASE_URL: z.string(),

  DATABASE_DEBUG: z.coerce.boolean().default(false),

  GITHUB_CLIENT_ID: z.string(),

  GITHUB_CLIENT_SECRET: z.string(),
})

const parsed = schema.safeParse(process.env)

if (!parsed.success) {
  // biome-ignore lint/nursery/noConsole: show all env error
  console.log(parsed.error.issues)

  throw new Error("There is an error with the environment variables")
}

export const ENV = parsed.data
