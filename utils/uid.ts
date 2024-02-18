export const createId = () => "";

/**
 * append any string with random unique id.
 *
 * @param str
 * @returns
 */
export const appendId = (str: string) => {
  const suffix = Math.floor(Math.random() * 100);

  return str + suffix;
};
