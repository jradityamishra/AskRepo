"use client";
import {useRouter} from "next/navigation";
import { useEffect } from "react";
import {Spinner} from "@/components/ui/spinner";
import { useCurrentUser } from "@/hooks/use-auth";
export default function AuthCallbackPage(){
    const router=useRouter();
    const{data:user,isLoading,isError,isFetched}=useCurrentUser();

    useEffect(()=>{
        if(!isFetched || isLoading) return;

       if(user){
        router.replace("/dashboard");
        return;
       }
       router.replace("/login?error=session");
    },[isFetched,isLoading,isError,user,router]);
    return (
        <div className="flex items-center justify-center h-screen">
            <Spinner />
            <p className="ml-4">Finishing Github Authentication...</p>
        </div>
    );

    
}
