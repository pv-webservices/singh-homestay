// Server-side AI image generation. Runs in Node only — never in the browser.
// Usage: node --env-file=.env scripts/generate-images.mjs [--force] [--only=id,id] [--dry-run]
import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";
import {
  imageConfig,
  imageAssets,
  selectModel,
  selectQuality,
  selectSize,
} from "../config/image-generation.mjs";

const args = process.argv.slice(2);
const force = args.includes("--force");
const dryRun = args.includes("--dry-run");
const only = args
  .find((a) => a.startsWith("--only="))
  ?.slice(7)
  .split(",");

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey && !dryRun) {
  console.error("OPENAI_API_KEY is not set. Add it to .env (never commit it).");
  process.exit(1);
}

const exists = (file) =>
  access(file).then(
    () => true,
    () => false,
  );

async function generate(asset) {
  const body = {
    model: selectModel(asset),
    prompt: asset.prompt,
    size: selectSize(asset),
    quality: selectQuality(asset),
    n: 1,
    output_format: imageConfig.outputFormat,
  };
  if (dryRun) return { body };
  const response = await fetch(imageConfig.endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(imageConfig.requestTimeoutMs),
  });
  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = json?.error?.message || response.statusText;
    throw new Error(`${response.status} ${message}`);
  }
  const b64 = json?.data?.[0]?.b64_json;
  if (!b64) throw new Error("Response did not include image data.");
  return { body, buffer: Buffer.from(b64, "base64") };
}

await mkdir(imageConfig.outputDir, { recursive: true });
const selected = imageAssets.filter((a) => !only || only.includes(a.id));
let failures = 0;
for (const asset of selected) {
  const file = path.join(
    imageConfig.outputDir,
    `${asset.id}.${imageConfig.outputFormat}`,
  );
  if (!force && !dryRun && (await exists(file))) {
    console.log(`skip  ${asset.id} (exists; use --force to regenerate)`);
    continue;
  }
  try {
    const { body, buffer } = await generate(asset);
    const label = `${body.model} · ${body.quality} · ${body.size}`;
    if (buffer) {
      await writeFile(file, buffer);
      console.log(`done  ${asset.id} → ${file} (${label})`);
    } else console.log(`plan  ${asset.id} (${label})`);
  } catch (error) {
    failures++;
    console.error(`fail  ${asset.id}: ${error.message}`);
  }
}
process.exitCode = failures ? 1 : 0;
