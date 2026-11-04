# Website audit and fixes — 1 November 2026

The existing design is preserved. `src/styles/global.css` has no diff from HEAD. The only permanent form UI change is removal of the optional email field, explicitly approved in this chat; privacy text was corrected accordingly. New field-level errors appear only during invalid interactions. Fonts, colors, page sections, existing photographs, navigation, animation and component layouts were retained.

**Release state: local changes only. No commit, push, deployment, DNS edit, Search Console change, call or real WhatsApp action was performed.**

## Setup and deployment evidence

- Framework: Astro **7.4.2**, static output, TypeScript, self-hosted fonts, Sharp image derivatives. Build: `npm run build`; output: `dist/`.
- Host: **Vercel**, confirmed by live response headers and the www CNAME `b55b1bac5411c524.vercel-dns-017.com`.
- DNS: Hostinger-managed authoritative nameservers `hermes.dns-parking.com` and `artemis.dns-parking.com`.
- Git: `https://github.com/pv-webservices/singh-homestay.git`, `main`; local HEAD and remote main were both `1ec035d7881845854154b21d721ddd8c3e5fdf12`. [GitHub commit status](https://api.github.com/repos/pv-webservices/singh-homestay/commits/1ec035d7881845854154b21d721ddd8c3e5fdf12/status) reports successful **Vercel** deployment, [deployment evidence](https://vercel.com/web-matrix-solutions/singh-homestay/5ukq75qdgFPnMQtj9LbtcMLGSWxD).
- Before edits, the live homepage exactly matched a local build: **53,356 bytes**, identical HTML and the same four hashed font/CSS/JS references. The later local build differs intentionally because this audit has not been deployed. Other original pages were not compared byte-for-byte to live.

## 1. Errors, redirects and headers

Retained the branded 404 and its existing home/contact, navigation, WhatsApp and telephone links. Fixed noindex behavior and removed canonical tags from every noindex page. Live random missing routes already return HTTP 404; the updated page was also tested locally through a missing route.

Added `vercel.json` with consistent trailing slashes, www-to-apex and index-document redirects, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, one-year immutable caching for hashed `/_astro/` assets and shorter caching for mutable photographs. HTTPS is enforced by Vercel; it already redirects HTTP to HTTPS. The configuration passes the current official Vercel JSON schema. Its live routing and headers remain unverified until deployment.

**Deployment blocker:** live Vercel domain settings currently redirect the apex to www, opposite the requested `https://singhhomestay.in/` canonical. Change Vercel Settings → Domains with the release, so the apex serves production and www redirects to the apex. Otherwise the old domain redirect and new code redirect can loop. No external domain setting was changed.

No thank-you page, submission endpoint or inbound thank-you reference was found. Live `/thank-you/` returns 404. No artificial enquiry-success screen was introduced.

Files: `vercel.json`, `src/layouts/Layout.astro`, `src/pages/404.astro`, `scripts/check-live.mjs`.

## 2. Performance and responsive behavior

Preserved all existing image compositions, responsive CSS and hero styling. Existing photographs already had AVIF/WebP sources and dimensions; added 240px variants, a 160px logo and a 160px director thumbnail. Added responsive sizes/source selection to the existing portrait and drawer logo. Hero images remain eager with high fetch priority; below-fold content remains lazy. The logo no longer competes with the hero at high fetch priority.

Removed an unused Playfair Display dependency and unused Fraunces font-subset output; retained the same Latin Fraunces font and critical serif/sans preloads. No new client-side dependency was introduced. `parse5` is development-only and makes the output audit use a real HTML parser.

Mobile Lighthouse **13.6.0**, default mobile simulated throttling, headless Chrome, production build on `127.0.0.1:4321`. These are local lab measurements, not live PageSpeed or field data.

| Page | Performance | LCP | CLS | Lab TBT | SEO |
| --- | --- | --- | --- | --- | --- |
| Home | 100 → 95 | 1.27s → 1.14s | 0.0008 → 0.0008 | 16ms → 259ms | 66 → 100 |
| Rooms | 95 → 94 | 2.72s → 2.81s | 0.0000 → 0.0000 | 122ms → 152ms | 66 → 100 |

Accessibility and Best Practices were **100 before and after** on both pages. Repeated after-runs varied: Home performance 95–98 and Rooms 94–95. No speed improvement is claimed from these noisy single-run comparisons. Earlier after-run artifacts are retained under `output/audit/lighthouse-after-initial-*.json`.

**Remaining performance limits:** Rooms LCP is about 2.8s, above the 2.5s good threshold; the latest Home TBT is 259ms, above 200ms. These need further profiling and production measurements. Existing animation/design timing was preserved under the no-UI-change constraint. Lab TBT is not field INP. No field INP/CrUX data was retrieved, and no real-host after-deployment performance test was possible.

The homepage before/after screenshots are both **1440×10017**. Pixel differences above 20/255 cover 1.234% of the image, including responsive asset selection and rendering; this is not a claim of pixel identity. The page layout and existing stylesheet were preserved. See `output/playwright/before-home.png` and `after-home.png`.

Files: `src/components/Photo.astro`, `src/layouts/Layout.astro`, `src/pages/index.astro`, `src/pages/about-us.astro`, `src/styles/fonts.css`, asset scripts and organized image folders.

## 3. WhatsApp and telephone enquiries

Used the supplied WhatsApp recipient **919656553358** and mobile **+919656553358**. Retained the pre-existing landline **+914869296094**, pending reconfirmation. Existing booking-page links still lead to the local composer; WhatsApp links now include page-specific, encoded context. No fabricated contact number was added.

Removed the optional email field, email message-composition branch and related privacy wording. No email provider, form endpoint, environment variable, honeypot or delivery dependency existed to remove. The site has no submission backend. Forms only prepare a message and require a separate native-link click to open WhatsApp. They never claim delivery or booking confirmation.

Validation now covers 2–80-character names, 10–15 normalized phone digits, message bounds, real/past/paired dates and valid party/enquiry selections, including silent autofill/programmatic edits. Errors have stable field labels, `aria-invalid`, `aria-describedby`, a summary and first-invalid-field focus. Values are preserved. Editing invalidates an old summary, and the handoff revalidates values immediately before navigation. Summary output uses textContent.

Native anchors avoid script-created popups. Direct WhatsApp and telephone links remain visible in existing contact areas; no-JavaScript explanatory links remain available. A prevented/blocked handoff preserves values and the existing call fallback. Browsers cannot reliably detect whether an external WhatsApp application opened or whether a message was sent; actual device/app failure handling is unverified. The existing disclosure and explicit review/handoff are retained; no new consent checkbox or redesigned contact UI was added.

Privacy copy explains that opening the prefilled link takes the visitor to WhatsApp/Meta before the visitor decides whether to send. No enquiry data is logged to console/analytics, stored in local/session storage, or submitted to a custom backend. Homepage date/party URL behavior remains disclosed.

Files: `src/data/site.ts`, `src/lib/enquiry.mjs`, `src/scripts/site.ts`, `src/components/EnquiryForm.astro`, `src/pages/privacy-policy.astro`, `scripts/contact-qa.js`, `tests/enquiry.test.mjs`.

## 4. SEO and indexing

Added production-aware indexing: Vercel production defaults to indexable, local/preview defaults to noindex. An explicit `PUBLIC_INDEXABLE=false` override still wins, so remove an old production override. Crawling remains allowed so noindex directives can be read. The generated production sitemap lists exactly **13** content URLs and excludes the 404. No unsupported lastmod values were invented.

Indexable pages use self-referencing canonicals, `index, follow, max-image-preview:large`, unique titles at most 65 characters, descriptions 70–170 characters, one H1 and no skipped heading levels. Policies remain indexable. The 404 uses `noindex, follow` with no canonical.

Shortened browser/SEO titles only (visible headings unchanged):

- Home: `Homestay near Mlamala Waterfall, Idukki | Singh Homestay`
- Gallery: `Gallery · Rooms, Waterfalls & Idukki | Singh Homestay`
- Privacy: `Privacy Policy · Website & Enquiries | Singh Homestay`
- FAQ: `FAQs · Planning Your Stay | Singh Homestay`

Completed Open Graph/Twitter metadata with a logo-derived 1200×630 image. Added stable LodgingBusiness/WebSite IDs and breadcrumbs to inner pages; fixed safe JSON-LD escaping of `<`. Retained the supplied address/phone and existing navigation/breadcrumb/cross-links. No founder, article, rating, review, price or unverified business claims were invented. There are no blog posts; Article markup is inapplicable. FAQ rich-result markup was not added.

`npm run audit` checks all output metadata, headings, schemas, canonicals, contacts, image references/dimensions/loading attributes, internal paths/fragments, sitemap consistency, clean routes, icon sizes, manifest and duplicate image hashes. It passes for the production build: **14 pages, 13 indexable, 151 distinct internal targets, zero issues**. A noindex local build was also checked successfully with zero sitemap URLs.

Files: `astro.config.mjs`, `.env.example`, `src/layouts/Layout.astro`, `src/data/site.ts`, robots/sitemap endpoints, `scripts/audit.mjs`, `tests/audit.test.mjs`.

## 5. File and image organization

Moved tracked documents to `docs/` and images into `brand/`, `property/`, `people/` and `editorial/` folders using `git mv`. Names remain lowercase and hyphenated. Updated every dynamic/static source path and the asset pipeline. Full-resolution originals moved to ignored `source-files/`, outside deployed output; no master files were deleted or published. Existing approved director imagery was retained.

The audit found zero exact duplicate deployed image hashes. Every deployed photograph is an optimized derivative, and gallery links open at most a 1600px derivative. The only JPEG output is the deliberately generated 1200×630 social image. No original camera file is shipped. README now documents Vercel deployment, commands, folders and contact configuration.

Files: `README.md`, `docs/ASSETS.md`, `scripts/optimize-images.mjs`, `scripts/resize-thumbnails.mjs`, `config/image-generation.mjs`, `.gitignore`, organized `public/images/` folders.

## 6. Google Search Console guide

Created `docs/GOOGLE-SEARCH-CONSOLE.md`: live release checks; Hostinger DNS TXT Domain-property verification; actual `https://singhhomestay.in/sitemap.xml` submission; exact grouped list of 13 indexable URLs; manageable priority batches; exclusions; fetch/pending troubleshooting; weeks 1–4 follow-up, PageSpeed, Google Business Profile and Bing. Domain verification and indexing requests remain user actions.

## 7. Favicons

Generated square 48px ICO; 48/96/192/512px PNGs; 180px Apple icon; SVG favicon; webmanifest with names, colors and icon entries. All derive from the existing approved logo on an ivory background. The SVG embeds a PNG because no approved vector master exists. Added references to the shared head, including the homepage. File sizes/dimensions and local HTTP availability are verified.

Live currently returns 404 for the new icon/manifest paths; the old SVG is 200. This is expected until deployment, not a completed live fix. Google may take days or weeks after recrawling to update its favicon; homepage indexing requests do not guarantee or directly accelerate the update. [Google's favicon guidance](https://developers.google.com/search/docs/appearance/favicon-in-search).

Files: `scripts/generate-icons.mjs`, `public/favicon*`, `public/apple-touch-icon.png`, `public/site.webmanifest`, `src/layouts/Layout.astro`.

## 8. Verification

| Check | Actual result |
| --- | --- |
| Unit tests | 7/7 pass |
| Astro check | 0 errors, 0 warnings, 0 hints |
| Production build | 14 HTML pages |
| SEO/output audit | 14 pages, 13 indexable, 151 internal targets, 0 failures |
| Dependency audit | npm reported 0 vulnerabilities; production dependency audit also 0 |
| Vercel configuration | 0 validation errors against current official schema |
| Final responsive/browser/axe | 74/74 pass; 14 pages × 5 requested widths plus 4 extra views; 28 axe scans, 0 violations; 0 broken links/images/requests, console errors or overflow |
| Final contact tests | 41/41 pass; outgoing contact actions intercepted, 0 axe violations in error state |
| Final interactions | 30/30 pass; keyboard/menu/gallery/date/no-JS/reduced-motion checks; 0 axe violations in open viewer |
| Existing design stylesheet | No diff from HEAD |
| Git whitespace check | Pass; only local LF/CRLF conversion notices |
| Secret-pattern scan | No matches in source/public/build for tested credential patterns; not a credential audit of external systems |

Final browser evidence is saved under `output/audit/*-final.log`; earlier runs are retained separately. Earlier runs caught transient 404s when a build replaced `dist/` during browsing and a test-isolation issue with repeated click interceptors; the final suites use a complete build and fresh browser contexts.

Keyboard/focus checks cover the menu trap/restoration, photo viewer, native FAQ interaction, invalid fields and reduced motion. A final keyboard check confirmed that Tab reveals the focused skip link, Enter moves the navigation starting point into main content, the next Tab reaches the main booking CTA with a visible focus ring, and the scrolled mobile WhatsApp control is visible at 56×56px. Evidence: `output/audit/keyboard-qa.log`. A no-JavaScript context tests the menu, content visibility and enquiry fallback. This is automated/assisted browser verification, not a human screen-reader or physical-device audit.

## Live observations and remaining release work

Read-only HTTP checks are in `output/audit/live-check.json` and can be rerun with `node scripts/check-live.mjs`.

- HTTP → HTTPS works; apex → www is the existing opposite canonical redirect.
- `/` is HTTP 200 after redirects; old robots meta is `noindex, nofollow`, robots.txt disallows all crawling, and sitemap.xml is empty.
- Unknown routes and `/thank-you/` return real 404.
- `/index.html` and `/rooms/index.html` still serve content instead of canonicalizing; `/rooms` and `/rooms/` both serve content on the old configuration.
- The requested three security headers are absent on the old deployment. New icon URLs and manifest are 404; the existing SVG is 200.
- No new live deployment was made, so post-deployment version, redirects, security headers, sitemap, icons and updated contact UI are **not verified live**.

## Decisions and your next actions

1. Review the prepared bare-domain canonical and arrange the Vercel domain-setting change with deployment; this is the main release blocker. No redirect was changed live.
2. The primary WhatsApp/mobile number is the supplied **+91 96565 53358**; no number clarification is needed. Review contextual message wording, reconfirm the existing landline and exact Google Maps pin, and confirm current classification/address/facilities/house rules and policy copy. Existing claims were not independently re-certified.
3. Review the four shortened SEO titles and the decision to keep the two policy pages indexable. No new content page was noindexed; preview builds and 404 remain noindex.
4. When ready, explicitly authorize your normal commit/push/redeploy workflow. Remove an old production indexing override and coordinate the domain settings. Run the live checks above afterward. Nothing has been committed or pushed here.
5. Approve one supervised manual WhatsApp **chat-open** flow after deployment. Sending a message needs separate approval. No contact action was attempted in this audit.
6. Add the Search Console Domain property using the Hostinger TXT record, verify ownership, submit the generated sitemap, and inspect/request indexing in the batches listed in the guide. Do not submit 404/preview/thank-you URLs.
7. Recheck mobile performance on production and obtain field INP when available. Remaining LCP/TBT limitations above are explicit; no guarantee of indexing, favicon timing, message receipt or availability is made.
