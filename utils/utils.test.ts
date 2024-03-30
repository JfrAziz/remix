import { createId } from "./uid";
import { removeEmpty } from "./utils";
import { describe, it, expect } from "vitest";

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

describe("removeEmpty", () => {
  it("should remove null and undefined values from a flat object", () => {
    const input = {
      a: 1,
      b: null,
      c: undefined,
      d: "hello",
    };

    const expectedOutput = {
      a: 1,
      d: "hello",
    };

    expect(removeEmpty(input)).toEqual(expectedOutput);
  });

  it("should remove null and undefined values from a nested object", () => {
    const input = {
      a: 1,
      b: {
        c: null,
        d: "world",
        e: undefined,
      },
    };

    const expectedOutput = {
      a: 1,
      b: {
        d: "world",
      },
    };

    expect(removeEmpty(input)).toEqual(expectedOutput);
  });

  it("should not modify arrays or non-object values", () => {
    const input = {
      a: [1, null, 3],
      b: "hello",
      c: null,
      d: undefined,
    };

    const expectedOutput = {
      a: [1, null, 3],
      b: "hello",
    };

    expect(removeEmpty(input)).toEqual(expectedOutput);
  });
});
