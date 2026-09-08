"use client";
import React, { Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, ArrowRight, GitBranch, Lock, Sparkles } from "lucide-react";

import { getGitHubLoginUrl } from "@/lib/github";
// import { useCurrentUser } from "@/hooks/use-current-user";
import { GitHubIcon } from "@/components/icons/github-icon";
import { BrandMark } from "@/components/layout/app-shell";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/use-auth";
function LoginLoading() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <Spinner className="size-8 text-primary" />
        </div>
    );
}

const FEATURES = [
    {
        icon: GitBranch,
        title: "Chat with any repo",
        description:
            "Ask questions about files, commits and pull requests in natural language.",
    },
    {
        icon: Sparkles,
        title: "AI-powered insights",
        description:
            "Summarize diffs, explain code and generate reviews in seconds.",
    },
    {
        icon: Lock,
        title: "Secure by default",
        description:
            "Read-only OAuth scopes. Your source code never leaves your session.",
    },
];

function LoginContent() {
    const params = useSearchParams();
    const router = useRouter();
    const error = params.get("error");
    const next = params.get("next") || "/dashboard";

    const { data: user, isLoading } = useCurrentUser();
   

    useEffect(() => {
        if (user && !isLoading) {
            router.replace(next.startsWith("/") ? next : `/dashboard`);
        }
    }, [user, isLoading, router, next]);

    // if (isLoading || !user) {
    //     return <LoginLoading />;
    // }

    return (
        <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
            {/* Ambient background */}
            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -top-40 -left-32 h-[28rem] w-[28rem] rounded-full bg-primary/20 blur-3xl dark:bg-primary/15" />
                <div className="absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-fuchsia-400/20 blur-3xl dark:bg-fuchsia-500/10" />
                <div
                    className="absolute inset-0 opacity-[0.35] dark:opacity-20"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)",
                        backgroundSize: "28px 28px",
                        maskImage:
                            "radial-gradient(ellipse at center, black 40%, transparent 75%)",
                    }}
                />
            </div>

            <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6">
                <BrandMark />
                <div className="flex items-center gap-2">
                    <Link
                        href="/"
                        className={cn(
                            buttonVariants({ variant: "ghost", size: "sm" }),
                            "text-muted-foreground"
                        )}
                    >
                        Back to home
                    </Link>
                    <ModeToggle />
                </div>
            </header>

            <main className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 pb-16 pt-8 lg:grid-cols-[1.05fr_minmax(0,420px)] lg:gap-16 lg:pt-16">
                {/* Left: marketing pane */}
                <section className="order-2 lg:order-1">
                    <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                        </span>
                        Now supporting private repositories
                    </div>

                    <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                        Understand your codebase{" "}
                        <span className="bg-gradient-to-r from-primary via-fuchsia-500 to-primary bg-clip-text text-transparent">
                            in plain English
                        </span>
                        .
                    </h1>

                    <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                        Sign in with GitHub to connect a repository and start a
                        conversation with your code — no setup, no indexing
                        pipelines, just answers.
                    </p>

                    <ul className="mt-10 grid gap-5 sm:grid-cols-2">
                        {FEATURES.map(({ icon: Icon, title, description }) => (
                            <li
                                key={title}
                                className="flex gap-3 rounded-xl border border-border/60 bg-card/40 p-4 backdrop-blur transition-colors hover:border-border hover:bg-card/70"
                            >
                                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
                                    <Icon className="size-4" />
                                </span>
                                <div>
                                    <p className="text-sm font-semibold">{title}</p>
                                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                                        {description}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Right: sign-in card */}
                <section className="order-1 lg:order-2">
                    <div className="relative">
                        <div
                            aria-hidden
                            className="absolute -inset-px rounded-3xl bg-gradient-to-br from-primary/40 via-transparent to-fuchsia-500/30 opacity-70 blur-md"
                        />
                        <Card className="relative rounded-3xl border-border/70 bg-card/80 shadow-xl backdrop-blur-xl">
                            <CardHeader className="items-center gap-4 pb-2 text-center">
                                <div className="grid size-14 place-items-center rounded-2xl border border-border/60 bg-background/70 shadow-sm">
                                    <GitHubIcon className="size-7" />
                                </div>
                                <div className="space-y-1.5">
                                    <CardTitle className="text-2xl font-semibold tracking-tight">
                                        Sign in
                                    </CardTitle>
                                    <CardDescription className="text-sm text-muted-foreground">
                                        Connect GitHub to chat with your repository.
                                    </CardDescription>
                                </div>
                            </CardHeader>

                            <CardContent className="flex flex-col gap-5 pt-6">
                                {error && (
                                    <Alert
                                        variant="destructive"
                                        className="border-destructive/30 bg-destructive/5"
                                    >
                                        <AlertCircle className="size-4" />
                                        <AlertTitle>
                                            We couldn&apos;t sign you in
                                        </AlertTitle>
                                        <AlertDescription className="text-xs leading-relaxed">
                                            {decodeURIComponent(error)}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                <a
                                    href={getGitHubLoginUrl({ next })}
                                    className={cn(
                                        buttonVariants({
                                            variant: "default",
                                            size: "lg",
                                        }),
                                        "group w-full gap-2 rounded-xl bg-foreground text-background hover:bg-foreground/90"
                                    )}
                                >
                                    <GitHubIcon className="size-5" />
                                    Continue with GitHub
                                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                                </a>

                                <div className="relative py-1 text-center">
                                    <div className="absolute inset-x-0 top-1/2 -z-10 h-px bg-border" />
                                    <span className="bg-card px-3 text-xs uppercase tracking-wider text-muted-foreground">
                                        Secure OAuth
                                    </span>
                                </div>

                                <p className="text-center text-xs leading-relaxed text-muted-foreground">
                                    We&apos;ll request read-only access to your
                                    repositories. You can revoke it any time from your{" "}
                                    <a
                                        href="https://github.com/settings/applications"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
                                    >
                                        GitHub settings
                                    </a>
                                    .
                                </p>

                                <p className="text-center text-xs text-muted-foreground">
                                    By continuing, you agree to our{" "}
                                    <Link
                                        href="/terms"
                                        className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
                                    >
                                        Terms
                                    </Link>{" "}
                                    and{" "}
                                    <Link
                                        href="/privacy"
                                        className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
                                    >
                                        Privacy Policy
                                    </Link>
                                    .
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            </main>

            <footer className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 px-6 pb-8 text-xs text-muted-foreground sm:flex-row">
                <p>© {new Date().getFullYear()} AskRepo. All rights reserved.</p>
                <div className="flex items-center gap-4">
                    <Link href="/status" className="hover:text-foreground">
                        Status
                    </Link>
                    <Link href="/docs" className="hover:text-foreground">
                        Docs
                    </Link>
                    <Link href="/support" className="hover:text-foreground">
                        Support
                    </Link>
                </div>
            </footer>
        </div>
    );
}

const LoginPage = () => (
    <Suspense fallback={<LoginLoading />}>
        <LoginContent />
    </Suspense>
);

export default LoginPage;