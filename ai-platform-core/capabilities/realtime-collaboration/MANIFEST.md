# Realtime AI Collaboration Capability

## Purpose
Reusable Doable realtime service for AI-assisted collaborative project work.

## Immutable source
`doable-source/services/ws/`

Source commit: `a6036d1fd6dca83c08ee5affa141e5c85e45f5af`.

## Included behavior
- WebSocket service and room lifecycle.
- Project-scoped realtime rooms and presence.
- AI stream chunk/status/error events.
- AI tool-event propagation.
- AI queue/typing/message/abort events.
- Collaborative Yjs document synchronization.
- Room idle cleanup and persistence.
- Realtime tracing/instrumentation and PostgreSQL trace export.
- Shared state required for AI edits to become visible to collaborators.

## Host boundaries
- Authentication and tenant authorization.
- WebSocket deployment/upgrade endpoint.
- PostgreSQL connection and schema.
- Yjs document persistence policy.
- Client editor/preview implementation.
- Domain-specific visual-edit and comment UI.

## Reuse rule
Copy the complete service source and its package manifest when realtime AI collaboration is required. Do not copy isolated event handlers while omitting room, Yjs, persistence, or tracing dependencies.
