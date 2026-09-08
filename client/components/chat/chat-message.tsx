"use client";

import { FileCode2, User2 } from "lucide-react";

import { ChatMarkdown } from "@/components/chat/chat-markdown";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageHeader,
} from "@/components/ui/message";
import type { ChatMessage } from "@/lib/api";
import { cn } from "@/lib/utils";

function CitationChip({
  filePath,
  startLine,
  endLine,
}: {
  filePath: string;
  startLine: number | null;
  endLine: number | null;
}) {
  const lines = startLine ? `:${startLine}${endLine && endLine !== startLine ? `-${endLine}` : ""}` : "";
  return (
    <Badge variant="outline" className="gap-1 font-mono text-[11px] font-normal">
      <FileCode2 className="size-3" />
      {filePath}
      {lines}
    </Badge>
  );
}

function ThinkingDots() {
  return (
    <span className="flex items-center gap-1 py-0.5" aria-label="Thinking">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-1.5 animate-bounce rounded-full bg-current opacity-60"
          style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.8s" }}
        />
      ))}
    </span>
  );
}

export function ChatMessageItem({
  message,
  isStreaming = false,
}: {
  message: ChatMessage;
  isStreaming?: boolean;
}) {
  const isUser = message.role === "USER";
  const isThinking = isStreaming && !message.content;

  return (
    <Message align={isUser ? "end" : "start"}>
      {!isUser && (
        <MessageAvatar>
          <span className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            DP
          </span>
        </MessageAvatar>
      )}
      {isUser && (
        <MessageAvatar>
          <Avatar className="size-8">
            <AvatarFallback>
              <User2 className="size-4" />
            </AvatarFallback>
          </Avatar>
        </MessageAvatar>
      )}

      <MessageContent>
        <div
          data-slot="bubble-content"
          className={cn(
            "w-fit max-w-[88%] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed sm:max-w-[75%]",
            isUser
              ? "self-end bg-primary text-primary-foreground"
              : "self-start bg-muted text-foreground"
          )}
        >
          {isThinking ? (
            <ThinkingDots />
          ) : (
            <>
              <ChatMarkdown content={message.content} />
              {isStreaming && (
                <span className="ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 animate-pulse rounded-sm bg-current align-middle" />
              )}
            </>
          )}
        </div>

        {message.citations.length > 0 && (
          <MessageHeader className="flex-wrap gap-1.5 px-0">
            {message.citations.map((citation, index) => (
              <CitationChip
                key={`${citation.filePath}-${index}`}
                filePath={citation.filePath}
                startLine={citation.startLine}
                endLine={citation.endLine}
              />
            ))}
          </MessageHeader>
        )}
      </MessageContent>
    </Message>
  );
}
