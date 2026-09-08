import { useQuery,useMutation,useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";
import { queryKeys } from "@/lib/query-keys";
import { api,type ChatMessage } from "@/lib/api";
import { streamChatMessage } from "@/lib/stream-chat";
import { toast } from "@/components/ui/toast";




export function useChatSessions(repositoryId:string,enabled=true){
    return useQuery(
       { queryKey:queryKeys.chat.sessions(repositoryId),
         queryFn:()=>api.listSessions(repositoryId),
         enabled:Boolean(repositoryId) && enabled
       }

    )
}

export function useChatMessages(sessionId:string |null){
    return useQuery({
        queryKey:queryKeys.chat.messages(sessionId ?? ""),
        queryFn:()=>api.getMessages(sessionId ?? ""),
        enabled:Boolean(sessionId)

    })
}

export function useCreateChatSession(repositoryId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (title?: string) => api.createSession(repositoryId, title),
        onSuccess: (session) => {
            queryClient.setQueryData(
                queryKeys.chat.sessions(repositoryId),
                (old: Awaited<ReturnType<typeof api.listSessions>> | undefined) => [
                    session,
                    ...(old ?? []),
                ]
            );
        },
        onError: (error: Error) => {
            toast.add({
                title: "Could not start a new chat",
                description: error.message,
                type: "error",
            });
        },
    });
}

function appendMessage(
    queryClient: ReturnType<typeof useQueryClient>,
    sessionId: string,
    message: ChatMessage
) {
    queryClient.setQueryData<ChatMessage[]>(
        queryKeys.chat.messages(sessionId),
        (old) => [...(old ?? []), message]
    );
}

function replaceMessage(
    queryClient: ReturnType<typeof useQueryClient>,
    sessionId: string,
    tempId: string,
    message: ChatMessage
) {
    queryClient.setQueryData<ChatMessage[]>(queryKeys.chat.messages(sessionId), (old) => {
        if (!old) return [message];
        const index = old.findIndex((m) => m.id === tempId);
        if (index === -1) return [...old, message];
        const next = [...old];
        next[index] = message;
        return next;
    });
}

const REVEAL_INTERVAL_MS = 20;

export function useSendMessage(sessionId: string | null) {
    const queryClient = useQueryClient();
    const [isStreaming, setIsStreaming] = useState(false);
    const [streamingText, setStreamingText] = useState("");
    const abortRef = useRef<AbortController | null>(null);
    const fullTextRef = useRef("");
    const pendingFinalRef = useRef<ChatMessage | null>(null);
    const revealTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const stopReveal = useCallback(() => {
        if (revealTimerRef.current) {
            clearInterval(revealTimerRef.current);
            revealTimerRef.current = null;
        }
    }, []);

    // Reveals text at a steady pace independent of how fast the network delivers it,
    // so a very fast model response still reads like a real typewriter stream.
    const startReveal = useCallback(
        (finishedSessionId: string) => {
            if (revealTimerRef.current) return;
            revealTimerRef.current = setInterval(() => {
                setStreamingText((prev) => {
                    const full = fullTextRef.current;
                    if (prev.length >= full.length) {
                        const final = pendingFinalRef.current;
                        if (final) {
                            pendingFinalRef.current = null;
                            appendMessage(queryClient, finishedSessionId, final);
                            stopReveal();
                            setIsStreaming(false);
                            fullTextRef.current = "";
                            return "";
                        }
                        return prev;
                    }
                    const remaining = full.length - prev.length;
                    const step = Math.max(1, Math.ceil(remaining / 20));
                    return full.slice(0, prev.length + step);
                });
            }, REVEAL_INTERVAL_MS);
        },
        [queryClient, stopReveal]
    );

    const send = useCallback(
        async (content: string) => {
            if (!sessionId || isStreaming || !content.trim()) return;

            const controller = new AbortController();
            abortRef.current = controller;
            fullTextRef.current = "";
            pendingFinalRef.current = null;
            setIsStreaming(true);
            setStreamingText("");
            startReveal(sessionId);

            const tempId = `temp-${Date.now()}`;
            appendMessage(queryClient, sessionId, {
                id: tempId,
                role: "USER",
                content,
                citations: [],
                createdAt: new Date().toISOString(),
            });

            try {
                await streamChatMessage(sessionId, content, {
                    signal: controller.signal,
                    onUserMessage: (message) => replaceMessage(queryClient, sessionId, tempId, message),
                    onToken: (token) => {
                        fullTextRef.current += token;
                    },
                    onAssistantMessage: (message) => {
                        fullTextRef.current = message.content;
                        pendingFinalRef.current = message;
                    },
                    onError: (error) => {
                        toast.add({
                            title: "Message failed",
                            description: error.message,
                            type: "error",
                        });
                    },
                });
            } catch (error) {
                const isAbort = error instanceof DOMException && error.name === "AbortError";
                if (!isAbort) {
                    toast.add({
                        title: "Message failed",
                        description: error instanceof Error ? error.message : "Something went wrong.",
                        type: "error",
                    });
                }
            } finally {
                // If the stream ended without a final message (error/abort), stop revealing immediately.
                if (!pendingFinalRef.current) {
                    stopReveal();
                    setIsStreaming(false);
                    setStreamingText("");
                    fullTextRef.current = "";
                }
                abortRef.current = null;
            }
        },
        [sessionId, isStreaming, queryClient, startReveal, stopReveal]
    );

    const stop = useCallback(() => {
        abortRef.current?.abort();
    }, []);

    return { send, stop, isStreaming, streamingText };
}

