"use client";

import Link from "next/link";
import {
  ArrowRight,
  Check,
  FolderGit2,
  GitBranch,
  Lock,
  MessageSquareCode,
  Quote,
  Sparkles,
  Zap,
} from "lucide-react";

import { useCurrentUser } from "@/hooks/use-auth";
import { GitHubIcon } from "@/components/icons/github-icon";
import { BrandMark } from "@/components/layout/app-shell";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { getGitHubLoginUrl } from "@/lib/github";
import { cn } from "@/lib/utils";

const BENTO_FEATURES = [
  {
    icon: MessageSquareCode,
    title: "Ask in plain English",
    description:
      "Ask about files, functions, commits or pull requests and get grounded answers with citations back to the exact source line.",
    span: "sm:col-span-2",
  },
  {
    icon: FolderGit2,
    title: "Connect any repository",
    description:
      "Public or private, no indexing pipelines to babysit.",
    span: "",
  },
  {
    icon: Lock,
    title: "Secure by default",
    description:
      "Read-only OAuth scopes. Your code never leaves your session.",
    span: "",
  },
  {
    icon: GitBranch,
    title: "Understand every change",
    description:
      "Summarize diffs and review pull requests without switching tabs.",
    span: "",
  },
  {
    icon: Zap,
    title: "Built for speed",
    description:
      "Streaming answers and cached context, even on large monorepos.",
    span: "sm:col-span-2",
  },
];

const TIMELINE = [
  {
    step: "01",
    title: "Sign in with GitHub",
    description: "Authorize AskRepo with read-only OAuth scopes. Takes about ten seconds.",
  },
  {
    step: "02",
    title: "Pick a repository",
    description: "Choose any repo you have access to — public, private, or an org's monorepo.",
  },
  {
    step: "03",
    title: "Start the conversation",
    description: "Ask questions, request summaries, or dig into a pull request — instantly.",
  },
];

const CHECKLIST = [
  "No install, no CLI, no config files",
  "Works with monorepos and multi-language stacks",
  "Revoke GitHub access anytime, in one click",
];

