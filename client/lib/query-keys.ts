export const queryKeys = {
auth:{
    all:["auth"] as const,
    me:()=>[...queryKeys.auth.all,"me"] as const,

},
repos:{
    all:["repos"] as const,
    list:()=>[...queryKeys.repos.all,"list"] as const,
    detail: (id: string) => [...queryKeys.repos.all, "detail", id] as const,
    status: (id: string) => [...queryKeys.repos.all, "status", id] as const,
},
chat:{
    all:["chat"] as const,
    sessions: (RepositoryId: string) => [...queryKeys.chat.all, "sessions", RepositoryId] as const,
    messages: (SessionId: string) => [...queryKeys.chat.all, "messages", SessionId] as const,
     
},
}