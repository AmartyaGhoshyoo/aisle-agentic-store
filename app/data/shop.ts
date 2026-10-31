// Aisle's demo catalogue: departments and products. Product photos are free Unsplash photos
// (cropped square, WebP) in /public/products/<dept>/; six products also have a real 3D model
// (see components/three/products.ts) that opens in the product viewer.
import type { ModelId } from "../components/three/products";

export type DeptKey = "mobiles" | "laptops" | "audio" | "watches" | "footwear" | "fashion" | "beauty" | "home" | "kitchen" | "sports";

export const DEPTS: { key: DeptKey; name: string; icon: string; cover: string; blurb: string }[] = [
  { key: "mobiles", name: "Mobiles", icon: "smartphone", cover: "/products/mob/nova-red.webp", blurb: "Flagships to first phones" },
  { key: "laptops", name: "Laptops", icon: "laptop", cover: "/products/lap/studio15.webp", blurb: "Study, work, play" },
  { key: "audio", name: "Audio", icon: "headphones", cover: "/products/aud/hush.webp", blurb: "Headphones & speakers" },
  { key: "watches", name: "Watches", icon: "watch", cover: "/products/wat/racing.webp", blurb: "Chronos to minimal" },
  { key: "footwear", name: "Footwear", icon: "footprints", cover: "/products/sho/skate.webp", blurb: "Runners & court classics" },
  { key: "fashion", name: "Fashion", icon: "shirt", cover: "/products/fas/autumn-set.webp", blurb: "Layers, denim, travel" },
  { key: "beauty", name: "Beauty", icon: "sparkles", cover: "/products/bea/vitc.webp", blurb: "Skincare that works" },
  { key: "home", name: "Home", icon: "sofa", cover: "/products/hom/saffron.webp", blurb: "Sofas, chairs, calm" },
  { key: "kitchen", name: "Kitchen", icon: "cookingpot", cover: "/products/kit/espresso.webp", blurb: "Cook, brew, keep cold" },
  { key: "sports", name: "Sports", icon: "dumbbell", cover: "/products/spo/hex.webp", blurb: "Train at home" },
];

export interface Item {
  id: string;
  dept: DeptKey;
  name: string;
  brand: string;
  price: number;
  mrp: number;
  rating: number;
  reviews: number;
  /** Photo path, or null when the product is shown as a render of its 3D model. */
  img: string | null;
  model?: ModelId;
  fast?: boolean;
  note: string;
}

type Row = [id: string, name: string, brand: string, price: number, mrp: number, rating: number, reviews: number, img: string | null, note: string, extra?: Partial<Item>];

