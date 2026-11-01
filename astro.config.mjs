import { defineConfig } from "astro/config";
import { loadEnv } from "vite";

const env = loadEnv("production", process.cwd(), "");
const site = env.PUBLIC_SITE_URL || "https://singhhomestay.in";
if (site && !/^https:\/\/[a-z\d.-]+(?::\d+)?\/?$/i.test(site))
  throw new Error("PUBLIC_SITE_URL must be an HTTPS origin.");
if (env.PUBLIC_INDEXABLE === "true" && !site)
  throw new Error("Set PUBLIC_SITE_URL before enabling indexing.");

export default defineConfig({
  site,
  output: "static",
  trailingSlash: "always",
  vite: {
    define: {
      "import.meta.env.PUBLIC_INDEXABLE": JSON.stringify(
        env.PUBLIC_INDEXABLE ||
          (env.VERCEL_ENV === "production" ? "true" : "false"),
      ),
    },
  },
  devToolbar: { enabled: false },
});
