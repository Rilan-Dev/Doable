"use client";

/**
 * RuntimePreviewPanel — Doable integration wrapper.
 *
 * Reads the active file's source from the editor store and renders it live
 * using the RuntimePreview (in-browser TSX transpilation via @babel/standalone).
 *
 * This panel replaces the iframe-based dev-server preview with an instant
 * in-browser render — no build step required. Useful for:
 *   - Quick TSX component previews without spinning up a dev server
 *   - Runtime UI rendering when the dev server is unavailable
 *   - Sharing live component previews
 */

import { useMemo } from "react";
import { useEditorStore } from "../hooks/use-editor-store";
import { RuntimePreview } from "../runtime-render";
import { Code2, Info } from "lucide-react";

export function RuntimePreviewPanel() {
  const activeFilePath = useEditorStore((s) => s.activeFilePath);
  const activeFileContent = useEditorStore((s) => s.activeFileContent);

  // Get the source of the active file.
  const source = useMemo(() => {
    return activeFileContent || "";
  }, [activeFileContent]);

  // Check if the active file is a TSX/JSX file.
  const isTsxFile = useMemo(() => {
    if (!activeFilePath) return false;
    return /\.(tsx|jsx)$/i.test(activeFilePath);
  }, [activeFilePath]);

  if (!activeFilePath) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center">
          <Code2 className="mx-auto size-10 text-muted-foreground/40" />
          <p className="mt-3 text-sm font-medium text-muted-foreground">
            No file open
          </p>
          <p className="text-xs text-muted-foreground">
            Open a TSX/JSX file to see it rendered live.
          </p>
        </div>
      </div>
    );
  }

  if (!isTsxFile) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center">
          <Info className="mx-auto size-10 text-muted-foreground/40" />
          <p className="mt-3 text-sm font-medium text-muted-foreground">
            Not a TSX/JSX file
          </p>
          <p className="text-xs text-muted-foreground">
            Runtime preview works with .tsx and .jsx files.
            <br />
            Active file: <code className="font-mono">{activeFilePath}</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-4 overflow-auto">
      <RuntimePreview source={source} className="h-full" />
    </div>
  );
}
