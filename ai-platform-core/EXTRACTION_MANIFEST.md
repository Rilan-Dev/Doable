# AI Platform Core Extraction

Status: Phase 2 — second-order dependency audit complete
Source repository: Rilan-Dev/Doable
Source ref: develop
Extraction branch: ai-platform-core-extraction
Captured source commit: a6036d1fd6dca83c08ee5affa141e5c85e45f5af

## Immutable-copy rule

All content under `ai-platform-core/doable-source/` and `ai-platform-core/dependency-closure/` is copied by reusing the original Git tree/blob objects.

Do not edit, format, rename, optimize, refactor, bug-fix, or alter these copied files. Host-specific behavior belongs in future adapters.

## Dependency-closure classification

### A — Reusable AI core
- `services/api/src/ai`
- `services/api/src/context`
- `services/api/src/integrations`
- `services/api/src/mcp`
- `services/api/src/sandbox`
- `services/api/src/data-worker`
- `services/api/src/routes/chat`
- relevant provider/integration/context/skills/sandbox/plan routes
- `packages/doable-ai`
- `packages/docore`
- `packages/dovault`
- `packages/shared`
- `packages/doable-sdk`

These contain the requested agent, provider, tool, MCP, integration, sandbox, file, planning, chat and AI infrastructure.

### B — Required infrastructure / compatibility dependencies

Second-order closure additions (copied exactly by original Git tree identity):
- `services/api/src/templates` — tree `1289c0ae29d5dc893c6f2db5c80b893f177b1e52` (Doable-only scaffold/template dependency).
- `services/api/src/git` — tree `830aa877f377e78e9e1df3703ec4ebe8d2158846` (Git CLI/project versioning host dependency).
- `services/api/src/runtime` — tree `ae8aa7c249b90eaf6dd66ec82d5d47021d2aeb79` (process, ports, dev-server and sandbox runtime dependency).

Copied exactly under `dependency-closure/`:
- `packages/db` — complete DB query/type/migration package required by the AI runtime and chat/integration/MCP configuration.
- `services/api/src/db` — API SQL runtime.
- `services/api/src/frameworks` — build/dev framework adapter dependency used by AI build tooling.
- `services/api/src/projects` — project filesystem, safety and AI-write guard dependencies.
- `services/api/src/lib` — secrets, crypto, platform configuration and shared API utilities referenced by the runtime.
- `services/api/src/middleware` — authentication/credits/rate-limit/access dependencies used by chat routes.

### C — Narrow Doable-specific runtime coupling retained verbatim
Copied into the immutable source area because the AI runtime directly imports them:
- `services/api/src/routes/compat-proxy.ts`
- `services/api/src/routes/auth/platform-ai-bootstrap.ts`

These are not considered platform contracts. They will be replaced or wrapped by adapters when the extracted core is consumed by Clara, Dynamic UI, NexaHub or another host.

## Important findings

The closure confirms the AI code is not a standalone package. Its primary external coupling is:
1. SQL/database query layer and Doable schema.
2. Project filesystem/framework adapters.
3. API secret/crypto/config helpers.
4. Authentication/access/rate-limit middleware.
5. Two provider bootstrap/compatibility routes.

The closure does NOT justify extracting Doable's entire product UI, billing, editor, deployment UI, or authentication UX.

## RAG boundary

Doable's AI runtime and embedding/provider abstractions can be reused, but Clara's Qdrant knowledge base must remain a host adapter. The extraction does not replace Clara's existing RAG store with Doable's application DB.

## Second-order audit result

The closure is now source-complete for the inspected file-manager/project-runtime path. Remaining dependencies are primarily external packages and host capabilities rather than missing Doable source. The detailed classification is recorded in `ai-platform-core/SECOND_ORDER_DEPENDENCY_AUDIT.md`.

Key boundaries: GitHub Copilot CLI/SDK, PostgreSQL/Doable schema, filesystem/project roots, subprocess execution, OS sandbox primitives, identity/tenant context, secret/key material, MCP network/process execution, third-party integration packages, and host RAG/vector storage.

Redis/RabbitMQ were not found as direct dependencies in the inspected `services/api/package.json`; they are not being added speculatively.

## Next phase

Build a clean host-neutral contract layer outside the immutable snapshot:
- AgentRuntimeAdapter
- ProviderRegistry/ProviderResolverAdapter
- ToolRegistryAdapter
- MCPAdapter
- IntegrationAdapter
- SandboxAdapter
- FileWorkspaceAdapter
- ChatTransportAdapter
- PlanningAdapter
- Context/MemoryAdapter
- RAGAdapter
- Voice/RealtimeAdapter

No copied Doable source is to be modified to implement those contracts.
