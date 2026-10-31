# Aisle — the store that shops with you

A marketing + demo site for an agentic shopping product by Zovak. Say what you need; the agent
finds three picks, compares them, gets your size right and fills the cart. You press pay.

- **A real shop:** sticky header with search (filters the shelf as you type, or hand the sentence to the
  agent), a cart with a live count, and a department bar (Mobiles, Laptops, Audio, Watches, Footwear,
  Fashion, Beauty, Home, Kitchen, Sports)
- **Agent workstation (the centre of the page):** pick a request and watch the agent work in five steps —
  Ask → Search (your sentence becomes filters; thousands of products checked) → Compare (best three with
  reasons, side by side; tap to choose) → Cart (coupon applied) → **You confirm**. Nothing is paid until you tap.
- **The shelf:** department tabs with one compact row each (no endless list); "View all" opens a drawer
  with the full department and sorting. Search in the header filters it.
- **Product sheet** with HD photo, quantity and "Ask Aisle about this"; **cart drawer** with agent-prepared checkout
- **For brands:** the store owner's copilot with an approvals queue
- **Chat + voice assistant** (Zovak web widget) in demo mode
- Blush + berry + emerald; Bodoni Moda + Jost

## Changing products

All products live in `app/data/shop.ts` (one row each: id, name, brand, price, MRP, rating, reviews,
photo, note). Photos are 800×800 WebP in `public/products/<dept>/`. To add one: put a square photo there
and add a row. Credits: photos are from Unsplash (Unsplash License); 3D models are listed in
`app/components/three/products.ts` and in the footer.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
```

## Connecting the backend later

The widget calls `POST /api/agent/chat` (see `app/api/agent/chat/route.ts`, currently 501).
Set `NEXT_PUBLIC_AGENT_LIVE=true` and proxy that route to the Aisle backend. The reply shape
(`text`, `cards`, `quick`) is in `app/components/assistant/types.ts`.

## Plan

`docs/Aisle_Agentic_Plan.pdf` — what can be automated (shopper + store owner), agents and tools,
guardrails, data model, API, integrations, reuse of ZOVAK, roadmap and open decisions.
Rebuild with `python3 docs/build_plan.py`.
