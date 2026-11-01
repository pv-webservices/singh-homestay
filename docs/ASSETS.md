# Asset provenance

## Client photographs and logo

Originals live in `source-files/` (not published, ignored by Git). `npm run assets` creates AVIF + WebP derivatives at 240, 480, 900 and up to 1600px in `public/images/property/` and `public/images/editorial/`. Processing changes size and encoding only.

| Published name | Original                  | Use                                          |
| -------------- | ------------------------- | -------------------------------------------- |
| `waterfall-*`  | `hero section image.jpeg` | Home hero, About, waterfall page, CTA band   |
| `cascade-*`    | `image-15.jpeg`           | Hero card, gallery page header, gallery      |
| `room-*`       | `image-14.jpeg`           | Rooms header, gallery                        |
| `room-wide-*`  | `image-16.jpeg`           | Bedroom bento, room detail header, booking   |
| `twin-room-*`  | `image-24.jpeg`           | Rooms page, gallery                          |
| `twin-beds-*`  | `image-21.jpeg`           | Twin-bed tile, rooms page, gallery (new)     |
| `veranda-*`    | `image-17.jpeg`           | Sit-out tile, About header, gallery          |
| `dining-*`     | `image-18.jpeg`           | Dining tile, About, gallery                  |
| `exterior-*`   | `image-7.jpeg`            | Intro collage, About, rooms page             |
| `welcome-banner-*` | `about-us-image.webp`   | Intro collage signboard                      |
| `hills-*`      | `image-10.jpeg`           | Idukki hills card, Nearby Places             |
| `plantations-*`| `image-12.jpeg`           | Nearby Places, gallery                       |
| `logo-160/320/640` | `website logo.jpeg`       | Header, drawer, footer                       |

The logo's outer white backdrop is removed by flood fill from the edges so it sits on the ivory header tab; the artwork itself is unchanged.

Signage (`business image-1/3/4`) and the Department of Tourism certificate (`business image-11`) supplied the published facts: the alternate name Singh House Homestay, host Sanjay Singh (Managing Director), the homestay classification, and the house rules (parking only for customers; plastics, alcohol and tobacco not allowed). Certificate scans and the low-resolution `image-5` portrait are not published.

**Host portrait:** `public/images/people/sanjay-singh-director-profile.webp` (540×720, retouched version supplied by the client from `source-files/singh-director.jpeg`) is used on the homepage host row and the About page "Meet your host" card. Publication was approved by the client on 28 October 2026. Its thin frame line is cropped by CSS (`.host-photo`, `.host-portrait`).

## AI-generated images (5)

Generated server-side by `scripts/generate-images.mjs` using `config/image-generation.mjs`. They show generic regional scenery only — never the property, its rooms, or a named viewpoint — and are kept out of the photo gallery.

| File                | Model / quality / size                 | Placement                                  |
| ------------------- | -------------------------------------- | ------------------------------------------ |
| `ai-misty-ghats`    | gpt-image-2.5-sunburst · high · 1536×1024 | Home quote band, Nearby Places header, 404 |
| `ai-tea-slopes`     | gpt-image-2.5-flare · high · 1536×1024   | Peerumedu card and page, Contact header    |
| `ai-spice-still`    | gpt-image-2.5-flare · medium · 1024×1024 | Spice-country card, Peerumedu page         |
| `ai-monsoon-leaves` | gpt-image-2.5-flare · medium · 1536×1024 | Home "three steps" band background         |
| `ai-hill-road`      | gpt-image-2.5-flare · medium · 1536×1024 | Contact "Find your way" card               |

Routing: Flare by default; Sunburst only for hero/banner placements, high-complexity compositions, reference-image work, or when Flare was flagged insufficient (`flareInsufficient: true`). Quality is `high` for hero, banner and feature placements, otherwise `medium`. Raw PNGs are kept in `source-files/generated/`.

## Audit asset organization — 1 November 2026

Brand files live in `public/images/brand/`, the existing approved director portrait and its 160px thumbnail in `people/`, client photographs in `property/`, and generated scenery in `editorial/`. Masters were moved to the ignored `source-files/` directory. All tracked image/document moves used `git mv`. No original masters were published or deleted. Smaller derivatives preserve the existing crops and CSS layout.

`npm run icons` derives the favicon set and 1200×630 social image from the existing approved logo, on an ivory background. The SVG icon embeds the 96px PNG because the supplied logo has no vector master. The tiny icon necessarily retains more detail than a simplified monogram; no replacement brand artwork was invented.
