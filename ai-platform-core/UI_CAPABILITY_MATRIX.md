# AI Platform Core — UI/UX Capability Matrix

Source of truth: the verified Doable UI reference tree at the captured source commit. The reference implementation remains immutable and is not production UI.

## State vocabulary

Every reusable screen should model these states where applicable: initial/loading, populated, empty, validation, saving/submitting, success, recoverable error, permission denied/restricted, disconnected/expired, destructive confirmation, retry/reconnect, and disabled/read-only.

| Area | Screen / surface | Verified Doable reference | Primary capability | Interaction/state coverage |
|---|---|---|---|---|
| AI settings | AI Settings shell | `apps/web/src/modules/ai-settings/components/ai-settings-page.tsx` | providers | workspace selection; tabs; loading; access restricted; role-gated tab |
| AI settings | Connections | `.../connections-tab.tsx` | providers/secrets | personal vs workspace scope; add; OAuth; token form; validate; remove; loading; empty; error; success |
| AI settings | Model configuration | `.../model-config-tab.tsx` | providers | source selection; model selection; workspace defaults; user overrides; save; saved feedback; loading |
| AI settings | Access Control | `.../access-control-tab.tsx` | providers/identity | enforce AI; enforced source/model; visibility control; save; saved feedback; loading |
| AI settings | Doable AI | `.../doable-ai-tab.tsx` | agents/providers | AI feature configuration; admin gating; persistence states |
| AI settings | Provider wizard | `.../provider-wizard.tsx` | providers/secrets | modal; choose/configure/validate/models; search/filter; scope; credential entry; validation; save; close/reset |
| AI settings | Provider card | `.../provider-card.tsx` | providers | connected/invalid state; test; actions; health feedback |
| Integrations | Catalog | `apps/web/src/modules/integrations/integration-catalog.tsx` | integrations | search; category filter; pagination; loading skeleton; error; connected/available sections; detail; connect |
| Integrations | Integration card | `.../integration-card.tsx` | integrations | connection status; connect/disconnect; action affordances |
| Integrations | Connect flow | `.../connect-flow.tsx` | integrations/secrets | modal/flow; OAuth; manual credentials; enhanced auth; permissions; validation; saving; success/error |
| Integrations | Detail sheet | `.../integration-detail-sheet.tsx` | integrations | drawer/sheet; metadata; connection state; actions; close |
| MCP | MCP panel | `apps/web/src/modules/settings/components/mcp-panel.tsx` | mcp | list; refresh; active/inactive; reconnect; test; delete; loading; empty; error |
| MCP | Add server form | `.../mcp-add-server-form.tsx` | mcp/secrets | HTTP/stdio; auth; discovery; OAuth popup; validation; save; cancellation |
| Skills | Skills & Rules panel | `apps/web/src/modules/skills/skills-panel.tsx` | skills | scoped sections; expand/collapse; create; edit; delete; loading; empty; error |
| Skills | Skill picker popover | `.../skill-picker.tsx` | skills | portal popover; search; manual/auto invocation; no match; no configured skills; outside-click close |
| Skills | Skills rules settings | `apps/web/src/modules/settings/components/skills-rules-panel.tsx` | skills | rule configuration; scope; edit/delete; persistence states |
| Workspace | Knowledge | `apps/web/src/app/(dashboard)/workspace-settings/workspace-knowledge.tsx` | context/rag | knowledge list; editor; create/update/delete; empty; save/error feedback |
| Project | Project settings | `apps/web/src/modules/settings/components/project-settings.tsx` | workspace/sandbox | configuration tabs; status; danger zone; destructive confirmation |
| Setup | AI provider setup | `apps/web/src/app/setup/steps/Step2AIProvider.tsx` | providers | setup wizard; provider selection; OAuth; credentials; model selection; saving; success/error; skip |
| Setup | Integrations/billing setup | `apps/web/src/app/setup/steps/Step4Integrations.tsx` | integrations | collapsible configuration; secrets visibility; save status; success/error; plan defaults |
| Dashboard | Project dialogs | `apps/web/src/app/(dashboard)/dashboard/dashboard-dialogs.tsx` | workspace | delete/bulk-delete confirmation; rename; move-to-folder; template preview/remix; GitHub import |

## Reusable UX state contract

1. **Loading:** preserve the user's context; show skeleton/spinner without replacing the entire navigation shell.
2. **Empty:** explain what the capability does and provide the primary creation/connect action.
3. **Validation:** keep entered values; identify the failing field or external connection; allow retry.
4. **Saving:** disable duplicate submission and show progress on the initiating control.
5. **Success:** provide immediate confirmation and refresh dependent lists/models.
6. **Error:** keep the surface open, preserve input, show a concise actionable message, and offer retry.
7. **Permission denied:** explain whether the capability is unavailable, feature-disabled, or role-restricted.
8. **Disconnected/expired:** distinguish recoverable reconnect from permanent removal.
9. **Destructive confirmation:** identify the exact target and state whether the operation is reversible.
10. **Read-only/disabled:** explain why the control is disabled rather than silently hiding the capability.

## Host adaptation rules

- Keep capability and information architecture stable across hosts.
- Do not copy Doable's visual theme blindly.
- Map these surfaces into the host's existing navigation shell; do not create a competing sidebar.
- Preserve scope, permissions, status, and recovery interactions even when visual components are replaced.
- Keep backend adapters independent from UI components.
