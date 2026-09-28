#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.cwd(), "ai-platform-core");
const manifestPath = path.join(root, "external-dependencies/source-manifests/services-api.package.json");
if (!fs.existsSync(manifestPath)) {
  console.error("Missing source-manifests/services-api.package.json");
  process.exit(1);
}
const api = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const all = {...(api.dependencies || {}), ...(api.devDependencies || {})};
const workspace = Object.entries(all).filter(([k,v]) => String(v).startsWith("workspace:"));
const external = Object.entries(all).filter(([k,v]) => !String(v).startsWith("workspace:"));
const activePieces = external.filter(([k]) => k.startsWith("@activepieces/piece-"));
const infrastructure = {
  runtime: [
    "Node.js 22+",
    "pnpm 9.x-compatible workspace tooling",
    "PostgreSQL 16-compatible database for Doable DB-dependent paths"
  ],
  execution: [
    "Git CLI",
    "Linux process/sandbox primitives where sandbox features are enabled (setpriv, systemd, nftables, seccomp/bubblewrap as applicable)",
    "Puppeteer-compatible browser/Chromium for browser/build/document paths"
  ],
  security: [
    "secure secret/key storage",
    "tenant identity/RBAC",
    "network/egress policy for untrusted tool and integration execution"
  ],
  optional: [
    "GitHub Copilot CLI/SDK when Copilot-backed agent execution is enabled",
    "external MCP server packages for specific built-in MCP Apps",
    "Activepieces piece packages selected by the host"
  ]
};
const out = {
  generatedAt: new Date().toISOString(),
  sourceManifest: "external-dependencies/source-manifests/services-api.package.json",
  workspacePackages: Object.fromEntries(workspace),
  externalNpmPackages: Object.fromEntries(external),
  activepiecesPackages: Object.fromEntries(activePieces),
  infrastructure,
  rule: "A capability is not considered portable until its package and infrastructure requirements are explicitly bound by the target project."
};
const outPath = path.join(root, "external-dependencies/external-dependencies.json");
fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + "\n");
console.log(JSON.stringify(out, null, 2));
