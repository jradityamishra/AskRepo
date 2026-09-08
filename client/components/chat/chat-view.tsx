"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, MessageSquarePlus, PanelLeft } from "lucide-react";

import { ChatComposer } from "@/components/chat/chat-composer";
import { ChatMessageItem } from "@/components/chat/chat-message";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { IndexingState } from "@/components/chat/indexing-state";
import { LanguageBadge } from "@/components/dashboard/language-badge";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import {
  useChatMessages,
  useChatSessions,
  useCreateChatSession,
  useSendMessage,
} from "@/hooks/use-chat";
import { useIndexStatus, useRepository } from "@/hooks/use-repo";

function ChatEmptyState({ repositoryId }: { repositoryId: string }) {
  const createSession = useCreateChatSession(repositoryId);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
      <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
        <MessageSquarePlus className="size-6" />
      </span>
      <div>
        <p className="text-sm font-semibold">Start a new conversation</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Ask anything about this repository — files, commits, or how something works.
        </p>
      </div>
      <Button onClick={() => createSession.mutate(undefined)} disabled={createSession.isPending}>
        New chat
      </Button>
    </div>
  );
}

const ChatView = ({ repoId }: { repoId: string }) => {
  const repoQuery = useRepository(repoId);
  const repo = repoQuery.data;
  const isIndexing = repo?.indexStatus === "INDEXING";
  const statusQuery = useIndexStatus(repoId, isIndexing);

  const sessionsQuery = useChatSessions(repoId, repo?.indexStatus === "READY");
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!selectedSessionId && sessionsQuery.data && sessionsQuery.data.length > 0) {
      setSelectedSessionId(sessionsQuery.data[0].id);
    }
  }, [sessionsQuery.data, selectedSessionId]);

  const messagesQuery = useChatMessages(selectedSessionId);
  const { send, stop, isStreaming, streamingText } = useSendMessage(selectedSessionId);

  if (repoQuery.isLoading || !repo) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner className="size-6" />
      </div>
    );
  }

  const notReady = repo.indexStatus !== "READY";

  function selectSession(id: string) {
    setSelectedSessionId(id);
    setMobileSidebarOpen(false);
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border/60 px-3 sm:gap-3 sm:px-4">
        <Button variant="ghost" size="icon-sm" nativeButton={false} render={<Link href="/dashboard" />}>
          <ArrowLeft className="size-4" />
        </Button>
        {!notReady && (
          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <PanelLeft className="size-4" />
            <span className="sr-only">Open conversations</span>
          </Button>
        )}
        <LanguageBadge language={repo.language} showLable={false} className="size-8 shrink-0 justify-center rounded-lg p-0" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{repo.fullName}</p>
          <p className="truncate text-xs text-muted-foreground">{repo.defaultBranch}</p>
        </div>
        <ModeToggle />
      </header>

      {notReady ? (
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="w-full max-w-md">
            <IndexingState repo={repo} status={statusQuery.data} />
          </div>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1">
          <ChatSidebar
            repositoryId={repoId}
            selectedSessionId={selectedSessionId}
            onSelectSession={selectSession}
            className="hidden border-r border-border/60 md:flex"
          />

          <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
            <SheetContent side="left" className="p-0">
              <ChatSidebar
                repositoryId={repoId}
                selectedSessionId={selectedSessionId}
                onSelectSession={selectSession}
                className="w-full"
              />
            </SheetContent>
          </Sheet>

          <div className="flex min-h-0 flex-1 flex-col">
            {!selectedSessionId ? (
              <ChatEmptyState repositoryId={repoId} />
            ) : (
              <>
                <MessageScrollerProvider>
                  <MessageScroller className="flex-1">
                    <MessageScrollerViewport>
                      <MessageScrollerContent className="mx-auto w-full max-w-3xl px-3 py-6 sm:px-4">
                        {messagesQuery.data?.map((message) => (
                          <ChatMessageItem key={message.id} message={message} />
                        ))}
                        {isStreaming && (
                          <ChatMessageItem
                            message={{
                              id: "streaming",
                              role: "ASSISTANT",
                              content: streamingText,
                              citations: [],
                              createdAt: new Date().toISOString(),
                            }}
                            isStreaming
                          />
                        )}
                      </MessageScrollerContent>
                    </MessageScrollerViewport>
                    <MessageScrollerButton />
                  </MessageScroller>
                </MessageScrollerProvider>

                <ChatComposer onSend={send} onStop={stop} isStreaming={isStreaming} />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export { ChatView };
