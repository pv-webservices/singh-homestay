import { parse } from "parse5";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { createHash } from "node:crypto";

export function elements(html) {
  const result = [];
  const text = (node) =>
    node.nodeName === "#text"
      ? node.value
      : (node.childNodes || []).map(text).join("");
  function visit(node) {
    if (node.tagName)
      result.push({
        tag: node.tagName,
        attrs: Object.fromEntries(node.attrs.map((a) => [a.name, a.value])),
        text: text(node),
      });
    node.childNodes?.forEach(visit);
  }
  visit(parse(html));
  return result;
}

export function checkPage(html, route, origin) {
  const nodes = elements(html),
    failures = [];
  const check = (pass, message) => {
    if (!pass) failures.push(`${route}: ${message}`);
  };
  const metas = Object.fromEntries(
    nodes
      .filter((n) => n.tag === "meta")
      .map((n) => [n.attrs.name || n.attrs.property, n.attrs.content]),
  );
  const title = nodes.find((n) => n.tag === "title")?.text || "",
    description = metas.description || "";
  check(
    title.length > 0 && title.length <= 65,
    `title length ${title.length} (expected 1–65)`,
  );
  check(
    description.length >= 70 && description.length <= 170,
    `description length ${description.length} (expected 70–170)`,
  );
  const headings = nodes.filter((n) => /^h[1-6]$/.test(n.tag));
  check(
    headings.filter((n) => n.tag === "h1").length === 1,
    "must have exactly one H1",
  );
  let previous = 0;
  for (const h of headings) {
    const level = Number(h.tag[1]);
    check(
      level <= previous + 1,
      `heading level skipped before ${h.text.trim()}`,
    );
    previous = level;
  }
  const indexable = /^index(?:,|$)/.test(metas.robots || "");
  check(
    /^(?:noindex|index), follow/.test(metas.robots || ""),
    "invalid robots meta",
  );
  if (indexable)
    check(
      metas.robots.includes("max-image-preview:large"),
      "missing large image preview permission",
    );
  const canonicals = nodes.filter(
    (n) => n.tag === "link" && n.attrs.rel === "canonical",
  );
  check(
    indexable
      ? canonicals.length === 1 && canonicals[0].attrs.href === origin + route
      : canonicals.length === 0,
    "canonical/indexability mismatch",
  );
  if (route === "/404.html") check(!indexable, "404 must be noindex");
  for (const key of [
    "og:title",
    "og:description",
    "og:url",
    "og:type",
    "og:image",
    "og:image:width",
    "og:image:height",
    "og:image:type",
    "og:image:alt",
    "twitter:card",
    "twitter:title",
    "twitter:description",
    "twitter:image",
    "twitter:image:alt",
  ])
    check(!!metas[key], `missing ${key}`);
  check(
    metas["og:title"] === title && metas["og:description"] === description,
    "social metadata disagrees with page",
  );
  check(metas["og:url"] === origin + route, "incorrect social URL");
  check(
    metas["og:image:width"] === "1200" && metas["og:image:height"] === "630",
    "social image dimensions",
  );
  const graph = [];
  for (const script of nodes.filter(
    (n) => n.tag === "script" && n.attrs.type === "application/ld+json",
  )) {
    try {
      const data = JSON.parse(script.text);
      graph.push(...(data["@graph"] || [data]));
      check(!script.text.includes("<"), "JSON-LD contains unescaped <");
      check(
        !/\"(?:email|aggregateRating|review|priceRange)\"\s*:/.test(
          script.text,
        ),
        "unverified structured-data fields",
      );
    } catch {
      check(false, "invalid JSON-LD");
    }
  }
  const business = graph.find((n) => n["@type"] === "LodgingBusiness");
  check(
    business?.telephone === "+919656553358" &&
      !!business?.["@id"] &&
      !!business?.logo &&
      !!business?.address,
    "missing verified business schema",
  );
  check(
    graph.some((n) => n["@type"] === "WebSite"),
    "missing WebSite schema",
  );
  if (!["/", "/404.html"].includes(route))
    check(
      graph.some((n) => n["@type"] === "BreadcrumbList"),
      "missing breadcrumb schema",
    );
  for (const image of nodes.filter((n) => n.tag === "img" && n.attrs.src)) {
    check(
      "alt" in image.attrs && !!image.attrs.width && !!image.attrs.height,
      "image lacks alt or dimensions",
    );
    check(
      ["lazy", "eager"].includes(image.attrs.loading),
      "image lacks explicit loading strategy",
    );
    check(
      !image.attrs.srcset || !!image.attrs.sizes,
      "responsive image lacks sizes",
    );
  }
  for (const link of nodes.filter((n) => n.tag === "a")) {
    const href = link.attrs.href || "";
    check(
      !/^mailto:/i.test(href) || href === "mailto:brahmasingh369@gmail.com",
      "obsolete contact destination",
    );
    if (href.startsWith("https://wa.me/")) {
      const url = new URL(href);
      check(
        url.pathname === "/919656553358" && !!url.searchParams.get("text"),
        "incorrect WhatsApp recipient or missing message",
      );
    }
    if (href.startsWith("tel:"))
      check(/^tel:\+[1-9]\d{9,14}$/.test(href), "invalid telephone link");
    if (link.attrs.target === "_blank")
      check(/noopener/.test(link.attrs.rel || ""), "unsafe external target");
  }
  check(
    !nodes.some((n) => n.tag === "input" && n.attrs.type === "email"),
    "obsolete email field",
  );
  for (const form of nodes.filter((n) => n.tag === "form"))
    check(
      !/post/i.test(form.attrs.method || "") &&
        !/https?:/.test(form.attrs.action || ""),
      "form must not submit to a delivery backend",
    );
  for (const icon of [
    "/favicon.ico",
    "/favicon.svg",
    "/favicon-48x48.png",
    "/favicon-96x96.png",
    "/apple-touch-icon.png",
    "/site.webmanifest",
  ])
    check(
      nodes.some((n) => n.tag === "link" && n.attrs.href === icon),
      `missing icon reference ${icon}`,
    );
  return { failures, nodes, title, description, indexable };
}

