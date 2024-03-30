/**
 * I know this is not best error handler, you can see this code flying
 * around in this code base. for some reason, I am tired writing anything
 * with try catch, so I treat all errors as values and then you must handled the
 * error before use the value (I like the go style on handling error).
 *
 * before you continue, I classify any error as expected error and unexpected
 * error. expected error is error you can predict, like when you get the data
 * from db then your result is zero you can assume that as NOT_FOUND error.
 * unexpected error is when you don't know this error but you know some line
 * of code can be error sometimes (usually you put it in try catch block) and
 * handle it.
 *
 * so to make it easier to check what error and what to do when some errors
 * happen, I created this simple utils. any function has result either error
 * or the value. when there is error there is no value and vice versa. and you
 * can check any error easier because you can get what error form any functions.
 *
 * you can find this pattern on neverthrow packages, but I think this is enough
 * for me.
 */

/**
 * error result, code and it's message
 */
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

/**
 * your result is success or error, pick one
 */
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
export const ThrowOnError = <T>(res: Result<T>) =>
  res.error ? Throw(res.error) : res.value;
