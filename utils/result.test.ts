import { describe, expect, it } from "vitest"
import { Err, Ok, Result, ThrowOnError } from "./result"

describe("Error handling utilities", () => {
  it("should create an error result", () => {
    const errorResult: Result<number> = Err("NOT_FOUND", "Resource not found")

    expect(errorResult).toEqual({
      error: { code: "NOT_FOUND", message: "Resource not found" },
    })
  })

  it("should create a success result", () => {
    const successResult: Result<string> = Ok("Success")

    expect(successResult).toEqual({ value: "Success" })
  })

  it("should throw an error on error result", () => {
    const errorResult: Result<string> = Err("INVALID_INPUT", "Invalid input")

    expect(() => ThrowOnError(errorResult)).toThrowError("INVALID_INPUT")
  })

  it("should return the value on success result", () => {
    const successResult: Result<number> = Ok(42)

    expect(ThrowOnError(successResult)).toBe(42)
  })

  it("should not throw on success result", () => {
    const successResult: Result<number> = Ok(42)

    expect(() => ThrowOnError(successResult)).not.toThrow()
  })

  it("should throw the default error if no message provided", () => {
    const errorResult: Result<string> = Err("INTERNAL_ERROR")

    expect(() => ThrowOnError(errorResult)).toThrowError("INTERNAL_ERROR")
  })
})
