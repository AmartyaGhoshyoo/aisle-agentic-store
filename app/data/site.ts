// Aisle: an agentic shopping store. All copy and demo data in one place.

export const SITE = {
  name: "Aisle",
  tagline: "The store that shops with you",
  by: { name: "Zovak", url: "https://www.zovak.tech" },
  email: "hello@zovak.tech",
};

// Gradient tiles stand in for product photos (icons from the shared ICONS map).
export const TONES = {
  berry: "linear-gradient(135deg,#f9a8d4,#be185d)",
  mint: "linear-gradient(135deg,#a7f3d0,#059669)",
  lilac: "linear-gradient(135deg,#ddd6fe,#7c3aed)",
  peach: "linear-gradient(135deg,#fecdd3,#e11d48)",
  sky: "linear-gradient(135deg,#bae6fd,#0369a1)",
  ink: "linear-gradient(135deg,#94a3b8,#1e293b)",
};

export const PRODUCTS = [
  { id: "p1", name: "Stride Air Runner", price: "$112", note: "Wide fit · 4.7★", icon: "shoe", tone: TONES.berry },
  { id: "p2", name: "Boom Retro Speaker", price: "$149", note: "24 h battery", icon: "headphones", tone: TONES.ink },
  { id: "p3", name: "Atlas Chronograph", price: "$189", note: "Sapphire · 200 m", icon: "watch", tone: TONES.mint },
  { id: "p4", name: "Linen Overshirt", price: "$58", note: "Runs small", icon: "shirt", tone: TONES.peach },
  { id: "p5", name: "Halo Sunglasses", price: "$74", note: "Polarised", icon: "glasses", tone: TONES.lilac },
  { id: "p6", name: "Folio 14 Laptop", price: "$899", note: "1.2 kg · 18 h", icon: "laptop", tone: TONES.sky },
  { id: "p7", name: "Voyager Leather Case", price: "$189", note: "Cabin size", icon: "bag", tone: TONES.mint },
  { id: "p8", name: "Gift Box Trio", price: "$45", note: "Wrapped free", icon: "package", tone: TONES.berry },
  { id: "p9", name: "Trail Steel Bottle", price: "$34", note: "Cold for 24 h", icon: "package", tone: TONES.peach },
];

export const byId = (id: string) => PRODUCTS.find((p) => p.id === id)!;


// The stylist's looks: three products each.
export const LOOKS = [
  { name: "Run club", ids: ["p1", "p3", "p9"], line: "Light, fast, everything timed." },
  { name: "Weekend away", ids: ["p7", "p5", "p2"], line: "One case, sunglasses, music for the evening." },
  { name: "Commute", ids: ["p7", "p3", "p9"], line: "Laptop in leather, on time, coffee-cold water." },
  { name: "Gift for him", ids: ["p3", "p5", "p2"], line: "Wrapped free, arrives Thursday." },
] as const;


// One shopping trip, from a sentence to a delivered (or returned) order.
export const CHAPTERS = [
  {
    agent: "Intent agent",
    title: "Say it like *you'd say it to a friend.*",
    body: "“Running shoes for flat feet, under $120, arriving before Saturday.” The agent turns that into filters — use, fit, budget, deadline — and asks only what it can't infer.",
    stat: "1 sentence",
    statLabel: "instead of 9 filters",
  },
  {
    agent: "Curator agent",
    title: "Three picks, *not three hundred.*",
    body: "It searches the catalogue, reviews and stock, then shows a short list with the reason each one fits you. Your past orders and sizes are remembered — with your permission.",
    stat: "3 picks",
    statLabel: "each with a reason",
  },
  {
    agent: "Compare agent",
    title: "Side by side, *in plain words.*",
    body: "Price, delivery date, comfort, battery, return window — compared on what you said matters. Review summaries quote real customers, never invented praise.",
    stat: "12 s",
    statLabel: "to a clear answer",
  },
  {
    agent: "Fit agent",
    title: "The right size, *first time.*",
    body: "Brand-by-brand size maps, your past returns and the “runs small” signal from reviews give one size recommendation and how confident it is.",
    stat: "−30%",
    statLabel: "size returns (target)",
  },
  {
    agent: "Checkout agent",
    title: "It fills the cart. *You press pay.*",
    body: "Coupons applied, delivery slot chosen, address checked. The agent prepares everything — but money only moves when you confirm.",
    stat: "1 tap",
    statLabel: "to approve the order",
  },
  {
    agent: "Care agent",
    title: "Tracking and returns *without the queue.*",
    body: "“Where's my order?”, “Swap for a size up”, “Refund this” — handled in chat, voice or WhatsApp, with a label and refund status in seconds.",
    stat: "24/7",
    statLabel: "order help",
  },
];

