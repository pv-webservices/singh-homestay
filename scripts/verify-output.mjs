import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const origin = process.argv[2];
const indexable = process.argv.includes("--indexable");
const files = [];
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const filename = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(filename);
    else files.push(filename);
  }
}
await walk("dist");
const titles = new Set(),
  descriptions = new Set();
for (const filename of files.filter((file) => file.endsWith(".html"))) {
  const html = await readFile(filename, "utf8");
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  const description = html.match(
    /<meta name="description" content="(.*?)"/s,
  )?.[1];
  assert.ok(title && description, `Missing metadata: ${filename}`);
  assert.ok(!titles.has(title), `Duplicate title: ${title}`);
  titles.add(title);
  assert.ok(
    !descriptions.has(description),
    `Duplicate description: ${filename}`,
  );
  descriptions.add(description);
  assert.equal(
    (html.match(/<h1(?:\s|>)/g) || []).length,
    1,
    `Heading count: ${filename}`,
  );
  const canonical = html.match(/<link rel="canonical" href="(.*?)"/)?.[1];
  if (origin)
    assert.ok(canonical?.startsWith(origin + "/"), `Canonical: ${filename}`);
  else
    assert.equal(
      canonical,
      undefined,
      "Preview canonical must not invent an origin",
    );
  const schema = JSON.parse(
    html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)?.[1] ||
      "null",
  );
  assert.equal(schema["@type"], "LodgingBusiness");
  assert.equal(schema.telephone, "+919288056157");
  for (const key of [
    "aggregateRating",
    "review",
    "priceRange",
    "amenityFeature",
  ])
    assert.equal(schema[key], undefined);
  for (const match of html.matchAll(/<img\s[^>]*src="(\/[^\"]+)"/g))
    await stat(path.join("dist", match[1]));
}
assert.equal(titles.size, 14, "Expected 13 content pages and a custom 404");
assert.equal(
  files.some((file) => file.endsWith(".jpeg")),
  false,
  "Original images and scans must not be published",
);
const robots = await readFile("dist/robots.txt", "utf8");
const sitemap = await readFile("dist/sitemap.xml", "utf8");
if (indexable) {
  assert.match(robots, /Allow: \//);
  assert.ok(robots.includes(origin + "/sitemap.xml"));
} else assert.match(robots, /Disallow: \//);
assert.equal((sitemap.match(/<loc>/g) || []).length, origin ? 13 : 0);
assert.equal(
  (await readdir(".")).filter((file) => file.endsWith(".html")).length,
  0,
  "Remove the replaced starter HTML",
);
console.log(
  `Verified ${titles.size} unique pages, metadata, structured data, image paths, robots and sitemap (${indexable ? "public configuration" : "preview configuration"}).`,
);
