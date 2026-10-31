# Aisle — the store that shops with you

A marketing + demo site for an agentic shopping product by Zovak. Say what you need; the agent
finds three picks, compares them, gets your size right and fills the cart. You press pay.

- **A real shop:** sticky header with search (filters the shelf as you type, or hand the sentence to the
  agent), a cart with a live count, and a department bar (Mobiles, Laptops, Audio, Watches, Footwear,
  Fashion, Beauty, Home, Kitchen, Sports)
- **3D showroom hero:** the six products that have real 3D models stand on lit plinths in a ring that turns,
  casts soft shadows and reacts to the cursor and scroll; click one to open it
- **Promo banners** (real photos with scroll parallax), **department tiles** that tilt in 3D, **deals of the
  day** with a countdown
- **The shelf:** 84 products with real photos (free Unsplash), filters (department, max price, rating,
  arrives tomorrow, has a 3D view), sorting, and cards that tilt under the cursor
- **Product sheet:** drag-to-turn 3D viewer for model products (photo otherwise), quantity, add to cart,
  "Ask Aisle about this", more from the department
- **Cart drawer:** quantities, free-delivery progress, an agent-found coupon, and checkout the agent prepares
  but you confirm (demo — nothing is charged). The cart is remembered in this browser
- **Ask:** a conversation builds as you scroll and each pick drops into a 3D bag; "You press pay" puts them
  in the real cart
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
