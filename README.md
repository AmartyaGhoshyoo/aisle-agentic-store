# Aisle — the store that shops with you

A marketing + demo site for an agentic shopping product by Zovak. Say what you need; the agent
finds three picks, compares them, gets your size right and fills the cart. You press pay.

- **3D agent orb** (three.js shader) with the catalogue orbiting it; scrolling pulls out three picks
- **Pinned scroll story:** intent → picks → compare → size → pay → order care, in a phone mock
- **Store copilot section** for merchants: listings, cart recovery, stock forecast, review insights
- **Chat + voice assistant** (Zovak web widget) in demo mode with a sample catalogue

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
