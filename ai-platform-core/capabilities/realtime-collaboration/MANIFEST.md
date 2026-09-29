# Realtime AI Collaboration Capability

## Purpose
Complete Doable realtime collaboration service source for projects where AI execution, human collaboration, shared editing, and live previews must coexist.

## Immutable source
- `doable-source/services/ws/`
- Source commit: `a6036d1fd6dca83c08ee5affa141e5c85e45f5af`
- Preserve the copied source exactly. Do not refactor the immutable copy.

## Included behavior
- Authenticated WebSocket sessions and project rooms.
- Presence, multiple connections per user, heartbeats, idle state and reconnect grace periods.
- Team chat and typing indicators.
- File-open awareness, selections and cursor broadcasting.
- Yjs CRDT synchronization.
- Per-file Y.Text state with filesystem hydration and debounced persistence.
- AI-originated file writes/edits through CRDT so AI changes become collaborative updates.
- AI stream chunks, stream completion, tool events, status, errors, queue updates, typing and abort events.
- Visual edit selection, conflict detection, style/text changes and preview refresh events.
- Design comments with add/resolve/unresolve/delete lifecycle.
- Internal API endpoints for API→WS broadcast, AI/Yjs writes, collaboration-active checks and presence.
- OpenTelemetry tracing and PostgreSQL span export.
- Origin validation, JWT validation and internal-secret protection.

## Dependency closure
The service depends on host identity/JWT, project filesystem, PostgreSQL/project authorization, shared security helpers and the Yjs package. Reuse the complete copied service plus its package manifest rather than extracting individual message types.

## Host boundaries
- JWT issuer/secret and tenant authorization.
- Project filesystem/root.
- PostgreSQL schema and RLS/access queries.
- Internal API URLs/secrets.
- Public WebSocket endpoint and origin allowlist.
- Telemetry storage.
- Host editor/preview UI.

## Why this is separate from generic AI core
The generic AI runtime produces agent/tool/model events. This capability transports those events into a collaborative workspace and synchronizes AI-originated edits with humans through CRDT state.
