"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTheme } from "next-themes";

export function MermaidDiagram({ code }: { code: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const { resolvedTheme } = useTheme();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { default: mermaid } = await import("mermaid");
        mermaid.initialize({
          startOnLoad: false,
          theme: resolvedTheme === "dark" ? "dark" : "default",
          securityLevel: "strict",
        });
        const { svg } = await mermaid.render(`mermaid-${id}`, code);
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not render diagram");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [code, id, resolvedTheme]);

  if (error) {
    return (
      <div className="code-block">
        <div className="code-block-header">
          <span>mermaid</span>
        </div>
        <pre>
          <code>{code}</code>
        </pre>
      </div>
    );
  }

  return <div ref={ref} className="mermaid-diagram" />;
}
