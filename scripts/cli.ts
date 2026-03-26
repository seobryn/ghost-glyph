import { encode, decode, embed, extract } from "../src/index.js";
import clipboard from "clipboardy";

function printHelp() {
  console.log(
    `ghost-glyph CLI\n\nUsage:\n  pnpm run cli encode <text>\n  pnpm run cli decode <invisible>\n  pnpm run cli embed <secret> <carrier>\n  pnpm run cli extract <carrier>\n`,
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
        const result = encode(text);
        await clipboard.write(result);
        console.log("(Invisible text copied to clipboard)");
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
        const result = embed(secret, carrier);
        await clipboard.write(result);
        console.log("(Invisible embedded text copied to clipboard)");
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
    console.error("Error:", (err as Error).message);
    process.exit(1);
  }
}

main();
