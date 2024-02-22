import { user } from "config/schema/schema";
import {
  Output,
  email,
  merge,
  minLength,
  object,
  optional,
  pick,
  regex,
  string,
  toTrimmed,
} from "valibot";

export type UpdateUserSchema = Output<typeof updateUserSchema>;

export const updateUserSchema = merge([
  pick(user, [
    "full_name",
    "user_name",
    "email",
    "job",
    "bio",
    "company",
    "location",
  ]),
  object({
    email: optional(string([email("email not valid")])),
    full_name: optional(
      string([toTrimmed(), minLength(2, "full name at least 2 characters")])
    ),
    user_name: optional(
      string([
        toTrimmed(),
        regex(
          /^[a-zA-Z0-9]{3,16}$/,
          "username only alphanumeric and be between 3 and 16 characters in length"
        ),
      ])
    ),
  }),
]);
