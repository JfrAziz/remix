import { User } from "schema";
import { Err, Ok, Result } from "utils/result";
import { ServiceError } from "utils/error";
import { appendId, createId } from "utils/uid";
import { findByProviderAndId, updateAuthData } from "repository/auth";
import {
  findUserById,
  checkUserName,
  saveOrUpdateUser,
} from "repository/users";

interface GithubUser {
  id: number;
  login: string;
  type: string;
  name: string;
  avatar_url: string;
  bio: string | null;
  blog: string | null;
  email: string | null;
  company: string | null;
  location: string | null;
}

export const getGithubEmail = async (
  token: string
): Promise<Result<string | null, ServiceError>> => {
  const emails = await fetch("https://api.github.com/user/emails", {
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => r.json() as unknown as { email: string; primary: boolean }[]);

  if ("message" in emails)
    return Err("SERVICE_ERROR", "failed to get user emails");

  const email =
    emails.find((e) => e.primary === true)?.email ||
    emails.find((e) => !e.email.includes("@users.noreply.github.com"))?.email ||
    null;

  return Ok(email);
};

/**
 * save user from github provider
 */
export const handleGithubAuth = async (
  githubUser: GithubUser
): Promise<Result<User, ServiceError | Err>> => {
  const auth = await findByProviderAndId("github", githubUser.id.toString());

  /**
   * save last login and return user data
   */
  if (auth.value) {
    await updateAuthData(auth.value);

    return findUserById(auth.value.user_id);
  }

  /**
   * check users with username from oauth providers.
   * if exist, append random Id to make it unique then
   * create a new user for that github account
   */
  const isUserNameExist = await checkUserName(githubUser.login);

  if (isUserNameExist.value) githubUser.login = appendId(githubUser.login);

  const user = await saveOrUpdateUser({
    id: createId(),
    full_name: githubUser.name,
    user_name: githubUser.login,
    /**
     * additional information
     */
    email: githubUser.email,
    avatar_url: githubUser.avatar_url,
    /**
     * more additional information
     */
    job: null,
    bio: githubUser.bio,
    company: githubUser.company,
    location: githubUser.location,
  });

  if (user.error) return Err("SERVICE_ERROR", user.error.message);

  /**
   * also create auth data for the user
   */
  await updateAuthData({
    id: createId(),
    provider: "github",
    provider_id: githubUser.id.toString(),
    user_id: user.value.id,
    verified: true,
  });

  return user;
};
