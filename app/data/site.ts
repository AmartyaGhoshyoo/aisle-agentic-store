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
  { id: "p2", name: "Hush ANC Headphones", price: "$149", note: "38 h battery", icon: "headphones", tone: TONES.ink },
  { id: "p3", name: "Pulse Fit Watch", price: "$89", note: "Sleep + GPS", icon: "watch", tone: TONES.mint },
  { id: "p4", name: "Linen Overshirt", price: "$58", note: "Runs small", icon: "shirt", tone: TONES.peach },
  { id: "p5", name: "Halo Sunglasses", price: "$74", note: "Polarised", icon: "glasses", tone: TONES.sky },
  { id: "p6", name: "Folio 14 Laptop", price: "$899", note: "1.2 kg · 18 h", icon: "laptop", tone: TONES.lilac },
  { id: "p7", name: "Weekender Tote", price: "$66", note: "Recycled canvas", icon: "bag", tone: TONES.mint },
  { id: "p8", name: "Gift Box Trio", price: "$45", note: "Wrapped free", icon: "package", tone: TONES.berry },
];

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
