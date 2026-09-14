/**
 * Runtime TSX Engine — ported from Dynamic UI Render.
 *
 * Transpiles TSX/JSX source strings in-browser via @babel/standalone and
 * renders them as live React components.
 *
 * IMPORTANT: @babel/standalone is loaded from CDN (unpkg) via a dynamic
 * <script> tag — it is NOT an npm dependency. This means:
 *   - No package.json changes needed
 *   - No pnpm-lock.yaml update needed
 *   - Docker build works as-is
 *   - The package loads on demand when the user clicks the "Runtime" tab
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

// ─── CDN loading of @babel/standalone ─────────────────────────
// We load @babel/standalone from unpkg CDN via a <script> tag so it
// doesn't need to be an npm dependency. This keeps the Docker image
// small and avoids lockfile issues.

let _babelLoaded = false
let _babelLoadPromise: Promise<any> | null = null

function loadBabelFromCDN(): Promise<any> {
  if (_babelLoaded && (window as any).Babel) {
    return Promise.resolve((window as any).Babel)
  }
  if (_babelLoadPromise) return _babelLoadPromise

  _babelLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/@babel/standalone@7.25.6/babel.min.js'
    script.async = true
    script.onload = () => {
      _babelLoaded = true
      const babel = (window as any).Babel
      if (babel) {
        resolve(babel)
      } else {
        reject(new Error('Babel loaded but not found on window'))
      }
    }
    script.onerror = () => {
      _babelLoadPromise = null
      reject(new Error('Failed to load @babel/standalone from CDN. Check your internet connection.'))
    }
    document.head.appendChild(script)
  })

  return _babelLoadPromise
}

// ─── Module Registry ──────────────────────────────────────────
// Maps require() names to host module values. recharts is loaded lazily
// from CDN too (optional — if it fails, the registry just has an empty object).

let _rechartsLoaded = false
let _rechartsLoadPromise: Promise<any> | null = null

function loadRechartsFromCDN(): Promise<any> {
  if (_rechartsLoaded) {
    return Promise.resolve((window as any).Recharts || {})
  }
  if (_rechartsLoadPromise) return _rechartsLoadPromise

  _rechartsLoadPromise = new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/recharts@2.15.0/dist/recharts.min.js'
    script.async = true
    script.onload = () => {
      _rechartsLoaded = true
      resolve((window as any).Recharts || {})
    }
    script.onerror = () => {
      // recharts is optional — resolve with empty object if it fails.
      _rechartsLoaded = true
      resolve({})
    }
    document.head.appendChild(script)
  })

  return _rechartsLoadPromise
}

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
  return [
    'react', 'react-dom', 'react-dom/client', 'react/jsx-runtime',
    '@babel/standalone', 'lucide-react', 'recharts',
    'clsx', 'tailwind-merge', 'class-variance-authority',
  ].sort()
}

/**
 * Transpile a TSX/JSX source string into a live React component.
 * Async because it lazy-loads @babel/standalone from CDN on first call.
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
    // Lazy-load babel + recharts from CDN.
    const [babel, recharts] = await Promise.all([
      loadBabelFromCDN(),
      loadRechartsFromCDN(),
    ])
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
