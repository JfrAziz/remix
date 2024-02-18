import { Err } from "utils/result";

export type ServiceError = Err<"SERVICE_ERROR">;

export type NotFoundError = Err<"NOT_FOUND">;

export type DatabaseError = Err<"DATABASE_ERROR">;
