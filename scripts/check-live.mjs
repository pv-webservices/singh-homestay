import { readFile, writeFile, mkdir } from "node:fs/promises";
import { elements } from "./audit.mjs";

const origin = "https://singhhomestay.in";
const targets = [
  "/",
  "/robots.txt",
  "/sitemap.xml",
  "/audit-missing/",
  "/index.html",
  "/rooms",
  "/rooms/",
  "/rooms/index.html",
  "/thank-you/",
  "/favicon.ico",
  "/favicon.svg",
  "/favicon-48x48.png",
  "/favicon-96x96.png",
  "/favicon-192x192.png",
  "/favicon-512x512.png",
  "/apple-touch-icon.png",
  "/site.webmanifest",
];
const results = [];
for (const target of targets) {
  const response = await fetch(origin + target, {
    signal: AbortSignal.timeout(20000),
  });
  const isText = /text|xml|json/.test(
    response.headers.get("content-type") || "",
  );
  const body = isText ? await response.text() : "";
  const nodes = target === "/" ? elements(body) : [];
  results.push({
    target,
    finalUrl: response.url,
    status: response.status,
    headers: Object.fromEntries(
      [
        "server",
        "x-content-type-options",
        "referrer-policy",
        "x-frame-options",
        "cache-control",
      ].map((h) => [h, response.headers.get(h)]),
    ),
    ...(target === "/"
      ? {
          robots: nodes.find(
            (n) => n.tag === "meta" && n.attrs.name === "robots",
          )?.attrs.content,
          canonical: nodes.find(
            (n) => n.tag === "link" && n.attrs.rel === "canonical",
          )?.attrs.href,
          matchesCurrentLocalBuild:
            body === (await readFile("dist/index.html", "utf8")),
        }
      : {}),
    ...(["/robots.txt", "/sitemap.xml"].includes(target) ? { body } : {}),
  });
}
const redirects = [];
for (const target of [
  "http://singhhomestay.in/",
  origin + "/",
  "https://www.singhhomestay.in/",
]) {
  const r = await fetch(target, {
    redirect: "manual",
    signal: AbortSignal.timeout(20000),
  });
  redirects.push({
    url: target,
    status: r.status,
    location: r.headers.get("location"),
  });
}
const report = {
  checkedAt: new Date().toISOString(),
  redirects,
  results,
  note: "Read-only HTTP checks; no deployment or contact action.",
};
await mkdir("output/audit", { recursive: true });
await writeFile(
  "output/audit/live-check.json",
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
