#!/usr/bin/env node

// src/index.ts
var Z0 = "\u200B";
var Z1 = "\u200C";
var CARRIER_START = "\u2063";
var CARRIER_END = "\u2064";
var BITS_PER_BYTE = 8;
var encoder = new TextEncoder();
var decoder = new TextDecoder();
function encode(input) {
  const bytes = encoder.encode(input);
  return Array.from(
    bytes,
    (byte) => byte.toString(2).padStart(BITS_PER_BYTE, "0").replaceAll("0", Z0).replaceAll("1", Z1)
  ).join("");
}
function decode(input) {
  if (input.length === 0) {
    return "";
  }
  const normalized = Array.from(input).filter((char) => char === Z0 || char === Z1).join("");
  if (normalized.length % BITS_PER_BYTE !== 0) {
    throw new Error("Invalid encoded input length");
  }
  const byteCount = normalized.length / BITS_PER_BYTE;
  const bytes = new Uint8Array(byteCount);
  for (let index = 0; index < byteCount; index += 1) {
    const chunk = normalized.slice(
      index * BITS_PER_BYTE,
      (index + 1) * BITS_PER_BYTE
    );
    const binary = Array.from(chunk, (char) => char === Z1 ? "1" : "0").join(
      ""
    );
    bytes[index] = Number.parseInt(binary, 2);
  }
  return decoder.decode(bytes);
}
function embed(secret, carrier) {
  return `${carrier}${CARRIER_START}${encode(secret)}${CARRIER_END}`;
}
function extract(carrier) {
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

// scripts/cli.ts
function printHelp() {
  console.log(
    `ghost-glyph CLI

Usage:
  pnpm run cli encode <text>
  pnpm run cli decode <invisible>
  pnpm run cli embed <secret> <carrier>
  pnpm run cli extract <carrier>
`
  );
}
async function main() {
  const [, , cmd, ...args] = process.argv;
  if (!cmd || cmd === "--help" || cmd === "-h") {
    printHelp();
    process.exit(0);
  }
  try {
    switch (cmd) {
      case "encode": {
        const text = args.join(" ");
        if (!text) throw new Error("No text provided");
        console.log(encode(text));
        break;
      }
      case "decode": {
        const input = args.join(" ");
        if (!input) throw new Error("No input provided");
        console.log(decode(input));
        break;
      }
      case "embed": {
        const [secret, ...carrierArr] = args;
        const carrier = carrierArr.join(" ");
        if (!secret || !carrier)
          throw new Error("Usage: embed <secret> <carrier>");
        console.log(embed(secret, carrier));
        break;
      }
      case "extract": {
        const carrier = args.join(" ");
        if (!carrier) throw new Error("No carrier provided");
        console.log(extract(carrier));
        break;
      }
      default:
        printHelp();
        process.exit(1);
    }
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}
main();
