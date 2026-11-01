import test from "node:test";
import assert from "node:assert/strict";
import { checkPage, elements } from "../scripts/audit.mjs";

test("HTML audit parses decoded attributes and identifies real SEO regressions", () => {
  const html =
    "<title>Too long ".repeat(1) +
    "x".repeat(80) +
    '</title><meta name="description" content="short"><meta name="robots" content="noindex, follow"><link rel="canonical" href="https://singhhomestay.in/"><h1>Test</h1><h3>Skipped</h3><img src="/missing.webp"><input type="email"><a href="https://wa.me/123?text=A&amp;other=B">Chat</a>';
  const { failures } = checkPage(html, "/", "https://singhhomestay.in");
  for (const message of [
    "title length",
    "description length",
    "heading level skipped",
    "canonical/indexability mismatch",
    "image lacks alt",
    "incorrect WhatsApp",
    "obsolete email field",
    "missing WebSite",
  ])
    assert.ok(
      failures.some((f) => f.includes(message)),
      message,
    );
  assert.equal(
    elements(html).find((n) => n.tag === "a").attrs.href,
    "https://wa.me/123?text=A&other=B",
  );
});
