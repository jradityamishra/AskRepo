"use client";

import {useMemo,useState} from "react";
import {FolderGit2} from "lucide-react";
import {DashboardHeader} from "@/components/dashboard/dashboard-header";
import {RepoCard} from "@/components/dashboard/repo-card";
import {Button} from "@/components/ui/button";

import { Empty ,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,

} from "@/components/ui/empty";
import { Skeleton } from "../ui/skeleton";
import { useRefreshRepos,useRepos } from "@/hooks/use-repo";
import type {IndexStatus} from "@/lib/api";

type FilterStatus="ALL"|IndexStatus;

export function RepoDashboard() {
    const ReposQuery = useRepos();
    const refresh = useRefreshRepos();
    const[search,setSearch]=useState("");
    const [status,setStatus]=useState<FilterStatus>("ALL");
    const [visibility, setVisibility] = useState<"all"|"public"|"private">("all");
    const filtered=useMemo(()=>{
        const list=ReposQuery.data ??[];
        const q=search.trim().toLowerCase();

        return list.filter((repo)=>{
            if(status!=="ALL" && repo.indexStatus !== status) return false;
            if(visibility==="private" && !repo.isPrivate) return false;
            if(visibility==="public" && repo.isPrivate) return false;
            if(!q) return true;

            return(
                repo.fullName.toLowerCase().includes(q) ||
                (repo.description??"").toLowerCase().includes(q)||
                (repo.language??"").toLowerCase().includes(q)
            )
        })
    },[ReposQuery.data,search,visibility,status]);

    const readyCount=ReposQuery.data?.filter(repo => repo.indexStatus === "READY").length ?? 0;

    return(
        <div className="flex flex-col gap-6">
            <DashboardHeader
            search={search}
            onSearchChange={setSearch}
            visibility={visibility}
            onVisibilityChange={setVisibility}
            status={status}
            onStatusChange={setStatus}
            totalCount={ReposQuery.data?.length ?? 0}
            readyCount={readyCount}
            onSync={()=>refresh.mutate()}
            isSyncing={refresh.isPending || ReposQuery.isFetching}

            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {ReposQuery.isLoading &&
                  Array.from({ length: 6 }).map((_, index) => (
                      <Skeleton key={index} className="h-48 w-full rounded-2xl" />
                  ))}
                {ReposQuery.isError && (
                    <Empty className="col-span-full">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <FolderGit2/>

                            </EmptyMedia>
                            <EmptyTitle>Could not load repositories</EmptyTitle>
                            <EmptyDescription>
                                {(ReposQuery.error as Error)?.message}

                            </EmptyDescription>
                        </EmptyHeader>
                        <Button onClick={()=>void ReposQuery.refetch()}>Try Again</Button>
                    </Empty>
                )}
                {ReposQuery.isSuccess && filtered.length===0 && (
                    <Empty className="col-span-full">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <FolderGit2/>
                            </EmptyMedia>
                            <EmptyTitle>No repositories match</EmptyTitle>
                            <EmptyDescription>
                                Try clearing your search or filter settings.
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                )}
                {ReposQuery.isSuccess && filtered.length>0 &&
                    filtered.map(repo => (
                        <RepoCard key={repo.id} repo={repo} />
                    ))}
            </div>
        </div>
    )
    
}
