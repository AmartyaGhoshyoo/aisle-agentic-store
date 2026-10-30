"use client";

import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useInView, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowRight, Check, ShieldCheck, Sparkles } from "lucide-react";
import { AISLES, CHANNELS, GUARDRAILS, LOOKS, MERCHANT, SITE, byId } from "../data/site";
import { openAssistant } from "./assistant/Assistant";
import { Rise, RiseWords, Wrap, ease } from "./kit";
import Bag from "./three/Bag";
import { productShots, type ModelId } from "./three/products";

/** Product "photos" rendered from the 3D models, once, in the browser. */
function useShots() {
  const [shots, setShots] = useState<Record<string, string>>({});
  useEffect(() => {
    let live = true;
    productShots().then((s) => live && setShots(s));
    return () => {
      live = false;
    };
  }, []);
  return shots;
}

function Shot({ id, shots, className = "" }: { id: string; shots: Record<string, string>; className?: string }) {
  const src = shots[id];
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={byId(id).name} draggable={false} className={`select-none object-contain ${className}`} />
  ) : (
    <div className={`animate-pulse rounded-full bg-petal ${className}`} />
  );
}

const price = (p: string) => Number(p.replace(/[^0-9.]/g, ""));

export function Nav() {
  const { scrollY } = useScroll();
  const shadow = useTransform(scrollY, [0, 120], ["0 0 0 rgba(0,0,0,0)", "0 12px 40px -20px rgba(124,22,72,0.35)"]);
  return (
    <div className="fixed inset-x-0 top-3 z-50 px-3">
      <motion.header style={{ boxShadow: shadow, background: "rgba(255,250,253,0.88)" }} className="glass mx-auto flex h-14 max-w-[1180px] items-center justify-between rounded-full pl-6 pr-2">
        <a href="#shop" className="font-display text-[1.6rem] italic leading-none">
          aisle<span className="text-berry">.</span>
        </a>
        <nav className="hidden gap-8 text-[0.95rem] text-plum/70 md:flex">
          <a href="#aisles" className="hover:text-plum">Shop</a>
          <a href="#ask" className="hover:text-plum">Ask</a>
          <a href="#stylist" className="hover:text-plum">Stylist</a>
          <a href="#brands" className="hover:text-plum">For brands</a>
        </nav>
        <button onClick={() => openAssistant("chat")} className="min-h-[42px] cursor-pointer rounded-full bg-plum px-5 text-[0.92rem] font-medium text-white">
          Ask Aisle
        </button>
      </motion.header>
    </div>
  );
}

// ── Aisles: a sideways gallery driven by vertical scroll ─────────────────────
const AISLE_BG = ["#fce7f3", "#ede9fe", "#d1fae5", "#e0e7ff", "#dcfce7", "#ffe4e6"];

function TiltCard({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(0, { stiffness: 150, damping: 15 }), ry = useSpring(0, { stiffness: 150, damping: 15 });
  return (
    <motion.div
      ref={ref}
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 18);
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * 18);
      }}
      onPointerLeave={() => (rx.set(0), ry.set(0))}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
    >
      {children}
    </motion.div>
  );
}

