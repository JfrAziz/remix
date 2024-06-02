import * as v from "valibot"
import type { User } from "schema"

export type UpdateUserSchema = v.Output<typeof updateUserSchema>

export const updateUserSchema = v.object({
  email: v.optional(v.string([v.email("email not valid")])),
  full_name: v.optional(
    v.string([v.toTrimmed(), v.minLength(2, "full name at least 2 characters")])
  ),
  user_name: v.optional(
    v.string([
      v.toTrimmed(),
      v.regex(
        /^[a-zA-Z0-9]{3,16}$/,
        "username only alphanumeric and be between 3 and 16 characters in length"
      ),
    ])
  ),
}) satisfies v.BaseSchema<
  Partial<Pick<User, "email" | "user_name" | "full_name">>
>
