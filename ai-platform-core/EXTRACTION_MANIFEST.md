# AI Platform Core Extraction Manifest

## Immutable source rule

The Doable source snapshot and copied UI reference trees are immutable reference material. Do not edit, reformat, rename, refactor, optimize, or fix copied Doable source. Host-specific behavior belongs in adapters and compatibility layers.

## Captured Doable source

Source branch/ref: develop
Source commit: a6036d1fd6dca83c08ee5affa141e5c85e45f5af

## Extraction layers

1. doable-source/ — immutable AI/runtime source snapshot.
2. dependency-closure/ — required second-order runtime dependencies.
3. contracts/ — host-neutral capability contracts.
4. adapters/ — runtime compatibility and adapter implementations.
5. ui-reference/ — immutable Doable UX reference source.
6. UI_CAPABILITY_MATRIX.md — screen/state/capability inventory.
7. ADAPTER_ARCHITECTURE.md — concrete binding architecture.

## Practical adapters implemented

doable-runtime-adapters.ts implements the complete adapter set through explicit dependency injection:

Agent Runtime → Providers/Resolver → Tools → MCP → Integrations → Context → Workspace → Processes → Sandbox → RAG → Chat Transport → Voice → Secrets → Identity.

adapter-validation.ts verifies that the runtime adapter set is complete and reports UI coverage gaps separately from headless capabilities.

## UI/UX extraction

The UI reference layer now covers verified Doable AI-platform surfaces including:

- AI Settings shell, Connections, Model Configuration, Access Control and Doable AI.
- Provider wizard/card.
- Integration catalog, cards, connect flow and detail drawer.
- MCP panel and add-server form.
- Skills & Rules panel, skill picker and rules settings.
- Workspace Knowledge and Project Settings.
- Setup AI Provider and Setup Integrations/Billing.
- Dashboard delete/bulk-delete, rename, move-folder, template preview/remix and GitHub import dialogs.

The capability matrix explicitly models loading, populated, empty, validation, saving, success, error, restricted, disconnected, retry, disabled and destructive-confirmation states where applicable.

## Runtime coupling classifications

- Portable: agent/provider/tool/MCP/integration concepts and normalized streaming contracts.
- Host-specific: identity/tenant, database, filesystem, process execution, sandbox security, secret storage, RAG backend, transport and realtime voice.
- Infrastructure: PostgreSQL, Git, subprocesses, OS sandbox primitives, package/build runtimes and object storage.
- Doable-specific integrations: Activepieces ecosystem and Doable credential/storage mechanisms stay behind adapters.

## Verification

The extraction branch remains ahead of the immutable snapshot without modifying the original Doable source tree. Changes in this phase are confined to ai-platform-core/.