export const AGENTS = [
  { name: "Personal shopper", does: "Understands what you want and remembers your taste", icon: "sparkles" },
  { name: "Curator", does: "Searches catalogue, stock and reviews; shows 3 picks", icon: "search" },
  { name: "Compare", does: "Side-by-side on the things you said matter", icon: "scale" },
  { name: "Size & fit", does: "One size recommendation with a confidence score", icon: "ruler" },
  { name: "Deal watcher", does: "Tracks price drops and back-in-stock for you", icon: "bell" },
  { name: "Stylist & bundles", does: "Completes the look, suggests gifts within budget", icon: "gift" },
  { name: "Checkout", does: "Fills the cart and coupons — you confirm payment", icon: "card" },
  { name: "Order care", does: "Tracking, swaps, returns and refunds in chat or voice", icon: "truck" },
  { name: "Store copilot", does: "For the shop owner: catalogue, pricing, stock, carts", icon: "store" },
];

// The merchant side: what the store owner's agents automate.
export const MERCHANT = [
  { title: "Catalogue enrichment", detail: "Writes product titles, descriptions, tags and size charts from a photo and a spec sheet.", metric: "4 min → 20 s per product" },
  { title: "Abandoned-cart recovery", detail: "Messages shoppers who left, answers their actual question, and offers help — not spam.", metric: "+11% recovered (target)" },
  { title: "Stock & reorder forecast", detail: "Predicts sell-outs by size and colour and drafts purchase orders for approval.", metric: "Stock-outs flagged 9 days early" },
  { title: "Review insights", detail: "Turns thousands of reviews into fixes: “runs small”, “strap breaks”, “love the colour”.", metric: "Weekly digest" },
  { title: "Dynamic offers", detail: "Suggests bundles and discounts within margin rules you set — nothing goes live without you.", metric: "Margin floor enforced" },
  { title: "Support deflection", detail: "Order status, returns and sizing answered by the agent; hard cases go to your team with context.", metric: "~70% handled (target)" },
];

export const GUARDRAILS = [
  { rule: "You press pay", detail: "The agent prepares carts and returns; payments, refunds and address changes need your tap." },
  { rule: "Prices come from the store", detail: "Prices, stock and delivery dates are read from the catalogue, never made up by the model." },
  { rule: "Honest reviews", detail: "Summaries quote real reviews and show the bad with the good." },
  { rule: "Your data, your call", detail: "Sizes and taste are remembered only if you allow it, and can be wiped in one tap." },
];

export const CHANNELS = ["Website chat", "Voice", "WhatsApp", "Instagram DM", "Email", "Phone"];

