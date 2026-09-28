# AI Platform Core Extraction Manifest

## Immutable source rule

The Doable source snapshot and copied UI reference trees are immutable reference material. Do not edit, reformat, rename, refactor, optimize, or fix copied Doable source. Host-specific behavior belongs in adapters and compatibility layers.

## Captured source baseline

- Source repository: `Rilan-Dev/Doable`
- Source ref: `develop`
- Captured source commit: `a6036d1fd6dca83c08ee5affa141e5c85e45f5af`
- Extraction branch: `ai-platform-core-extraction`

## Requested reusable AI-platform capabilities

| Capability | Exact extracted source boundary | Status |
|---|---|---|
| AI provider abstractions and provider implementations | `doable-source/services/api/src/ai` + `doable-source/packages/shared/src/ai` + `doable-source/packages/doable-ai` | captured |
| Provider catalog/model metadata/discovery/validation | `doable-source/services/api/src/ai/provider-discovery*`, provider routes, shared provider catalog/data | captured |
| Agent engine and agent modes | `doable-source/services/api/src/ai/engine.ts`, `ai/modes/*`, provider/Copilot engine files | captured |
| Tool registry, definitions, execution and tool-calling loop | `doable-source/services/api/src/ai/tools`, `ai/modes/agent.ts`, Copilot tool loader/bridge | captured |
| Planning / plan execution / clarification | `doable-source/services/api/src/ai/modes/plan.ts`, plan tools/routes and context dependencies | captured |
| MCP protocol, transports, clients, connectors, discovery and tool bridge | `doable-source/services/api/src/mcp` + MCP routes | captured |
| Native integrations, catalog, connections, OAuth, enhanced auth, credential vault and tool bridge | `doable-source/services/api/src/integrations` + integration routes | captured |
| Skills, rules, scopes, progressive loading and materialization | `doable-source/services/api/src/ai/skills*`, context/skill dependencies and skills routes | captured |
| AI chat/session/streaming/events/tool callbacks/recovery | `doable-source/services/api/src/routes/chat` + AI streaming/session dependencies | captured |
| Context/memory/injection/budgeting | `doable-source/services/api/src/context` + context routes | captured |
| Workspace/project file operations and build/search/install tools | AI tools + projects/runtime/framework/git dependency closure | captured |
| Sandbox/isolation/process execution | `doable-source/services/api/src/sandbox`, runtime/git/framework/project closure | captured |
| SDK/client-side AI chat, embeddings and MCP agent helper | `doable-source/packages/doable-ai` and `doable-source/packages/doable-sdk` | captured |
| Shared AI types/catalogs | `doable-source/packages/shared` | captured |
| Core utility/secret packages | `doable-source/packages/docore`, `dovault`, shared/lib closure | captured |
| Required DB/auth/config compatibility dependencies | `dependency-closure/*` | captured as host-bound dependencies |
| AI/provider/settings/integration/MCP/skills/workspace UI | `ui-reference/apps/web/src/modules/*` and setup/workspace pages | captured |
| Agent/chat/tool-call UI and streaming interaction model | `ui-reference/apps/web/src/modules/editor/chat/*` plus editor state store and dashboard chat input | captured |
| Voice/realtime UI | Doable has no single native realtime voice UI equivalent; host voice UI remains an adapter concern | intentionally host-bound |

## Important distinction: reusable code vs host bindings

The extraction is not a new standalone product implementation. It is a **portable source library/reference** plus contracts and adapters.

- `doable-source/` is exact Doable source.
- `dependency-closure/` contains exact source required by that runtime but coupled to DB/filesystem/process/security infrastructure.
- `ui-reference/` contains exact Doable UI source used as the interaction-model reference.
- `contracts/` defines the host-neutral seam.
- `adapters/` translates a host into that seam.

A future host must not edit copied source to make it fit. It binds identity, tenancy, credentials, providers, RAG, persistence, filesystem, process execution, sandboxing and transport through adapters.

## Completeness rule

No host project should be treated as the next implementation target until the requested AI-platform source and UX domains above are present and the verification record confirms:

1. exact source commit is recorded;
2. immutable backend trees are present;
3. dependency closure is present;
4. provider catalog + provider implementations are present;
5. agent/tool/MCP/integration/skills/chat code is present;
6. relevant UI reference source is present;
7. capability matrix maps UI surfaces to runtime capabilities;
8. no copied source is modified by host integration work.

## Verification boundary

The original Doable source ref remains untouched. All extraction and reference additions are under `ai-platform-core/`. Host implementations belong in their own repositories.
