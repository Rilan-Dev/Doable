/**
 * Runtime TSX Engine — ported from Dynamic UI Render.
 *
 * This is the core engine that transpiles TSX/JSX source strings in-browser
 * via @babel/standalone and renders them as live React components.
 *
 * IMPORTANT: @babel/standalone and recharts are loaded LAZILY (dynamic import)
 * so they don't need to be installed for the app to boot. They're only loaded
 * when the user actually clicks the "Runtime" tab.
 *
 * Flow:
 *   TSX source string
 *     -> Babel.transform (presets: react+typescript, plugin: transform-modules-commonjs)
 *     -> CommonJS code
 *     -> new Function('require','module','exports','React', code)(...)
 *     -> module.exports.default -> a React component
 *     -> rendered live
 */

import * as React from 'react'
import * as ReactDomClient from 'react-dom/client'
import * as ReactJsxRuntime from 'react/jsx-runtime'
import * as LucideIcons from 'lucide-react'
import * as ClsxLib from 'clsx'
import * as TailwindMergeLib from 'tailwind-merge'
import * as CvaLib from 'class-variance-authority'

// ─── Lazy-loaded modules ──────────────────────────────────────
// @babel/standalone and recharts are loaded dynamically only when
// transpileComponent() is first called. This prevents build-time
// import errors when these packages aren't installed yet.

let _babel: typeof import('@babel/standalone') | null = null
let _recharts: typeof import('recharts') | null = null

async function ensureBabel() {
  if (!_babel) {
    _babel = await import('@babel/standalone')
  }
  return _babel
}

async function ensureRecharts() {
  if (!_recharts) {
    try {
      _recharts = await import('recharts')
    } catch {
      _recharts = {} as any
    }
  }
  return _recharts
}

// ─── Module Registry ──────────────────────────────────────────
// Maps require() names to host module values. This is what makes the
// transpiled code able to import React, lucide icons, recharts, etc.
// Built dynamically so lazy-loaded modules are included once loaded.

function buildModuleRegistry(babel: any, recharts: any): Record<string, unknown> {
  return {
    react: React,
    'react-dom': ReactDomClient,
    'react-dom/client': ReactDomClient,
    'react/jsx-runtime': ReactJsxRuntime,
    'react/jsx-dev-runtime': ReactJsxRuntime,
    '@babel/standalone': babel,
    'lucide-react': LucideIcons,
    recharts: recharts,
    clsx: ClsxLib,
    'tailwind-merge': TailwindMergeLib,
    'class-variance-authority': CvaLib,
  }
}

export interface TranspileResult {
  Component: React.ComponentType<any> | null
  error: string | null
  durationMs: number
}

export function listAvailableModules(): string[] {
  const modules = [
    'react', 'react-dom', 'react-dom/client', 'react/jsx-runtime',
    '@babel/standalone', 'lucide-react', 'recharts',
    'clsx', 'tailwind-merge', 'class-variance-authority',
  ]
  return modules.sort()
}

/**
 * Transpile a TSX/JSX source string into a live React component.
 * This is async because it lazy-loads @babel/standalone on first call.
 */
export async function transpileComponent(
  source: string,
  filename = 'runtime-component.tsx',
): Promise<TranspileResult> {
  const t0 = typeof performance !== 'undefined' ? performance.now() : Date.now()
  if (!source || !source.trim()) {
    return { Component: null, error: 'Source is empty.', durationMs: 0 }
  }
  try {
    // Lazy-load babel + recharts on first use.
    const [babel, recharts] = await Promise.all([ensureBabel(), ensureRecharts()])
    const registry = buildModuleRegistry(babel, recharts)

    const { code } = babel.transform(source, {
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

    function require(name: string): unknown {
      if (name in registry) return registry[name]
      const bare = name.split('/').pop() || ''
      if (bare && bare in registry) return registry[bare]
      throw new Error(
        `Runtime require: module "${name}" is not available in the registry. ` +
          `Allowed: react, react-dom, lucide-react, recharts, clsx, tailwind-merge, class-variance-authority`,
      )
    }

    // eslint-disable-next-line no-new-func
    const fn = new Function('require', 'module', 'exports', 'React', code)
    fn(require, mod, mod.exports, React)

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
