import { User } from "config/schema";
import { Err, Ok, Result } from "utils/result";
import { findUserById } from "repository/users";

export const getUser = async (id: string): Promise<Result<User, Err>> => {
  const result = await findUserById(id);

  if (result.error) return Err("NOT_FOUND");

  return Ok(result.value);
};
