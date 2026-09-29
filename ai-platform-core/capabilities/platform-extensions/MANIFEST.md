# Reusable Platform Extensions

This manifest promotes the second-pass Doable capabilities requested for reuse across unrelated host projects. The source under `doable-source-extensions/` is immutable reference source, copied by Git tree/blob identity from Doable `develop` at `a6036d1fd6dca83c08ee5affa141e5c85e45f5af`.

## Included source families

### AI execution and development
- Planning / clarification / approval: already in `capabilities/agents`, `capabilities/tools`, and core AI source.
- Attachments / image inputs: core `services/api/src/ai/attachments.ts` and chat/UI closure.
- Image generation / generated-image persistence: `doable-source/mcp-servers/image-generator/` and core MCP persistence.
- Usage / credits / quotas: core AI usage plus `doable-source-extensions/usage/` and `billing/`.
- Tracing / observability: API tracing, WS tracing, browser tracing and admin trace UI.
- Audit trail: admin audit source and audit UI.
- Project/runtime generation: dependency closure plus promoted build/runtime/editor source.
- Framework-aware prompting and templates: captured framework/template dependency closure and reusable template UI.
- GitHub workflow: complete API GitHub source and reusable GitHub UI flows.
- Version control / diff / restore: version-control source plus editor components/UI.
- Realtime collaboration/Yjs: complete WS service and collaboration UI.
- Visual AI editing: visual-edit, runtime-render, context-files and build source.

### AI productivity servers
- PDF builder
- Presentation builder
- Spreadsheet builder
- Markdown builder
- Image generator
- NotebookLM
- MCP shared UI helpers

### Product/platform capabilities
- Analytics
- Billing / credits / plans
- Authentication / MFA / OAuth
- Tenant/workspace/RBAC middleware
- Notifications
- Email providers/templates/queue
- Marketplace discovery/listings/moderation
- Custom-domain/deployment helpers
- Workspace/dashboard/settings UI
- Admin UI
- Editor panels/components/toolbar
- Marketplace/billing/usage/settings UI

## Source preservation rule

Do not modify these copies. A host project adapts:
- identity and tenancy
- persistence/database schema
- secrets/credential storage
- provider credentials
- RAG/vector store
- deployment/runtime infrastructure
- external OAuth/payment/email/domain providers
- routing and visual theme

The copied implementation and its interaction/state behavior remain the reference.

## Dependency rule

The extension source intentionally references existing `dependency-closure/` and `doable-source/` trees. Do not copy only a single file from an extension and assume it is complete; follow its imports and the dependency maps.

## Important host-bound extensions

Authentication, RBAC, billing, database schema, email, domains, deployment, and infrastructure are reusable implementation references but are not host-neutral. They must be bound through host adapters and security policies.

## Acceptance

1. Verify immutable source tree identities with `verification/verify-extraction.mjs`.
2. Verify external package manifests with `external-dependencies/verify-external-dependencies.mjs`.
3. Before host implementation, inspect this manifest and every referenced source/dependency/UI closure.
4. Do not alter immutable Doable source to fit the host.
