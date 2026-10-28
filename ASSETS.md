# Asset provenance

## Client photographs and logo

Originals live in `source-assets/` (not published, ignored by Git). `npm run assets` creates AVIF + WebP derivatives at up to 480, 900 and 1600px in `public/images/`. Processing changes size and encoding only.

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
| `hills-*`      | `image-10.jpeg`           | Idukki hills card, Nearby Places             |
| `plantations-*`| `image-12.jpeg`           | Nearby Places, gallery                       |
| `logo-320/640` | `website logo.jpeg`       | Header, drawer, footer                       |

The logo's outer white backdrop is removed by flood fill from the edges so it sits on the ivory header tab; the artwork itself is unchanged.

Signage (`business image-1/3/4`) and the Department of Tourism certificate (`business image-11`) supplied the published facts: the alternate name Singh House Homestay, host Sanjay Singh (Managing Director), the homestay classification, and the house rules (parking only for customers; plastics, alcohol and tobacco not allowed). Certificate scans and the low-resolution `image-5` portrait are not published.

**Host portrait:** `public/images/sanjay-singh-director-profile.webp` (540×720, retouched version supplied by the client from `source-assets/singh-director.jpeg`) is used on the homepage host row and the About page "Meet your host" card. Publication was approved by the client on 28 October 2026. Its thin frame line is cropped by CSS (`.host-photo`, `.host-portrait`).

## AI-generated images (5)

Generated server-side by `scripts/generate-images.mjs` using `config/image-generation.mjs`. They show generic regional scenery only — never the property, its rooms, or a named viewpoint — and are kept out of the photo gallery.

| File                | Model / quality / size                 | Placement                                  |
| ------------------- | -------------------------------------- | ------------------------------------------ |
| `ai-misty-ghats`    | gpt-image-2.5-sunburst · high · 1536×1024 | Home quote band, Nearby Places header, 404 |
| `ai-tea-slopes`     | gpt-image-2.5-flare · high · 1536×1024   | Peerumedu card and page, Contact header    |
| `ai-spice-still`    | gpt-image-2.5-flare · medium · 1024×1024 | Spice-country card, Peerumedu page         |
| `ai-monsoon-leaves` | gpt-image-2.5-flare · medium · 1536×1024 | Home "three steps" band background         |
| `ai-hill-road`      | gpt-image-2.5-flare · medium · 1536×1024 | Contact "Find your way" card               |

Routing: Flare by default; Sunburst only for hero/banner placements, high-complexity compositions, reference-image work, or when Flare was flagged insufficient (`flareInsufficient: true`). Quality is `high` for hero, banner and feature placements, otherwise `medium`. Raw PNGs are kept in `source-assets/generated/`.
