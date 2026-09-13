/**
 * Runtime TSX Engine — ported from Dynamic UI Render.
 *
 * This is the core engine that transpiles TSX/JSX source strings in-browser
 * via @babel/standalone and renders them as live React components.
 *
 * Flow:
 *   TSX source string
 *     -> Babel.transform (presets: react+typescript, plugin: transform-modules-commonjs)
 *     -> CommonJS code
 *     -> new Function('require','module','exports','React', code)(...)
 *     -> module.exports.default -> a React component
 *     -> rendered live
 *
 * This module is designed as an ad-hoc feature for Doable — it enables
 * instant preview of TSX components without a dev server or build step.
 */

import * as React from 'react'
import * as ReactDomClient from 'react-dom/client'
import * as ReactJsxRuntime from 'react/jsx-runtime'
import * as Babel from '@babel/standalone'
import * as LucideIcons from 'lucide-react'
import * as RechartsLib from 'recharts'
import * as ClsxLib from 'clsx'
import * as TailwindMergeLib from 'tailwind-merge'
import * as CvaLib from 'class-variance-authority'

// ─── Module Registry ──────────────────────────────────────────
// Maps require() names to host module values. This is what makes the
// transpiled code able to import React, lucide icons, recharts, etc.

const MODULE_REGISTRY: Record<string, unknown> = {
  react: React,
  'react-dom': ReactDomClient,
  'react-dom/client': ReactDomClient,
  'react/jsx-runtime': ReactJsxRuntime,
  'react/jsx-dev-runtime': ReactJsxRuntime,
  '@babel/standalone': Babel,
  'lucide-react': LucideIcons,
  recharts: RechartsLib,
  clsx: ClsxLib,
  'tailwind-merge': TailwindMergeLib,
  'class-variance-authority': CvaLib,
}

export interface TranspileResult {
  Component: React.ComponentType<any> | null
  error: string | null
  durationMs: number
}

export function listAvailableModules(): string[] {
  return Object.keys(MODULE_REGISTRY).sort()
}

function createRuntimeRequire() {
  return function require(name: string): unknown {
    if (name in MODULE_REGISTRY) return MODULE_REGISTRY[name]
    const bare = name.split('/').pop() || ''
    if (bare && bare in MODULE_REGISTRY) return MODULE_REGISTRY[bare]
    throw new Error(
      `Runtime require: module "${name}" is not available in the registry. ` +
        `Allowed: react, react-dom, lucide-react, recharts, clsx, tailwind-merge, class-variance-authority`,
    )
  }
}

/**
 * Transpile a TSX/JSX source string into a live React component.
 */
export function transpileComponent(
  source: string,
  filename = 'runtime-component.tsx',
): TranspileResult {
  const t0 = typeof performance !== 'undefined' ? performance.now() : Date.now()
  if (!source || !source.trim()) {
    return { Component: null, error: 'Source is empty.', durationMs: 0 }
  }
  try {
    const { code } = Babel.transform(source, {
      presets: [
        ['react', { runtime: 'classic' }],
        ['typescript', { ignoreExtensions: true }],
      ],
      plugins: ['transform-modules-commonjs'],
      sourceMaps: false,
      sourceFileName: filename,
      filename,
    })
    if (!code) return { Component: null, error: 'Babel produced empty output.', durationMs: 0 }

    const mod: { exports: Record<string, unknown> } = { exports: {} }
    const req = createRuntimeRequire()
    const fn = new Function('require', 'module', 'exports', 'React', code)
    fn(req, mod, mod.exports, React)

    const def = (mod.exports.default as React.ComponentType<any>) || null
    if (!def) {
      const named = Object.values(mod.exports).find(
        (v) => typeof v === 'function' || (v && typeof v === 'object' && typeof (v as any).render === 'function'),
      ) as React.ComponentType<any> | undefined
      if (named) {
        return {
          Component: named,
          error: null,
          durationMs: Math.round((typeof performance !== 'undefined' ? performance.now() : Date.now()) - t0),
        }
      }
      return {
        Component: null,
        error: 'No default export found. Make sure your component has `export default function ...`.',
        durationMs: Math.round((typeof performance !== 'undefined' ? performance.now() : Date.now()) - t0),
      }
    }
    return {
      Component: def,
      error: null,
      durationMs: Math.round((typeof performance !== 'undefined' ? performance.now() : Date.now()) - t0),
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return { Component: null, error: msg, durationMs: Math.round((typeof performance !== 'undefined' ? performance.now() : Date.now()) - t0) }
  }
}

/**
 * Hook: transpile a source string and re-transpile when it changes (debounced).
 */
export function useRuntimeComponent(source: string, debounceMs = 350) {
  const [result, setResult] = React.useState<TranspileResult>({
    Component: null,
    error: null,
    durationMs: 0,
  })

  React.useEffect(() => {
    let cancelled = false
    const handle = setTimeout(() => {
      const r = transpileComponent(source)
      if (!cancelled) setResult(r)
    }, debounceMs)
    return () => {
      cancelled = true
      clearTimeout(handle)
    }
  }, [source, debounceMs])

  return result
}
