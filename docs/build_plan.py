"""Builds docs/Aisle_Agentic_Plan.html (print to PDF with headless Chrome).

Run:  python3 docs/build_plan.py
"""
import pathlib
from plandoc import bullets, callout, para, pre, render, table

META = {
    "kicker": "Zovak · Product plan",
    "title": "Aisle — the store that shops with you",
    "subtitle": "What can be automated in online shopping (for shoppers and for store owners), how the agents work, what always needs a human tap, and how we build the backend on what we learned from Nofa / ZOVAK.",
    "by": "Prepared for Amartya Ghosh · Zovak",
    "date": "30 Oct 2026",
    "status": "Frontend demo built · backend not started",
}
THEME = {
    "cover_bg": "linear-gradient(150deg,#2a0f1f 0%,#5b1238 60%,#be185d 100%)",
    "cover_ink": "#ffffff",
    "accent_on_cover": "#f9a8d4",
    "accent": "#be185d",
    "accent_dark": "#831843",
    "th_bg": "#2a0f1f",
    "th_ink": "#f9a8d4",
    "callout_bg": "#fdf2f8",
}

S = []

S.append(("Summary", para(
    "Aisle is an online store with an AI agent at the counter. Shoppers say what they need in their own words; the agent finds three good picks, compares them, recommends a size, fills the cart and handles tracking, swaps and returns. Store owners get a copilot that writes product pages, recovers abandoned carts, forecasts stock and turns reviews into fixes.",
    "The rule from Nofa carries over: **the agent prepares, the person confirms.** Payments, refunds, address changes, price changes and purchase orders always need a human tap.",
    "Aisle can be sold two ways: (a) as our own demo store, and (b) as an agent layer that plugs into an existing Shopify / WooCommerce store. Section 13 asks you to choose.",
) + callout("Status: the website (aisle-shopping) is built with a working chat + voice widget in demo mode (sample catalogue). The widget calls POST /api/agent/chat, which returns 501 until the backend exists.")))

S.append(("Who uses it", table(
    ["Person", "Pain today", "What Aisle does"],
    [
        ["Shopper who knows the need, not the product", "Nine filters, 300 results, no idea which fits", "One sentence → three picks with reasons"],
        ["Shopper unsure about size", "Orders two sizes, returns one", "Size recommendation with confidence"],
        ["Gift buyer", "Doesn't know the recipient's taste", "Budget-bound gift ideas, wrapping, delivery date"],
        ["Existing customer", "Waits for support on tracking/returns", "Instant tracking, swaps, refunds in chat, voice, WhatsApp"],
        ["Store owner", "Writing listings, chasing carts, guessing stock", "Store copilot: listings, recovery, forecasts, insights"],
        ["Support team", "Repetitive \"where is my order\" tickets", "Agent handles routine; hard cases arrive with context"],
    ],
)))

S.append(("What can be automated", para(
    "Autonomy levels: **Auto** = agent acts alone (read-only or low-risk); **Propose** = agent prepares, a person taps approve; **Human** = agent only assists.",
) + "<h3>For the shopper</h3>" + table(
    ["Task", "What the agent does", "Agent", "Autonomy"],
    [
        ["Understand the need", "Turns a sentence (or voice note, or photo) into structured intent: use, budget, size, deadline, style", "Personal shopper", "Auto"],
        ["Search & curate", "Searches catalogue + stock + delivery dates; returns 3 picks with a reason each", "Curator", "Auto"],
        ["Visual search", "\"Find something like this\" from a photo or Instagram link", "Curator", "Auto"],
        ["Compare", "Side-by-side on what the shopper said matters, with real review quotes", "Compare", "Auto"],
        ["Size & fit", "Uses brand size maps, past orders/returns and review signals; gives size + confidence", "Size & fit", "Auto"],
        ["Bundles & styling", "Completes the look; suggests gifts within budget", "Stylist", "Auto"],
        ["Price-drop / restock alerts", "Watches items and messages the shopper", "Deal watcher", "Propose (opt-in)"],
        ["Cart building", "Adds items, applies best valid coupon, picks delivery slot", "Checkout", "Auto"],
        ["Payment", "Prepares the payment summary; payment happens on the store's checkout", "Checkout", "Human (tap to pay)"],
        ["Order tracking", "Live status from the courier, delivery window, courier contact", "Order care", "Auto"],
        ["Swaps & returns", "Checks policy window, books pickup, issues label", "Order care", "Propose"],
        ["Refunds", "Prepares refund per policy", "Order care", "Propose (shopper) + rules / staff above a limit"],
        ["Reorder", "\"Order my usual\" for consumables", "Personal shopper", "Propose"],
    ],
) + "<h3>For the store owner</h3>" + table(
    ["Task", "What the agent does", "Agent", "Autonomy"],
    [
        ["Catalogue enrichment", "Writes titles, descriptions, tags, size charts, alt text from photos + spec sheets", "Store copilot", "Propose"],
        ["Translation", "Bangla / Hindi / English listings", "Store copilot", "Propose"],
        ["Abandoned-cart recovery", "Messages the shopper, answers the real question (size? delivery?), offers help", "Store copilot", "Auto (within opt-in + frequency caps)"],
        ["Stock forecasting", "Predicts sell-outs by size/colour; drafts purchase orders", "Store copilot", "Propose"],
        ["Review insights", "Clusters reviews into themes (\"runs narrow\") with counts and trends", "Store copilot", "Auto"],
        ["Pricing & offers", "Suggests bundles/discounts inside margin rules", "Store copilot", "Propose"],
        ["Support deflection", "Answers order status, policy, sizing; escalates with summary", "Order care", "Auto"],
        ["Fraud / abuse flags", "Flags risky orders and return abuse for review", "Store copilot", "Human"],
        ["Weekly report", "Sales, conversion, top questions, lost-sale reasons", "Store copilot", "Auto"],
    ],
)))

