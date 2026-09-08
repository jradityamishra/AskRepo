"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {useCurrentUser} from "@/hooks/use-auth";
import {Spinner} from "@/components/ui/spinner";


export function RequireAuth({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const {data:user,isLoading,isError}=useCurrentUser();
    
    useEffect(()=>{
        if(!isLoading && !user){
            router.push("/login");
        }
    },[isLoading,user,router]);

    if(isLoading || !user){
      return(
        <div className="flex justify-center items-center h-screen">
          <Spinner />
          <p>Loading for workspace....</p>
        
        </div>
      )
    }
    if(isError || !user){
        return null;
    }

    return <>{children}</>;
}