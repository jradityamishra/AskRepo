import { LogOut } from "lucide-react";
import { refresh } from "next/dist/server/web/spec-extension/revalidate";

export type IndexStatus="PENDING"|"INDEXING"|"READY"|"FAILED";

export type IndexStatusResponse = {
    id: string;
    indexStatus: IndexStatus;
    filesProcessed: number;
    filesTotal: number;
    chunkCount: number;
    indexedAt: string|null;
    errorMessage: string|null;
};
export type Citation = {
    filePath: string;
    startLine: number|null;
    endLine: number|null;
    language: string|null;
}

export type ChatSession = {
    id: string;
   repositoryId: string;
   title: string;
    createdAt: string;
};

export type ChatMessage = {
   id: string;
    role: "USER"|"ASSISTANT";
    content: string;
    citations:Citation[]
    createdAt: string;
};


export type User = {
    id: string;
    githubId: number;
    githubUsername: string;
    displayName: string;
    avatarUrl: string|null;
}
export type Repository = {
    id: string;
    githubRepoId: number;
    name: string;
    fullName: string;
    owner: string;
    isPrivate: boolean;
    defaultBranch: string;
    language: string;
    htmlUrl: string|null;
    description: string|null;
    indexedAt: string|null;
    chunkCount: number;
    filesTotal: number;
    filesProcessed: number;
    errorMessage: string|null;
    indexStatus: IndexStatus;
};
export class ApiError extends Error {
    status: number;
    constructor(status: number, message: string) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
 
}

export function getApiBaseUrl(){
    const backendBase = process.env.NEXT_PUBLIC_BACKEND_URL||"http://localhost:8080";
    return backendBase;
}
export function getGiithubLoginUrl(){  
    return `${getApiBaseUrl()}/oauth2/authorization/github`;
}

export async function parseError(Res: Response): Promise<string> {
    try{
        const data=await Res.json();
        return data?.message ?? "Unknown error";
    }catch(e){
        return Res.statusText||"Request failed";
    }
}

export async function apiFetch<T>(apth:string,init?: RequestInit){
   const res=await fetch(`${getApiBaseUrl()}${apth}`, {
            ...init,
            credentials: "include",
            headers: {
                ...(init?.body ? { "Content-Type": "application/json" } : {}),
                ...(init?.headers ?? {}),
            },
        });
    if (!res.ok) {
        const errorMessage = await parseError(res);
        throw new ApiError(res.status, errorMessage);
    }
    return res.json() as Promise<T>;
}

export const api={
    me:()=>apiFetch<User>("/api/auth/me"),
    logout:()=>apiFetch<void>("/api/auth/logout",{
        method: "POST"
    }),

    listRepos:(refresh=true)=>
     apiFetch<Repository[]>(`/api/repos?refresh=${refresh}`),
    getRepo:(id: string) =>
        apiFetch<Repository>(`/api/repos/${id}`),
    startIndex:(id: string) =>
        apiFetch<Repository>(`/api/repos/${id}/index`,{method:"POST"}),
    indexStatus:(id: string) =>
        apiFetch<IndexStatusResponse>(`/api/repos/${id}/status`),
    createSession:(repositoryId: string,title?:string) =>
        apiFetch<ChatSession> ("/api/chat/sessions",{
            method:"POST",
            body: JSON.stringify({repositoryId,title})
        }),
    listSessions:(repositoryId: string) =>
        apiFetch<ChatSession[]>(`/api/chat/sessions?repositoryId=${encodeURIComponent(repositoryId)}`),
    getMessages:(sessionId: string) =>
        apiFetch<ChatMessage[]>(`/api/chat/sessions/${sessionId}/messages`),
}

// API utility functions and types for interacting with the Repository.



