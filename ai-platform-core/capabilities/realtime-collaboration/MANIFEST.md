# Realtime AI Collaboration Capability

## Purpose
Reusable realtime transport and collaborative state layer for AI-assisted applications.

## Immutable source
- `doable-source/services/ws/`
- UI collaboration reference: `ui-reference/apps/web/src/modules/collaboration/`
- AI visual-edit source: `doable-source/apps/web/src/modules/editor/visual-edit/`

## Behavior
- WebSocket rooms and connection lifecycle.
- AI stream chunks, status, tool events and queue state.
- Abort and user-interaction events.
- Yjs collaborative document synchronization.
- Presence and cursor state.
- Realtime editor/preview coordination.
- Collaboration tracing.
- Visual editing and design/sticky-note interactions.

## Host boundaries
Authentication/tenant resolution, room authorization, persistence, WebSocket deployment, optional pub/sub, object storage and artifact persistence remain host adapters.

Preserve authorization and sandbox assumptions when adapting this service.
