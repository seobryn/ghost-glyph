import { describe, expect, it } from "vitest";

import {
  decode,
  embed,
  encode,
  extract,
  invisibleCharacters,
} from "../src/index.js";

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

  it("embeds hidden content into a carrier", () => {
    const carrier = "Visible message";
    const embedded = embed("secret", carrier);

    expect(embedded.startsWith(carrier)).toBe(true);
    expect(embedded).not.toBe(carrier);
  });

  it("extracts hidden content from a carrier", () => {
    const carrier = "Hello team";
    const embedded = embed("Hi 👋", carrier);

    expect(extract(embedded)).toBe("Hi 👋");
  });

  it("throws when no embedded payload is present", () => {
    expect(() => extract("plain visible text")).toThrowError(
      /No embedded payload found/,
    );
  });

  it("exposes carrier delimiters in invisible characters map", () => {
    expect(typeof invisibleCharacters.carrierStart).toBe("string");
    expect(typeof invisibleCharacters.carrierEnd).toBe("string");
  });
});
