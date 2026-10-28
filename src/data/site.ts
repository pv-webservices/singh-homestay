export const business = {
  name: "Singh Homestay",
  phone: "+91 92880 56157",
  tel: "+919288056157",
  whatsapp: "919288056157",
  landline: "04869 296094",
  address:
    "Aruvikuzhi, Mlamala Puthuvel, Thengakal P.O., Peerumedu Taluk, Idukki District, Kerala – 685533, India",
  host: "Sanjay Singh",
  hostRole: "Managing Director",
  altName: "Singh House Homestay",
  // From the Department of Tourism, Kerala homestay classification certificate
  // and the property signage in source-assets/.
  classification: "Classified homestay · Department of Tourism, Kerala",
  maps:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(
      "Singh House Homestay, Aruvikuzhi, Mlamala Puthuvel, Thengakal, Idukki, Kerala 685533",
    ),
};
export const whatsapp =
  "https://wa.me/" +
  business.whatsapp +
  "?text=" +
  encodeURIComponent(
    "Hello Singh Homestay, I would like to enquire about a stay. Please share availability and pricing.",
  );
// Rules printed on the property signboard.
export const houseRules = [
  [
    "car",
    "Parking only for customers",
    "Parking is reserved for guests staying at the homestay.",
  ],
  ["leaf", "Plastic-free stay", "Plastics are not allowed on the property."],
  ["ban", "No alcohol or tobacco", "Alcohol and tobacco are not allowed."],
];
export const nav = [
  ["/", "Home"],
  ["/about-us/", "About Us"],
  ["/rooms/", "Rooms"],
  ["/gallery/", "Gallery"],
  ["/nearby-places/", "Nearby Places"],
  ["/contact-us/", "Contact"],
];
export const routes = [
  "/",
  "/about-us/",
  "/rooms/",
  "/rooms/homestay-rooms/",
  "/gallery/",
  "/nearby-places/",
  "/nearby-places/mlamala-waterfall/",
  "/nearby-places/peerumedu/",
  "/contact-us/",
  "/book-your-stay/",
  "/faq/",
  "/privacy-policy/",
  "/booking-policy/",
];
export const photos = {
  waterfall: {
    name: "waterfall",
    width: 1600,
    height: 1200,
    alt: "Mlamala waterfall cascading over rocks between green forest banks",
    caption: "Mlamala Waterfall",
    category: "Waterfalls",
  },
  cascade: {
    name: "cascade",
    width: 1040,
    height: 780,
    alt: "Water cascading across broad rocks in the Mlamala waterfall area",
    caption: "Water, rock & a little quiet",
    category: "Waterfalls",
  },
  room: {
    name: "room",
    width: 1200,
    height: 1600,
    alt: "Wooden double bed with floral bedspread in a pink-walled homestay room",
    caption: "A room to make yourself at home",
    category: "Accommodation",
  },
  "room-wide": {
    name: "room-wide",
    width: 1200,
    height: 1600,
    alt: "Homestay bedroom with pink walls, curtains, mirror and wooden bed",
    caption: "The warmth of a homestay",
    category: "Accommodation",
  },
  "twin-room": {
    name: "twin-room",
    width: 1600,
    height: 757,
    alt: "Homestay sleeping area with wooden beds and white linens",
    caption: "A look inside the accommodation",
    category: "Accommodation",
  },
  veranda: {
    name: "veranda",
    width: 1200,
    height: 1600,
    alt: "Seating on the sheltered pink veranda at Singh Homestay",
    caption: "Time to sit back",
    category: "Homestay",
  },
  dining: {
    name: "dining",
    width: 1200,
    height: 1600,
    alt: "Wooden dining table and chairs inside Singh Homestay",
    caption: "Everyday homestay moments",
    category: "Homestay",
  },
  exterior: {
    name: "exterior",
    width: 572,
    height: 1280,
    alt: "The real Singh Homestay building with a balcony and plants in front",
    caption: "Welcome to Singh Homestay",
    category: "Homestay",
  },
  "twin-beds": {
    name: "twin-beds",
    width: 757,
    height: 1600,
    alt: "Two wooden beds with fresh white linens against a pink wall",
    caption: "Twin beds, fresh linens",
    category: "Accommodation",
  },
  hills: {
    name: "hills",
    width: 493,
    height: 1040,
    alt: "Green hills and cultivated slopes in the Idukki region",
    caption: "The green side of Idukki",
    category: "Landscapes",
  },
  plantations: {
    name: "plantations",
    width: 493,
    height: 1040,
    alt: "Sunlit plantation landscape and rolling green hills in Idukki",
    caption: "Hills that invite you to slow down",
    category: "Landscapes",
  },
  // AI-generated regional scenery (config/image-generation.mjs). Never used
  // to depict the property, rooms or a named viewpoint.
  "ai-misty-ghats": {
    name: "ai-misty-ghats",
    width: 1536,
    height: 1024,
    alt: "Layers of morning mist drifting over forested hills in the Western Ghats",
    caption: "Morning over the Western Ghats",
    category: "Landscapes",
  },
  "ai-tea-slopes": {
    name: "ai-tea-slopes",
    width: 1536,
    height: 1024,
    alt: "Neatly trimmed rows of tea bushes covering rolling hills under a soft sky",
    caption: "Tea country",
    category: "Landscapes",
  },
  "ai-spice-still": {
    name: "ai-spice-still",
    width: 1024,
    height: 1024,
    alt: "Green cardamom pods, black pepper, cloves and cinnamon on a banana leaf",
    caption: "Spice country",
    category: "Landscapes",
  },
  "ai-monsoon-leaves": {
    name: "ai-monsoon-leaves",
    width: 1536,
    height: 1024,
    alt: "Raindrops resting on large green tropical leaves",
    caption: "After the rain",
    category: "Landscapes",
  },
  "ai-hill-road": {
    name: "ai-hill-road",
    width: 1536,
    height: 1024,
    alt: "A quiet road winding through green hills and tea gardens in Idukki",
    caption: "The road into the hills",
    category: "Landscapes",
  },
};
export type PhotoKey = keyof typeof photos;
export const gallery: PhotoKey[] = [
  "waterfall",
  "room",
  "hills",
  "veranda",
  "cascade",
  "room-wide",
  "twin-beds",
  "plantations",
  "dining",
  "twin-room",
  "exterior",
];
export const places = [
  {
    slug: "mlamala-waterfall",
    title: "Mlamala Waterfall",
    label: "Waterfalls & forest",
    image: "waterfall" as PhotoKey,
    description:
      "A cascade, a rocky riverbed and a wonderfully green setting. Discover the waterfall area near the homestay.",
  },
  {
    slug: "peerumedu",
    title: "Peerumedu",
    label: "Hills & plantation country",
    image: "ai-tea-slopes" as PhotoKey,
    description:
      "Explore the wider landscape of Peerumedu, a hill region known for its tea, coffee and spice plantations.",
  },
];
export const faq = [
  [
    "How do I enquire about a stay?",
    "Choose your dates on our booking enquiry page and prepare a WhatsApp message. Send it to the homestay to ask about availability and pricing. You can also call us directly.",
  ],
  [
    "Where is Singh Homestay?",
    "The homestay is in Aruvikuzhi, Mlamala Puthuvel, Thengakal P.O., Peerumedu Taluk, Idukki District, Kerala – 685533.",
  ],
  [
    "Does an enquiry confirm my booking?",
    "An enquiry starts a conversation. Your stay is confirmed only when you and the homestay have agreed on the room, dates, price and booking arrangements directly.",
  ],
  [
    "How can I get directions?",
    "Call or message us for the exact arrival pin and current approach directions before travelling. The address search on our contact page can help you locate the area.",
  ],
  [
    "What are the room rates and guest capacity?",
    "Please share your dates and the number of adults and children with us. The homestay will confirm suitable room arrangements and current pricing for your group.",
  ],
  [
    "Can I ask about meals, Wi-Fi, hot water and parking?",
    "Yes. Tell us which facilities matter to your stay, and ask the homestay to confirm them before you book. Please also check any parking arrangements for your vehicle.",
  ],
  [
    "What are the check-in and cancellation arrangements?",
    "Check-in and check-out times, payments, cancellation and refund arrangements must be agreed directly with the homestay before confirming a stay.",
  ],
  [
    "Are there any house rules?",
    "Please ask for the current house rules, including policies on parking, plastics, alcohol, tobacco, pets and visitors, before confirming your stay.",
  ],
];
