export type PlatformCapability = "agents"|"providers"|"tools"|"mcp"|"integrations"|"skills"|"context"|"memory"|"workspace"|"processes"|"sandbox"|"secrets"|"rag"|"chat"|"voice-realtime";
export interface CapabilityBinding { capability: PlatformCapability; contract: string; doableSources: string[]; uiReferencePaths: string[]; hostSpecific: boolean; }
export const CAPABILITY_BINDINGS: readonly CapabilityBinding[] = [
{capability:"agents",contract:"AgentRuntimeAdapter",doableSources:["services/api/src/routes/chat","services/api/src/ai"],uiReferencePaths:["modules/ai-settings"],hostSpecific:false},
{capability:"providers",contract:"ProviderRegistryAdapter/ProviderResolverAdapter",doableSources:["services/api/src/ai/provider.ts","services/api/src/ai/provider-discovery.ts"],uiReferencePaths:["modules/ai-settings","app/(dashboard)/ai-settings"],hostSpecific:true},
{capability:"tools",contract:"ToolRegistryAdapter",doableSources:["services/api/src/ai/tools"],uiReferencePaths:["modules/skills"],hostSpecific:true},
{capability:"mcp",contract:"MCPAdapter",doableSources:["services/api/src/mcp"],uiReferencePaths:["modules/settings"],hostSpecific:true},
{capability:"integrations",contract:"IntegrationAdapter",doableSources:["services/api/src/integrations"],uiReferencePaths:["modules/integrations"],hostSpecific:true},
{capability:"skills",contract:"skill runtime",doableSources:["services/api/src/ai/skills","services/api/src/ai/skills-materializer.ts"],uiReferencePaths:["modules/skills","modules/settings"],hostSpecific:true},
{capability:"context",contract:"ContextMemoryAdapter",doableSources:["services/api/src/context"],uiReferencePaths:["app/(dashboard)/workspace-settings"],hostSpecific:true},
{capability:"workspace",contract:"FileWorkspaceAdapter",doableSources:["services/api/src/projects","services/api/src/ai/tools"],uiReferencePaths:["modules/settings"],hostSpecific:true},
{capability:"processes",contract:"ProcessExecutionAdapter",doableSources:["services/api/src/runtime","services/api/src/git"],uiReferencePaths:["modules/settings"],hostSpecific:true},
{capability:"sandbox",contract:"SandboxAdapter",doableSources:["services/api/src/sandbox"],uiReferencePaths:["modules/settings"],hostSpecific:true},
{capability:"secrets",contract:"SecretCredentialAdapter",doableSources:["services/api/src/lib","services/api/src/integrations"],uiReferencePaths:["modules/integrations","modules/ai-settings"],hostSpecific:true},
{capability:"rag",contract:"RAGAdapter",doableSources:["services/api/src/ai"],uiReferencePaths:["app/(dashboard)/workspace-settings"],hostSpecific:true},
{capability:"chat",contract:"ChatTransportAdapter",doableSources:["services/api/src/routes/chat"],uiReferencePaths:["modules/ai-settings"],hostSpecific:true},
{capability:"voice-realtime",contract:"VoiceRealtimeAdapter",doableSources:[],uiReferencePaths:[],hostSpecific:true}];
