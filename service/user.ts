import { User } from "schema";
import { Err, Ok, Result } from "utils/result";
import { UpdateUserSchema } from "schema/validator/user";
import { checkUserName, findUserById, savePartialUser } from "repository/users";

export const getUser = async (id: string): Promise<Result<User, Err>> => {
  const result = await findUserById(id);

  if (result.error) return Err("NOT_FOUND");

  return Ok(result.value);
};

export const updateUser = async (
  id: string,
  user: UpdateUserSchema
): Promise<Result<User, Err>> => {
  const currentUser = await getUser(id);

  if (!currentUser.value) return Err("NOT_FOUND", "no user to update");

  if (user.user_name && currentUser.value.user_name !== user.user_name) {
    const isUserNameExist = await checkUserName(user.user_name);

    if (isUserNameExist.value)
      return Err("SERVICE_ERROR", "username already exist");
  }

  const saved = await savePartialUser(id, user);

  if (saved.error) return Err("SERVICE_ERROR", "failed to save user data");

  return Ok(saved.value);
};
