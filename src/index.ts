const Z0 = "\u200B";
const Z1 = "\u200C";
const CARRIER_START = "\u2063";
const CARRIER_END = "\u2064";
const BITS_PER_BYTE = 8;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export function encode(input: string): string {
  const bytes = encoder.encode(input);

  return Array.from(bytes, (byte) =>
    byte
      .toString(2)
      .padStart(BITS_PER_BYTE, "0")
      .replaceAll("0", Z0)
      .replaceAll("1", Z1),
  ).join("");
}

export function decode(input: string): string {
  if (input.length === 0) {
    return "";
  }

  const normalized = Array.from(input)
    .filter((char) => char === Z0 || char === Z1)
    .join("");

  if (normalized.length % BITS_PER_BYTE !== 0) {
    throw new Error("Invalid encoded input length");
  }

  const byteCount = normalized.length / BITS_PER_BYTE;
  const bytes = new Uint8Array(byteCount);

  for (let index = 0; index < byteCount; index += 1) {
    const chunk = normalized.slice(
      index * BITS_PER_BYTE,
      (index + 1) * BITS_PER_BYTE,
    );
    const binary = Array.from(chunk, (char) => (char === Z1 ? "1" : "0")).join(
      "",
    );
    bytes[index] = Number.parseInt(binary, 2);
  }

  return decoder.decode(bytes);
}

export function embed(secret: string, carrier: string): string {
  return `${carrier}${CARRIER_START}${encode(secret)}${CARRIER_END}`;
}

export function extract(carrier: string): string {
  const startIndex = carrier.indexOf(CARRIER_START);

  if (startIndex === -1) {
    throw new Error("No embedded payload found");
  }

  const payloadStart = startIndex + CARRIER_START.length;
  const endIndex = carrier.indexOf(CARRIER_END, payloadStart);

  if (endIndex === -1) {
    throw new Error("No embedded payload found");
  }

  return decode(carrier.slice(payloadStart, endIndex));
}

export const invisibleCharacters = {
  zero: Z0,
  one: Z1,
  carrierStart: CARRIER_START,
  carrierEnd: CARRIER_END,
} as const;
