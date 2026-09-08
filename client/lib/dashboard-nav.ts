import { FolderGit2,LayoutGrid,Settings,type LucideIcon } from "lucide-react";
export type DashboardNavItem={
    title: string;
    href: string;
    icon: LucideIcon;
    exact?:boolean
}

export type DashboardNavGroup={
    title: string;
    items: DashboardNavItem[];
}

export const dashboardNavGroups: DashboardNavGroup[] = [
    {
       title:"WorkSpace",
       items:[
        {
          title:"overview",
          href:"/dashboard/overview",
          icon: LayoutGrid
        },{
            title:"Repositories",
            href:"/dashboard",
            icon: FolderGit2,
            exact: true
        }
       ]
    },
    {
        title:"Account",
        items:[
            {
                title:"Settings",
                href:"/dashboard/settings",
                icon: Settings
            }
        ]

    }
]

export function isDashboardNavActive(
    pathname:string,
    href:string,
    exact =false
): boolean {
    if (exact) {
        return pathname === href;
    }
    return pathname===href || pathname.startsWith(`${href}/`);
}