S.append(("The agents", para(
    "The shopper talks to one assistant (the orchestrator). It hands work to specialists that each own a few tools. All of them share one Shopper profile and one Cart — so the size agent knows what the curator picked, and order care knows what was bought.",
) + table(
    ["Agent", "Owns", "Main tools (functions)"],
    [
        ["Orchestrator", "Conversation, identity, routing, hand-offs", "identify_shopper, route_to_agent, escalate_to_human"],
        ["Personal shopper", "Intent and taste memory", "parse_intent, get_profile, remember_preference (consented)"],
        ["Curator", "Search and picks", "search_catalog(filters, query), get_stock, get_delivery_estimate, rank_picks"],
        ["Compare", "Side-by-side", "get_product, summarise_reviews(product, aspects)"],
        ["Size & fit", "Size recommendation", "get_size_chart, get_order_history, review_fit_signal, recommend_size"],
        ["Stylist", "Bundles and gifts", "complete_the_look, gift_ideas(budget, recipient)"],
        ["Deal watcher", "Alerts", "create_price_alert (gated), check_price_history"],
        ["Checkout", "Cart and payment hand-off", "add_to_cart, apply_best_coupon, choose_delivery_slot, create_checkout_link (payment by shopper)"],
        ["Order care", "After-sale", "get_order, track_shipment, check_return_policy, propose_swap/return/refund (gated)"],
        ["Store copilot", "Merchant automation", "draft_listing, forecast_stock, propose_purchase_order, review_insights, recover_cart"],
    ],
) + "<h3>How a purchase flows (example)</h3>" + pre(
"""shopper: "running shoes for flat feet, under $120, before Saturday"
  -> Personal shopper: intent = {use: running, support: stability, budget<=120, deadline: Sat, size: UK9 (history)}
  -> Curator: search_catalog + get_stock + get_delivery_estimate -> rank_picks -> 3 product cards
  -> shopper: "what size?" -> Size & fit: UK 9 wide, confidence 86% (reason shown)
  -> shopper: "add it" -> Checkout: add_to_cart, apply_best_coupon(RUN10) -> cart card
  -> Checkout: create_checkout_link -> "Confirm & pay $100.80" (proposal, expires 30 min)
  -> shopper pays on the store's checkout (Stripe / SSLCommerz / bKash) - the agent never holds card data
  -> payment webhook -> order confirmed -> Order care sends confirmation on WhatsApp
  -> Audit log: intent, picks shown, reasons, coupon, price checks, payment reference""")))

S.append(("Guardrails — what stays with people", bullets([
    "**The shopper presses pay.** The agent never stores card details and never completes a payment; it creates a checkout link or summary the shopper confirms.",
    "**Prices, stock, delivery dates and coupons come from the store system.** Product cards are built from database values; the model's text is checked against them (Nofa's plain-code check pattern).",
    "**Honest reviews:** summaries quote real reviews and include the negatives; no invented praise; sponsored placements labelled.",
    "**No dark patterns:** no fake scarcity or countdowns; recommendations explain why.",
    "**Consent for memory:** sizes and taste are stored only with opt-in; one-tap wipe; data export.",
    "**Merchant changes are proposals:** listings, prices, offers and purchase orders go live only after the owner approves; margin floors enforced in code.",
    "**Refund limits:** auto-refund only within policy and under a set amount; above it, staff approve.",
    "**Messaging rules:** cart-recovery and alerts respect opt-in, quiet hours and frequency caps (WhatsApp template rules).",
    "**Full audit trail** of what the agent showed, why, and every action taken.",
])))

