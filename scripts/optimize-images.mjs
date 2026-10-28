import sharp from "sharp";
import { mkdir, access } from "node:fs/promises";
import path from "node:path";
import { imageAssets, imageConfig } from "../config/image-generation.mjs";

const logoOnly = process.argv.includes("--logo");
const assets = logoOnly
  ? {}
  : {
      waterfall: "hero section image.jpeg",
      cascade: "image-15.jpeg",
      room: "image-14.jpeg",
      "room-wide": "image-16.jpeg",
      veranda: "image-17.jpeg",
      dining: "image-18.jpeg",
      "twin-room": "image-24.jpeg",
      "twin-beds": "image-21.jpeg",
      hills: "image-10.jpeg",
      plantations: "image-12.jpeg",
      exterior: "image-7.jpeg",
    };
// AI-generated regional imagery (see config/image-generation.mjs).
for (const asset of logoOnly ? [] : imageAssets)
  assets[asset.id] = path.join(
    "generated",
    `${asset.id}.${imageConfig.outputFormat}`,
  );

const exists = (file) =>
  access(file).then(
    () => true,
    () => false,
  );

await mkdir("public/images", { recursive: true });
for (const [name, file] of Object.entries(assets)) {
  const source = path.join("source-assets", file);
  if (!(await exists(source))) {
    console.warn(`missing ${source} — skipped`);
    continue;
  }
  const { width } = await sharp(source).metadata();
  const sizes = [
    ...new Set([480, 900, Math.min(1600, width)].filter((n) => n <= width)),
  ];
  for (const size of sizes) {
    const base = sharp(source)
      .rotate()
      .resize({ width: size, withoutEnlargement: true });
    await base
      .clone()
      .webp({ quality: 80 })
      .toFile(`public/images/${name}-${size}.webp`);
    await base
      .clone()
      .avif({ quality: 48, effort: 6 })
      .toFile(`public/images/${name}-${size}.avif`);
  }
  console.log(`${name}: ${sizes.join(", ")}px`);
}

// Logo: remove only the outer white backdrop (flood fill from the edges) so
// the artwork itself, including its cream letter outlines, is untouched.
const logoSource = path.join("source-assets", "website logo.jpeg");
if (await exists(logoSource)) {
  const { data, info } = await sharp(logoSource)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const isBackdrop = (i) =>
    data[i] > 228 && data[i + 1] > 228 && data[i + 2] > 228;
  const seen = new Uint8Array(width * height);
  const stack = [];
  for (let x = 0; x < width; x++) stack.push(x, x + (height - 1) * width);
  for (let y = 0; y < height; y++) stack.push(y * width, y * width + width - 1);
  while (stack.length) {
    const p = stack.pop();
    if (seen[p]) continue;
    seen[p] = 1;
    const i = p * 4;
    if (!isBackdrop(i)) continue;
    data[i + 3] = 0;
    const x = p % width;
    if (x > 0) stack.push(p - 1);
    if (x < width - 1) stack.push(p + 1);
    if (p >= width) stack.push(p - width);
    if (p < width * (height - 1)) stack.push(p + width);
  }
  const transparent = sharp(data, { raw: { width, height, channels: 4 } }).trim(
    { threshold: 1 },
  );
  const trimmed = await transparent.png().toBuffer();
  for (const size of [320, 640]) {
    await sharp(trimmed)
      .resize({ width: size })
      .webp({ quality: 88, alphaQuality: 90 })
      .toFile(`public/images/logo-${size}.webp`);
  }
  const meta = await sharp(trimmed).metadata();
  console.log(`logo: transparent ${meta.width}x${meta.height} → 320, 640px`);
}
