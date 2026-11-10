import assert from "node:assert/strict";
import { once } from "node:events";
import { test } from "node:test";
import { escapeHtml, pages } from "../dist/render.js";
import { createAppServer } from "../dist/server.js";

async function startServer(t) {
  const server = createAppServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve()))));
  return `http://127.0.0.1:${server.address().port}`;
}

test("locale routes serve HTML fragments with inline styles and no scripts", async (t) => {
  const base = await startServer(t);
  for (const language of ["nb", "nn", "en"]) {
    const response = await fetch(`${base}/${language}`);
    const html = await response.text();
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("content-type"), "text/html; charset=utf-8");
    assert.equal(Number(response.headers.get("content-length")), Buffer.byteLength(html));
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.equal(html, pages[language].toString());
    assert.ok(html.includes(`lang="${language}"`));
    assert.match(html, /<style>[\s\S]+<\/style>/);
    assert.match(html, /href="https:\/\/www\.nav\.no\/pensjon\/kalkulator\/login"/);
    assert.doesNotMatch(html, /<script|<html|<head>|<body|\{\{/i);
  }

  const alternate = await fetch(`${base}/nb/?source=min-side`);
  assert.equal(alternate.status, 200);
  assert.equal(await alternate.text(), pages.nb.toString());
});

test("root redirects to Bokmal", async (t) => {
  const base = await startServer(t);
  const root = await fetch(base, { redirect: "manual" });
  assert.equal(root.status, 302);
  assert.equal(root.headers.get("location"), "/nb");
});

test("health endpoints work without authentication", async (t) => {
  const base = await startServer(t);
  for (const path of ["/api/internal/isAlive", "/api/internal/isReady", "/isAlive", "/isReady"]) {
    const response = await fetch(`${base}${path}`);
    assert.equal(response.status, 200);
    assert.equal(await response.text(), "");
  }
});

test("authorization headers are ignored while TokenX validation is disabled", async (t) => {
  const base = await startServer(t);
  const response = await fetch(`${base}/nb`, { headers: { Authorization: "Bearer test-token" } });
  assert.equal(response.status, 200);
  assert.equal(await response.text(), pages.nb.toString());
});

test("HEAD returns headers only, unknown routes return 404, and POST returns 405", async (t) => {
  const base = await startServer(t);
  const head = await fetch(`${base}/nb`, { method: "HEAD" });
  assert.equal(head.status, 200);
  assert.equal(Number(head.headers.get("content-length")), pages.nb.byteLength);
  assert.equal(await head.text(), "");

  assert.equal((await fetch(`${base}/missing`)).status, 404);
  const post = await fetch(`${base}/nb`, { method: "POST" });
  assert.equal(post.status, 405);
  assert.equal(post.headers.get("allow"), "GET, HEAD");
});

test("template values are HTML escaped", () => {
  assert.equal(escapeHtml(`<&>"'`), "&lt;&amp;&gt;&quot;&#39;");
});