S.append(("Channels", table(
    ["Channel", "Use", "How (reusing ZOVAK)"],
    [
        ["Website chat + voice", "Shopping, tracking, returns", "The Zovak web widget on the site; product, compare and cart cards"],
        ["WhatsApp", "Shopping, order updates, cart recovery", "Nofa's WhatsApp Cloud API adapter; catalogue messages"],
        ["Instagram DM", "\"Price?\" / \"Available in M?\" comments and DMs", "Meta Messenger API (new adapter, same agent)"],
        ["Phone", "Order help", "Telnyx → OpenAI SIP (Nofa's working setup)"],
        ["Email", "Order confirmations, support inbox", "Gmail/Outlook adapter"],
        ["SMS", "Delivery OTP and windows", "Alpha SMS for Bangladesh, as planned for Nofa"],
        ["Merchant console", "Store copilot, approvals, insights", "Staff-portal pattern from Nofa"],
    ],
)))

S.append(("Data model (first version)", table(
    ["Entity", "Key fields"],
    [
        ["Store (tenant)", "id, name, platform (own/Shopify/Woo), policies, margin_rules, refund_limits"],
        ["Product / Variant", "id, title, description, attributes (use, fit, material…), variants[{size, colour, sku, price, stock}], images, embeddings"],
        ["SizeChart", "brand, category, size → measurements"],
        ["Review", "product_id, rating, text, fit_signal, aspects[]"],
        ["Shopper", "id, contacts, consent flags, sizes (opt-in), preferences, addresses"],
        ["Cart / CartLine", "shopper_id, lines[{variant, qty, price_at_add}], coupons, delivery_slot"],
        ["Order", "id (AS-…), lines, totals, payment_ref, status, shipment_ref"],
        ["Return / Swap / Refund", "order_id, lines, reason, policy_check, status, label_ref"],
        ["Alert", "shopper_id, product_id, condition (price ≤ x / back in stock), expires_at"],
        ["Proposal", "kind (payment/refund/swap/listing/price/PO), payload, needs (shopper/staff), status, expires_at"],
        ["AuditEvent", "time, actor, action, inputs, outputs, proposal_id"],
        ["Conversation / Message", "Shared with ZOVAK schema"],
    ],
)))

S.append(("API the website already expects", para(
    "The website widget is wired for this contract. Turning on NEXT_PUBLIC_AGENT_LIVE=true and pointing the Next.js route at the backend makes the site live without touching the UI.",
) + pre(
"""POST /api/agent/chat            (Next.js route -> proxies to the Aisle backend, like Nofa -> ZOVAK)
request:  { "message": "Running shoes under $120", "conversationId": "web-…",
            "history": [{ "role": "user"|"agent", "text": "…" }] }
response: { "text": "…", "quick": ["What size should I get?", "…"], "cards": [ Card, … ] }

Card =
 | { kind: "products", items: [{ id, name, price, note, icon, tone }] }   // icon/tone -> image URL later
 | { kind: "compare", a, b, rows: [{ label, a, b }] }
 | { kind: "cart", lines: [{ name, qty, price }], total }
 | { kind: "proposal", title, detail, confirm, done }                     // needs a human tap
""") + "<h3>Backend endpoints (proposed)</h3>" + table(
    ["Method & path", "Purpose"],
    [
        ["POST /v1/chat (stream)", "Conversation turn; streams text, then cards"],
        ["GET /v1/products/search?q=&filters=", "Hybrid search (keywords + embeddings)"],
        ["POST /v1/cart/{id}/lines · /coupon · /slot", "Cart operations"],
        ["POST /v1/checkout/{cart}/link", "Creates the payment link the shopper confirms"],
        ["POST /v1/proposals/{id}/approve | /reject", "Shopper or staff decision; re-validated server-side"],
        ["GET /v1/orders/{id} · /tracking", "Order care"],
        ["POST /v1/returns", "Swap / return / refund request"],
        ["POST /v1/webhooks/{payment|courier|meta|shopify}", "Signed, de-duplicated inbound events"],
        ["GET /v1/merchant/insights · /forecast", "Store copilot"],
        ["POST /v1/voice/session", "Browser voice session (GPT-Live), same as Nofa"],
    ],
)))

S.append(("Integrations", table(
    ["Need", "Options", "First choice for MVP"],
    [
        ["Store platform", "Own catalogue, Shopify (Storefront + Admin API), WooCommerce", "Own catalogue for the demo, Shopify next"],
        ["Search", "Postgres full-text + pgvector embeddings, Algolia, Meilisearch", "Postgres + pgvector"],
        ["Payments", "Stripe (intl), SSLCommerz / bKash / Nagad (Bangladesh), Razorpay (India)", "Stripe test mode + SSLCommerz sandbox"],
        ["Couriers", "Pathao, RedX, Steadfast (BD), Shiprocket (IN), EasyPost/Shippo (intl)", "One BD courier API"],
        ["Messaging", "Meta WhatsApp + Instagram, Telnyx, Gmail, Alpha SMS", "Reuse Nofa adapters"],
        ["Images", "Store's product photos; AI try-on later", "Store photos"],
        ["Analytics", "Store events + our audit log", "Own tables"],
    ],
)))

