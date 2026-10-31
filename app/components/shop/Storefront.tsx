"use client";

// The storefront: a calm hero, the agent workstation (ask → search → compare → cart → you
// confirm), one compact shelf per department with "View all", and three promo banners.
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Check, ChevronLeft, ChevronRight, Clock, Search, ShieldCheck, ShoppingBag, Sparkles, Tag, Truck, X } from "lucide-react";
import { DEALS, DEPTS, ITEMS, item, money, off, type Item } from "../../data/shop";
import { openAssistant } from "../assistant/Assistant";
import { CAT_ICONS } from "../catIcons";
import { Wrap, ease } from "../kit";
import ProductCard, { Stars, Thumb } from "./ProductCard";
import { goToShop, useShop } from "./store";

// ── Hero ────────────────────────────────────────────────────────────────────
export function Hero() {
  const [q, setQ] = useState("");
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-48 -top-48 h-[46rem] w-[46rem] rounded-full bg-[#f9a8d4]/35 blur-3xl" />
      <div className="pointer-events-none absolute -left-40 top-40 h-[30rem] w-[30rem] rounded-full bg-lilac/10 blur-3xl" />
      <Wrap className="relative grid items-center gap-10 pb-10 pt-10 lg:grid-cols-[1fr_1fr] lg:pb-16 lg:pt-14">
        <div>
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full border border-white bg-white/70 px-3 py-1 text-[0.8rem] text-plum/70 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald" /> Your personal shopping agent · 2.4M products
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.05 }} className="mt-5 font-display text-[clamp(2.6rem,5.4vw,4.8rem)] leading-[0.95]">
            Tell it what you need. <em className="text-berry">It does the shopping.</em>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.15 }} className="mt-5 max-w-[31rem] text-[1.05rem] text-plum/70">
            Aisle searches the whole store, compares the best three with reasons, picks your size and fills the cart. Nothing is paid until you confirm.
          </motion.p>
          <motion.form
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.22 }}
            onSubmit={(e) => {
              e.preventDefault();
              openAssistant("chat", q || undefined);
            }}
            className="mt-7 flex max-w-[34rem] items-center rounded-2xl border border-white bg-white/80 p-1.5 shadow-[0_20px_50px_-30px_rgba(124,22,72,0.5)] backdrop-blur-xl"
          >
            <Sparkles size={18} className="ml-3 shrink-0 text-berry" />
            <input value={q} onChange={(e) => setQ(e.target.value)} aria-label="Ask Aisle" placeholder="e.g. a light laptop for college under $900" className="h-11 min-w-0 flex-1 bg-transparent px-3 outline-none placeholder:text-plum/40" />
            <button className="flex h-11 cursor-pointer items-center gap-1.5 rounded-xl bg-plum px-4 text-[0.9rem] font-medium text-white hover:bg-berry">
              Ask <ArrowRight size={15} />
            </button>
          </motion.form>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[0.85rem] text-plum/60">
            <span className="inline-flex items-center gap-1.5"><Truck size={15} className="text-emerald" /> Delivery tomorrow</span>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck size={15} className="text-emerald" /> You confirm every payment</span>
            <span className="inline-flex items-center gap-1.5"><Tag size={15} className="text-emerald" /> Coupons found for you</span>
          </div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease }} className="relative mx-auto w-full max-w-[560px]">
          <div className="grid grid-cols-[1.15fr_1fr] gap-3">
            <div className="row-span-2 overflow-hidden rounded-[28px] shadow-[0_40px_80px_-40px_rgba(42,15,31,0.6)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/banners/happy.webp" alt="A shopper with bags" className="h-full min-h-[420px] w-full object-cover" />
            </div>
            <div className="overflow-hidden rounded-[22px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/products/sho/cloudline.webp" alt="Running shoe" className="aspect-square w-full object-cover" />
            </div>
            <div className="overflow-hidden rounded-[22px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/products/wat/atlas.webp" alt="Chronograph watch" className="aspect-square w-full object-cover" />
            </div>
          </div>
          <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="glass absolute -left-4 top-8 w-[15rem] rounded-2xl p-3 sm:-left-10">
            <p className="flex items-center gap-1.5 text-[0.72rem] uppercase tracking-[0.14em] text-berry">
              <Sparkles size={12} /> Aisle agent
            </p>
            <p className="mt-1 text-[0.86rem]">Found 3 running shoes for flat feet under $120 — in 12 s.</p>
          </motion.div>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="glass absolute -bottom-5 right-4 flex items-center gap-2 rounded-2xl px-3 py-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald text-white">
              <Check size={16} />
            </span>
            <span className="text-[0.84rem]">
              Coupon <b>RUN10</b> applied · −$11
            </span>
          </motion.div>
        </motion.div>
      </Wrap>
    </section>
  );
}

