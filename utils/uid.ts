import { ulid } from 'ulid'

export const createId = () => ulid();

/**
 * append any string with random unique id.
 *
 * @param str
 * @returns
 */
export const appendId = (str: string) => {
  const suffix = ulid().substring(0, 5);

  return str + "-" + suffix;
};
