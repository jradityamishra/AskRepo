"use client"


import { getRepoProgress, useStartIndexing } from "@/hooks/use-repo";
import { Repository, IndexStatusResponse } from "@/lib/api";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "../ui/empty";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";


export function IndexingState({
    repo,
    status
}: {repo:Repository,status?:IndexStatusResponse}){

    const indexMutation=useStartIndexing();
    const fileProcessed=status?.filesProcessed ?? repo.filesProcessed;
    const filesTotal=status?.filesTotal ?? repo.filesTotal;
    const chunkCount=status?.chunkCount ?? repo.chunkCount;
    const progress=getRepoProgress({ filesProcessed: fileProcessed, filesTotal });
    const indexStatus= status?.indexStatus ?? repo.indexStatus;
    const errorMessage=status?.errorMessage ?? repo.errorMessage;

    if(indexStatus === "FAILED"){
        return (
          <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                <AlertCircle className="text-destructive" />

                </EmptyMedia>
                <EmptyTitle>
                    Indexing Failed
                </EmptyTitle>
                <EmptyDescription>
                    {errorMessage ?? "An error occurred during indexing."}
                </EmptyDescription>
            </EmptyHeader>
            <Button onClick={() => indexMutation.mutate( repo.id )}
                disabled={indexMutation.isPending}
                >
                Retry Indexing
            </Button>
          </Empty>
        );
    }

    return(
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                <Loader2 className="animate-spin" />
                </EmptyMedia>
                <EmptyTitle>
                    Indexing {repo.fullName}
                </EmptyTitle>
                <EmptyDescription>
                    {fileProcessed} of {filesTotal} files processed ({chunkCount} chunks)
                </EmptyDescription>
            </EmptyHeader>
            <div>
                <progress value={progress} max={100} className="w-full"/>
                <p>
                    you can leave this page open - chat unlocks when indexing finishes.
                </p>
            </div>
        </Empty>
    )
};