export default function HomePage() {
  const { data: user } = useCurrentUser();

  const primaryCta = user ? (
    <Link
      href="/dashboard"
      className={cn(
        buttonVariants({ size: "lg" }),
        "group gap-2 rounded-xl bg-foreground text-background hover:bg-foreground/90"
      )}
    >
      Go to dashboard
      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
    </Link>
  ) : (
    <a
      href={getGitHubLoginUrl({ next: "/dashboard" })}
      className={cn(
        buttonVariants({ size: "lg" }),
        "group gap-2 rounded-xl bg-foreground text-background hover:bg-foreground/90"
      )}
    >
      <GitHubIcon className="size-5" />
      Continue with GitHub
      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
    </a>
  );

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Single top spotlight instead of login's dual-blob background */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[42rem] overflow-hidden">
        <div className="absolute left-1/2 top-[-18rem] h-[36rem] w-[64rem] -translate-x-1/2 rounded-[100%] bg-[conic-gradient(from_180deg_at_50%_50%,var(--color-primary)_0deg,transparent_100deg,transparent_260deg,var(--color-primary)_360deg)] opacity-20 blur-3xl dark:opacity-25" />
      </div>

      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <BrandMark />
          <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-foreground">
              How it works
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <ModeToggle />
            {user ? (
              <Link
                href="/dashboard"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* Hero: centered, not split like the login screen */}
        <section className="mx-auto w-full max-w-3xl px-6 pb-16 pt-16 text-center sm:pt-24">
          <Badge variant="secondary" className="mx-auto">
            AI pair programmer for any repo
          </Badge>

          <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Your codebase,{" "}
            <span className="bg-gradient-to-r from-primary via-fuchsia-500 to-primary bg-clip-text text-transparent">
              answered in plain English
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Connect a GitHub repository and ask anything — how a feature
            works, what a pull request changed, or why a bug happened.
            AskRepo answers with citations back to the source.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {primaryCta}
            <a
              href="#how-it-works"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-xl"
              )}
            >
              See how it works
            </a>
          </div>

          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            {CHECKLIST.map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <Check className="size-3.5 text-primary" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Product shot: full-width browser mockup instead of a floating chat card */}
        <section className="mx-auto w-full max-w-5xl px-6 pb-20">
          <div className="overflow-hidden rounded-2xl border border-border shadow-2xl shadow-primary/10">
            <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-2.5">
              <span className="size-2.5 rounded-full bg-destructive/60" />
              <span className="size-2.5 rounded-full bg-yellow-500/60" />
              <span className="size-2.5 rounded-full bg-green-500/60" />
              <span className="ml-3 truncate rounded-md bg-background px-3 py-1 text-xs text-muted-foreground">
                askrepo.app/dashboard/api-gateway
              </span>
            </div>
            <div className="grid grid-cols-[auto_1fr] bg-card">
              <div className="hidden w-44 flex-col gap-1 border-r border-border p-3 sm:flex">
                {["Overview", "api-gateway", "web-client", "infra"].map((item, i) => (
                  <span
                    key={item}
                    className={cn(
                      "truncate rounded-md px-2.5 py-1.5 text-xs font-medium",
                      i === 1
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    {item}
                  </span>
                ))}
              </div>
              <div className="flex flex-col gap-3 p-5">
                <div className="flex justify-end">
                  <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-3.5 py-2.5 text-sm text-primary-foreground">
                    What changed in the auth flow last week?
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="max-w-[85%] space-y-2 rounded-2xl rounded-tl-sm bg-muted px-3.5 py-2.5 text-sm">
                    <p>
                      Three commits touched auth: session cookies were switched
                      to <code className="text-xs">SameSite=Lax</code>, the
                      refresh-token retry was capped at 3 attempts, and a 401
                      handler was added to <code className="text-xs">useCurrentUser</code>.
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant="outline">hooks/use-auth.ts</Badge>
                      <Badge variant="outline">#128</Badge>
                    </div>
                  </div>
                </div>
                <div className="mt-1 flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
                  Ask another question about this repo…
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features: asymmetric bento grid, solid cards (not translucent glass) */}
        <section id="features" className="mx-auto w-full max-w-5xl scroll-mt-24 px-6 py-16">
          <div className="max-w-xl">
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Everything you need to talk to your code
            </h2>
            <p className="mt-3 text-pretty text-base leading-relaxed text-muted-foreground">
              Built for engineers who want answers, not another dashboard to
              maintain.
            </p>
          </div>

          <ul className="mt-10 grid gap-4 sm:grid-cols-3">
            {BENTO_FEATURES.map(({ icon: Icon, title, description, span }) => (
              <li
                key={title}
                className={cn(
                  "rounded-2xl bg-card p-5 ring-1 ring-foreground/10 transition-shadow hover:shadow-md",
                  span
                )}
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <p className="mt-4 text-sm font-semibold">{title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* How it works: vertical timeline, not boxed cards */}
        <section
          id="how-it-works"
          className="mx-auto w-full max-w-3xl scroll-mt-24 px-6 py-16"
        >
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            From sign-in to your first answer in under a minute
          </h2>

          <ol className="mt-10 space-y-8 border-l border-border pl-8">
            {TIMELINE.map(({ step, title, description }) => (
              <li key={step} className="relative">
                <span className="absolute -left-[2.6rem] grid size-8 place-items-center rounded-full border border-border bg-background text-xs font-mono font-semibold text-primary">
                  {step}
                </span>
                <p className="text-sm font-semibold">{title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* Testimonial: not present on the login page */}
        <section className="mx-auto w-full max-w-3xl px-6 py-16">
          <figure className="rounded-2xl bg-card p-8 ring-1 ring-foreground/10 sm:p-10">
            <Quote className="size-8 text-primary/40" />
            <blockquote className="mt-4 text-balance text-lg font-medium leading-relaxed sm:text-xl">
              &ldquo;We onboard new engineers twice as fast now. Instead of
              scheduling a walkthrough, they just ask AskRepo how the billing
              service talks to the queue.&rdquo;
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <Avatar>
                <AvatarFallback>JM</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="font-semibold">Jyotiraditya Mishra</p>
                <p className="text-muted-foreground">Maintainer, AskRepo</p>
              </div>
            </figcaption>
          </figure>
        </section>

        {/* Final CTA: bold gradient banner instead of a glass card */}
        <section className="mx-auto w-full max-w-5xl px-6 py-16">
          <div className="rounded-3xl bg-gradient-to-br from-primary to-fuchsia-600 px-6 py-14 text-center text-primary-foreground">
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Ready to understand your codebase?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-pretty text-sm leading-relaxed text-primary-foreground/80">
              Sign in with GitHub and start chatting with your first
              repository in seconds.
            </p>
            <div className="mt-8 flex justify-center">
              {user ? (
                <Link
                  href="/dashboard"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "group gap-2 rounded-xl bg-background text-foreground hover:bg-background/90"
                  )}
                >
                  Go to dashboard
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              ) : (
                <a
                  href={getGitHubLoginUrl({ next: "/dashboard" })}
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "group gap-2 rounded-xl bg-background text-foreground hover:bg-background/90"
                  )}
                >
                  <GitHubIcon className="size-5" />
                  Continue with GitHub
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 px-6 py-8 text-xs text-muted-foreground sm:flex-row">
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
        </div>
      </footer>
    </div>
  );
}
