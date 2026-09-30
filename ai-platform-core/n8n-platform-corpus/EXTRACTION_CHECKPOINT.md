# n8n Complete Platform Corpus — Mechanical Inventory Checkpoint

## Source
- Repository: `Rilan-Dev/n8n`
- Ref: `master`
- Pinned commit: `31b6649d783ded919757ccd64259ea8a891c0955`
- Root Git tree SHA: `31b6649d783ded919757ccd64259ea8a891c0955`
- Recursive tree scan: complete (not truncated)

## Exact inventory
- Git tree entries: 36,795
- Files/blobs: 29,873
- Direct `package.json` manifests: 97
- TypeScript: 21,695
- JSON: 3,854
- Vue: 1,338
- Markdown: 710
- SVG: 623
- YAML/YML: 390
- Python: 69
- MJS/JS/CJS/MTS: 416
- CSS/SCSS: 101+
- Other runtime/support/config/test/assets are retained by the complete-tree policy.

## Repository-wide boundary
The complete pinned tree is the source-of-truth. Capability indexes must point into the exact snapshot; source must not be duplicated into capability folders.

The inventory includes application code, packages, nodes, credentials, AI, agents, MCP, browser/computer use, workflow/runtime, frontend/editor, collaboration, chat, storage/database, task runners, Python runtime, scheduler, telemetry/observability, extensions, tests, fixtures, prompts, skills, templates, manifests, migrations, generated documentation, Docker/operational source, security policy, and repository agent instructions.

## Important newly verified roots
- `packages/@n8n/task-runner-python/` exists and contains Python runtime source, tests, `pyproject.toml`, `uv.lock`, and runtime tooling.
- `packages/@n8n/instance-ai/src/` contains agent, runtime, tools, tool registry, MCP, memory, knowledge-base, planned-tasks, workflow-builder, workflow-loop, skills, workspace, streaming, tracing, debugging, storage, prompts and evaluation/test material.
- `packages/@n8n/agents/src/` contains evals, integrations, runtime, SDK, skills, storage, vector stores and workspace.
- `packages/@n8n/workflow-sdk/src/` contains AST interpretation, codegen, type generation, lint, validation, prompts, mock data and workflow builder.
- `packages/@n8n/engine/src/` contains graph, execution, runtime, queue, response channel, lifecycle events, persistence/database, auth and testing.
- `packages/@n8n/mcp-browser/src/` contains discovery, connections, CDP relay, extension connectivity, redaction, sensitivity, server configuration and tools.
- `packages/@n8n/computer-use/src/` contains gateway client/session, configuration, settings and computer-use tools.
- `packages/@n8n/local-gateway/` contains local gateway runtime, assets, scripts and configuration.
- `packages/extensions/insights/` is a first-party extension with an n8n manifest plus backend/frontend source.
- `docs/generated/postgres-schema/` contains generated database schema documentation, including agent, chat, execution, project, workflow and AI-related tables.

## Legal boundary
Root licensing files include `LICENSE.md` and `LICENSE_EE.md`. Restricted/EE source must be retained for provenance but classified explicitly as restricted. Source preservation never implies redistribution permission.

## Extraction state
This checkpoint records inventory only. It does NOT claim that 29,873 files have already been copied into the corpus. The next mechanical stage is exact source capture plus blob/tree verification, followed by recursive first-party package/dependency closure and external dependency inventory.
