# Singh Homestay — design system

An evolved version of the original brand (logo, forest/leaf palette, "Your Home in Nature"), rebuilt as an editorial, conversion-focused homestay site.

## Tokens (`src/styles/global.css`)

- **Colour:** forest #063d36 (brand), deep forest #03221d, emerald #14594b, leaf #a8ce71, clay accent #c8693a (from the logo's roof and heliconia), ivory #fbf9f3, paper #f4f1e7, sage #e6ede0.
- **Type:** Fraunces Variable (display), DM Sans (text), Caveat (hand-written accent echoing the original mockup). Self-hosted; the two main files are preloaded.
- **Layout:** `--wrap` = min(1480px, 90vw) for most sections; full-bleed hero, marquee, quote, steps and CTA bands. Mobile gutters 16–20px.
- **Shape:** 10 / 18 / 28px radii, pill buttons, soft layered shadows.
- **Motion:** one easing curve (`--ease`), transform/opacity only. Disabled under `prefers-reduced-motion`.

## Components

Header with an ivory logo tab, which turns solid after scrolling and tucks away on scroll-down · right-side drawer (outside the header, focus-trapped, `:target` fallback without JS) · glass booking bar · bento room grid · sticky "Explore" split · parallax quote band · numbered steps band · mosaic/masonry gallery with lightbox · house-rules card · FAQ accordion · photo CTA band · footer with wordmark · floating WhatsApp (appears after scrolling, never covers the booking bar).

Buttons use a directional background fill and icon nudge on hover. There are no shine, glow or shimmer effects. Cards lift and their images zoom on hover only (`@media (hover: hover)`); touch devices see captions without hover. Dropdowns use themed `appearance: base-select` where supported, with a styled native fallback.

## Homepage story

Hero → booking bar → welcome and host → marquee → inside the homestay (bento + amenities) → explore around (sticky) → quote band → how booking works → gallery → good to know (house rules, classification, FAQs) → CTA → footer.

## Content rules

- Facts come only from the supplied signage, certificate, business card and earlier verified copy. No invented reviews, ratings, distances, prices, capacities or amenities. The mockup's sample reviews and its Wi-Fi/hot-water icons are not published as facts.
- AI imagery depicts the region generically and is labelled as illustrative where it stands for Peerumedu.
- The main CTA is an enquiry, never an instant booking.
