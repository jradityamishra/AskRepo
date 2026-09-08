"use client";
import {RequireAuth} from "@/components/providers/require.auth";
import {AppShell} from "@/components/layout/app-shell";
import {RepoDashboard} from "@/components/dashboard/repo-dashboard";

export default function DashboardPage(){
  return(
    <RequireAuth>
      <AppShell
        title="Repositories"
        description="Connect a repository and start chatting with your code."
      >
       <RepoDashboard />
      </AppShell>
    </RequireAuth>
  )
}