export async function audit(directory = "dist") {
  const origin = "https://singhhomestay.in",
    files = [],
    pages = new Map(),
    failures = [];
  async function walk(dir) {
    for (const e of await readdir(dir, { withFileTypes: true })) {
      const f = path.join(dir, e.name);
      if (e.isDirectory()) await walk(f);
      else files.push(f);
    }
  }
  await walk(directory);
  const titles = new Set(),
    descriptions = new Set(),
    internalLinks = new Set();
  for (const filename of files.filter((f) => f.endsWith(".html"))) {
    const route =
      "/" +
      path
        .relative(directory, filename)
        .split(path.sep)
        .join("/")
        .replace(/index\.html$/, "");
    const page = checkPage(await readFile(filename, "utf8"), route, origin);
    failures.push(...page.failures);
    if (titles.has(page.title)) failures.push(`${route}: duplicate title`);
    if (descriptions.has(page.description))
      failures.push(`${route}: duplicate description`);
    titles.add(page.title);
    descriptions.add(page.description);
    pages.set(route, page);
  }
  const fileFor = (route) =>
    path.join(
      directory,
      decodeURIComponent(route.endsWith("/") ? route + "index.html" : route),
    );
  if (pages.size !== 14)
    failures.push(`Expected 14 built pages, found ${pages.size}`);
  for (const route of pages.keys())
    if (route !== "/404.html" && !/^\/(?:[a-z0-9-]+\/)*$/.test(route))
      failures.push(`Unclean route ${route}`);
  for (const [route, page] of pages) {
    const refs = [];
    for (const node of page.nodes) {
      for (const attr of ["href", "src"])
        if (node.attrs[attr]) refs.push(node.attrs[attr]);
      if (node.attrs.srcset)
        refs.push(
          ...node.attrs.srcset.split(",").map((s) => s.trim().split(/\s+/)[0]),
        );
      if (
        node.tag === "meta" &&
        ["og:image", "twitter:image"].includes(
          node.attrs.property || node.attrs.name,
        )
      )
        refs.push(node.attrs.content);
    }
    for (const ref of refs) {
      const url = new URL(ref, origin + route);
      if (url.origin !== origin) continue;
      const target = url.pathname;
      internalLinks.add(target);
      try {
        await stat(fileFor(target));
      } catch {
        failures.push(`${route}: missing local target ${target}`);
        continue;
      }
      if (
        url.hash &&
        pages.has(target) &&
        !pages
          .get(target)
          .nodes.some(
            (n) => n.attrs.id === decodeURIComponent(url.hash.slice(1)),
          )
      )
        failures.push(`${route}: missing fragment ${ref}`);
    }
  }
  const sitemap = await readFile(path.join(directory, "sitemap.xml"), "utf8");
  const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
    (m) => m[1],
  );
  const expected = [...pages]
    .filter(([, p]) => p.indexable)
    .map(([r]) => origin + r);
  if (JSON.stringify([...locations].sort()) !== JSON.stringify(expected.sort()))
    failures.push("Sitemap differs from indexable pages");
  const robots = await readFile(path.join(directory, "robots.txt"), "utf8");
  if (/Disallow:\s*\//.test(robots) || !robots.includes("Allow: /"))
    failures.push("robots.txt blocks crawling");
  if (expected.length && !robots.includes(`Sitemap: ${origin}/sitemap.xml`))
    failures.push("robots.txt lacks sitemap directive");
  for (const filename of files)
    if (
      /source-files|source-assets|\.jpe?g$/i.test(filename) &&
      !filename.endsWith("social-1200x630.jpg")
    )
      failures.push(`Original/private file deployed: ${filename}`);
  const hashes = new Map();
  for (const filename of files.filter((f) =>
    /\.(webp|avif|png|jpg)$/.test(f),
  )) {
    const hash = createHash("sha256")
      .update(await readFile(filename))
      .digest("hex");
    if (hashes.has(hash))
      failures.push(
        `Duplicate image bytes: ${filename} and ${hashes.get(hash)}`,
      );
    hashes.set(hash, filename);
  }
  for (const size of [48, 96, 180, 192, 512]) {
    const name =
      size === 180 ? "apple-touch-icon.png" : `favicon-${size}x${size}.png`;
    const meta = await sharp(path.join(directory, name)).metadata();
    if (meta.width !== size || meta.height !== size)
      failures.push(`Incorrect icon size ${name}`);
  }
  const social = await sharp(
    path.join(directory, "images/brand/social-1200x630.jpg"),
  ).metadata();
  if (social.width !== 1200 || social.height !== 630)
    failures.push("Incorrect social image size");
  const ico = await readFile(path.join(directory, "favicon.ico"));
  if (ico.readUInt16LE(2) !== 1 || ico[6] !== 48 || ico[7] !== 48)
    failures.push("Incorrect ICO header");
  const manifest = JSON.parse(
    await readFile(path.join(directory, "site.webmanifest"), "utf8"),
  );
  if (
    !manifest.name ||
    !manifest.short_name ||
    !manifest.theme_color ||
    !manifest.background_color
  )
    failures.push("Incomplete webmanifest");
  for (const icon of manifest.icons) await stat(fileFor(icon.src));
  const result = {
    pages: pages.size,
    indexable: expected.length,
    internalTargets: internalLinks.size,
    failures,
  };
  console.log(JSON.stringify(result, null, 2));
  if (failures.length) process.exitCode = 1;
  return result;
}

if (
  process.argv[1] &&
  ["audit.mjs", "verify-output.mjs"].includes(path.basename(process.argv[1]))
)
  await audit();