// ── The agent workstation ──────────────────────────────────────────────────
type Pick = { id: string; why: string; arrives: string; fit: string };
const SCENARIOS: { label: string; q: string; filters: string[]; scanned: number; noun: string; picks: Pick[]; coupon?: { code: string; pct: number } }[] = [
  {
    label: "Running shoes",
    q: "Running shoes for flat feet, under $120, here before Saturday. I'm a UK 9.",
    filters: ["Footwear", "Running", "Flat feet", "≤ $120", "UK 9 in stock", "Arrives by Sat"],
    scanned: 6180,
    noun: "running shoes",
    coupon: { code: "RUN10", pct: 10 },
    picks: [
      { id: "sho-stride", why: "Firm arch support and a wide fit — the best match for flat feet in budget.", arrives: "Thu", fit: "UK 9 wide · 86% sure" },
      { id: "sho-cloudline", why: "The most stable midsole under $110; reviewers with flat feet rate it 4.6.", arrives: "Fri", fit: "Runs true · UK 9" },
      { id: "sho-tempo", why: "Lightest of the three — good if your arches are only mildly flat.", arrives: "Thu", fit: "Runs small · take UK 9.5" },
    ],
  },
  {
    label: "Headphones",
    q: "Noise-cancelling headphones for long flights, under $300.",
    filters: ["Audio", "Over-ear", "Active noise cancelling", "≤ $300", "Battery 30 h+"],
    scanned: 2431,
    noun: "headphones",
    picks: [
      { id: "aud-quiet", why: "The strongest noise cancelling we sell — engine drone almost disappears.", arrives: "Tomorrow", fit: "30 h battery · foldable" },
      { id: "aud-hush", why: "About 85% as quiet for half the price; light on long wear.", arrives: "Tomorrow", fit: "35 h battery" },
      { id: "aud-sand", why: "40 h battery and soft pads — the comfiest for 12-hour flights.", arrives: "Thu", fit: "40 h battery" },
    ],
  },
  {
    label: "Gift for dad",
    q: "A watch for my dad's 60th, under $250, gift-wrapped.",
    filters: ["Watches", "Men's", "≤ $250", "Gift wrap", "Rated 4.5+"],
    scanned: 1874,
    noun: "watches",
    coupon: { code: "GIFT5", pct: 5 },
    picks: [
      { id: "wat-atlas", why: "A classic chronograph with a sapphire crystal; the most re-gifted watch on Aisle.", arrives: "Wed", fit: "Wrapped free · card included" },
      { id: "wat-regatta", why: "Blue dial and gold case — dressier, and arrives in a gift box.", arrives: "Thu", fit: "Gift box included" },
      { id: "wat-pilot", why: "Easy to read, luminous hands — great if he wears it every day.", arrives: "Wed", fit: "Wrapped free" },
    ],
  },
];
const STEPS = ["Ask", "Search", "Compare", "Cart", "You confirm"];

