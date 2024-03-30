import { appendId } from "./uid";
import { describe, expect, it } from "vitest";

describe("appendId", () => {
  it("should append a valid ULID suffix to a string", () => {
    const baseString = "test";

    const result = appendId(baseString);

    expect(result.startsWith("test-")).toBeTruthy();

    /**
     * we add 5 random id and -, so it's 6
     */
    expect(result.length).toBe(baseString.length + 6);
  });
});