export function Aisles() {
  const shots = useShots();
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  useLayoutEffect(() => {
    const m = () => setDist(Math.max(0, (track.current?.scrollWidth ?? 0) - window.innerWidth));
    m();
    window.addEventListener("resize", m);
    return () => window.removeEventListener("resize", m);
  }, []);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist]);
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="aisles" ref={section} className="relative" style={{ height: `calc(100vh + ${dist}px)` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <Wrap className="mb-6 flex items-end justify-between gap-6">
          <h2 className="font-display text-[clamp(2.4rem,5vw,4.4rem)] leading-[0.95]">
            Walk the <em className="text-berry">aisles.</em>
          </h2>
          <p className="hidden max-w-[22rem] text-plum/60 md:block">Every aisle has one pick the agent stands behind — and says why. Hover to turn it in your hand.</p>
        </Wrap>
        <motion.div ref={track} style={{ x }} className="flex w-max gap-5 px-5 sm:px-8 lg:px-[max(2rem,calc((100vw-1240px)/2+2rem))]">
          {AISLES.map((a, i) => {
            const p = byId(a.id);
            return (
              <article key={a.id} className="relative flex h-[66vh] min-h-[430px] w-[84vw] shrink-0 flex-col overflow-hidden rounded-[2rem] p-6 sm:w-[52vw] lg:w-[38vw] lg:p-8" style={{ background: AISLE_BG[i] }}>
                <span className="pointer-events-none absolute -right-4 top-2 select-none font-display text-[clamp(6rem,14vw,12rem)] italic leading-none text-white/70">{a.aisle}</span>
                <p className="relative text-[0.75rem] font-medium uppercase tracking-[0.3em] text-plum/50">
                  Aisle 0{i + 1} · {a.aisle}
                </p>
                <div className="relative flex flex-1 items-center justify-center">
                  <TiltCard>
                    <Shot id={a.id} shots={shots} className="h-[30vh] min-h-[200px] w-[30vh] min-w-[200px] drop-shadow-[0_30px_30px_rgba(91,18,56,0.25)]" />
                  </TiltCard>
                </div>
                <div className="relative flex items-end justify-between gap-4">
                  <div>
                    <p className="font-display text-[1.7rem] italic leading-tight">{p.name}</p>
                    <p className="mt-1 max-w-[24rem] text-[0.92rem] text-plum/65">{a.why}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-[1.6rem] text-berry">{p.price}</p>
                    <button onClick={() => openAssistant("chat", `Tell me about the ${p.name}`)} className="mt-1 inline-flex min-h-[40px] cursor-pointer items-center gap-1 rounded-full bg-plum px-4 text-[0.85rem] text-white">
                      Ask <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </motion.div>
        <Wrap className="mt-6">
          <div className="h-[2px] overflow-hidden rounded-full bg-plum/10">
            <motion.div style={{ width: bar }} className="h-full bg-berry" />
          </div>
        </Wrap>
      </div>
    </section>
  );
}

// ── Ask: a conversation that fills a 3D bag as you scroll ───────────────────
type Line = { who: "you" | "aisle"; text: string; pick?: string; drop?: number };
const SCRIPT: Line[] = [
  { who: "you", text: "I'm running my first 10K next month. Gear me up — $350 max." },
  { who: "aisle", text: "Three things matter for you: shoes for flat feet, a watch to pace you, and headphones that stay put." },
  { who: "aisle", text: "Stride Air, UK 9 wide — 86% sure on the size from your past orders.", pick: "p1", drop: 1 },
  { who: "you", text: "Add a watch that syncs with them." },
  { who: "aisle", text: "Pulse Fit pairs with the Stride app and tracks your sleep.", pick: "p3", drop: 2 },
  { who: "you", text: "And headphones for the long runs." },
  { who: "aisle", text: "Hush ANC — 38 h battery. With RUN10 your total is $315, under budget.", pick: "p2", drop: 3 },
];
const BAG_ITEMS: ModelId[] = ["p1", "p3", "p2"];

export function Ask() {
  const shots = useShots();
  const section = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const [step, setStep] = useState(1);
  useMotionValueEvent(scrollYProgress, "change", (p) => setStep(Math.max(1, Math.min(SCRIPT.length, Math.ceil(p * (SCRIPT.length + 0.6))))));
  const shown = SCRIPT.slice(0, step);
  const count = shown.reduce((n, l) => Math.max(n, l.drop ?? 0), 0);
  const total = BAG_ITEMS.slice(0, count).reduce((s, id) => s + price(byId(id).price), 0);
  const done = step === SCRIPT.length;

  return (
    <section id="ask" ref={section} className="relative h-[340vh] bg-plum text-white">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="pointer-events-none absolute right-[10%] top-1/2 h-[40rem] w-[40rem] -translate-y-1/2 rounded-full bg-berry/35 blur-3xl" />
        <Wrap className="relative grid h-full items-center gap-4 py-20 lg:grid-cols-[1fr_1fr]">
          <div className="order-2 flex h-full flex-col justify-end lg:order-1 lg:justify-center">
            <h2 className="mb-6 hidden font-display text-[clamp(2.4rem,4.4vw,4rem)] leading-[0.95] lg:block">
              One sentence in. <em className="text-[#f9a8d4]">A full bag out.</em>
            </h2>
            <div className="flex max-h-[52vh] flex-col justify-end gap-2.5 overflow-hidden">
              <AnimatePresence initial={false}>
                {shown.map((l, i) => (
                  <motion.div
                    key={i}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease }}
                    className={`max-w-[88%] rounded-3xl px-4 py-3 text-[0.95rem] ${l.who === "you" ? "self-end rounded-br-md bg-berry" : "self-start rounded-bl-md bg-white text-plum"}`}
                  >
                    {l.pick && (
                      <div className="mb-2 flex items-center gap-3 rounded-2xl bg-petal p-2">
                        <Shot id={l.pick} shots={shots} className="h-12 w-12" />
                        <div>
                          <p className="text-[0.85rem] font-semibold">{byId(l.pick).name}</p>
                          <p className="text-[0.8rem] text-berry">{byId(l.pick).price} · added to bag</p>
                        </div>
                      </div>
                    )}
                    {l.text}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
          <div className="relative order-1 h-[34vh] lg:order-2 lg:h-[70vh]">
            <Bag items={BAG_ITEMS} count={count} className="absolute inset-0" />
            <div className="absolute bottom-0 left-1/2 w-[min(22rem,90%)] -translate-x-1/2 rounded-2xl bg-white/10 p-3 text-center backdrop-blur max-lg:hidden">
              <p className="text-[0.8rem] uppercase tracking-[0.25em] text-white/60">Bag · {count} items</p>
              <p className="font-display text-[1.8rem]">${done ? (total * 0.9).toFixed(0) : total.toFixed(0)}</p>
              <AnimatePresence>
                {done && (
                  <motion.button initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} onClick={() => openAssistant("chat", "Check out")} className="mt-1 inline-flex min-h-[42px] cursor-pointer items-center gap-2 rounded-full bg-white px-5 text-[0.9rem] font-medium text-plum">
                    <ShieldCheck size={16} /> You press pay
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Wrap>
      </div>
    </section>
  );
}

// ── Stylist: pick a vibe, the agent builds the look ─────────────────────────
export function Stylist() {
  const shots = useShots();
  const [li, setLi] = useState(0);
  const look = LOOKS[li]!;
  const total = look.ids.reduce((s, id) => s + price(byId(id).price), 0);
  const spots = [
    { left: "4%", top: "8%", rotate: -8, size: "w-[46%]" },
    { left: "50%", top: "2%", rotate: 6, size: "w-[40%]" },
    { left: "28%", top: "46%", rotate: -2, size: "w-[44%]" },
  ];
  return (
    <section id="stylist" className="relative py-28">
      <Wrap className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-[0.75rem] font-medium uppercase tracking-[0.3em] text-berry">The stylist</p>
          <h2 className="mt-4 font-display text-[clamp(2.6rem,5.4vw,4.8rem)] leading-[0.95]">
            Name the moment. <em className="text-berry">It builds the look.</em>
          </h2>
          <div className="mt-8 flex flex-wrap gap-2">
            {LOOKS.map((l, i) => (
              <button key={l.name} onClick={() => setLi(i)} className={`min-h-[44px] cursor-pointer rounded-full px-5 text-[0.95rem] transition-colors ${i === li ? "bg-plum text-white" : "border border-plum/15 hover:bg-white"}`}>
                {l.name}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={li} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-8">
              <p className="font-display text-[1.5rem] italic">“{look.line}”</p>
              <ul className="mt-4 space-y-1.5 text-plum/75">
                {look.ids.map((id) => (
                  <li key={id} className="flex justify-between border-b border-plum/10 py-1.5">
                    <span>{byId(id).name}</span>
                    <span>{byId(id).price}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex items-center justify-between">
                <p className="font-display text-[2rem]">${total}</p>
                <button onClick={() => openAssistant("chat", `Add the ${look.name} look to my cart`)} className="inline-flex min-h-[48px] cursor-pointer items-center gap-2 rounded-full bg-berry px-6 font-medium text-white">
                  <Sparkles size={16} /> Cart this look
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="relative aspect-square w-full rounded-[2.5rem] bg-[radial-gradient(circle_at_50%_40%,#ffffff,#fce7f3_70%)]">
          {look.ids.map((id, i) => (
            <motion.div
              key={id}
              layoutId={`look-${id}`}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1, rotate: spots[i]!.rotate }}
              transition={{ type: "spring", stiffness: 120, damping: 16 }}
              className={`absolute ${spots[i]!.size}`}
              style={{ left: spots[i]!.left, top: spots[i]!.top }}
            >
              <div className="animate-[float_5s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.6}s` }}>
                <Shot id={id} shots={shots} className="aspect-square w-full drop-shadow-[0_25px_25px_rgba(91,18,56,0.25)]" />
              </div>
            </motion.div>
          ))}
        </div>
      </Wrap>
    </section>
  );
}

// ── For brands ───────────────────────────────────────────────────────────────
function Count({ to, prefix = "", suffix = "" }: { to: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const c = animate(0, to, { duration: 1.6, ease, onUpdate: (v) => ref.current && (ref.current.textContent = prefix + Math.round(v).toLocaleString("en-US") + suffix) });
    return () => c.stop();
  }, [inView, to, prefix, suffix]);
  return <span ref={ref}>{prefix}0{suffix}</span>;
}

export function Brands() {
  const [open, setOpen] = useState(0);
  const [approved, setApproved] = useState<number[]>([]);
  const asks = [
    { t: "Stride Air · UK 9 sells out in ~6 days. Reorder 40 pairs ($2,480)?", a: "Approve PO" },
    { t: "Reviews: “runs narrow” up 3× — add a size note to the listing?", a: "Add note" },
    { t: "Bundle the Run club look at 10% off (margin stays above 38%)?", a: "Publish" },
  ];
  return (
    <section id="brands" className="relative overflow-hidden bg-[#1a0913] py-28 text-white">
      <div className="pointer-events-none absolute -left-40 top-20 h-[36rem] w-[36rem] rounded-full bg-lilac/25 blur-3xl" />
      <Wrap className="relative">
        <p className="text-[0.75rem] font-medium uppercase tracking-[0.3em] text-[#f9a8d4]">For brands</p>
        <h2 className="mt-4 max-w-[54rem] font-display text-[clamp(2.6rem,6vw,5.4rem)] leading-[0.95]">
          Your shop keeps <em className="text-[#f9a8d4]">working</em> while you sleep.
        </h2>
        <div className="mt-12 grid grid-cols-3 gap-4 border-y border-white/10 py-8">
          {[
            { v: <Count to={48210} prefix="$" />, k: "revenue this week" },
            { v: <Count to={136} />, k: "carts recovered" },
            { v: <Count to={71} suffix="%" />, k: "chats handled by Aisle" },
          ].map((s) => (
            <div key={s.k}>
              <p className="font-display text-[clamp(1.8rem,4vw,3.4rem)] leading-none">{s.v}</p>
              <p className="mt-2 text-[0.85rem] text-white/55">{s.k}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <ol>
            {MERCHANT.map((m, i) => (
              <li key={m.title} className="border-b border-white/10">
                <button onClick={() => setOpen(i)} onMouseEnter={() => setOpen(i)} className="flex w-full cursor-pointer items-baseline gap-5 py-5 text-left">
                  <span className="font-display text-[0.95rem] text-white/40">0{i + 1}</span>
                  <span className={`font-display text-[clamp(1.4rem,2.6vw,2.1rem)] transition-colors ${open === i ? "italic text-[#f9a8d4]" : ""}`}>{m.title}</span>
                  <span className="ml-auto hidden text-[0.8rem] text-[#6ee7b7] sm:block">{m.metric}</span>
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pb-5 pl-10 text-white/65">
                      {m.detail}
                    </motion.p>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ol>
          <div>
            <p className="text-[0.8rem] uppercase tracking-[0.25em] text-white/50">Waiting for your OK</p>
            <div className="mt-4 space-y-3">
              {asks.map((a, i) => {
                const ok = approved.includes(i);
                return (
                  <Rise key={a.t} delay={i * 0.08}>
                    <div className="rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/10">
                      <p className="text-[0.95rem] text-white/85">{a.t}</p>
                      <button
                        onClick={() => setApproved((x) => [...x, i])}
                        disabled={ok}
                        className={`mt-3 inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-full px-4 text-[0.85rem] font-medium ${ok ? "bg-emerald text-white" : "bg-white text-plum"}`}
                      >
                        {ok ? (
                          <>
                            <Check size={14} /> Done · logged
                          </>
                        ) : (
                          a.a
                        )}
                      </button>
                    </div>
                  </Rise>
                );
              })}
            </div>
          </div>
        </div>
      </Wrap>
    </section>
  );
}

export function Trust() {
  return (
    <section id="trust" className="relative py-28">
      <Wrap>
        <h2 className="max-w-[50rem] font-display text-[clamp(2.4rem,5vw,4.4rem)] leading-[0.95]">
          <RiseWords text="It shops for you. *You stay in charge.*" />
        </h2>
        <div className="mt-12 grid gap-px overflow-hidden rounded-3xl bg-plum/10 sm:grid-cols-2 lg:grid-cols-4">
          {GUARDRAILS.map((g) => (
            <div key={g.rule} className="bg-blush p-6">
              <ShieldCheck className="text-emerald" size={22} />
              <h3 className="mt-4 font-display text-[1.35rem] italic">{g.rule}</h3>
              <p className="mt-2 text-[0.95rem] text-plum/65">{g.detail}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <span className="mr-2 text-[0.85rem] text-plum/50">Shop with Aisle on</span>
          {CHANNELS.map((c) => (
            <span key={c} className="rounded-full border border-plum/15 px-3.5 py-1.5 text-[0.88rem]">
              {c}
            </span>
          ))}
        </div>
      </Wrap>
    </section>
  );
}

export function Finale() {
  return (
    <section className="relative px-3 pb-6">
      <div className="relative mx-auto max-w-[1240px] overflow-hidden rounded-[2.5rem] bg-berry px-6 py-24 text-center text-white">
        <div className="pointer-events-none absolute left-1/2 top-full h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[conic-gradient(from_0deg,#f9a8d4,#7c3aed,#34d399,#f9a8d4)] opacity-60 blur-3xl" />
        <h2 className="relative mx-auto max-w-[52rem] font-display text-[clamp(2.8rem,7vw,6rem)] leading-[0.95]">
          Tell it what you need. <em>It&apos;s on it.</em>
        </h2>
        <p className="relative mx-auto mt-6 max-w-[32rem] text-white/75">Try the Aisle agent by chat or voice. A demo with a sample catalogue — nothing is really charged.</p>
        <div className="relative mt-10 flex flex-wrap justify-center gap-3">
          <button onClick={() => openAssistant("voice")} className="min-h-[52px] cursor-pointer rounded-full bg-white px-7 font-medium text-plum">
            Talk to Aisle
          </button>
          <a href={`mailto:${SITE.email}?subject=Aisle for my store`} className="flex min-h-[52px] items-center rounded-full px-7 font-medium ring-1 ring-white/40 hover:bg-white/10">
            Get Aisle for your brand
          </a>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="py-10">
      <Wrap className="flex flex-col items-center justify-between gap-3 text-[0.9rem] text-plum/55 sm:flex-row">
        <p>
          © {new Date().getFullYear()} {SITE.name} · built by{" "}
          <a href={SITE.by.url} className="font-medium text-plum underline-offset-4 hover:underline">
            {SITE.by.name}
          </a>
        </p>
        <p>Demo store · products modelled in 3D in your browser · no real payments</p>
      </Wrap>
    </footer>
  );
}