export function AgentDesk() {
  const { add, setCartOpen } = useShop();
  const [si, setSi] = useState(0);
  const [step, setStep] = useState(0);
  const [typed, setTyped] = useState(0);
  const [count, setCount] = useState(0);
  const [pick, setPick] = useState(0);
  const [held, setHeld] = useState(false); // the visitor took over: stop auto-advancing
  const [placed, setPlaced] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const s = SCENARIOS[si]!;

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(!!e?.isIntersecting), { threshold: 0.3 });
    if (box.current) io.observe(box.current);
    return () => io.disconnect();
  }, []);

  const start = (i: number) => {
    setSi(i);
    setStep(0);
    setTyped(0);
    setCount(0);
    setPick(0);
    setHeld(false);
    setPlaced(false);
  };

  // Type the request, then walk the steps on a timer until the confirm step.
  useEffect(() => {
    if (!inView || held) return;
    if (step === 0) {
      if (typed < s.q.length) {
        const t = setTimeout(() => setTyped((n) => Math.min(s.q.length, n + 2)), 28);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setStep(1), 600);
      return () => clearTimeout(t);
    }
    if (step === 1) {
      if (count < s.scanned) {
        const t = setTimeout(() => setCount((c) => Math.min(s.scanned, c + Math.ceil(s.scanned / 30))), 40);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setStep(2), 700);
      return () => clearTimeout(t);
    }
    if (step === 2 || step === 3) {
      const t = setTimeout(() => setStep((x) => x + 1), step === 2 ? 3600 : 2600);
      return () => clearTimeout(t);
    }
  }, [inView, held, step, typed, count, s]);

  const chosen = item(s.picks[pick]!.id)!;
  const discount = s.coupon ? Math.round((chosen.price * s.coupon.pct) / 100) : 0;
  const total = chosen.price - discount;
  const go = (n: number) => {
    setHeld(true);
    if (n >= 1) setTyped(s.q.length);
    if (n >= 1) setCount(s.scanned);
    setStep(n);
  };

  const thread = [
    { me: true, text: s.q.slice(0, typed) || "…" },
    step >= 1 && { me: false, text: `Searching ${s.noun} that match all ${s.filters.length} of your needs…` },
    step >= 2 && { me: false, text: `${s.scanned.toLocaleString("en-US")} checked. Here are the best three, with why.` },
    step >= 3 && { me: false, text: `${chosen.name} is in your cart${s.coupon ? ` — I applied ${s.coupon.code}` : ""}.` },
    step >= 4 && { me: false, text: placed ? "Order placed. Tracking will come to WhatsApp." : "Everything is ready. I'll wait for you to confirm." },
  ].filter(Boolean) as { me: boolean; text: string }[];

  return (
    <section id="agent" className="relative py-16 lg:py-20">
      <Wrap>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[40rem]">
            <p className="text-[0.78rem] font-medium uppercase tracking-[0.2em] text-berry">The agent workstation</p>
            <h2 className="mt-3 font-display text-[clamp(2.2rem,4.4vw,3.8rem)] leading-[0.98]">
              From one sentence to a ready cart — <em className="text-berry">you stay in charge.</em>
            </h2>
          </div>
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Try a request">
            {SCENARIOS.map((x, i) => (
              <button key={x.label} role="tab" aria-selected={si === i} onClick={() => start(i)} className={`min-h-[40px] cursor-pointer rounded-full px-4 text-[0.88rem] transition-colors ${si === i ? "bg-plum text-white" : "border border-white bg-white/70 backdrop-blur hover:bg-white"}`}>
                {x.label}
              </button>
            ))}
          </div>
        </div>

        <div ref={box} className="glass-panel mt-8 overflow-hidden rounded-[28px]">
          {/* Stepper */}
          <ol className="flex overflow-x-auto border-b border-plum/[0.07] px-3 [scrollbar-width:none] sm:px-5">
            {STEPS.map((label, i) => (
              <li key={label} className="shrink-0">
                <button onClick={() => go(i)} className={`flex min-h-[54px] cursor-pointer items-center gap-2 px-3 text-[0.86rem] transition-colors ${i === step ? "text-plum" : i < step ? "text-emerald" : "text-plum/40"}`}>
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[0.72rem] font-semibold ${i === step ? "bg-plum text-white" : i < step ? "bg-emerald text-white" : "bg-plum/[0.07]"}`}>{i < step ? <Check size={13} /> : i + 1}</span>
                  {label}
                </button>
              </li>
            ))}
          </ol>

          <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
            {/* Conversation */}
            <div className="border-b border-plum/[0.07] p-5 lg:border-b-0 lg:border-r">
              <div className="space-y-2.5">
                <AnimatePresence initial={false}>
                  {thread.map((m, i) => (
                    <motion.div key={`${si}-${i}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`max-w-[92%] rounded-2xl px-3.5 py-2.5 text-[0.9rem] ${m.me ? "ml-auto rounded-br-md bg-plum text-white" : "rounded-bl-md bg-white text-plum shadow-sm"}`}>
                      {!m.me && (
                        <p className="mb-0.5 flex items-center gap-1 text-[0.68rem] uppercase tracking-[0.14em] text-berry">
                          <Sparkles size={11} /> Aisle
                        </p>
                      )}
                      {m.text}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <div className="mt-5 rounded-2xl border border-plum/[0.08] bg-white/50 p-3 text-[0.8rem] text-plum/60">
                <p className="flex items-center gap-1.5 font-medium text-plum">
                  <ShieldCheck size={14} className="text-emerald" /> What the agent may do
                </p>
                <p className="mt-1">Search, compare, apply coupons and fill your cart. Paying, refunds and address changes always need your tap.</p>
              </div>
            </div>

            {/* Step view */}
            <div className="min-h-[440px] p-5">
              <AnimatePresence mode="wait">
                <motion.div key={`${si}-${step}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease }}>
                  {step === 0 && (
                    <div className="flex h-full min-h-[400px] flex-col items-center justify-center text-center">
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-berry/10 text-berry">
                        <Sparkles />
                      </span>
                      <p className="mt-4 max-w-[24rem] font-display text-[1.6rem] leading-tight">Say it like you’d say it to a friend.</p>
                      <p className="mt-2 max-w-[24rem] text-[0.9rem] text-plum/60">Budget, size, deadline, who it’s for — the agent turns your sentence into filters and asks only what it can’t work out.</p>
                    </div>
                  )}
                  {step === 1 && (
                    <div>
                      <p className="text-[0.78rem] uppercase tracking-[0.16em] text-plum/45">Understood as</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {s.filters.map((f, i) => (
                          <motion.span key={f} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }} className="rounded-full border border-berry/20 bg-white px-3 py-1.5 text-[0.85rem]">
                            {f}
                          </motion.span>
                        ))}
                      </div>
                      <div className="mt-8 rounded-2xl bg-white/70 p-5">
                        <p className="flex items-center gap-2 text-[0.85rem] text-plum/60">
                          <Search size={15} /> Checking catalogue, stock, sizes and reviews
                        </p>
                        <p className="mt-2 font-display text-[3rem] leading-none tabular-nums">{count.toLocaleString("en-US")}</p>
                        <p className="text-[0.85rem] text-plum/55">{s.noun} checked</p>
                        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-plum/[0.07]">
                          <div className="h-full rounded-full bg-gradient-to-r from-berry to-lilac transition-[width] duration-100" style={{ width: `${(count / s.scanned) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  )}
                  {step === 2 && (
                    <div>
                      <p className="text-[0.78rem] uppercase tracking-[0.16em] text-plum/45">Best three · tap one to choose</p>
                      <div className="mt-3 grid grid-cols-3 gap-2 sm:gap-3">
                        {s.picks.map((p, i) => {
                          const it = item(p.id)!;
                          return (
                            <button
                              key={p.id}
                              onClick={() => {
                                setPick(i);
                                setHeld(true);
                              }}
                              className={`cursor-pointer overflow-hidden rounded-2xl border bg-white text-left transition-all ${pick === i ? "border-berry shadow-[0_16px_40px_-20px_rgba(190,24,93,0.55)]" : "border-plum/[0.08] hover:border-plum/20"}`}
                            >
                              <div className="relative aspect-[4/3] overflow-hidden bg-petal">
                                <Thumb it={it} />
                                {i === 0 && <span className="absolute left-2 top-2 rounded-full bg-emerald px-2 py-0.5 text-[0.68rem] font-semibold text-white">Best match</span>}
                              </div>
                              <div className="p-2 sm:p-3">
                                <p className="line-clamp-2 text-[0.8rem] font-medium sm:line-clamp-1 sm:text-[0.88rem]">{it.name}</p>
                                <p className="mt-0.5 text-[0.95rem] font-semibold">{money(it.price)}</p>
                                <p className="mt-1.5 hidden text-[0.76rem] leading-snug text-plum/60 sm:block">{p.why}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      <table className="mt-4 w-full text-[0.8rem]">
                        <tbody className="divide-y divide-plum/[0.07]">
                          {[
                            ["Rating", (p: Pick) => <Stars r={item(p.id)!.rating} n={item(p.id)!.reviews} />],
                            ["Arrives", (p: Pick) => p.arrives],
                            ["Fit / notes", (p: Pick) => p.fit],
                          ].map(([k, f]) => (
                            <tr key={k as string}>
                              <td className="py-2 pr-2 text-plum/50">{k as string}</td>
                              {s.picks.map((p, i) => (
                                <td key={p.id} className={`py-2 ${pick === i ? "font-medium text-plum" : "text-plum/70"}`}>
                                  {(f as (p: Pick) => React.ReactNode)(p)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <button onClick={() => go(3)} className="mt-4 inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full bg-plum px-5 text-[0.88rem] font-medium text-white hover:bg-berry">
                        Put {chosen.name.split(" ").slice(0, 2).join(" ")} in the cart <ArrowRight size={15} />
                      </button>
                    </div>
                  )}
                  {(step === 3 || step === 4) && (
                    <div className="grid gap-5 sm:grid-cols-[1fr_1fr]">
                      <div className="overflow-hidden rounded-2xl bg-white">
                        <div className="aspect-[4/3] bg-petal">
                          <Thumb it={chosen} />
                        </div>
                        <div className="p-4">
                          <p className="text-[0.7rem] uppercase tracking-[0.14em] text-plum/45">{chosen.brand}</p>
                          <p className="font-medium">{chosen.name}</p>
                          <p className="mt-1 text-[0.82rem] text-plum/60">{s.picks[pick]!.fit}</p>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <dl className="space-y-2 rounded-2xl bg-white/70 p-4 text-[0.9rem]">
                          <div className="flex justify-between"><dt className="text-plum/60">Item</dt><dd>{money(chosen.price)}</dd></div>
                          {s.coupon && (
                            <div className="flex justify-between text-emerald"><dt>Coupon {s.coupon.code}</dt><dd>−{money(discount)}</dd></div>
                          )}
                          <div className="flex justify-between"><dt className="text-plum/60">Delivery</dt><dd>Free · {s.picks[pick]!.arrives}</dd></div>
                          <div className="flex justify-between border-t border-plum/10 pt-2 text-[1.1rem] font-semibold"><dt>Total</dt><dd>{money(total)}</dd></div>
                        </dl>
                        <p className="mt-3 flex items-center gap-1.5 text-[0.8rem] text-plum/55">
                          <Clock size={13} /> Home address · card ending 4242 · slot 10–12
                        </p>
                        {step === 3 ? (
                          <button onClick={() => go(4)} className="mt-auto min-h-[48px] cursor-pointer rounded-full bg-plum font-medium text-white hover:bg-berry">
                            Review & confirm
                          </button>
                        ) : placed ? (
                          <div className="mt-auto rounded-2xl bg-emerald/10 p-4 text-[0.9rem] text-emerald">
                            <p className="flex items-center gap-2 font-medium">
                              <Check size={17} /> Order placed — demo, nothing charged.
                            </p>
                          </div>
                        ) : (
                          <div className="mt-auto space-y-2">
                            <button onClick={() => setPlaced(true)} className="flex min-h-[50px] w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-emerald font-medium text-white hover:brightness-105">
                              <ShieldCheck size={17} /> Confirm & pay {money(total)}
                            </button>
                            <button
                              onClick={() => {
                                add(chosen.id);
                                setCartOpen(true);
                              }}
                              className="flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-plum/15 text-[0.88rem] hover:bg-white"
                            >
                              <ShoppingBag size={15} /> Put it in my real cart instead
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Wrap>
    </section>
  );
}

// ── The shelf: department tabs, one compact row, "View all" in a drawer ─────
export function Shelf() {
  const { dept, setDept, query, setQuery } = useShop();
  const [all, setAll] = useState(false);
  const row = useRef<HTMLDivElement>(null);
  const key = dept === "all" ? "deals" : dept;
  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q) return ITEMS.filter((i) => `${i.name} ${i.brand} ${i.note} ${i.dept}`.toLowerCase().includes(q));
    return key === "deals" ? DEALS : ITEMS.filter((i) => i.dept === key);
  }, [key, query]);
  const title = query ? `Results for “${query}”` : key === "deals" ? "Today's deals" : DEPTS.find((d) => d.key === key)!.name;
  const scroll = (d: number) => {
    row.current?.scrollBy({ left: d * row.current.clientWidth * 0.85, behavior: "smooth" });
  };
  useEffect(() => {
    row.current?.scrollTo({ left: 0 });
  }, [key, query]);

  return (
    <section id="shop" className="scroll-mt-32 py-14">
      <Wrap>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-[0.98]">
            Shop the <em className="text-berry">store</em>
          </h2>
          <div className="flex items-center gap-2">
            <button onClick={() => scroll(-1)} aria-label="Scroll left" className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white bg-white/70 backdrop-blur hover:bg-white">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => scroll(1)} aria-label="Scroll right" className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white bg-white/70 backdrop-blur hover:bg-white">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        <div className="mt-6 flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]" role="tablist" aria-label="Departments">
          {[{ key: "all" as const, name: "Today's deals", icon: "sparkles" }, ...DEPTS].map((d) => {
            const Icon = CAT_ICONS[d.icon] ?? Sparkles;
            const on = !query && dept === d.key;
            return (
              <button
                key={d.key}
                role="tab"
                aria-selected={on}
                onClick={() => {
                  setQuery("");
                  setDept(d.key);
                }}
                className={`flex min-h-[40px] shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-4 text-[0.88rem] transition-colors ${on ? "bg-plum text-white" : "border border-white bg-white/60 backdrop-blur hover:bg-white"}`}
              >
                <Icon size={15} className={on ? "" : "text-berry"} /> {d.name}
              </button>
            );
          })}
        </div>
        <div className="glass-panel mt-5 rounded-[28px] p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-medium">
              {title} <span className="text-plum/45">· {list.length}</span>
            </p>
            <button onClick={() => setAll(true)} className="inline-flex cursor-pointer items-center gap-1 text-[0.9rem] font-medium text-berry">
              View all <ArrowRight size={15} />
            </button>
          </div>
          {list.length === 0 ? (
            <p className="py-10 text-center text-plum/60">
              Nothing on the shelf matches. <button onClick={() => openAssistant("chat", query)} className="text-berry underline underline-offset-4">Ask Aisle to search everywhere</button>
            </p>
          ) : (
            <div ref={row} data-lenis-prevent-horizontal className="flex snap-x gap-3 overflow-x-auto pb-1 [scrollbar-width:none]">
              {list.slice(0, 10).map((it) => (
                <div key={it.id} className="w-[46vw] max-w-[220px] shrink-0 snap-start sm:w-[220px]">
                  <ProductCard it={it} />
                </div>
              ))}
            </div>
          )}
        </div>
      </Wrap>
      <AllDrawer open={all} onClose={() => setAll(false)} title={title} items={list} />
    </section>
  );
}

function AllDrawer({ open, onClose, title, items }: { open: boolean; onClose(): void; title: string; items: Item[] }) {
  const [sort, setSort] = useState("featured");
  const sorted = useMemo(() => {
    const s = [...items];
    if (sort === "low") s.sort((a, b) => a.price - b.price);
    if (sort === "high") s.sort((a, b) => b.price - a.price);
    if (sort === "rated") s.sort((a, b) => b.rating - a.rating);
    if (sort === "off") s.sort((a, b) => off(b) - off(a));
    return s;
  }, [items, sort]);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[65]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div onClick={onClose} className="absolute inset-0 bg-plum/40 backdrop-blur-sm" />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={title}
            data-lenis-prevent
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease }}
            className="absolute right-0 top-0 flex h-full w-full max-w-[820px] flex-col bg-[#fffafd]"
          >
            <div className="flex items-center justify-between gap-3 border-b border-plum/10 px-5 py-4">
              <h2 className="font-display text-[1.7rem]">
                {title} <span className="font-sans text-[1rem] text-plum/45">({items.length})</span>
              </h2>
              <div className="flex items-center gap-2">
                <select aria-label="Sort" value={sort} onChange={(e) => setSort(e.target.value)} className="min-h-[40px] cursor-pointer rounded-full border border-plum/15 bg-white px-3 text-[0.85rem]">
                  <option value="featured">Featured</option>
                  <option value="low">Price: low to high</option>
                  <option value="high">Price: high to low</option>
                  <option value="rated">Top rated</option>
                  <option value="off">Biggest discount</option>
                </select>
                <button onClick={onClose} aria-label="Close" className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:bg-petal">
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="grid flex-1 grid-cols-2 content-start gap-3 overflow-y-auto p-5 sm:grid-cols-3 lg:grid-cols-4">
              {sorted.map((it) => (
                <ProductCard key={it.id} it={it} />
              ))}
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Promo banners: real photos with gentle scroll parallax ──────────────────
function Banner({ src, kicker, title, cta, onClick, tall = false }: { src: string; kicker: string; title: string; cta: string; onClick(): void; tall?: boolean }) {
  const ref = useRef<HTMLButtonElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  return (
    <button ref={ref} onClick={onClick} className={`group relative cursor-pointer overflow-hidden rounded-[26px] text-left text-white ${tall ? "min-h-[380px]" : "min-h-[180px]"}`}>
      <motion.img style={{ y, scale: 1.14 }} src={src} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-plum/85 via-plum/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6">
        <p className="text-[0.72rem] uppercase tracking-[0.2em] text-white/75">{kicker}</p>
        <p className={`mt-1 font-display leading-[0.98] ${tall ? "text-[clamp(1.9rem,3.2vw,2.8rem)]" : "text-[1.55rem]"}`}>{title}</p>
        <span className="mt-3 inline-flex items-center gap-1.5 text-[0.88rem] font-medium">
          {cta} <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </button>
  );
}

export function Promos() {
  const { setDept, setQuery } = useShop();
  const go = (d: (typeof DEPTS)[number]["key"]) => () => {
    setQuery("");
    setDept(d);
    goToShop();
  };
  return (
    <section className="pb-14">
      <Wrap className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
        <Banner tall src="/banners/coat.webp" kicker="The autumn edit" title="Layers, knits and denim — up to 30% off" cta="Shop fashion" onClick={go("fashion")} />
        <div className="grid gap-4">
          <Banner src="/banners/bags.webp" kicker="Gifts, wrapped free" title="Watches they'll keep" cta="Shop watches" onClick={go("watches")} />
          <Banner src="/banners/window.webp" kicker="New season" title="Runners & court classics" cta="Shop footwear" onClick={go("footwear")} />
        </div>
      </Wrap>
    </section>
  );
}
