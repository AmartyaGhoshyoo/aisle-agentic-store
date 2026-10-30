// Demo brain for the Aisle assistant: keyword rules with realistic answers and cards.
// Replaced by the real agent backend later (same Reply shape).
import type { Brain } from "../components/assistant/types";
import { PRODUCTS, TONES } from "./site";

const pick = (...ids: string[]) => PRODUCTS.filter((p) => ids.includes(p.id));

export const BRAIN: Brain = {
  name: "Aisle",
  voiceHint: "Try: “Running shoes under $120”, “Compare the two speakers” or “Where is my order?”.",
  greeting: {
    text: "Hi, I'm Aisle — your shopping agent. Tell me what you need in your own words and I'll find, compare, size and cart it. You always press pay.",
    quick: ["Running shoes under $120", "A gift for my sister, $50", "Where is my order?"],
  },
  reply: (raw) => {
    const t = raw.toLowerCase();
    if (/(checkout|pay|place (the )?order|buy it|buy now)/.test(t))
      return {
        text: "Everything's ready. I applied your RUN10 coupon and picked Thursday delivery. Nothing is charged until you confirm.",
        cards: [
          { kind: "cart", lines: [{ name: "Stride Air Runner · UK 9 · wide", qty: 1, price: "$112.00" }, { name: "Coupon RUN10", qty: 1, price: "−$11.20" }, { name: "Delivery Thu", qty: 1, price: "$0.00" }], total: "$100.80" },
          { kind: "proposal", title: "Pay $100.80 with Visa •• 4242", detail: "Ships to Banani, Dhaka · arrives Thursday · free returns for 30 days.", confirm: "Confirm & pay", done: "Order AS-5521 placed. I'll message you when it ships." },
        ],
      };
    if (/(add|cart|take (it|the))/.test(t))
      return {
        text: "Added. Want me to check out now, or keep browsing? Socks that match are 20% off with it.",
        cards: [{ kind: "cart", lines: [{ name: "Stride Air Runner · UK 9 · wide", qty: 1, price: "$112.00" }], total: "$112.00" }],
        quick: ["Check out", "Add the socks too", "What size should I get?"],
      };
    if (/(size|fit|small|large|uk|us \d)/.test(t))
      return {
        text: "Go UK 9 in the wide fit. You wear UK 9 in your last two running shoes, and 31% of reviewers say this model runs slightly narrow — so wide, not a size up. Confidence: high (86%).",
        quick: ["Add to cart", "Compare with another shoe"],
      };
    if (/(compare|vs|versus|difference|which one)/.test(t))
      return {
        text: "Here's how the two speakers compare on what you mentioned — sound and battery. I'd pick the Boom Retro for the bigger sound.",
        cards: [
          {
            kind: "compare",
            a: "Boom Retro",
            b: "Echo Mini",
            rows: [
              { label: "Price", a: "$149", b: "$99" },
              { label: "Battery", a: "24 h", b: "12 h" },
              { label: "Sound", a: "Room-filling", b: "Desk-size" },
              { label: "Arrives", a: "Thu", b: "Fri" },
              { label: "Reviewers say", a: "“Light, great on flights”", b: "“Tight after 2 h”" },
            ],
          },
        ],
        quick: ["Add Boom to cart", "Watch Boom for a price drop"],
      };
    if (/(shoe|run|sneaker|trainer|flat feet)/.test(t))
      return {
        text: "Three running shoes under $120 that suit flat feet and arrive before Saturday. The Stride Air is the best match — wide fit and firm arch support.",
        cards: [
          {
            kind: "products",
            items: [
              PRODUCTS[0]!,
              { id: "s2", name: "Cloudline 3", price: "$104", note: "Stable · 4.5★", icon: "shoe", tone: TONES.sky },
              { id: "s3", name: "Tempo Lite", price: "$96", note: "Light · 4.4★", icon: "shoe", tone: TONES.mint },
            ],
          },
        ],
        quick: ["What size should I get?", "Add the Stride Air", "Compare Stride and Cloudline"],
      };
    if (/(speaker|headphone|audio|music|sound)/.test(t))
      return {
        text: "For music on the go I'd look at these two. Want them side by side?",
        cards: [{ kind: "products", items: [PRODUCTS[1]!, { id: "h2", name: "Echo Mini", price: "$99", note: "12 h battery", icon: "headphones", tone: TONES.lilac }] }],
        quick: ["Compare them", "Add Boom to cart"],
      };
    if (/(gift|present|birthday|sister|mom|friend)/.test(t))
      return {
        text: "Gift ideas around $50, all gift-wrapped free and arriving this week:",
        cards: [{ kind: "products", items: pick("p8", "p4", "p7") }],
        quick: ["Add the Gift Box Trio", "Something more techy"],
      };
    if (/(track|where|order|deliver|ship)/.test(t))
      return {
        text: "Order AS-5498 is out for delivery today between 2 and 4 pm. Your courier is Rafi.",
        cards: [{ kind: "products", items: pick("p3") }],
        quick: ["Return something", "Change delivery time"],
      };
    if (/(return|refund|exchange|swap)/.test(t))
      return {
        text: "No problem. The Linen Overshirt from order AS-5470 is within the 30-day window. I've prepared a swap to size L — or a refund if you prefer.",
        cards: [{ kind: "proposal", title: "Swap Linen Overshirt M → L", detail: "Free pickup tomorrow 10–12 · new one ships when the courier scans the return.", confirm: "Confirm swap", done: "Swap booked. Pickup label sent to your email and WhatsApp." }],
        quick: ["Refund instead", "Where is my order?"],
      };
    if (/(deal|discount|sale|cheaper|price drop|watch)/.test(t))
      return {
        text: "I'll watch it. The Boom Retro has dropped to $129 twice in the last 3 months — I'll message you the moment it does again.",
        cards: [{ kind: "proposal", title: "Price alert: Boom Retro ≤ $129", detail: "WhatsApp + email. Auto-expires in 60 days.", confirm: "Turn on alert", done: "Alert on. I'll tell you when it drops." }],
      };
    if (/(hello|hi|hey|good)/.test(t)) return BRAIN.greeting;
    return {
      text: "In this demo I can find products, compare them, recommend a size, fill your cart, track orders and handle returns. What are you shopping for?",
      quick: ["Running shoes under $120", "Compare speakers", "Return something"],
    };
  },
};
