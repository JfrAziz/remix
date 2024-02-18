export type Err<T = string> = {
  code: T;
  message?: string;
};

export type ResultError<E = Err> = {
  value?: undefined;
  error: E;
};

export type ResultSuccess<T> = {
  value: T;
  error?: undefined;
};

export type Result<T, E = Err> = ResultSuccess<T> | ResultError<E>;

/**
 * this is helpers function to generate
 * error result object
 */
export const Err = <E = string>(
  code: E,
  message?: string
): ResultError<Err<E>> => ({ error: { code, message } });

/**
 * create result ok result
 */
export const Ok = <T>(value: T): ResultSuccess<T> => ({ value: value });

/**
 * pass any Err object to raise an error
 */
export const Throw = (err: Err) => {
  throw new Error(err.code);
};

/**
 * only throw when error happend
 */
export const ThrowOnErrpr = <T>(res: Result<T>) =>
  res.error ? Throw(res.error) : res.value;
