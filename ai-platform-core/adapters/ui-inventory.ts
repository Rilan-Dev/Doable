export interface UIReferenceScreen { id:string; area:"providers"|"integrations"|"mcp"|"skills"|"workspace"|"project"|"setup"|"dialogs"; sourcePath:string; interactionPatterns:readonly string[]; }
export const UI_REFERENCE_INVENTORY: readonly UIReferenceScreen[] = [
{id:"provider-settings",area:"providers",sourcePath:"apps/web/src/modules/ai-settings/components/ai-settings-page.tsx",interactionPatterns:["tabs","cards","status","configuration","validation"]},
{id:"provider-wizard",area:"providers",sourcePath:"apps/web/src/modules/ai-settings/components/provider-wizard.tsx",interactionPatterns:["stepper","credentials","model-selection","validation","success-error"]},
{id:"provider-card",area:"providers",sourcePath:"apps/web/src/modules/ai-settings/components/provider-card.tsx",interactionPatterns:["connection-state","actions","health-status"]},
{id:"integration-catalog",area:"integrations",sourcePath:"apps/web/src/modules/integrations/integration-catalog.tsx",interactionPatterns:["search","catalog","categories","cards","empty-state"]},
{id:"integration-connect",area:"integrations",sourcePath:"apps/web/src/modules/integrations/integration-connect-dialog.tsx",interactionPatterns:["dialog","oauth","credentials","permissions","validation"]},
{id:"integration-detail",area:"integrations",sourcePath:"apps/web/src/modules/integrations/integration-detail-sheet.tsx",interactionPatterns:["sheet","details","actions","connection-status"]},
{id:"mcp-panel",area:"mcp",sourcePath:"apps/web/src/modules/settings/components/mcp-panel.tsx",interactionPatterns:["list","status","enable-disable","reconnect","remove"]},
{id:"mcp-add-server",area:"mcp",sourcePath:"apps/web/src/modules/settings/components/mcp-add-server-form.tsx",interactionPatterns:["form","http-stdio","authentication","validation"]},
{id:"skills-panel",area:"skills",sourcePath:"apps/web/src/modules/skills/skills-panel.tsx",interactionPatterns:["list","scope","enable-disable","management"]},
{id:"skill-picker",area:"skills",sourcePath:"apps/web/src/modules/skills/skill-picker.tsx",interactionPatterns:["picker","search","selection"]},
{id:"skills-rules",area:"skills",sourcePath:"apps/web/src/modules/settings/components/skills-rules-panel.tsx",interactionPatterns:["rules","configuration","scope"]},
{id:"workspace-knowledge",area:"workspace",sourcePath:"apps/web/src/app/(dashboard)/workspace-settings/workspace-knowledge.tsx",interactionPatterns:["knowledge-list","editor","empty-state","save"]},
{id:"project-settings",area:"project",sourcePath:"apps/web/src/modules/settings/components/project-settings.tsx",interactionPatterns:["tabs","configuration","danger-zone","status"]},
{id:"setup-integrations",area:"setup",sourcePath:"apps/web/src/app/setup/steps/Step4Integrations.tsx",interactionPatterns:["wizard","selection","connection","progress"]},
{id:"setup-ai-provider",area:"setup",sourcePath:"apps/web/src/app/setup/steps/Step2AIProvider.tsx",interactionPatterns:["wizard","provider-selection","configuration"]},
{id:"dashboard-dialogs",area:"dialogs",sourcePath:"apps/web/src/app/(dashboard)/dashboard/dashboard-dialogs.tsx",interactionPatterns:["modal","confirmation","create","destructive-action"]}];
