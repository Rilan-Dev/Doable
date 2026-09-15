// Bundles the runtime preview sandbox into public/runtime-sandbox.js.
//
// It ships separately from the Next.js build because it runs inside an
// opaque-origin iframe that cannot load the app's chunks, and it has to carry
// the app's own React 19 — React 19 publishes no UMD build to load from a CDN.
// Runs automatically before `next build` and `next dev` (prebuild / predev).
import { build } from "esbuild";
import { mkdirSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outfile = resolve(root, "public/runtime-sandbox.js");
mkdirSync(dirname(outfile), { recursive: true });

await build({
  entryPoints: [resolve(root, "src/modules/editor/runtime-render/sandbox/runtime-sandbox.ts")],
  outfile,
  bundle: true,
  format: "iife",
  platform: "browser",
  target: "es2020",
  minify: true,
  legalComments: "none",
  define: { "process.env.NODE_ENV": '"production"' },
  logLevel: "warning",
});

console.log(`[runtime-sandbox] built ${outfile} (${Math.round(statSync(outfile).size / 1024)} KB)`);
