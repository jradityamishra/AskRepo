"use client";

import { useState, type KeyboardEvent } from "react";
import { ArrowUp, Square } from "lucide-react";

import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group";
import { Textarea } from "@/components/ui/textarea";

export function ChatComposer({
  onSend,
  onStop,
  isStreaming,
  disabled,
  placeholder = "Ask about this repository…",
}: {
  onSend: (content: string) => void;
  onStop?: () => void;
  isStreaming?: boolean;
  disabled?: boolean;
  placeholder?: string;
}) {
  const [value, setValue] = useState("");

  function submit() {
    const content = value.trim();
    if (!content || disabled || isStreaming) return;
    onSend(content);
    setValue("");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  }

  return (
    <div className="border-t border-border/60 bg-background p-3 sm:p-4">
      <InputGroup className="mx-auto max-w-3xl items-end rounded-2xl">
        <Textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="max-h-48 border-none bg-transparent px-3 py-3 text-[15px] shadow-none focus-visible:ring-0"
        />
        <InputGroupAddon align="inline-end">
          {isStreaming ? (
            <Button size="icon-sm" variant="secondary" onClick={onStop} type="button">
              <Square className="size-3.5" />
              <span className="sr-only">Stop generating</span>
            </Button>
          ) : (
            <Button
              size="icon-sm"
              disabled={disabled || !value.trim()}
              onClick={submit}
              type="button"
            >
              <ArrowUp className="size-4" />
              <span className="sr-only">Send message</span>
            </Button>
          )}
        </InputGroupAddon>
      </InputGroup>
      <p className="mx-auto mt-2 hidden max-w-3xl text-center text-xs text-muted-foreground sm:block">
        AskRepo can make mistakes. Verify important answers against the source.
      </p>
    </div>
  );
}
