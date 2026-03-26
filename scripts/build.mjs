import { rm } from "node:fs/promises";
import { build } from "esbuild";

await rm(new URL("../dist", import.meta.url), { recursive: true, force: true });

await build({
  entryPoints: ["src/index.ts"],
  outfile: "dist/index.js",
  format: "esm",
  platform: "neutral",
  target: "es2022",
  bundle: true,
  sourcemap: !(process.env.NODE_ENV === "production"),
  minify: process.env.NODE_ENV === "production",
});
