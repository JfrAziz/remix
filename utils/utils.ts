type ExpandRecursively<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: ExpandRecursively<O[K]> }
    : never
  : T;

type RemoveNull<T> = ExpandRecursively<{
  [K in keyof T]: Exclude<RemoveNull<T[K]>, null>;
}>;

/**
 * remove any null or undefined value from any object
 * @returns
 */
export const removeEmpty = <T>(obj: T): RemoveNull<T> => {
  if (Array.isArray(obj)) return obj as RemoveNull<T>;

  return Object.fromEntries(
    Object.entries(obj as object)
      .filter(([, v]) => v != null)
      .map(([k, v]) => [k, v === Object(v) ? removeEmpty(v) : v])
  ) as RemoveNull<T>;
};
