import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronsUpDown, LogOut, Settings } from "lucide-react";

import { cn } from "@/lib/utils";
import { useCurrentUser, useLogout } from "@/hooks/use-auth";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { dashboardNavGroups, isDashboardNavActive } from "@/lib/dashboard-nav";

export function AppShell({
  children,
  title,
  description,
  actions,
  hideHeader,
}: {
  children: React.ReactNode;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  hideHeader?: boolean;
}) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                render={<Link href="/dashboard" />}
                tooltip="Dashboard"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                  AR
                </span>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate font-semibold">AskRepo</span>
                  <span className="truncate text-xs text-sidebar-foreground/70">
                    Chat with your code
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          {dashboardNavGroups.map((group) => (
            <SidebarGroup key={group.title}>
              <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        render={<Link href={item.href} />}
                        isActive={isDashboardNavActive(
                          pathname,
                          item.href,
                          item.exact
                        )}
                        tooltip={item.title}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <UserMenu />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        {!hideHeader && (
          <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-5" />
            <div className="flex min-w-0 flex-1 flex-col justify-center">
              {title && (
                <h1 className="truncate text-sm font-semibold leading-tight">
                  {title}
                </h1>
              )}
              {description && (
                <p className="truncate text-xs text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {actions}
              <ModeToggle />
            </div>
          </header>
        )}
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function UserMenu() {
  const { data: user } = useCurrentUser();
  const { mutate: logout, isPending } = useLogout();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<SidebarMenuButton size="lg" />}
        className="data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground"
      >
        <Avatar className="size-8 rounded-lg">
          <AvatarImage src={user.avatarUrl ?? undefined} alt={user.displayName} />
          <AvatarFallback className="rounded-lg">
            {user.displayName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left leading-tight">
          <span className="truncate font-medium">{user.displayName}</span>
          <span className="truncate text-xs text-sidebar-foreground/70">
            @{user.githubUsername}
          </span>
        </div>
        <ChevronsUpDown className="ml-auto size-4 text-sidebar-foreground/50" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="top" className="w-(--anchor-width) min-w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="grid leading-tight">
            <span className="truncate font-medium">{user.displayName}</span>
            <span className="truncate text-xs text-muted-foreground">
              @{user.githubUsername}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/dashboard/settings" />}>
          <Settings />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          disabled={isPending}
          onClick={() => logout()}
        >
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function BrandMark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2 font-semibold tracking-tight",
        className
      )}
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
        AR
      </span>
      <span>AskRepo</span>
    </Link>
  );
}

export function GostButtonLink({
  className,
  href,
  children,
}: {
  className?: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Button variant="ghost" className={className} nativeButton={false} render={<Link href={href} />}>
      {children}
    </Button>
  );
}

