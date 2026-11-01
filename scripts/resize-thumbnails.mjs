import sharp from "sharp";
import { readdir } from "node:fs/promises";

// Smaller derivatives preserve the existing compositions and CSS dimensions.
for (const folder of ["property", "editorial"]) {
  const files = (await readdir(`public/images/${folder}`)).filter((f) =>
    f.endsWith(".webp"),
  );
  const largest = new Map();
  for (const file of files) {
    const [, name, size] = file.match(/^(.*)-(\d+)\.webp$/) || [];
    if (name && Number(size) > (largest.get(name)?.size || 0))
      largest.set(name, { file, size: Number(size) });
  }
  for (const [name, { file }] of largest) {
    for (const format of ["webp", "avif"])
      await sharp(`public/images/${folder}/${file}`)
        .resize({ width: 240 })
        .toFormat(format, { quality: format === "avif" ? 48 : 80 })
        .toFile(`public/images/${folder}/${name}-240.${format}`);
  }
}
await sharp("public/images/brand/logo-640.webp")
  .resize({ width: 160 })
  .webp({ quality: 88 })
  .toFile("public/images/brand/logo-160.webp");
await sharp("public/images/people/sanjay-singh-director-profile.webp")
  .resize({ width: 160 })
  .webp({ quality: 80 })
  .toFile("public/images/people/sanjay-singh-director-profile-160.webp");
