"use client";

/**
 * RuntimePreview — ported from Dynamic UI Render.
 *
 * Renders a TSX source string live in-browser using the Runtime Engine.
 * This component is the ad-hoc integration point for Doable's editor —
 * it provides instant preview without a dev server.
 *
 * NOTE: transpileComponent is now async (lazy-loads @babel/standalone).
 *
 * Usage:
 *   <RuntimePreview source={tsxSource} />
 */

import React, { Component, type ErrorInfo, type ReactNode, useEffect, useState } from "react";
import { AlertCircle, Cpu, Loader2, Sparkles } from "lucide-react";
import { transpileComponent, type TranspileResult } from "./runtime-engine";
import { cn } from "@/lib/utils";

// Extract a friendly component name from source.
function extractComponentName(source: string): string | null {
  if (!source) return null;
  const patterns = [
    /export\s+default\s+function\s+([A-Z_$][A-Za-z0-9_$]*)/,
    /export\s+default\s+(?:const|let|var)\s+([A-Z_$][A-Za-z0-9_$]*)/,
    /function\s+([A-Z_$][A-Za-z0-9_$]*)\s*\(/,
    /(?:const|let|var)\s+([A-Z_$][A-Za-z0-9_$]*)\s*=\s*(?:\(|function)/,
  ];
  for (const re of patterns) {
    const m = source.match(re);
    if (m && m[1]) return m[1];
  }
  return null;
}

// ErrorBoundary so a runtime crash inside the user's component does not nuke the page.
class RuntimeBoundary extends Component<
  { resetKey: string; children: ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[RuntimePreview] component crashed:", error, info);
  }
  componentDidUpdate(prev: { resetKey: string }) {
    if (prev.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null });
    }
  }
  render() {
    if (this.state.error) {
      return (
        <div className="rounded-md border border-rose-300 bg-rose-50 p-3 text-sm dark:border-rose-900/60 dark:bg-rose-950/40">
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <div className="min-w-0">
              <p className="font-semibold text-rose-700 dark:text-rose-300">Runtime error</p>
              <pre className="mt-1 whitespace-pre-wrap break-words font-mono text-xs text-rose-700 dark:text-rose-300">
                {this.state.error.message}
              </pre>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Hook that calls the async transpileComponent with debouncing.
function useRuntimeComponent(source: string, debounceMs = 350) {
  const [result, setResult] = useState<TranspileResult>({
    Component: null,
    error: null,
    durationMs: 0,
  })
  const [isStale, setIsStale] = useState(false)

  useEffect(() => {
    let cancelled = false
    setIsStale(true)
    const handle = setTimeout(async () => {
      const r = await transpileComponent(source)
      if (!cancelled) {
        setResult(r)
        setIsStale(false)
      }
    }, debounceMs)
    return () => {
      cancelled = true
      clearTimeout(handle)
    }
  }, [source, debounceMs])

  return { ...result, isStale }
}

export interface RuntimePreviewProps {
  source: string;
  /** Hide chrome (badges, header) — useful for small previews. */
  bare?: boolean;
  className?: string;
}

export function RuntimePreview({ source, bare = false, className }: RuntimePreviewProps) {
  const result = useRuntimeComponent(source);
  const name = extractComponentName(source);
  const Comp = result.Component;

  const resetKey = `${name || "anon"}:${source.length}:${result.durationMs}:${result.error ? "err" : "ok"}`;
  const showTranspiling = result.isStale && !result.error && !Comp;

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-xl border bg-white shadow-sm overflow-hidden dark:bg-zinc-900",
        className,
      )}
    >
      {!bare && (
        <div className="flex items-center justify-between gap-2 border-b bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex size-6 items-center justify-center rounded-md bg-teal-500 text-white">
              <Sparkles className="size-3.5" />
            </span>
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-xs font-medium text-muted-foreground">Runtime Preview</span>
              {name && (
                <span className="rounded bg-zinc-200 dark:bg-zinc-700 px-1.5 py-0.5 font-mono text-[10px] truncate max-w-[160px]">
                  {name}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {showTranspiling ? (
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Loader2 className="size-3 animate-spin" /> Transpiling…
              </span>
            ) : result.error ? (
              <span className="rounded bg-rose-100 dark:bg-rose-950/40 px-1.5 py-0.5 text-[10px] text-rose-600 dark:text-rose-400">
                Error
              </span>
            ) : result.durationMs > 0 ? (
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Cpu className="size-3" /> {result.durationMs}ms
              </span>
            ) : null}
          </div>
        </div>
      )}

      <div className="relative flex-1 overflow-auto bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:14px_14px] p-4">
        {result.error ? (
          <div className="rounded-md border border-rose-300 bg-rose-50 p-3 text-sm dark:border-rose-900/60 dark:bg-rose-950/40">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-rose-600 dark:text-rose-400" />
              <div className="min-w-0">
                <p className="font-semibold text-rose-700 dark:text-rose-300">Transpile failed</p>
                <pre className="mt-1 whitespace-pre-wrap break-words font-mono text-xs text-rose-700 dark:text-rose-300">
                  {result.error}
                </pre>
              </div>
            </div>
          </div>
        ) : !source.trim() ? (
          <div className="flex h-full min-h-[160px] items-center justify-center text-sm text-muted-foreground">
            Source is empty — start typing TSX.
          </div>
        ) : Comp ? (
          <RuntimeBoundary resetKey={resetKey}>
            <div className="mx-auto w-full max-w-full origin-top-left">
              <Comp />
            </div>
          </RuntimeBoundary>
        ) : (
          <div className="flex h-full min-h-[160px] items-center justify-center text-sm text-muted-foreground">
            <Loader2 className="mr-2 size-4 animate-spin" />
            {result.isStale ? "Transpiling…" : "Loading runtime engine…"}
          </div>
        )}
      </div>
    </div>
  );
}
