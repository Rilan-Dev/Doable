/**
 * Runtime Render Module — ad-hoc feature ported from Dynamic UI Render.
 *
 * Enables in-browser TSX transpilation and live preview within Doable's editor.
 *
 * IMPORTANT: transpileComponent is async (lazy-loads @babel/standalone + recharts).
 * The packages must be installed (pnpm install) for the runtime preview to work,
 * but the app boots fine without them — they're only loaded when the user clicks
 * the "Runtime" tab.
 */

export { transpileComponent, listAvailableModules, type TranspileResult } from "./runtime-engine";
export { RuntimePreview, type RuntimePreviewProps } from "./runtime-preview";
