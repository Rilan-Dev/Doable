/**
 * Runtime Render Module — ad-hoc feature ported from Dynamic UI Render.
 *
 * Enables in-browser TSX transpilation and live preview within Doable's editor.
 * This module provides:
 *   - transpileComponent(): the core @babel/standalone transpile + execute engine
 *   - useRuntimeComponent(): React hook for debounced transpilation
 *   - RuntimePreview: a React component that renders transpiled TSX live
 *   - listAvailableModules(): lists the modules available in the require registry
 *
 * Integration points:
 *   - Add as a new ViewMode "runtime" in the editor
 *   - Or as a sidebar panel that shows a live preview of the current file
 *   - Works alongside the existing dev-server-based preview
 */

export { transpileComponent, useRuntimeComponent, listAvailableModules, type TranspileResult } from "./runtime-engine";
export { RuntimePreview, type RuntimePreviewProps } from "./runtime-preview";
