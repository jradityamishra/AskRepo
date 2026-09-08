"use client";

import { formatDistanceToNow } from "date-fns";
import { MessageSquarePlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useChatSessions, useCreateChatSession } from "@/hooks/use-chat";
import { cn } from "@/lib/utils";

export function ChatSidebar({
  repositoryId,
  selectedSessionId,
  onSelectSession,
  className,
}: {
  repositoryId: string;
  selectedSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  className?: string;
}) {
  const sessionsQuery = useChatSessions(repositoryId);
  const createSession = useCreateChatSession(repositoryId);

  function handleNewChat() {
    createSession.mutate(undefined, {
      onSuccess: (session) => onSelectSession(session.id),
    });
  }

  return (
    <aside className={cn("flex h-full w-72 shrink-0 flex-col sm:w-64", className)}>
      <div className="p-3">
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={handleNewChat}
          disabled={createSession.isPending}
        >
          <MessageSquarePlus className="size-4" />
          New chat
        </Button>
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto px-2 pb-3">
        {sessionsQuery.isLoading &&
          Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full rounded-lg" />
          ))}

        {sessionsQuery.isSuccess && sessionsQuery.data.length === 0 && (
          <p className="px-2 py-6 text-center text-xs text-muted-foreground">
            No conversations yet. Start a new chat to begin.
          </p>
        )}

        {sessionsQuery.data?.map((session) => (
          <button
            key={session.id}
            type="button"
            onClick={() => onSelectSession(session.id)}
            className={cn(
              "flex w-full flex-col gap-0.5 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted",
              selectedSessionId === session.id && "bg-muted font-medium"
            )}
          >
            <span className="truncate">{session.title || "New conversation"}</span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
}
