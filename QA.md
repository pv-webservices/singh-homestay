# Local verification — redesign, 28 October 2026

All checks ran against the production build (`npm run build`, served by `astro preview` on 127.0.0.1:4321) in headless Chromium.

| Check                                 | Result                                                                                       |
| ------------------------------------- | -------------------------------------------------------------------------------------------- |
| `npm test`                            | 5/5 pass (dates, phone validation, encoded enquiry message)                                  |
| `astro check`                         | 0 errors, 0 warnings                                                                         |
| `npm run build`                       | 14 pages                                                                                     |
| `npm run verify:output`               | metadata, structured data, image paths, robots and sitemap pass                              |
| `scripts/browser-qa.js`               | 43/43 cases: 13 routes × 320/768/1440px plus extra homepage sizes; no overflow, broken requests, JS errors or axe WCAG 2.2 A/AA violations |
| `scripts/interaction-qa.js`           | 30/30, including the right-side drawer after scrolling, focus trap, no-JS menu fallback, booking-bar handoff, WhatsApp message encoding, gallery filter, lightbox accessibility and reduced motion |
| Internal links (all pages, 2 sizes)   | no broken internal links; external links are tel:, wa.me, Google Maps searches and Kerala Tourism |
| Mobile Lighthouse (home)              | Performance 90, Accessibility 100, Best Practices 100; FCP 1.6s, LCP 3.6s (simulated throttling), CLS 0.001, TBT 0ms |
| API key exposure                      | the key appears nowhere in `src/`, `public/`, `config/`, `scripts/` or `dist/`               |

LCP is still above the 2.5s "good" threshold in the simulated run. Real-host caching and field data have not been measured.

## Still needs client confirmation

Production domain, exact map pin, current validity of the tourism classification, room rates and capacity, check-in/out times, payment and cancellation terms. Whether Wi-Fi, hot water and meals are offered (shown in the original mockup) was not verified, so those are not published. Genuine guest reviews were not supplied, so no testimonials are shown.
