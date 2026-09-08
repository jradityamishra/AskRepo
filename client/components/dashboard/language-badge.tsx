import { Code2 } from "lucide-react";

import { LanguageIcon, type LanguageName } from "@/components/icons/languaga-icons";
import { cn } from "@/lib/utils";

const LANGUAGE_MAP: Record<string, LanguageName> = {
  javascript: "javascript",
  typescript: "typescript",
  python: "python",
  java: "java",
  html: "html",
  css: "css",
  react: "react",
  node: "node",
};

function resolveLanguage(language: string | null | undefined): LanguageName | null {
  if (!language) return null;
  return LANGUAGE_MAP[language.trim().toLowerCase()] ?? null;
}

export function LanguageBadge({
  language,
  showLable = true,
  className,
}: {
  language: string | null | undefined;
  showLable?: boolean;
  className?: string;
}) {
  const known = resolveLanguage(language);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground",
        className
      )}
    >
      {known ? (
        <LanguageIcon language={known} size={14} className="shrink-0 rounded-[3px]" />
      ) : (
        <Code2 className="size-3.5 shrink-0" />
      )}
      {showLable && <span className="truncate">{language || "Unknown"}</span>}
    </span>
  );
}
