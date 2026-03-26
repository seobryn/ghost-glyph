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
import { encode, decode } from "@seobryn/ghost-glyph";

const hidden = encode("Hi 👋");
console.log(hidden); // invisible string

const original = decode(hidden);
console.log(original); // "Hi 👋"
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

### invisibleCharacters

Exposes the character mapping used by the library:

```ts
{
  zero: "\u200B",
  one: "\u200C"
}
```

## Development

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
