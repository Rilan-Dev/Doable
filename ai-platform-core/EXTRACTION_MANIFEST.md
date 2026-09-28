
## Phase 3 — practical adapter boundary

Added a host-neutral adapter registry and Doable compatibility bridge under ai-platform-core/adapters/.

The bridge deliberately does not import doable-source/. Hosts implement translation from their identity, persistence, provider, tool, MCP, integration, filesystem, process, sandbox, secrets, RAG, transport and voice systems into the contracts.

A machine-readable UI inventory maps representative Doable screens and dialogs to capability areas and interaction patterns. The immutable UI reference trees remain under ai-platform-core/ui-reference/ and are not production UI. Future hosts can preserve the interaction model while applying their own theme and existing navigation shell.
