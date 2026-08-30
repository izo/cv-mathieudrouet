/// <reference types="@cloudflare/workers-types" />

// Pages Function middleware — Markdown content negotiation for AI agents.
// Porté à l'identique depuis l'edge function Netlify d'origine, supprimée lors
// de la migration vers Cloudflare Pages (voir docs/07-migration-cloudflare-pages-2026-05-29.md).
// When a request to a mapped route sends `Accept: text/markdown` (with a quality
// at least equal to text/html), the Markdown source is returned instead of the
// HTML rendering. Browsers keep getting HTML because their default Accept prefers
// text/html.

const ROUTE_TO_MARKDOWN: Record<string, string> = {
  "/": "/cv.md",
  "/about": "/about.md",
  "/about/": "/about.md",
  // Version anglaise — même contrat, une source par langue.
  "/en": "/en/cv.md",
  "/en/": "/en/cv.md",
  "/en/about": "/en/about.md",
  "/en/about/": "/en/about.md",
};

// CF Pages ignores X-Frame-Options and Permissions-Policy set via _headers —
// injecting them here ensures they reach the client on every HTML response.
const SECURITY_HEADERS: Record<string, string> = {
  "x-frame-options": "DENY",
  "permissions-policy": "camera=(), microphone=(), geolocation=()",
};

export const onRequest: PagesFunction = async (context) => {
  const { request, next, env } = context;
  const url = new URL(request.url);
  const target = ROUTE_TO_MARKDOWN[url.pathname];

  // Route non concernée ou méthode non idempotente → pipeline normal
  if (!target || (request.method !== "GET" && request.method !== "HEAD")) {
    return withSecurityHeaders(await next());
  }

  const accept = request.headers.get("accept") || "";
  if (!prefersMarkdown(accept)) return withSecurityHeaders(await next());

  // Récupère l'asset statique .md servi par Pages via le binding ASSETS
  const assets = (env as { ASSETS: Fetcher }).ASSETS;
  const mdResponse = await assets.fetch(
    new Request(new URL(target, url.origin).toString(), {
      headers: { accept: "text/markdown" },
    }),
  );
  if (!mdResponse.ok) return withSecurityHeaders(await next());

  const body = request.method === "HEAD" ? null : await mdResponse.text();

  const headers = new Headers({
    "content-type": "text/markdown; charset=utf-8",
    "vary": "Accept",
    "cache-control": "public, max-age=3600, must-revalidate",
    "x-markdown-source": target,
    "link": [
      `</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"`,
      `</.well-known/agent-skills/index.json>; rel="https://agentskills.io/rel/index"; type="application/json"`,
      `<${url.pathname}>; rel="canonical"`,
    ].join(", "),
  });

  return new Response(body, { status: 200, headers });
};

function withSecurityHeaders(response: Response): Response {
  const ct = response.headers.get("content-type") ?? "";
  if (!ct.includes("text/html")) return response;
  const headers = new Headers(response.headers);
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
    if (!headers.has(k)) headers.set(k, v);
  }
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

function prefersMarkdown(accept: string): boolean {
  if (!accept) return false;
  const entries = accept
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [type, ...params] = entry.split(";").map((s) => s.trim());
      const qParam = params.find((p) => p.startsWith("q="));
      const q = qParam ? parseFloat(qParam.slice(2)) : 1;
      return { type: type.toLowerCase(), q: Number.isFinite(q) ? q : 1 };
    });

  const md = entries.find((e) => e.type === "text/markdown" || e.type === "text/x-markdown");
  if (!md || md.q === 0) return false;

  const html = entries.find((e) => e.type === "text/html");
  const htmlQ = html ? html.q : 0;

  return md.q >= htmlQ;
}
