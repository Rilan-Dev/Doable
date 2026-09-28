# AI Platform Core Extraction

Status: Phase 1 — immutable source extraction
Source repository: Rilan-Dev/Doable
Source ref: develop (captured on branch ai-platform-core-extraction)
Extraction branch: ai-platform-core-extraction
Source commit: a6036d1fd6dca83c08ee5affa141e5c85e45f5af

## Non-negotiable source preservation

Every item under `ai-platform-core/doable-source/` is an exact Git object copy from the source tree.

Rules:
- Do not edit, reformat, rename, optimize, refactor, bug-fix, or otherwise alter copied Doable source.
- Do not change imports, prompts, schemas, function signatures, provider behavior, tool behavior, or configuration semantics inside copied source.
- Host-project adaptation must happen outside the immutable source area.
- Future extraction additions must record the original path and Git blob/tree SHA.
- Validation must compare Git object SHA (and, where materialized, byte SHA-256) between source and extracted files.

## Reusable capability domains

1. Agent runtime and execution
2. AI provider/model discovery and resolution
3. Copilot-backed agent engine and provider bridges
4. Context hierarchy, injection and budgeting
5. Skills and progressive skill loading
6. Built-in AI tools: files, shell, package install, build, validation, search, planning
7. Planning and plan execution
8. MCP clients, transports, connectors, discovery, tool bridge and SSRF protection
9. Native integrations, credential vault, OAuth, runners and tool bridge
10. Sandboxing, isolation, profiles, rules, auditing and worker/data execution
11. Chat sessions, persistence, streaming, events, tool callbacks and recovery
12. Shared AI provider/type catalogs and SDK/core packages

## Immutable extracted source

- `services/api/src/ai` — tree 13edcc7bd9726c38ea9bd4aab0d7825b2b8387d0
- `services/api/src/context` — tree 43424593729e9a6d23ce71731c7bf6991b7d6c8b
- `services/api/src/data-worker` — tree 41f76545e048af489e5b1a260ecb24dbb57c6125
- `services/api/src/integrations` — tree f8373823ec6063b9ff0f911d83c761d840f97a30
- `services/api/src/mcp` — tree 77fc1cff3ec48ba3bce21322befcf985003ac03c
- `services/api/src/sandbox` — tree d0028c442297801dbe57a546ea3ec4f6232adbb2
- `services/api/src/routes/chat` — tree 69ab556c027e51b655ce8760315ea5547a554b38
- `services/api/src/routes/integrations-admin.ts` — blob 82538892891afd1cd45368e51abb5f871dab8614
- `services/api/src/routes/integrations-catalog.ts` — blob ce092eae3e0f2ac96a3725f32a6b83893d9136d9
- `services/api/src/routes/integrations-connections.ts` — blob 748fe5d8afef2e4d2531ae93adba8747f129218a
- `services/api/src/routes/integrations-oauth.ts` — blob c158bb799e86e658a9cff553db9c8519b02fdb7b
- `services/api/src/routes/integrations.ts` — blob eb1e5297a630b80aef98c10cbae9bf55b3cff040
- `services/api/src/routes/mcp-apps-data.ts` — blob f01b197f66b9520eeb8b5417c4ca1cb1d88e0a3f
- `services/api/src/routes/plan.ts` — blob 85ffcc681be6f19b61c32a8c480d4651c7624b26
- `services/api/src/routes/provider-bridge.ts` — blob 0906f6c10213c6224969ac45d10b06785e64d6e7
- `services/api/src/routes/provider-catalog.ts` — blob ae7f2cc8e456627226466495a348261453c12713
- `services/api/src/routes/skills.ts` — blob 6f93fedd37dc3a8b079c96d9ed57581c9de3baba
- `services/api/src/routes/context.ts` — blob 552ef7c4251d1cb464cb61730097159fe4ed349b
- `services/api/src/routes/sandbox-rules.ts` — blob 267324003df3131c5d76da36d260f5acd9cd7d8d
- `services/api/src/routes/workspaces/sandbox.ts` — blob 51b2515a0c931b02e1ce9caea3aceccbd15f9644
- `packages/doable-ai` — tree 4df61ac8972c156009a661ebf599fb2b91b7ddab
- `packages/docore` — tree 2a33159a3b92f653ddf1514027982d454bea2fd4
- `packages/dovault` — tree 15532f8f7effbe8a7eb33b57333b113d64e7606
- `packages/shared` — tree 8dad7fcadfe23fb5e6d3b3d919f0501e59cfae71
- `packages/doable-sdk` — tree 32683d5cd4b42353e790000123176bb3b2eb8f2a

## Explicitly deferred

Doable product UI, editor UI, billing, authentication UX, project-management UX, and other host-specific product logic are not copied into the immutable core in this phase.

The next phase will build adapters/contracts around this source rather than modifying it. Clara will keep its Qdrant RAG implementation and voice providers independent; Dynamic UI and NexaHub can consume the same core through their own host adapters.

## Target architecture

`ai-platform-core/`
- `doable-source/` — immutable exact source snapshot
- `adapters/` — host-specific contracts and provider/RAG/identity adapters (future)
- `verification/` — exact-copy and integration tests (future)
- `docs/` — extraction/dependency maps (future)
