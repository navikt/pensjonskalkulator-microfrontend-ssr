import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
// import { getToken, validateTokenxToken } from "@navikt/oasis";
import { pages } from "./render.js";
import type { Language } from "./types.js";

const healthPaths = new Set(["/api/internal/isAlive", "/api/internal/isReady", "/isAlive", "/isReady"]);
const routes = new Map<string, Language>([
  ["/nb", "nb"],
  ["/nn", "nn"],
  ["/en", "en"],
]);

export function createAppServer() {
  async function handleRequest(request: IncomingMessage, response: ServerResponse): Promise<void> {
    const pathname = new URL(request.url ?? "/", "http://localhost").pathname;
    const path = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;

    if (request.method !== "GET" && request.method !== "HEAD") {
      response.writeHead(405, { Allow: "GET, HEAD" });
      response.end();
      return;
    }

    if (healthPaths.has(path)) {
      response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
      response.end();
      return;
    }

    response.setHeader("Cache-Control", "no-store");

    // Restore @navikt/oasis as a runtime dependency before enabling TokenX again.
    /*
    if (process.env.NODE_ENV !== "development") {
      const token = getToken(request);
      if (!token) {
        console.warn("Missing TokenX token");
        response.writeHead(401);
        response.end();
        return;
      }

      const validation = await validateTokenxToken(token);
      if (!validation.ok) {
        console.warn("Invalid TokenX token", validation.errorType);
        response.writeHead(401);
        response.end();
        return;
      }
    }
    */

    if (path === "/") {
      response.writeHead(302, { Location: "/nb" });
      response.end();
      return;
    }

    const language = routes.get(path);
    if (!language) {
      response.writeHead(404);
      response.end();
      return;
    }

    const html = pages[language];
    response.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Length": html.byteLength,
    });
    response.end(request.method === "HEAD" ? undefined : html);
  }

  return createServer((request, response) => {
    void handleRequest(request, response).catch((error: unknown) => {
      console.error("SSR request failed", error);
      if (response.headersSent) {
        response.destroy();
        return;
      }
      response.writeHead(500);
      response.end();
    });
  });
}
