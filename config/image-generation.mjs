// Central settings for AI image generation. Change models, quality tiers or
// sizes here; scripts/generate-images.mjs reads everything from this file.
// The API key is never stored here: it is read from OPENAI_API_KEY at runtime.

export const imageConfig = {
  endpoint: "https://api.openai.com/v1/images/generations",
  models: {
    standard: "gpt-image-2.5-flare",
    premium: "gpt-image-2.5-sunburst",
  },
  quality: {
    default: "medium",
    premium: "high",
  },
  sizes: {
    square: "1024x1024",
    landscape: "1536x1024",
    portrait: "1024x1536",
  },
  outputFormat: "png",
  outputDir: "source-assets/generated",
  requestTimeoutMs: 180_000,
};

// Placements that always justify the premium model / quality.
const PREMIUM_PLACEMENTS = new Set(["hero", "banner"]);
const KEY_PLACEMENTS = new Set(["hero", "banner", "feature"]);

/**
 * Pick the model for an asset. Flare by default; Sunburst only when the
 * placement or the composition genuinely needs it, or Flare already failed.
 * @param {ImageAsset} asset
 */
export function selectModel(asset) {
  const premium =
    PREMIUM_PLACEMENTS.has(asset.placement) ||
    asset.complexity === "high" ||
    Boolean(asset.referenceImage) ||
    asset.flareInsufficient === true;
  return premium ? imageConfig.models.premium : imageConfig.models.standard;
}

/** @param {ImageAsset} asset */
export function selectQuality(asset) {
  return KEY_PLACEMENTS.has(asset.placement) || asset.complexity === "high"
    ? imageConfig.quality.premium
    : imageConfig.quality.default;
}

/** @param {ImageAsset} asset */
export const selectSize = (asset) => imageConfig.sizes[asset.orientation];

/**
 * @typedef {object} ImageAsset
 * @property {string} id            Output file name (no extension)
 * @property {"hero"|"banner"|"feature"|"card"|"background"} placement
 * @property {"square"|"landscape"|"portrait"} orientation
 * @property {"low"|"high"} complexity
 * @property {string} usedOn        Where the image appears on the site
 * @property {string} alt           Alt text used on the site
 * @property {string} prompt
 * @property {string} [referenceImage]
 * @property {boolean} [flareInsufficient]
 */

const STYLE =
  "Authentic documentary travel photograph, natural colour, realistic detail, soft natural light, no people, no text, no watermark, no logos, no buildings in the foreground.";

/** Every generated image has one purpose and one placement. @type {ImageAsset[]} */
export const imageAssets = [
  {
    id: "ai-misty-ghats",
    placement: "banner",
    orientation: "landscape",
    complexity: "high",
    usedOn: "Home full-width quote band; Nearby Places page header",
    alt: "Layers of morning mist drifting over forested hills in the Western Ghats",
    prompt: `Wide landscape of the Western Ghats hills in Idukki, Kerala at early morning: layered blue-green forested ridges receding into the distance, soft mist pooled in the valleys, a few tea-covered slopes in the mid-ground, gentle golden light breaking through clouds. Calm, spacious composition with quiet sky in the upper third for overlaid text. ${STYLE}`,
  },
  {
    id: "ai-tea-slopes",
    placement: "feature",
    orientation: "landscape",
    complexity: "low",
    usedOn: "Peerumedu destination card and detail page",
    alt: "Neatly trimmed rows of tea bushes covering rolling hills under a soft sky",
    prompt: `Rolling hills covered in neatly trimmed rows of tea bushes in the Peerumedu highlands of Kerala, scattered tall silver oak shade trees, a narrow estate footpath curving through the slope, light mist on the far hills, overcast soft daylight. ${STYLE}`,
  },
  {
    id: "ai-spice-still",
    placement: "card",
    orientation: "square",
    complexity: "low",
    usedOn: "Home 'Idukki spice country' experience card",
    alt: "Green cardamom pods, black pepper and cinnamon on a banana leaf",
    prompt: `Overhead close-up still life of Kerala spices on a fresh green banana leaf on dark weathered wood: green cardamom pods, black peppercorns, cinnamon sticks, a few cloves. Natural window light, shallow depth of field, rich but realistic colour. No text, no watermark, no hands.`,
  },
  {
    id: "ai-monsoon-leaves",
    placement: "background",
    orientation: "landscape",
    complexity: "low",
    usedOn: "Home 'How a stay is arranged' dark background band",
    alt: "Raindrops resting on large green tropical leaves",
    prompt: `Close-up of monsoon raindrops resting on large overlapping dark green tropical leaves in a Kerala forest, deep shadows, moody low-key light, lots of dark negative space suitable as a website background behind text. ${STYLE}`,
  },
  {
    id: "ai-hill-road",
    placement: "card",
    orientation: "landscape",
    complexity: "low",
    usedOn: "Contact page 'Find your way' card",
    alt: "A quiet road winding through green hills and forest in Idukki",
    prompt: `A quiet narrow road winding through lush green hills and forest in rural Idukki, Kerala, seen from a gentle elevation, tea bushes and tall trees along the roadside, soft afternoon light, no vehicles. ${STYLE}`,
  },
];
