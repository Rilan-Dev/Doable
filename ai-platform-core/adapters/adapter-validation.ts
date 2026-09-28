import type { AIPlatformAdapters } from "./adapter-registry.js";
import { CAPABILITY_BINDINGS } from "./capability-map.js";
import { UI_REFERENCE_INVENTORY } from "./ui-inventory.js";

export interface AdapterValidationResult {
  ok: boolean;
  missingAdapters: string[];
  missingUiReferences: string[];
  capabilities: number;
  uiReferences: number;
}

export function validateAIPlatformAdapters(adapters: AIPlatformAdapters): AdapterValidationResult {
  const required: Array<[keyof AIPlatformAdapters, string]> = [
    ["identity", "identity"],
    ["providers", "providers"],
    ["agents", "agents"],
    ["tools", "tools"],
    ["mcp", "mcp"],
    ["integrations", "integrations"],
    ["workspace", "workspace"],
    ["processes", "processes"],
    ["sandbox", "sandbox"],
    ["context", "context"],
    ["rag", "rag"],
    ["transport", "chat"],
    ["voice", "voice-realtime"],
    ["secrets", "secrets"],
  ];

  const missingAdapters = required
    .filter(([key]) => adapters[key] == null)
    .map(([, capability]) => capability);

  const missingUiReferences = CAPABILITY_BINDINGS
    .filter((binding) => binding.uiReferencePaths.length === 0)
    .map((binding) => binding.capability);

  return {
    ok: missingAdapters.length === 0 && missingUiReferences.length === 0,
    missingAdapters,
    missingUiReferences,
    capabilities: CAPABILITY_BINDINGS.length,
    uiReferences: UI_REFERENCE_INVENTORY.length,
  };
}