// ── Marketplace catalogue (demo): categories shown on the 3D catalogue drum and the category grid.
export const CATEGORIES = [
  { key: "mobiles", name: "Mobiles", icon: "smartphone", count: "24,310", tone: "linear-gradient(135deg,#c7d2fe,#4338ca)", ask: "Best camera phone under $400", items: [["Nova 12 Pro", "$399"], ["Pixelite 8", "$349"], ["Orbit S5", "$279"], ["Zen X", "$519"]] },
  { key: "laptops", name: "Laptops", icon: "laptop", count: "8,902", tone: "linear-gradient(135deg,#bae6fd,#0369a1)", ask: "A light laptop for college", items: [["Folio 14", "$899"], ["AirBook 13", "$999"], ["Volt 15", "$749"], ["Studio 16", "$1,499"]] },
  { key: "shoes", name: "Footwear", icon: "footprints", count: "61,544", tone: "linear-gradient(135deg,#f9a8d4,#be185d)", ask: "Running shoes for flat feet", items: [["Stride Air", "$112"], ["Cloudline 3", "$104"], ["Tempo Lite", "$96"], ["Trail Grip", "$128"]] },
  { key: "fashion", name: "Fashion", icon: "shirt", count: "312,880", tone: "linear-gradient(135deg,#fecdd3,#e11d48)", ask: "Linen shirt for a beach wedding", items: [["Linen Overshirt", "$58"], ["Oxford Tee", "$24"], ["Wrap Dress", "$72"], ["Chino Slim", "$49"]] },
  { key: "watches", name: "Watches", icon: "watch", count: "9,410", tone: "linear-gradient(135deg,#a7f3d0,#047857)", ask: "Smartwatch that tracks sleep", items: [["Atlas Chrono", "$189"], ["Pulse Fit", "$89"], ["Tide 40", "$149"], ["Halo Mini", "$69"]] },
  { key: "audio", name: "Audio", icon: "headphones", count: "15,207", tone: "linear-gradient(135deg,#ddd6fe,#6d28d9)", ask: "Noise-cancelling headphones for flights", items: [["Hush ANC", "$149"], ["Boom Retro", "$149"], ["Echo Buds", "$79"], ["Bass Bar", "$199"]] },
  { key: "tv", name: "TVs", icon: "tv", count: "3,118", tone: "linear-gradient(135deg,#cbd5e1,#334155)", ask: "55-inch TV for a bright room", items: [["Vista 55 QLED", "$549"], ["Lumen 43", "$329"], ["Cine 65", "$899"], ["Frame 50", "$699"]] },
  { key: "home", name: "Furniture", icon: "sofa", count: "41,762", tone: "linear-gradient(135deg,#fde68a,#b45309)", ask: "A small sofa for a studio flat", items: [["Nook 2-Seater", "$420"], ["Loft Chair", "$180"], ["Fold Daybed", "$360"], ["Oak Side Table", "$90"]] },
  { key: "kitchen", name: "Kitchen", icon: "cookingpot", count: "27,035", tone: "linear-gradient(135deg,#fed7aa,#c2410c)", ask: "Air fryer for a family of four", items: [["Crisp 6L", "$89"], ["Duo Pot", "$69"], ["Brew One", "$49"], ["Chef Knife", "$39"]] },
  { key: "appliances", name: "Appliances", icon: "refrigerator", count: "6,543", tone: "linear-gradient(135deg,#e0f2fe,#0e7490)", ask: "Quiet fridge under $600", items: [["Frost 320L", "$579"], ["Wash 8kg", "$449"], ["Cool Split AC", "$499"], ["Mist Purifier", "$159"]] },
  { key: "beauty", name: "Beauty", icon: "sparkles", count: "58,221", tone: "linear-gradient(135deg,#fbcfe8,#db2777)", ask: "Sunscreen for oily skin", items: [["Glow SPF 50", "$18"], ["Nuit Parfum", "$82"], ["Dew Serum", "$26"], ["Matte Tint", "$14"]] },
  { key: "grocery", name: "Grocery", icon: "apple", count: "19,860", tone: "linear-gradient(135deg,#bbf7d0,#15803d)", ask: "Weekly groceries for two, vegetarian", items: [["Organic Basket", "$42"], ["Basmati 5kg", "$16"], ["Cold Brew 6", "$12"], ["Nut Mix 1kg", "$19"]] },
  { key: "toys", name: "Toys", icon: "toybrick", count: "22,904", tone: "linear-gradient(135deg,#fef08a,#ca8a04)", ask: "Gift for a 6-year-old who loves building", items: [["Brick City 900", "$59"], ["Robo Kit", "$45"], ["Marble Run", "$34"], ["Space Lander", "$39"]] },
  { key: "sports", name: "Sports", icon: "dumbbell", count: "17,388", tone: "linear-gradient(135deg,#99f6e4,#0f766e)", ask: "Home gym setup under $300", items: [["Adjust Bells", "$199"], ["Yoga Mat Pro", "$39"], ["Trail Bottle", "$34"], ["Bike Trainer", "$249"]] },
  { key: "books", name: "Books", icon: "bookopen", count: "1.2M", tone: "linear-gradient(135deg,#e9d5ff,#7e22ce)", ask: "A thriller like Gone Girl", items: [["The Quiet Lake", "$14"], ["Atomic Days", "$18"], ["Map of Salt", "$16"], ["Night Train", "$12"]] },
  { key: "cameras", name: "Cameras", icon: "camera", count: "4,207", tone: "linear-gradient(135deg,#fecaca,#991b1b)", ask: "Beginner camera for travel vlogs", items: [["Snap M50", "$649"], ["Action 4K", "$249"], ["Instax Go", "$89"], ["Prime 35mm", "$399"]] },
] as const;

// The demo searches the hero runs (and you can pick): what was asked, where it looked, three picks.
export const SEARCHES = [
  {
    q: "Phone with the best camera under $400",
    cat: "mobiles",
    scanned: "2,431 phones",
    picks: [
      { name: "Nova 12 Pro", price: "$399", why: "Top low-light score in its price; 4.6★ from 12k reviews" },
      { name: "Pixelite 8", price: "$349", why: "Best video stabilisation under $400" },
      { name: "Orbit S5", price: "$279", why: "Great main camera, saves you $120" },
    ],
  },
  {
    q: "Running shoes for flat feet, before Saturday",
    cat: "shoes",
    scanned: "6,180 running shoes",
    picks: [
      { name: "Stride Air", price: "$112", why: "Firm arch, wide fit — UK 9 from your history" },
      { name: "Cloudline 3", price: "$104", why: "Stable midsole, arrives Thursday" },
      { name: "Trail Grip", price: "$128", why: "If you run on rough paths too" },
    ],
  },
  {
    q: "A small sofa for a studio flat",
    cat: "home",
    scanned: "3,902 sofas",
    picks: [
      { name: "Nook 2-Seater", price: "$420", why: "142 cm wide — fits under a 150 cm window" },
      { name: "Fold Daybed", price: "$360", why: "Sofa by day, guest bed by night" },
      { name: "Loft Chair", price: "$180", why: "If you only need one seat" },
    ],
  },
  {
    q: "Gift for a 6-year-old who loves building",
    cat: "toys",
    scanned: "4,766 toys",
    picks: [
      { name: "Brick City 900", price: "$59", why: "Age 6+, most re-bought building set" },
      { name: "Marble Run", price: "$34", why: "Builds and moves — parents rate it 4.8★" },
      { name: "Robo Kit", price: "$45", why: "First coding, no screen needed" },
    ],
  },
] as const;