S.append(("What we reuse from Nofa / ZOVAK", table(
    ["ZOVAK piece", "Reused for Aisle as"],
    [
        ["Channel adapters (web, voice, phone, WhatsApp, SMS, email)", "Same adapters; add Instagram DM"],
        ["Agent loop with tool calling and streaming", "Orchestrator + shopping specialists"],
        ["Read / Propose / Mutate policy, expiring proposals", "Payment hand-off, refunds, swaps, listings, POs"],
        ["Plain-code checks after the model; cards only when relevant", "Price/stock/coupon checks before cards render"],
        ["Outbox worker + notifications", "Order updates, alerts, cart recovery with caps"],
        ["Staff portal", "Merchant console with approvals"],
        ["Audit, idempotency, webhook de-dup", "Payments and courier webhooks"],
        ["Next.js proxy + private demo gate", "Same for the Aisle site"],
    ],
) + callout("New pieces Aisle needs that Nofa doesn't have: product search with embeddings, size/fit logic, cart & checkout links, payment webhooks, courier tracking, and merchant analytics.")))

S.append(("Roadmap", table(
    ["Phase", "Scope", "Done when"],
    [
        ["0 · Demo site (done)", "Website, 3D orb + product ring, scroll story, merchant console mock, chat + voice widget in demo mode", "Live on a URL you choose"],
        ["1 · Shopping agent MVP", "Real catalogue (~200 products), search + 3 picks + compare cards, web chat and voice", "A shopper finds and carts a product by asking"],
        ["2 · Checkout + order care", "Cart, coupons, payment link (Stripe/SSLCommerz test), courier tracking, returns proposals, WhatsApp", "Order placed and tracked end-to-end (test mode)"],
        ["3 · Size & memory", "Size charts, fit signals from reviews, consented profile, alerts", "Size recommendation with confidence on every apparel/shoe pick"],
        ["4 · Store copilot", "Listing drafts, review insights, cart recovery, stock forecast, approvals console", "Owner approves AI work in one queue"],
        ["5 · Plug-in mode", "Shopify app / WooCommerce plugin with the widget + agent", "Installs on a real store"],
    ],
)))

S.append(("How we measure it", table(
    ["Metric", "Target for a pilot store"],
    [
        ["Conversion of chat sessions vs. site average", "+20 to +40%"],
        ["Size-related returns", "−20 to −30%"],
        ["Support tickets handled by the agent", "≥ 70%"],
        ["Abandoned carts recovered", "+8 to +12%"],
        ["Time to publish a product listing", "< 1 minute with review"],
        ["Prices/stock shown that didn't match the store", "0"],
    ],
)))

S.append(("Risks", table(
    ["Risk", "Mitigation"],
    [
        ["Agent shows a wrong price or out-of-stock item", "Cards built from live data; re-check at add-to-cart and checkout"],
        ["Pushy or manipulative selling", "No fake scarcity; reasons shown; easy \"just browsing\""],
        ["Payment security", "Payment only on the provider's hosted checkout; agent never sees card data"],
        ["Privacy of shopper profiles", "Opt-in memory, wipe/export, retention policy"],
        ["WhatsApp/Instagram policy limits", "Templates, opt-in, frequency caps, 24-hour window rules"],
        ["Integration effort per store", "Own catalogue first; then one platform (Shopify) as a plug-in"],
    ],
)))

S.append(("Decisions I need from you", bullets([
    "**Product shape:** our own demo store, or an agent plug-in for existing Shopify/WooCommerce stores (or both, in that order)?",
    "**Market first:** Bangladesh (SSLCommerz/bKash, Pathao/RedX, Alpha SMS) or international (Stripe, EasyPost)?",
    "**Catalogue for the pilot:** a real partner store, or a sample catalogue with real product photos you provide?",
    "**Separate repo or inside ZOVAK?** My suggestion: aisle-backend, importing shared ZOVAK packages, so Nofa stays untouched.",
    "**Refund auto-limit and cart-recovery caps** to start with.",
    "**Domain and deploy:** e.g. aisle.zovak.tech on Vercel, like Nofa.",
])))


if __name__ == "__main__":
    out = pathlib.Path(__file__).with_name("Aisle_Agentic_Plan.html")
    out.write_text(render(META, S, THEME), encoding="utf-8")
    print("wrote", out)