const rows: Record<DeptKey, Row[]> = {
  mobiles: [
    ["mob-nova", "Nova 12 Pro · 256 GB", "Nova", 399, 499, 4.6, 12408, "mob/nova", "50 MP night camera", { fast: true }],
    ["mob-nova-red", "Nova 12 · Product Red", "Nova", 349, 419, 4.5, 8120, "mob/nova-red", "Red glass back"],
    ["mob-orbit", "Orbit S5 · Ocean Blue", "Orbit", 279, 329, 4.4, 5402, "mob/orbit", "5,000 mAh battery", { fast: true }],
    ["mob-pixelite", "Pixelite 8 · Obsidian", "Pixelite", 349, 399, 4.7, 9811, "mob/pixelite", "Best video under $400"],
    ["mob-zen", "Zen X · Walnut edition", "Zen", 519, 599, 4.5, 2210, "mob/zen", "Wireless charging"],
    ["mob-sunset", "Sunset Edge 6.1″", "Orbit", 229, 289, 4.3, 3108, "mob/sunset", "Compact, one-hand"],
    ["mob-duo", "Duo Pack · two phones", "Pixelite", 459, 598, 4.2, 980, "mob/duo", "Family bundle"],
    ["mob-blush", "Blush Mini 5.4″", "Zen", 299, 349, 4.4, 1760, "mob/blush", "Fits every pocket", { fast: true }],
    ["mob-pure", "Pure 15 · Starlight", "Nova", 699, 799, 4.8, 15022, "mob/pure", "Titanium frame"],
  ],
  laptops: [
    ["lap-folio14", "Folio 14 · 16 GB / 512 GB", "Folio", 899, 1049, 4.7, 4302, "lap/folio14", "1.2 kg · 18 h battery", { fast: true }],
    ["lap-air13", "AirBook 13 · Silver", "Arc", 999, 1099, 4.8, 21877, "lap/airbook13", "Fanless, silent"],
    ["lap-air15", "AirBook 15 · Silver", "Arc", 1199, 1299, 4.7, 9310, "lap/airbook15", "Big screen, still light"],
    ["lap-studio15", "Studio 15 · Midnight", "Arc", 1499, 1699, 4.8, 3120, "lap/studio15", "For video editing"],
    ["lap-edge", "ThinkEdge X1 · Carbon", "Edge", 1149, 1349, 4.6, 2760, "lap/edge", "Best keyboard we sell"],
    ["lap-canvas", "Canvas 13 OLED", "Lumen", 949, 1099, 4.5, 1890, "lap/canvas", "OLED · touch"],
    ["lap-vista", "Vista 15 Touch", "Lumen", 799, 899, 4.4, 2240, "lap/vista", "2-in-1 hinge", { fast: true }],
    ["lap-raptor", "Raptor 17 RTX", "Raptor", 1599, 1899, 4.6, 1544, "lap/raptor", "RGB keys · 240 Hz"],
    ["lap-nightcraft", "Nightcraft 16", "Raptor", 1299, 1499, 4.5, 880, "lap/nightcraft", "Quiet gaming mode"],
    ["lap-slate", "Slate 14 · Space Grey", "Folio", 749, 849, 4.4, 3650, "lap/slate", "Student pick"],
  ],
  audio: [
    ["aud-speaker", "Boom Retro Speaker", "Boom", 149, 189, 4.6, 4021, null, "24 h battery · 3D view", { model: "p2", fast: true }],
    ["aud-hush", "Hush ANC · Black", "Hush", 149, 199, 4.7, 18342, "aud/hush", "Noise-cancelling", { fast: true }],
    ["aud-quiet", "Quiet 1000 · Black", "Hush", 279, 349, 4.8, 22140, "aud/quiet", "Best ANC on flights"],
    ["aud-halo-rose", "Halo Max · Rose", "Halo", 449, 549, 4.6, 6720, "aud/halo-rose", "Spatial audio"],
    ["aud-halo-graphite", "Halo Max · Graphite", "Halo", 449, 549, 4.6, 6720, "aud/halo-graphite", "Spatial audio"],
    ["aud-sand", "Sand Wireless", "Pulse", 179, 199, 4.5, 3301, "aud/sand", "40 h battery"],
    ["aud-cloud", "Cloud Wired · White", "Pulse", 29, 39, 4.3, 12030, "aud/cloud", "Light, foldable"],
    ["aud-monitor", "Monitor Pro Studio", "Studio", 99, 129, 4.7, 5410, "aud/monitor", "Flat sound for mixing"],
    ["aud-aria", "Aria Leather On-Ear", "Studio", 219, 259, 4.4, 980, "aud/aria", "Chrome & leather"],
  ],
  watches: [
    ["wat-atlas", "Atlas Chronograph", "Atlas", 189, 249, 4.7, 7302, "wat/atlas", "Sapphire · 200 m · 3D view", { model: "p3", fast: true }],
    ["wat-racing", "Racing Chrono · Red", "Atlas", 229, 279, 4.6, 2130, "wat/racing", "Tachymeter bezel"],
    ["wat-aurum", "Aurum Link · Gold", "Aurum", 259, 329, 4.5, 1840, "wat/aurum", "Steel, gold PVD"],
    ["wat-regatta", "Regatta Blue Dial", "Aurum", 239, 289, 4.6, 990, "wat/regatta", "Gift-boxed"],
    ["wat-pilot", "Pilot Black Chrono", "Atlas", 199, 239, 4.5, 2210, "wat/pilot", "Luminous hands"],
    ["wat-deep", "Deep Sea 42", "Tide", 149, 189, 4.4, 3120, "wat/deep", "Leather strap", { fast: true }],
    ["wat-noir", "Noir Minimal 38", "Mono", 99, 129, 4.6, 5530, "wat/noir", "All-black"],
    ["wat-blanc", "Blanc Minimal 38", "Mono", 99, 129, 4.6, 4120, "wat/blanc", "Mesh strap"],
    ["wat-petal", "Petal 36 Bracelet", "Tide", 129, 169, 4.3, 870, "wat/petal", "For smaller wrists"],
    ["wat-rose", "Rosé 34 Ceramic", "Aurum", 279, 349, 4.7, 640, "wat/rose", "Ceramic + rose gold"],
  ],
  footwear: [
    ["sho-stride", "Stride Air Runner", "Stride", 112, 140, 4.7, 11203, "sho/stride", "Wide fit · 3D view", { model: "p1", fast: true }],
    ["sho-cloudline", "Cloudline 3 · Coral", "Stride", 104, 130, 4.6, 6120, "sho/cloudline", "Soft, stable midsole", { fast: true }],
    ["sho-tempo", "Tempo Lite", "Stride", 96, 120, 4.5, 3304, "sho/tempo", "Daily trainer"],
    ["sho-night", "Night Trainer", "Forma", 89, 110, 4.4, 1980, "sho/night", "Gym & short runs"],
    ["sho-court-white", "Court High · White", "Court", 119, 140, 4.7, 9020, "sho/court-white", "Leather high-top"],
    ["sho-court-red", "Court High · Red Toe", "Court", 129, 150, 4.8, 12090, "sho/court-red", "Collector colourway"],
    ["sho-retro", "Retro Runner · Red", "Court", 99, 120, 4.5, 2840, "sho/retro", "Suede panels"],
    ["sho-skate", "Classic Skate · Maroon", "Deck", 64, 75, 4.6, 14400, "sho/skate", "Canvas, waffle sole", { fast: true }],
    ["sho-clean", "Clean Court Low", "Forma", 79, 95, 4.4, 2210, "sho/clean", "Goes with everything"],
    ["sho-glide", "Glide Slip-On · Cream", "Forma", 72, 90, 4.3, 760, "sho/glide", "Laceless"],
    ["sho-minimal", "Minimal Low · White", "Deck", 69, 85, 4.5, 3010, "sho/minimal", "Vegan leather"],
  ],
  fashion: [
    ["fas-sunglasses", "Halo Sunglasses", "Halo", 74, 99, 4.5, 3402, null, "Polarised · 3D view", { model: "p5", fast: true }],
    ["fas-suitcase", "Voyager Leather Case", "Voyager", 189, 249, 4.6, 1203, null, "Cabin size · 3D view", { model: "p7" }],
    ["fas-autumn", "Autumn Layers Set", "Field", 128, 170, 4.4, 640, "fas/autumn-set", "Knit, shirt, boots look"],
    ["fas-denim", "Weekend Denim Set", "Field", 139, 180, 4.5, 820, "fas/denim-set", "Shirt, blazer, jeans"],
    ["fas-linen", "Linen Overshirt · White", "Coast", 58, 72, 4.6, 2210, "fas/linen", "Runs small — size up", { fast: true }],
    ["fas-knit", "Mustard Open Knit", "Coast", 49, 65, 4.3, 540, "fas/knit", "Hand-finished"],
    ["fas-jeans", "Straight Jeans · Mid Blue", "Field", 54, 69, 4.5, 6120, "fas/jeans", "Lace-trim hem"],
    ["fas-tee", "Heavy Tee · Black ×2", "Basics", 32, 40, 4.7, 18200, "fas/tee", "240 gsm cotton", { fast: true }],
    ["fas-silk", "Champagne Silk Blouse", "Coast", 89, 120, 4.4, 410, "fas/silk", "Mulberry silk"],
  ],
  beauty: [
    ["bea-vitc", "Vitamin C Glow Serum", "Citra", 26, 32, 4.6, 9840, "bea/vitc", "15% vitamin C", { fast: true }],
    ["bea-citrus", "Citrus Day Cream SPF 30", "Citra", 22, 28, 4.5, 4210, "bea/citrus", "For oily skin"],
    ["bea-night", "Night Repair Drops", "Amber", 38, 45, 4.7, 3320, "bea/night", "Retinal 0.1%"],
    ["bea-amber", "Amber Face Oil", "Amber", 34, 40, 4.5, 1210, "bea/amber-oil", "Squalane + rosehip"],
    ["bea-cleanser", "Cloud Cleanser", "Pure Lab", 14, 18, 4.6, 12030, "bea/cleanser", "Gentle, fragrance-free", { fast: true }],
    ["bea-ritual", "Daily Ritual Set", "Pure Lab", 48, 64, 4.7, 2840, "bea/ritual", "Serum, toner, moisturiser"],
    ["bea-rose", "Rose Clay Kit", "Bloom", 42, 56, 4.4, 980, "bea/rose-kit", "Mask, balm, tint"],
    ["bea-trio", "Morning Trio", "Bloom", 36, 48, 4.5, 1430, "bea/trio", "Mist, SPF, gloss"],
    ["bea-bronze", "Bronze Body Lotion", "Amber", 24, 30, 4.3, 760, "bea/bronze", "Gradual glow"],
  ],
  home: [
    ["hom-saffron", "Saffron Lounge Chair", "Nook", 280, 360, 4.6, 840, "hom/saffron", "Velvet, oak legs"],
    ["hom-bay", "Bay Blue Armchair", "Nook", 240, 300, 4.5, 1120, "hom/bay", "Fits small rooms", { fast: true }],
    ["hom-orb", "Orb Bouclé Chair", "Forme", 420, 520, 4.7, 310, "hom/orb", "Curved bouclé"],
    ["hom-terra", "Terra Curve Sofa", "Forme", 1290, 1590, 4.8, 220, "hom/terra", "Modular, 3 seats"],
    ["hom-cloud", "Cloud Sofa + Ottoman", "Nook", 890, 1100, 4.6, 640, "hom/cloud-sofa", "Washable covers"],
    ["hom-dining", "Linen Dining Chair", "Forme", 140, 180, 4.4, 1530, "hom/dining", "Set of 2"],
    ["hom-living", "Sunroom Lounge Set", "Forme", 1690, 2100, 4.5, 90, "hom/living", "Sofa, table, pouf"],
    ["hom-console", "Charcoal Low Sofa", "Nook", 760, 940, 4.3, 180, "hom/console", "Deep seats"],
  ],
  kitchen: [
    ["kit-espresso", "Espresso & Grinder Set", "Brew", 449, 549, 4.7, 2310, "kit/espresso", "Grinder + brewer", { fast: true }],
    ["kit-casserole", "Cast-iron Casserole 5 L", "Hearth", 129, 170, 4.8, 6120, "kit/casserole", "Enamelled, lifetime"],
    ["kit-fridge", "French-door Fridge 520 L", "Frost", 1299, 1499, 4.5, 870, "kit/fridge", "Quiet 36 dB"],
  ],
  sports: [
    ["spo-bottle", "Trail Steel Bottle", "Trail", 34, 42, 4.7, 8230, null, "Cold for 24 h · 3D view", { model: "p9", fast: true }],
    ["spo-hex", "Hex Dumbbells 2 × 10 kg", "Iron", 79, 99, 4.6, 5120, "spo/hex", "Rubber-coated"],
    ["spo-bands", "Resistance Band Kit", "Iron", 29, 39, 4.5, 9340, "spo/bands", "5 levels + handles", { fast: true }],
    ["spo-rack", "Dumbbell Rack Set", "Iron", 399, 499, 4.7, 610, "spo/rack", "2–20 kg, 10 pairs"],
    ["spo-studio", "Home Studio Kit", "Flow", 149, 199, 4.4, 430, "spo/studio", "Balls, rings, grips"],
    ["spo-gym", "Power Rack Pro", "Iron", 699, 849, 4.8, 290, "spo/gym", "Pull-up bar included"],
  ],
};

export const ITEMS: Item[] = (Object.keys(rows) as DeptKey[]).flatMap((dept) =>
  rows[dept].map(([id, name, brand, price, mrp, rating, reviews, img, note, extra]) => ({
    id,
    dept,
    name,
    brand,
    price,
    mrp,
    rating,
    reviews,
    img: img ? `/products/${img}.webp` : null,
    note,
    ...extra,
  })),
);

export const item = (id: string) => ITEMS.find((i) => i.id === id);
export const money = (n: number) => "$" + n.toLocaleString("en-US");
export const off = (i: Item) => Math.round((1 - i.price / i.mrp) * 100);

// Today's deals: the biggest discounts, one per department.
export const DEALS = DEPTS.map((d) => ITEMS.filter((i) => i.dept === d.key).sort((a, b) => off(b) - off(a))[0]!).filter(Boolean);

export const PHOTO_CREDIT = "Product and lifestyle photos: Unsplash (unsplash.com), free under the Unsplash License.";
