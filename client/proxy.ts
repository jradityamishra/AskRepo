import { request } from "http";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE="askrepo_auth";

export function proxy(req: NextRequest) {
    const {pathname}=req.nextUrl;
    const isAuthed=req.cookies.get(AUTH_COOKIE)?.value==="true";


    if(pathname.startsWith("/auth/callback")){
        return NextResponse.next();
    }
    if(pathname.startsWith("/dashboard") || pathname.startsWith("/chat")) {
        if(!isAuthed){
            const loginUrl=req.nextUrl.clone();
            loginUrl.pathname="/login";
            loginUrl.searchParams.set("next", pathname);
            return NextResponse.redirect(loginUrl);
        }
       
    }
    if(pathname==="/login" && isAuthed){
        const dash=req.nextUrl.clone();
        dash.pathname="/dashboard";
        return NextResponse.redirect(dash);

    }
    return NextResponse.next();
}

export const config={
    matcher: ["/auth/callback", "/dashboard/:path*", "/chat/:path*", "/login"]
}