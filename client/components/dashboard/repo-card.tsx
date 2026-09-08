"use client";

import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ExternalLink,
  GitBranch,
  Lock,
  MessageSquare,
  RotateCcw,
} from "lucide-react";
import { IndexErrorAlert } from "@/components/dashboard/index-error-alert";
import { LanguageBadge } from "@/components/dashboard/language-badge";
import { IndexStatusBadge } from "@/components/dashboard/index-status-badge";
import { Button } from "@/components/ui/button";
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { getRepoProgress, useStartIndexing } from "@/hooks/use-repo";
import type { Repository } from "@/lib/api";
import { cn } from "@/lib/utils";
export function RepoCard({ repo }: { repo: Repository }) {
  const router = useRouter();
  const indexMutation = useStartIndexing();
  const isIndexing = repo.indexStatus === "INDEXING" || indexMutation.isPending;
  const isFailed = repo.indexStatus === "FAILED";
  const isReady = repo.indexStatus === "READY";
  const progress = getRepoProgress(repo);

  function openChat() {
    router.push(`/chat/${repo.id}`);
  }

  function startIndexing() {
    if (isIndexing) return;
    indexMutation.mutate(repo.id);
  }

  return (
    <article
      className={cn(
        "flex flex-col gap-4 rounded-2xl border bg-card p-5 ring-1 ring-foreground/10 transition-shadow hover:shadow-md",
        isIndexing && "border-primary/30",
        isFailed && "border-destructive/40"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <LanguageBadge language={repo.language} showLable={false} className="mt-0.5 size-8 shrink-0 justify-center rounded-lg p-0" />
          <div className="min-w-0">
            <p className="truncate text-xs text-muted-foreground">{repo.owner}</p>
            <h3 className="truncate text-sm font-semibold" title={repo.name}>
              {repo.name}
            </h3>
          </div>
        </div>
        <IndexStatusBadge indexStatus={repo.indexStatus} className="shrink-0" />
      </div>

      {!isFailed && (
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {repo.description || "No description available."}
        </p>
      )}

      {isFailed && (
        <IndexErrorAlert
          message={repo.errorMessage}
          onRetry={() => indexMutation.mutate(repo.id)}
          isRetrying={indexMutation.isPending}
        />
      )}

      {isIndexing && (
        <Progress value={progress} className="gap-1.5">
          <ProgressLabel className="flex w-full justify-between text-xs font-normal text-muted-foreground">
            {repo.filesProcessed} / {repo.filesTotal || "?"} files processed
            <ProgressValue />
          </ProgressLabel>
        </Progress>
      )}

      <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <GitBranch className="size-3.5" />
          {repo.defaultBranch}
        </span>
        {repo.isPrivate && (
          <span className="flex items-center gap-1">
            <Lock className="size-3.5" />
            Private
          </span>
        )}
        {repo.htmlUrl && (
          <a
            href={repo.htmlUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 hover:text-foreground"
          >
            <ExternalLink className="size-3.5" />
            View on GitHub
          </a>
        )}
      </div>

      <div className="flex items-center gap-2 border-t border-border/60 pt-4">
        {isReady ? (
          <>
            <Button size="sm" className="group flex-1 gap-1.5" onClick={openChat}>
              <MessageSquare className="size-3.5" />
              Chat
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </Button>
            {repo.htmlUrl && (
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5"
                nativeButton={false}
                render={<a href={repo.htmlUrl} target="_blank" rel="noreferrer" />}
              >
                <ExternalLink className="size-3.5" />
                Open
              </Button>
            )}
          </>
        ) : (
          !isFailed && (
            <Button
              size="sm"
              className="flex-1 gap-1.5"
              disabled={isIndexing}
              onClick={startIndexing}
            >
              {isIndexing ? <Spinner className="size-3.5" /> : <RotateCcw className="size-3.5" />}
              {isIndexing ? "Indexing…" : "Start indexing"}
            </Button>
          )
        )}
      </div>
    </article>
  );
}

    