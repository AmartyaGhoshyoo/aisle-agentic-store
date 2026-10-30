# Aisle — the store that shops with you

A marketing + demo site for an agentic shopping product by Zovak. Say what you need; the agent
finds three picks, compares them, gets your size right and fills the cart. You press pay.

- **Realistic 3D product models** (free glTF: Khronos samples CC BY / CC0, Poly Haven CC0 — credits in
  the footer), shrunk for the web; the same models are rendered into the product "photos"
- **Hero turntable:** the products on a glossy pedestal — drag to spin; the one facing you is described
- **Walk the aisles:** a sideways-scrolling gallery, one aisle per pick, with tilt-in-hand cards
- **Ask:** a conversation builds as you scroll and each pick drops into a 3D shopping bag
- **Stylist:** pick a moment (Run club, Weekend away…) and the look assembles itself
- **For brands:** the store owner's copilot with an approvals queue
- **Chat + voice assistant** (Zovak web widget) in demo mode
- Blush + berry + emerald; Bodoni Moda + Jost

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
