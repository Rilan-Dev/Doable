#!/usr/bin/env node
/**
 * AI Platform Core extraction verifier.
 *
 * Works in:
 *  1. the Doable extraction Git checkout (strong mode: Git tree/blob identity);
 *  2. a target project after ai-platform-core/ has been copied (structure mode).
 *
 * It never edits immutable source files.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";

const root = path.resolve(process.cwd(), "ai-platform-core");
const reportPath = path.join(root, "verification", "completeness-report.json");

const expectedTrees = {
  "doable-source/services/api/src/ai": "13edcc7bd9726c38ea9bd4aab0d7825b2b8387d0",
  "doable-source/services/api/src/context": "43424593729e9a6d23ce71731c7bf6991b7d6c8b",
  "doable-source/services/api/src/data-worker": "41f76545e048af489e5b1a260ecb24dbb57c6125",
  "doable-source/services/api/src/integrations": "f8373823ec6063b9ff0f911d83c761d840f97a30",
  "doable-source/services/api/src/mcp": "77fc1cff3ec48ba3bce21322befcf985003ac03c",
  "doable-source/services/api/src/sandbox": "d0028c442297801dbe57a546ea3ec4f6232adbb2",
  "doable-source/services/api/src/routes/chat": "69ab556c027e51b655ce8760315ea5547a554b38",
  "doable-source/packages/doable-ai": "4df61ac8972c156009a661ebf599fb2b91b7ddab",
  "doable-source/packages/docore": "2a33159a3b92f653ddf1514027982d454bea2fd4",
  "doable-source/packages/dovault": "15532f8f7effbe8a7eb33b57333b113d64e7606",
  "doable-source/packages/shared": "8dad7fcadfe23fb5e6d3b3d919f0501e59cfae71",
  "doable-source/packages/doable-sdk": "32683d5cd4b42353e790000123176bb3b2eb8f2a",
  "dependency-closure/packages/db": "1faf731b078d489040e54bfde4bb2d08086354fe",
  "dependency-closure/services/api/src/db": "3fe1b58f43e135dce8807438769eec032b591bb5",
  "dependency-closure/services/api/src/frameworks": "f106f350efd3362473eb33d18962503d50e4de9a",
  "dependency-closure/services/api/src/projects": "654182e0e19b8d44ed0fcb791278ef3841bb36c",
  "dependency-closure/services/api/src/lib": "7bb5fd5302ce66e97d25d91b8097bada80bc762a",
  "dependency-closure/services/api/src/middleware": "62b0a6ba803d9827f9b0acc6d1a8091febffd5f8",
  "dependency-closure/services/api/src/templates": "1289c0ae29d5dc893c6f2db5c80b893f177b1e52",
  "dependency-closure/services/api/src/git": "830aa877f377e78e9e1df3703ec4ebe8d2158846",
  "dependency-closure/services/api/src/runtime": "ae8aa7c249b90eaf6dd66ec82d5d47021d2aeb79"
};

const expectedBlobs = {
  "doable-source/services/api/src/routes/integrations-admin.ts": "82538892891afd1cd45368e51abb5f871dab8614",
  "doable-source/services/api/src/routes/integrations-catalog.ts": "ce092eae3e0f2ac96a3725f32a6b83893d9136d9",
  "doable-source/services/api/src/routes/integrations-connections.ts": "748fe5d8afef2e4d2531ae93adba8747f129218a",
  "doable-source/services/api/src/routes/integrations-oauth.ts": "c158bb799e86e658a9cff553db9c8519b02fdb7b",
  "doable-source/services/api/src/routes/integrations.ts": "eb1e5297a630b80aef98c10cbae9bf55b3cff040",
  "doable-source/services/api/src/routes/mcp-apps-data.ts": "f01b197f66b9520eeb8b5417c4ca1cb1d88e0a3f",
  "doable-source/services/api/src/routes/plan.ts": "85ffcc681be6f19b61c32a8c480d4651c7624b26",
  "doable-source/services/api/src/routes/provider-bridge.ts": "0906f6c10213c6224969ac45d10b06785e64d6e7",
  "doable-source/services/api/src/routes/provider-catalog.ts": "ae7f2cc8e456627226466495a348261453c12713",
  "doable-source/services/api/src/routes/skills.ts": "6f93fedd37dc3a8b079c96d9ed57581c9de3baba",
  "doable-source/services/api/src/routes/context.ts": "552ef7c4251d1cb464cb61730097159fe4ed349b",
  "doable-source/services/api/src/routes/sandbox-rules.ts": "267324003df3131c5d76da36d260f5acd9cd7d8d",
  "doable-source/services/api/src/routes/workspaces/sandbox.ts": "51b2515a0c931b02e1ce9caea3aceccbd15f9644",
  "doable-source/services/api/src/routes/compat-proxy.ts": "751590170921d9eb2fe83b4497c7b1a6ef23f427",
  "doable-source/services/api/src/routes/auth/platform-ai-bootstrap.ts": "f318372e194b6f1104cb45c2f74ade5337094fe2"
};

const requiredDirs = Object.keys(expectedTrees);
const requiredFiles = [
  "EXTRACTION_MANIFEST.md",
  "COMPLETE_AI_PLATFORM_COVERAGE.md",
  "COPY_TO_ANY_PROJECT.md",
  "UI_UX_REFERENCE.md",
  "UI_CAPABILITY_MATRIX.md",
  "ADAPTER_ARCHITECTURE.md",
  "verification/source-and-ui-manifest.json",
  "verification/immutable-source-manifest.json",
  "verification/verify-extraction.mjs",
  "external-dependencies/external-dependencies.json",
  "external-dependencies/generate-external-dependencies.mjs",
  "external-dependencies/README.md",
  "external-dependencies/source-manifests/services-api.package.json",
  "external-dependencies/source-manifests/root.package.json",
  "external-dependencies/source-manifests/pnpm-workspace.yaml",
  "external-dependencies/source-manifests/tsconfig.base.json",
  "external-dependencies/source-manifests/marketplace-bundle.package.json",
  "capabilities/multi-provider/MANIFEST.md",
  "capabilities/agents/MANIFEST.md",
  "capabilities/tools/MANIFEST.md",
  "capabilities/integrations/MANIFEST.md",
  "capabilities/mcp/MANIFEST.md",
  "capabilities/skills/MANIFEST.md",
  "capabilities/chat/MANIFEST.md",
  "capabilities/context-memory/MANIFEST.md",
  "capabilities/workspace-sandbox/MANIFEST.md",
  "capabilities/ui/MANIFEST.md"
];

function exists(rel) { return fs.existsSync(path.join(root, rel)); }

function gitRevParse(spec) {
  try {
    return execFileSync("git", ["rev-parse", spec], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return null;
  }
}

function gitAvailable() {
  return Boolean(gitRevParse("HEAD"));
}

function sha1(data) { return crypto.createHash("sha1").update(data).digest("hex"); }

function gitTreeSha(absDir) {
  const entries = fs.readdirSync(absDir, { withFileTypes: true }).map((entry) => {
    const abs = path.join(absDir, entry.name);
    if (entry.isDirectory()) return { name: entry.name, mode: "40000", sha: gitTreeSha(abs) };
    const stat = fs.lstatSync(abs);
    const mode = (stat.mode & 0o111) ? "100755" : "100644";
    return { name: entry.name, mode, sha: gitBlobSha(path.relative(root, abs)) };
  }).sort((a, b) => Buffer.from(a.name).compare(Buffer.from(b.name)));
  const body = Buffer.concat(entries.map((e) => Buffer.concat([
    Buffer.from(`${e.mode} ${e.name}\0`),
    Buffer.from(e.sha, "hex")
  ])));
  return sha1(Buffer.concat([Buffer.from(`tree ${body.length}\0`), body]));
}

function listFilesystemFiles(relRoot) {
  const absRoot = path.join(root, relRoot);
  const out = [];
  function walk(dir, rel) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const childRel = path.join(rel, entry.name).split(path.sep).join("/");
      const childAbs = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(childAbs, childRel);
      else out.push(childRel);
    }
  }
  if (fs.existsSync(absRoot)) walk(absRoot, relRoot);
  return out.sort();
}

function gitListFiles(relRoot) {
  try {
    return execFileSync("git", ["ls-tree", "-r", "--name-only", "HEAD", "--", `ai-platform-core/${relRoot}`], { encoding: "utf8" })
      .split("\n").map(x => x.trim()).filter(Boolean).map(x => x.replace(/^ai-platform-core\//, "")).sort();
  } catch { return []; }
}

function gitBlobSha(file) {
  const abs = path.join(root, file);
  if (!fs.existsSync(abs)) return null;
  const data = fs.readFileSync(abs);
  const header = Buffer.from(`blob ${data.length}\\0`);
  return crypto.createHash("sha1").update(Buffer.concat([header, data])).digest("hex");
}

const report = {
  verifier: "ai-platform-core/verification/verify-extraction.mjs",
  generatedAt: new Date().toISOString(),
  source: {
    repository: "Rilan-Dev/Doable",
    ref: "develop",
    commit: "a6036d1fd6dca83c08ee5affa141e5c85e45f5af"
  },
  mode: gitAvailable() ? "git+filesystem" : "filesystem",
  checks: {},
  featureManifests: {},
  externalDependencyManifest: exists("external-dependencies/source-manifests/services-api.package.json"),
  pass: true
};

const missingDirs = requiredDirs.filter((p) => !exists(p));
const missingFiles = requiredFiles.filter((p) => !exists(p));
report.checks.requiredDirectories = { total: requiredDirs.length, missing: missingDirs, pass: missingDirs.length === 0 };
report.checks.requiredFiles = { total: requiredFiles.length, missing: missingFiles, pass: missingFiles.length === 0 };
report.pass &&= report.checks.requiredDirectories.pass && report.checks.requiredFiles.pass;

if (gitAvailable()) {
  const treeResults = {};
  for (const [rel, expected] of Object.entries(expectedTrees)) {
    const actual = gitRevParse(`HEAD:ai-platform-core/${rel}`);
    treeResults[rel] = { expected, actual, pass: actual === expected };
  }
  report.checks.gitTrees = treeResults;
  report.checks.gitTreesPass = Object.values(treeResults).every((x) => x.pass);
  report.pass &&= report.checks.gitTreesPass;

  const blobResults = {};
  for (const [rel, expected] of Object.entries(expectedBlobs)) {
    const actual = gitRevParse(`HEAD:ai-platform-core/${rel}`);
    blobResults[rel] = { expected, actual, pass: actual === expected };
  }
  report.checks.gitBlobs = blobResults;
  report.checks.gitBlobsPass = Object.values(blobResults).every((x) => x.pass);
  report.pass &&= report.checks.gitBlobsPass;
} else {
  const blobResults = {};
  for (const [rel, expected] of Object.entries(expectedBlobs)) {
    const actual = gitBlobSha(rel);
    blobResults[rel] = { expected, actual, pass: actual === expected };
  }
  report.checks.filesystemKeyBlobs = blobResults;
  report.checks.filesystemKeyBlobsPass = Object.values(blobResults).every((x) => x.pass);
  report.pass &&= report.checks.filesystemKeyBlobsPass;
}

const sourceManifest = path.join(root, "verification/source-and-ui-manifest.json");
if (fs.existsSync(sourceManifest)) {
  const m = JSON.parse(fs.readFileSync(sourceManifest, "utf8"));
  const uiFiles = Object.keys(m.uiReferenceAdditionalFiles || {});
  report.checks.uiReferenceFiles = {
    total: uiFiles.length,
    missing: uiFiles.filter((p) => !exists(`ui-reference/${p}`)),
    pass: uiFiles.every((p) => exists(`ui-reference/${p}`))
  };
  report.pass &&= report.checks.uiReferenceFiles.pass;
}

const immutableManifestPath = path.join(root, "verification/immutable-source-manifest.json");
if (fs.existsSync(immutableManifestPath)) {
  const m = JSON.parse(fs.readFileSync(immutableManifestPath, "utf8"));
  const fileResults = [];
  const expectedByRoot = new Map();
  for (const f of m.files || []) {
    const rel = `${f.root}/${f.path}`;
    expectedByRoot.set(rel, f);
    const actualSha = gitAvailable() ? gitRevParse(`HEAD:ai-platform-core/${rel}`) : gitBlobSha(rel);
    fileResults.push({ path: rel, expected: f.sha, actual: actualSha, pass: actualSha === f.sha });
  }
  const rootSetResults = {};
  for (const [rel, expected] of Object.entries(m.capturedRootTrees || {})) {
    const actual = gitAvailable()
      ? gitRevParse(`HEAD:ai-platform-core/${rel}`)
      : (exists(rel) ? gitTreeSha(path.join(root, rel)) : null);
    rootSetResults[rel] = { expected, actual, pass: actual === expected };
  }
  const inventory = {};
  for (const root of new Set((m.files || []).map(f => f.root))) {
    const expected = (m.files || []).filter(f => f.root === root).map(f => `${root}/${f.path}`).sort();
    const actual = gitAvailable() ? gitListFiles(root) : listFilesystemFiles(root);
    const missing = expected.filter(x => !actual.includes(x));
    const extra = actual.filter(x => !expected.includes(x));
    inventory[root] = { expected: expected.length, actual: actual.length, missing, extra, pass: missing.length === 0 && extra.length === 0 };
  }
  report.checks.immutableSource = {
    sourceCommit: m.source?.commit,
    totalFiles: fileResults.length,
    verifiedFiles: fileResults.filter(x => x.pass).length,
    fileFailures: fileResults.filter(x => !x.pass),
    rootTrees: rootSetResults,
    rootTreesPass: Object.values(rootSetResults).every(x => x.pass),
    inventory,
    inventoryPass: Object.values(inventory).every(x => x.pass),
    filesPass: fileResults.every(x => x.pass),
    pass: fileResults.every(x => x.pass) && Object.values(rootSetResults).every(x => x.pass) && Object.values(inventory).every(x => x.pass)
  };
  report.pass &&= report.checks.immutableSource.pass;
}

for (const name of [
  "multi-provider","agents","tools","integrations","mcp","skills",
  "chat","context-memory","workspace-sandbox","ui"
]) {
  const p = `capabilities/${name}/MANIFEST.md`;
  report.featureManifests[name] = { path: p, present: exists(p) };
  report.pass &&= report.featureManifests[name].present;
}

fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report, null, 2));
process.exit(report.pass ? 0 : 1);
