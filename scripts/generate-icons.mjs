import sharp from "sharp";
import { writeFile } from "node:fs/promises";

// Reuse the supplied logo; never generate replacement brand artwork.
const logo = "public/images/brand/logo-640.webp";
const background = "#fbf9f3";
for (const size of [48, 96, 180, 192, 512]) {
  const icon = await sharp(logo)
    .resize(size - 4, size - 4, { fit: "contain", background })
    .extend({ top: 2, bottom: 2, left: 2, right: 2, background })
    .flatten({ background })
    .png()
    .toBuffer();
  const filename =
    size === 180 ? "apple-touch-icon.png" : `favicon-${size}x${size}.png`;
  await writeFile(`public/${filename}`, icon);
  if (size === 48) {
    const header = Buffer.alloc(22);
    header.writeUInt16LE(1, 2);
    header.writeUInt16LE(1, 4);
    header[6] = header[7] = 48;
    header.writeUInt16LE(1, 10);
    header.writeUInt16LE(32, 12);
    header.writeUInt32LE(icon.length, 14);
    header.writeUInt32LE(22, 18);
    await writeFile("public/favicon.ico", Buffer.concat([header, icon]));
  }
  if (size === 96)
    await writeFile(
      "public/favicon.svg",
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><image width="96" height="96" href="data:image/png;base64,${icon.toString("base64")}"/></svg>`,
    );
}
const overlay = await sharp(logo)
  .resize(820, 480, { fit: "inside" })
  .toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 3, background } })
  .composite([{ input: overlay, gravity: "center" }])
  .jpeg({ quality: 85 })
  .toFile("public/images/brand/social-1200x630.jpg");
await writeFile(
  "public/site.webmanifest",
  JSON.stringify(
    {
      name: "Singh Homestay",
      short_name: "Singh Homestay",
      start_url: "/",
      display: "browser",
      theme_color: "#063d36",
      background_color: background,
      icons: [192, 512].map((size) => ({
        src: `/favicon-${size}x${size}.png`,
        sizes: `${size}x${size}`,
        type: "image/png",
        purpose: "any",
      })),
    },
    null,
    2,
  ) + "\n",
);
console.log(
  "Generated logo-derived icons, manifest and 1200×630 social image.",
);
