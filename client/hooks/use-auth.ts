"use client";

import {useMutation,useQuery,useQueryClient} from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { api,ApiError } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";

export const AUTH_COOKIE="askrepo_auth";

export function setAuthCookie(authed:boolean){
    if(typeof document === "undefined") return;
    if(authed){
        document.cookie = `${AUTH_COOKIE}=true; path=/; max-age=${60 * 60 * 24 * 7}; sameSite=Lax`;
    }else{
        document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0; sameSite=Lax`;
    }
    
}

export function useCurrentUser(){
    return useQuery({
       queryKey:queryKeys.auth.me(),
       queryFn: async()=>{
             try{
                const user=await api.me();
                setAuthCookie(true);
                return user;
             }catch(error){
                setAuthCookie(false);
                throw error;
             }

       },
       staleTime:5 * 60 * 1000, // 5 minutes
       // 401 (not logged in) is expected and won't succeed on retry
       retry: (failureCount, error) =>
         !(error instanceof ApiError && error.status === 401) && failureCount < 3,
    });
}

export function useLogout(){
    const queryClient=useQueryClient();
    const router=useRouter();

    return useMutation({
        mutationFn: async()=>{
            await api.logout();
        },
        onSettled: async ()=>{
            setAuthCookie(false);
            queryClient.setQueriesData({ queryKey: queryKeys.auth.me() }, null);
            await queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
            router.replace("/login");
        }
    })
}