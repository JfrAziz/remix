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

export const Err = <E = string>(
  code: E,
  message?: string
): ResultError<Err<E>> => ({ error: { code, message } });

export const Ok = <T>(value: T): ResultSuccess<T> => ({ value: value });
