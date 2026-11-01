# Singh Homestay

Static Astro 7 website for https://singhhomestay.in/. Node.js 22.12+ is required. No booking inventory, payments, accounts, submission database or delivery backend exists. Enquiries are prepared in the browser for the visitor to review and send through WhatsApp.

## Local commands

```powershell
npm ci
npm run dev
npm test
npm run check
npm run build
npm run audit
npm run preview -- --port 4321
```

`npm run audit` checks all generated HTML, metadata lengths/uniqueness, H1/heading order, indexability/canonicals, social metadata, JSON-LD, image attributes, internal files/fragments, contact destinations and sitemap consistency. `npm run verify:output` is an alias. Run after building.

Local and Vercel preview builds default to `noindex, follow` and an empty sitemap. For a local production-mode indexing audit:

```powershell
$env:PUBLIC_INDEXABLE='true'
npm run build
Remove-Item Env:PUBLIC_INDEXABLE
npm run audit
```

## Vercel deployment

Verified Git remote: `https://github.com/pv-webservices/singh-homestay.git`, branch `main`. GitHub reports a successful Vercel deployment for the current remote commit. The original live homepage exactly matched a local build before this audit. Changes from this audit are local only; no commit, push or deployment was performed.

Vercel configuration is in `vercel.json`: Astro framework, output `dist`, trailing slashes, index-document redirects, www-to-apex redirect, security headers and immutable caching for hashed `/_astro/` assets. Vercel enforces HTTPS. The build command runs type checks, unit tests, build and SEO audit. No adapter or server functions are required.

**Before deploying:** the existing live Vercel domain setting redirects the apex to www. Change Settings → Domains so `singhhomestay.in` serves production and www redirects to the apex. Leaving the existing apex redirect active alongside the new reverse redirect can loop. Do this with the release. Confirm the chosen canonical origin before launch.

Production indexing defaults on only when `VERCEL_ENV=production`. Remove an old `PUBLIC_INDEXABLE=false` production override if present. An explicit false still disables indexing. The default canonical origin is the supplied https://singhhomestay.in; `PUBLIC_SITE_URL` must be an HTTPS origin if overridden. Do not enable indexing on preview builds.

After authorized Git push/redeploy, run `node scripts/check-live.mjs` and follow [the Search Console guide](docs/GOOGLE-SEARCH-CONSOLE.md). Check the generated custom 404 with a random missing URL, not only `/404.html`. Local preview does not emulate Vercel headers or redirects.

## Contact configuration

`src/data/site.ts` owns the confirmed WhatsApp recipient `919288056157`, mobile `+919288056157`, existing landline, address, navigation and route list. `whatsappFor(path)` supplies encoded page-specific messages. Reconfirm the existing landline and exact map pin with the client; Maps links remain labelled address searches.

`src/components/EnquiryForm.astro` and `src/scripts/site.ts` prepare the enquiry. `src/lib/enquiry.mjs` validates typed, autofilled and programmatic values: name length, 10–15 phone digits, paired calendar dates, future arrival, guest selections and message bounds. Field errors have accessible descriptions, summary and focus. Values stay in the form. No personal contact data is logged or saved in storage. The homepage date/party handoff uses a GET URL; the privacy policy explains browser-history implications.

A separate user click opens the prepared native WhatsApp link, then the visitor decides whether to send. This never confirms delivery, room availability or a booking. Native anchors avoid script-created popups; direct WhatsApp and telephone links remain available throughout the site and in no-JavaScript fallback text. The browser cannot establish whether the WhatsApp app opened successfully or a message was sent. Request explicit approval for a supervised real chat-open test; sending requires separate approval.

## Folder structure

- `src/pages/`: 13 content routes plus the custom 404, robots and generated sitemap endpoints.
- `src/layouts/`, `src/components/`, `src/styles/`, `src/scripts/`: existing presentation and behavior. The audit preserved the design; only the approved optional contact field was removed.
- `src/data/site.ts`: business data, page names and indexable routes.
- `public/images/brand/`: approved logo derivatives and social image.
- `public/images/property/`: actual property and regional client photographs.
- `public/images/people/`: the director portrait already present before this audit and its thumbnail.
- `public/images/editorial/`: previously generated regional illustrations; never represented as property photographs.
- `public/`: square favicon set and webmanifest.
- `source-files/`: private full-resolution masters and supplied materials, ignored by Git and excluded from deployment. Do not upload this directory.
- `docs/`: design/asset provenance, historical QA, current audit report and Google Search Console instructions.
- `scripts/`, `tests/`: asset generation, output/live/browser audits and unit tests.
- `output/`: ignored local QA artifacts, Lighthouse JSON and screenshots.

## Assets and browser QA

`npm run assets` rebuilds responsive 240/480/900/up-to-1600px AVIF/WebP photographs and 160/320/640px logos from private masters. `node scripts/resize-thumbnails.mjs` can create the small derivatives from existing public files, including the portrait thumbnail. `npm run icons` regenerates the logo-based icon set and 1200×630 social image without private masters. Normal builds need no private originals or credentials.

AI regional-image generation remains an optional existing maintenance tool: `npm run images:plan` is offline; `npm run images:generate` uses a locally configured server-side API key. Model/prompt configuration is in `config/image-generation.mjs`. No generation API was called for this audit. Never commit a real key or deploy the project root.

From a running production preview, use the established Playwright CLI workflow:

```powershell
npx --yes --package @playwright/cli playwright-cli -s=singh open http://127.0.0.1:4321/
npx --yes --package @playwright/cli playwright-cli -s=singh run-code --filename scripts/browser-qa.js
npx --yes --package @playwright/cli playwright-cli -s=singh run-code --filename scripts/interaction-qa.js
npx --yes --package @playwright/cli playwright-cli -s=singh run-code --filename scripts/contact-qa.js
```

Contact QA intercepts outgoing contact clicks. Do not bypass its interception or test with real messages/calls.

See [the current audit report](docs/AUDIT-REPORT.md), [asset provenance](docs/ASSETS.md), and [Search Console setup](docs/GOOGLE-SEARCH-CONSOLE.md). Confirm current classification, address spelling, map pin, room facilities/capacity/rates and booking policies with the client; no new business claims were introduced.
