import { describe, expect, it } from "vitest";

import { decode, encode, invisibleCharacters } from "../src/index.js";

describe("ghost-glyph", () => {
  it("encodes and decodes plain text", () => {
    const input = "hello world";
    const encoded = encode(input);

    expect(encoded).not.toBe(input);
    expect(decode(encoded)).toBe(input);
  });

  it("encodes and decodes unicode text", () => {
    const input = "Hi 👋 café";
    const encoded = encode(input);

    expect(decode(encoded)).toBe(input);
  });

  it("uses only configured invisible characters", () => {
    const encoded = encode("secret");

    for (const char of encoded) {
      expect(
        char === invisibleCharacters.zero || char === invisibleCharacters.one,
      ).toBe(true);
    }
  });

  it("ignores non-invisible characters while decoding", () => {
    const encoded = encode("abc");
    const withNoise = `x${encoded}y`;

    expect(decode(withNoise)).toBe("abc");
  });

  it("throws for incomplete encoded input", () => {
    const encoded = encode("a");
    const broken = encoded.slice(0, -1);

    expect(() => decode(broken)).toThrowError(/Invalid encoded input length/);
  });
});
