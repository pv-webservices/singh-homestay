# Singh Homestay

A static, multi-page Astro business website based on the supplied homepage reference, logo and real business photographs. No React runtime, account system, payment flow or booking inventory.

## Run locally

Requires Node.js 22.12+ (developed with Node.js 24.19).

```powershell
npm install
npm run dev
```

Production build and preview:

```powershell
npm test
npm run check
npm run build
npm run preview -- --port 4321
```

Open [the local preview](http://127.0.0.1:4321/). Deploy **only `dist/`** to a static host; do not upload the project directory or `source-assets/`. Configure the host to serve the generated `404.html` for unknown routes.

## Pages

Home, About Us, Rooms, Homestay Rooms detail, Gallery, Nearby Places, Mlamala Waterfall detail, Peerumedu detail, Contact Us, Book Your Stay, FAQ, Privacy Policy, and Booking & Enquiry Policy. A custom 404 page is also included.

There is one homepage source, `src/pages/index.astro`. Astro generates an `index.html` for each route in `dist/`; these are the normal output of a multi-page website, not duplicate homepage implementations. The supplied `html file.html` is replaced by the finished site.

## Content and design

- `src/data/site.ts`: business contacts, navigation, photo captions, attractions and FAQs.
- `src/styles/global.css`: design tokens (see `DESIGN.md`), components, motion and responsive styles.
- `src/layouts/Layout.astro`: shared navigation, footer, metadata, structured data and photo viewer.
- `src/components/`: page hero, photo, gallery, booking bar, enquiry form, section heading, WhatsApp icon and CTA components.
- `src/scripts/site.ts`: navigation, progressive reveals, gallery filters/lightbox and enquiry behavior.
- `src/lib/enquiry.mjs`: calendar validation and WhatsApp message creation, covered by unit tests.
- `DESIGN.md`: reference interpretation, content boundaries and skills used.
- `ASSETS.md`: original-to-optimized asset mapping and provenance.
- `QA.md`: results and the limits of local verification.

## Enquiries

The homepage bar validates dates and carries them, with party size, to `/book-your-stay/` through a GET URL. The enquiry page preselects that party size as adults; visitors can adjust adults and children before preparing the final message.

The booking and contact forms validate the details and show an enquiry summary. The visitor then opens WhatsApp with a correctly encoded message, reviews it and presses Send in WhatsApp. The site does not send automatically or claim delivery or availability. No credentials, email service or server database are required. Without JavaScript, telephone and direct WhatsApp links remain available; gallery photos open as normal image links and FAQs use native disclosures.

## Before a public launch

1. Confirm the exact production origin. `singhhomestay.in` appears in the supplied business materials but deployment and domain ownership were not verified.
2. Confirm the business address spelling, WhatsApp recipient and exact Google Maps arrival pin. Current Maps buttons are explicitly labelled searches.
3. Obtain approval for the public copy and privacy/enquiry information. Agree actual room capacity, facilities, check-in/out times, payments, cancellations and house rules directly with the client before publishing those specifics.
4. Keep personal portraits and certificate scans private. They are preserved in `source-assets/`, outside Astro’s public folder and ignored by Git. No personal portrait is used on the site.
5. Copy `.env.example` to `.env`, set `PUBLIC_SITE_URL` to the confirmed HTTPS origin, and enable `PUBLIC_INDEXABLE=true` only for the approved public site. Rebuild after changing these values. Preview builds default to noindex and `Disallow: /`; without an origin the sitemap is empty and canonical/absolute social URLs are omitted.
6. Deploy `dist/`, verify redirects, HTTPS, canonical URLs and sitemap on the real domain, and test one authorized enquiry with the client. Local QA cannot establish production indexing or message delivery.

## AI image generation

Five regional images (misty hills, tea slopes, spices, monsoon leaves, hill road) were generated server-side with the OpenAI Image API. They never depict the property. Models, quality tiers, sizes and every prompt/placement live in `config/image-generation.mjs`. Change the model names or quality there.

```powershell
npm run images:plan       # show model/quality/size routing, no API calls
npm run images:generate   # reads OPENAI_API_KEY from .env; skips existing files (--force to redo)
npm run assets            # convert originals + generated PNGs to AVIF/WebP
```

The key is read only by the Node script. It is never bundled into the site. `.env` is Git-ignored.

## Assets and formatting

`npm run assets` regenerates responsive AVIF/WebP derivatives from originals in `source-assets/`. The optimized public assets are already present, so a normal build does not require the private originals. No generated resort/property photography is used. Fonts are self-hosted.

Browser QA uses Playwright CLI and local axe-core. From a running production preview:

```powershell
npx --yes --package @playwright/cli playwright-cli -s=singh open http://127.0.0.1:4321/ --headed
npx --yes --package @playwright/cli playwright-cli -s=singh run-code --filename scripts/browser-qa.js
```

Official technical references: [Astro static routing](https://v6.docs.astro.build/en/guides/routing/) and [site URL configuration](https://docs.astro.build/en/guides/configuring-astro/). Regional destination source: [Kerala Tourism: Peerumedu](https://www.keralatourism.org/munnar/peerumedu-idukki.php). No exact travel times, attraction fees or opening hours are asserted.
