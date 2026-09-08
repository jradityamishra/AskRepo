"use client";

import { useMutation, useQuery ,useQueryClient} from "@tanstack/react-query"
import {api,type Repository} from "@/lib/api";
import {queryKeys} from "@/lib/query-keys";
import {toast} from "@/components/ui/toast";

const INDEXING_POLL_MS=2000;

function hasIndexingError(repos: Repository[]|undefined) {
    return repos?.some(repo => repo.indexStatus === "INDEXING") ?? false;
}

function updateRepoInListCache(
    queryClient: ReturnType<typeof useQueryClient>,
    updatedRepo: Repository
) {
    queryClient.setQueryData<Repository[]>(queryKeys.repos.list(), (oldRepos) => {
        if (!oldRepos) return oldRepos;
        return oldRepos.map(repo => repo.id === updatedRepo.id ? updatedRepo : repo);
    });
}

export function useRepos(){
    return useQuery({
        queryKey: queryKeys.repos.list(),
        queryFn:async ()=>{
            const repos=await api.listRepos(false);
            if(repos.length===0){
                return api.listRepos(true);
            }
            return repos;
        },
        staleTime: 30_000,
        refetchInterval: (query)=>
            hasIndexingError(query.state.data) ? INDEXING_POLL_MS : false,
    })
}

export function useRepository(repoId: string) {
    return useQuery({
        queryKey: queryKeys.repos.detail(repoId),
        queryFn:  () => {
            return api.getRepo(repoId);
        },
       enabled: Boolean(repoId),
        refetchInterval: (query) =>
           query.state.data?.indexStatus === "INDEXING" ? INDEXING_POLL_MS : false,
    })
}

export function useIndexStatus(repoId: string,enabled=false) {
    return useQuery({
        queryKey:queryKeys.repos.status(repoId),
        queryFn:()=>
            api.indexStatus(repoId),
        enabled:Boolean(repoId) && enabled,
        refetchInterval: (query) =>
            query.state.data?.indexStatus === "INDEXING" ? INDEXING_POLL_MS : false,
    })
}

export function useStartIndexing(){
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (repoId: string) => api.startIndex(repoId),
        onSuccess: (repo) => {
          queryClient.setQueryData(queryKeys.repos.detail(repo.id), repo);
          updateRepoInListCache(queryClient, repo);
          void queryClient.invalidateQueries({ queryKey: queryKeys.repos.list() });
          toast.add({
            title: "Indexing Started",
            description: `Indexing has started for repository ${repo.fullName}.`,
            type:"loading"
          })
        },
        onError: (error:Error) => {
          toast.add({
            title: "Indexing Failed",
            description: `Failed to start indexing: ${error.message}`,
            type:"error"
          })
        }
    });

}

export function useRefreshRepos(){
    const queryClient = useQueryClient();
  
    return useMutation({
        mutationFn:()=>
            toast.promise(api.listRepos(true),{
                loading:{
                    title: "Refreshing Repositories",
                    description: "Refreshing the list of repositories...",
                    type: "loading"
                },
                success:(repos)=>({
                        title: "Repositories Refreshed",
                        description: `Successfully refreshed ${repos.length} repositories.`,
                        type: "success"
                    
                }),
                error: (error: Error) => ({
                    title: "Failed to Refresh Repositories",
                    description: `Failed to refresh repositories: ${error.message}`,
                    type: "error"
                })
    
            }),
        onSuccess: (repos) => {
             queryClient.setQueryData(queryKeys.repos.list(),repos);
        }
    });
}

export function getRepoProgress(repo:Pick<Repository,"filesProcessed"|"filesTotal">){
    if(!repo.filesTotal) return 0;
    return Math.min(100,Math.round((repo.filesProcessed / repo.filesTotal) * 100));
}

