import { appendId, createId } from "./uid";
import { describe, expect, it } from "vitest";

describe("createId", () => {
  it("should generate a valid ULID", () => {
    const id = createId();

    // Validate that the generated ID is a string
    expect(typeof id).toBe("string");

    // Validate the length of the ID (26 characters)
    expect(id.length).toBe(26);

    // Validate that the ID is lexically sortable
    const nextId = createId();

    expect(id < nextId).toBe(true);
  });
});

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
