export const DEFAULT_SCOPES = ["read:user", "user:email", "repo"];

function readEnv(name: string): string | undefined {
  const value = process.env[name as keyof NodeJS.ProcessEnv];
  return value && value.length > 0 ? value : undefined;
}

export interface GitHubLoginOptions {
  next?: string;
  scopes?: string[];
  state?: string;
}

export function getGitHubLoginUrl(options: GitHubLoginOptions = {}): string {
  const backendBase = readEnv("NEXT_PUBLIC_BACKEND_URL") ?? "http://localhost:8080";
  const clientId = readEnv("NEXT_PUBLIC_GITHUB_CLIENT_ID");
  const redirectUri = readEnv("NEXT_PUBLIC_GITHUB_REDIRECT_URI");

  // Prefer routing through the backend's Spring Security OAuth2 entrypoint.
  if (!clientId || !redirectUri) {
    const url = new URL("/oauth2/authorization/github", backendBase);
    if (options.next) url.searchParams.set("next", options.next);
    return url.toString();
  }

  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set(
    "scope",
    (options.scopes ?? DEFAULT_SCOPES).join(" ")
  );
  if (options.state) url.searchParams.set("state", options.state);
  return url.toString();
}
