# Google Search Console setup — Singh Homestay

Prepared 1 November 2026. These instructions describe the updated local build. Deployment and Search Console ownership verification have not been performed.

## 1. Complete the live-domain checks first

- Canonical origin prepared in code: **https://singhhomestay.in/**. The existing live apex currently redirects to **www**. In Vercel → project → Settings → Domains, remove the apex-to-www redirect, assign the production deployment to `singhhomestay.in`, and redirect `www.singhhomestay.in` to the apex. Do this with the release: leaving the old domain redirect alongside the new reverse redirect can cause a loop.
- Confirm HTTP redirects to HTTPS, www redirects to the apex, `/index.html` redirects to `/`, and directory URLs end in `/`.
- Remove any old production `PUBLIC_INDEXABLE=false` override. The updated config uses `VERCEL_ENV=production` to enable indexing; previews remain `noindex, follow`. Local launch QA can set `PUBLIC_INDEXABLE=true` for one build.
- Confirm `/robots.txt` allows crawling and includes `Sitemap: https://singhhomestay.in/sitemap.xml`. Noindex pages must remain crawlable so their robots meta can be read.
- Confirm `/sitemap.xml` returns HTTP 200, XML, and exactly the 13 URLs below.
- Confirm a random nonexistent route returns **HTTP 404**, the branded error page, `noindex, follow`, and no canonical tag.
- Confirm favicon files and `/site.webmanifest` return HTTP 200, and CSS, JS and icons are crawlable.
- Inspect WhatsApp URLs for recipient `919656553358`, encoded contextual text, and `tel:+919656553358` calls. The pre-existing landline is `tel:+914869296094`; ask the client to reconfirm it. Automated tests intercept contact navigation. One supervised manual chat-open test requires approval, and sending requires separate approval.
- Run `node scripts/check-live.mjs` after deployment and inspect `output/audit/live-check.json`. Astro preview cannot verify Vercel redirect/header behavior.

## 2. Add the Domain property and verify DNS

DNS checked on 1 November 2026: authoritative nameservers are `hermes.dns-parking.com` and `artemis.dns-parking.com`; `www` is a CNAME to `b55b1bac5411c524.vercel-dns-017.com`. Manage verification at **Hostinger**, while Vercel serves the website.

1. Open [Google Search Console](https://search.google.com/search-console/). Add property → **Domain** → enter `singhhomestay.in` without a protocol or path.
2. Copy the exact `google-site-verification=…` TXT value Google supplies. It is specific to your property; no token is invented or included here.
3. In Hostinger hPanel → **Domains → Domain portfolio → Manage** for `singhhomestay.in` → **DNS / Nameservers → DNS records**, add a **TXT** record. Set Name/Host to `@`, paste Google's entire value, and keep the default TTL. Preserve existing records, nameservers and the Vercel A/CNAME records.
4. Save, allow DNS propagation, then click **Verify** in Search Console. If pending, confirm the public TXT record with `Resolve-DnsName singhhomestay.in -Type TXT` and retry after propagation. Leave the record in place after verification.

Official guides: [Hostinger TXT records](https://www.hostinger.com/support/1583664-how-to-manage-txt-records-at-hostinger/), [Google ownership verification](https://support.google.com/webmasters/answer/9008080).

## 3. Submit the generated sitemap

In Sitemaps, submit **https://singhhomestay.in/sitemap.xml**. This project generates `sitemap.xml`, not `sitemap-index.xml`. The XML is automatically generated from the site's route list and excludes the custom 404. There are no fabricated last-modified dates; this static site has no trustworthy per-page content timestamps.

A browser's XML “no style information” message is normal: XML needs no visual stylesheet. If Google reports **Couldn't fetch** or **Pending**, inspect the actual HTTP response, final host, redirect chain, robots rules, sitemap XML, deployment protection and Google access. Processing may take time, but do not assume an accessibility failure is harmless.

## 4. Indexable URLs: exactly 13

All URLs below use `https://singhhomestay.in` as the origin. Both policy pages remain indexable because they provide useful public enquiry information. No new policy noindex decision was introduced.

### Batch 1 — main enquiry and business pages (5)

- https://singhhomestay.in/
- https://singhhomestay.in/rooms/
- https://singhhomestay.in/rooms/homestay-rooms/
- https://singhhomestay.in/contact-us/
- https://singhhomestay.in/book-your-stay/

### Batch 2 — supporting visitor information (6)

- https://singhhomestay.in/about-us/
- https://singhhomestay.in/gallery/
- https://singhhomestay.in/nearby-places/
- https://singhhomestay.in/nearby-places/mlamala-waterfall/
- https://singhhomestay.in/nearby-places/peerumedu/
- https://singhhomestay.in/faq/

### Batch 3 — public policies (2)

- https://singhhomestay.in/privacy-policy/
- https://singhhomestay.in/booking-policy/

After the live checks pass, use URL Inspection → **Test live URL** → **Request indexing** for Batch 1, then the other batches as quota permits. Submitting the sitemap is sufficient for discovery; manual requests are optional and do not guarantee indexing.

Do **not** submit `/404.html`, nonexistent routes, preview deployment URLs, query-string booking variations, image/icon files, or `/thank-you/`. The 404 and previews are noindex; assets are not standalone content pages; query variants duplicate the booking page. No thank-you page or inbound reference existed in this project, and the live route returns 404. Opening WhatsApp never proves a message was sent.

## 5. Weeks 1–4

- **Week 1:** Check sitemap status, URL Inspection and Pages/Indexing. Investigate blocked/noindex or redirect-loop reports. Some discovery and indexing delay is expected.
- **Week 2:** Review canonical selection, duplicate/soft-404 exclusions and applicable enhancement reports. Breadcrumb structured data exists. No invented review, founder or article data was added.
- **Week 3:** Recheck [PageSpeed Insights](https://pagespeed.web.dev/) for Home and Rooms. Lighthouse TBT is a lab measurement; field INP requires real-user data and may be unavailable on a small or new site. Review real traffic in Search Console as it becomes available.
- **Week 4:** Check queries, impressions and page coverage, update only verified business information, maintain the Google Business Profile with the confirmed location/phone, and add the site to [Bing Webmaster Tools](https://www.bing.com/webmasters/), optionally importing the verified Search Console property.

## Favicon expectations

Logo-derived square icons are linked from every page. Google may take days or weeks after recrawling to display a favicon change; display is not guaranteed. Requesting homepage indexing does not guarantee or directly accelerate that favicon update. See [Google's favicon documentation](https://developers.google.com/search/docs/appearance/favicon-in-search).
