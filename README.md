# ghost-glyph

A tiny TypeScript library to hide and recover text using zero-width Unicode characters.

`ghost-glyph` encodes UTF-8 bytes into invisible characters:

- `\u200B` (zero-width space) represents bit `0`
- `\u200C` (zero-width non-joiner) represents bit `1`

## Installation

```bash
pnpm add @seobryn/ghost-glyph
```

## Quick Example

```ts
import { decode, embed, encode, extract } from "@seobryn/ghost-glyph";

const hidden = encode("Hi 👋");
console.log(hidden); // invisible string

const original = decode(hidden);
console.log(original); // "Hi 👋"

const carrier = "Release notes are ready.";
const embedded = embed("Ship at 17:00", carrier);
const revealed = extract(embedded);
console.log(revealed); // "Ship at 17:00"
```

## API

### encode(input: string): string

Converts a string into an invisible zero-width sequence.

- Input is encoded as UTF-8 bytes.
- Each byte is converted into 8 bits.
- Bit `0` becomes `\u200B`, bit `1` becomes `\u200C`.

### decode(input: string): string

Converts an invisible zero-width sequence back into the original string.

Behavior:

- Returns `""` for empty input.
- Ignores non-zero-width characters in the provided input.
- Throws an error if the filtered encoded length is not divisible by 8.

### embed(secret: string, carrier: string): string

Appends an invisible payload to visible carrier text.

- Uses invisible start/end delimiters around the encoded payload.
- Keeps your visible carrier text unchanged.

### extract(carrier: string): string

Extracts and decodes a hidden payload from carrier text created with `embed`.

- Reads payload between invisible start/end delimiters.
- Throws if no embedded payload is found.

### invisibleCharacters

Exposes the character mapping used by the library:

```ts
{
  zero: "\u200B",
  one: "\u200C",
  carrierStart: "\u2063",
  carrierEnd: "\u2064"
}
```

## CLI Usage

### Local development

You can use the CLI locally via pnpm scripts:

```bash
# Encode to invisible
pnpm run cli encode "Secret message"

# Decode from invisible
pnpm run cli decode "<invisible>"

# Embed secret in carrier
pnpm run cli embed "hidden" "Visible text"

# Extract secret from carrier
pnpm run cli extract "Visible text<invisible>"
```

Run `pnpm run cli` for help and usage info.

### Published package

When this package is published, the CLI is available through the `ghost-glyph` binary.

```bash
# pnpm dlx
pnpm dlx @seobryn/ghost-glyph encode "Secret message"

# pnpx
pnpx @seobryn/ghost-glyph encode "Secret message"
```

The package publish flow builds `dist/index.js`, types, and `dist/cli.js` automatically through the `prepack` script.

### Install dependencies

```bash
pnpm install
```

### Type check

```bash
pnpm run typecheck
```

### Run tests

```bash
pnpm test
```

### Watch tests

```bash
pnpm run test:watch
```

### Build

```bash
pnpm run build
```

Build output is generated in `dist/` as ESM JavaScript and TypeScript declarations.

## Notes

- This is text obfuscation, not cryptographic security.
- Some systems may normalize or strip zero-width characters, which can break roundtrips.
