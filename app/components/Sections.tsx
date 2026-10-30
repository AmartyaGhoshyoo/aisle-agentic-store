"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useScroll, useTransform } from "motion/react";
import {
  Bell,
  CreditCard,
  Gift,
  Ruler,
  Scale,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { AGENTS, CHANNELS, GUARDRAILS, MERCHANT, PRODUCTS, SITE } from "../data/site";
import { ICONS, openAssistant } from "./assistant/Assistant";
import { Rise, RiseWords, Wrap, ease } from "./kit";

const AGENT_ICONS: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  search: Search,
  scale: Scale,
  ruler: Ruler,
  bell: Bell,
  gift: Gift,
  card: CreditCard,
  truck: Truck,
  store: Store,
};

export function Nav() {
  const { scrollY } = useScroll();
  const shadow = useTransform(scrollY, [0, 120], ["0 0 0 rgba(0,0,0,0)", "0 12px 40px -20px rgba(124,22,72,0.35)"]);
  return (
    <div className="fixed inset-x-0 top-3 z-50 px-3">
      <motion.header style={{ boxShadow: shadow, background: "rgba(255,250,253,0.9)" }} className="glass mx-auto flex h-14 max-w-[1180px] items-center justify-between rounded-full pl-5 pr-2">
        <a href="#top" className="font-display text-[1.35rem] font-extrabold tracking-tight">
          aisle<span className="text-berry">.</span>
        </a>
        <nav className="hidden gap-7 text-[0.92rem] font-semibold text-plum/70 md:flex">
          <a href="#journey" className="hover:text-plum">How it shops</a>
          <a href="#agents" className="hover:text-plum">Agents</a>
          <a href="#store" className="hover:text-plum">For stores</a>
          <a href="#trust" className="hover:text-plum">Trust</a>
        </nav>
        <button onClick={() => openAssistant("chat")} className="min-h-[42px] cursor-pointer rounded-full bg-berry px-5 text-[0.9rem] font-bold text-white">
          Ask Aisle
        </button>
      </motion.header>
    </div>
  );
}

export function Shelf() {
  return (
    <div className="overflow-hidden border-y border-plum/5 bg-white/60 py-5">
      <div className="flex w-max animate-[marquee_40s_linear_infinite] gap-4">
        {[...PRODUCTS, ...PRODUCTS].map((p, i) => {
          const Icon = ICONS[p.icon] ?? ICONS.bag!;
          return (
            <button
              key={i}
              onClick={() => openAssistant("chat", `Tell me about the ${p.name}`)}
              className="flex cursor-pointer items-center gap-3 rounded-full bg-white py-1.5 pl-1.5 pr-5 ring-1 ring-plum/5"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full text-white" style={{ background: p.tone }}>
                <Icon size={18} />
              </span>
              <span className="text-[0.9rem] font-semibold">{p.name}</span>
              <span className="text-[0.85rem] text-plum/50">{p.price}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Agents() {
  return (
    <section id="agents" className="relative py-28">
      <Wrap>
        <p className="text-[0.8rem] font-bold uppercase tracking-[0.2em] text-berry">Behind the counter</p>
        <h2 className="mt-4 max-w-[50rem] font-display text-[clamp(2.3rem,5vw,4.2rem)] font-bold leading-[1.02]">
          <RiseWords text="Nine agents, *one shop assistant.*" />
        </h2>
        <p className="mt-5 max-w-[38rem] text-plum/65">You talk to one friendly assistant. Behind it, specialist agents hand the job along — and the store owner gets their own copilot.</p>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AGENTS.map((a, i) => {
            const Icon = AGENT_ICONS[a.icon] ?? Sparkles;
            return (
              <Rise key={a.name} delay={(i % 3) * 0.08}>
                <motion.div whileHover={{ y: -6 }} className="glass group h-full rounded-3xl p-6">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-berry/10 text-berry transition-colors group-hover:bg-berry group-hover:text-white">
                    <Icon size={22} />
                  </span>
                  <h3 className="mt-5 font-display text-[1.3rem] font-bold">{a.name}</h3>
                  <p className="mt-1.5 text-plum/65">{a.does}</p>
                </motion.div>
              </Rise>
            );
          })}
        </div>
      </Wrap>
    </section>
  );
}

function Count({ to, prefix = "", suffix = "", decimals = 0 }: { to: number; prefix?: string; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const c = animate(0, to, { duration: 1.6, ease, onUpdate: (v) => ref.current && (ref.current.textContent = prefix + v.toLocaleString("en-US", { maximumFractionDigits: decimals, minimumFractionDigits: decimals }) + suffix) });
    return () => c.stop();
  }, [inView, to, prefix, suffix, decimals]);
  return <span ref={ref}>{prefix}0{suffix}</span>;
}

const BARS = [38, 52, 44, 61, 58, 73, 69, 84, 78, 92, 88, 97];

export function Merchant() {
  const [pick, setPick] = useState(0);
  return (
    <section id="store" className="relative py-28">
      <div className="pointer-events-none absolute inset-x-0 top-20 mx-auto h-[30rem] max-w-[60rem] rounded-full bg-[#c4b5fd]/30 blur-3xl" />
      <Wrap className="relative">
        <p className="text-[0.8rem] font-bold uppercase tracking-[0.2em] text-berry">For store owners</p>
        <h2 className="mt-4 max-w-[52rem] font-display text-[clamp(2.3rem,5vw,4.2rem)] font-bold leading-[1.02]">
          <RiseWords text="Your shop, *running itself* while you sleep." />
        </h2>
        <div className="mt-14 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-2">
            {MERCHANT.map((m, i) => (
              <button
                key={m.title}
                onClick={() => setPick(i)}
                className={`block w-full cursor-pointer rounded-2xl p-5 text-left transition-colors ${pick === i ? "bg-plum text-white" : "bg-white/60 hover:bg-white"}`}
              >
                <p className="flex items-center justify-between gap-3 font-display text-[1.1rem] font-bold">
                  {m.title}
                  <span className={`text-[0.75rem] font-sans font-bold ${pick === i ? "text-[#6ee7b7]" : "text-emerald"}`}>{m.metric}</span>
                </p>
                {pick === i && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-2 text-[0.94rem] text-white/70">
                    {m.detail}
                  </motion.p>
                )}
              </button>
            ))}
          </div>
          <Rise>
            <div className="glass rounded-[2rem] p-6">
              <div className="flex items-center justify-between">
                <p className="font-display text-[1.1rem] font-bold">Store copilot · this week</p>
                <span className="rounded-full bg-emerald/10 px-3 py-1 text-[0.75rem] font-bold text-emerald">demo data</span>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { k: "Revenue", v: <Count to={48210} prefix="$" /> },
                  { k: "Carts recovered", v: <Count to={136} /> },
                  { k: "Chats handled", v: <Count to={71} suffix="%" /> },
                ].map((s) => (
                  <div key={s.k} className="rounded-2xl bg-white p-4">
                    <p className="text-[0.72rem] font-semibold text-plum/50">{s.k}</p>
                    <p className="mt-1 text-[1.5rem] font-extrabold tracking-tight">{s.v}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex h-40 items-end gap-2 rounded-2xl bg-white p-4">
                {BARS.map((b, i) => (
                  <motion.span
                    key={i}
                    className={`flex-1 rounded-t-md ${i === BARS.length - 1 ? "bg-berry" : "bg-berry/25"}`}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${b}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.05, ease }}
                  />
                ))}
              </div>
              <div className="mt-4 space-y-2 text-[0.88rem]">
                <p className="flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-3">
                  <span>
                    <b>Stride Air · UK 9</b> sells out in ~6 days. Reorder 40 pairs?
                  </span>
                  <span className="shrink-0 rounded-full bg-berry px-3 py-1 text-[0.78rem] font-bold text-white">Approve</span>
                </p>
                <p className="flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-3">
                  <span>
                    Reviews: <b>&ldquo;runs narrow&rdquo;</b> up 3× — add a size note?
                  </span>
                  <span className="shrink-0 rounded-full bg-plum/5 px-3 py-1 text-[0.78rem] font-bold">Review</span>
                </p>
              </div>
            </div>
          </Rise>
        </div>
      </Wrap>
    </section>
  );
}

export function Trust() {
  return (
    <section id="trust" className="relative py-28">
      <Wrap className="grid gap-14 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="text-[0.8rem] font-bold uppercase tracking-[0.2em] text-berry">Trust</p>
          <h2 className="mt-4 font-display text-[clamp(2.3rem,5vw,4rem)] font-bold leading-[1.02]">
            <RiseWords text="It shops for you. *You stay in charge.*" />
          </h2>
          <p className="mt-5 max-w-[30rem] text-plum/65">
            Built on the rule behind Nofa, our clinic receptionist: the agent prepares, a person confirms anything that moves money or makes a promise.
          </p>
          <p className="mt-10 text-[0.8rem] font-semibold text-plum/50">Shop with Aisle on</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {CHANNELS.map((c) => (
              <span key={c} className="rounded-full bg-white px-3.5 py-1.5 text-[0.88rem] font-semibold ring-1 ring-plum/10">
                {c}
              </span>
            ))}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {GUARDRAILS.map((g, i) => (
            <Rise key={g.rule} delay={i * 0.08}>
              <div className="h-full rounded-3xl bg-white p-6 ring-1 ring-plum/5">
                <ShieldCheck className="text-emerald" size={22} />
                <h3 className="mt-4 font-display text-[1.15rem] font-bold">{g.rule}</h3>
                <p className="mt-2 text-[0.94rem] text-plum/60">{g.detail}</p>
              </div>
            </Rise>
          ))}
        </div>
      </Wrap>
    </section>
  );
}

export function Finale() {
  return (
    <section className="relative px-3 pb-6">
      <div className="relative mx-auto max-w-[1240px] overflow-hidden rounded-[2.5rem] bg-plum px-6 py-24 text-center text-white">
        <div className="pointer-events-none absolute left-1/2 top-full h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[conic-gradient(from_0deg,#f472b6,#7c3aed,#34d399,#f472b6)] opacity-50 blur-3xl" />
        <h2 className="relative mx-auto max-w-[50rem] font-display text-[clamp(2.6rem,6.5vw,5.6rem)] font-bold leading-[1]">
          <RiseWords text="Tell it what you need. *It's on it.*" accent="text-[#f9a8d4]" />
        </h2>
        <p className="relative mx-auto mt-6 max-w-[32rem] text-white/65">Try the Aisle agent by chat or voice. It&apos;s a demo with a sample catalogue — nothing is really charged.</p>
        <div className="relative mt-10 flex flex-wrap justify-center gap-3">
          <button onClick={() => openAssistant("voice")} className="min-h-[52px] cursor-pointer rounded-full bg-white px-7 font-bold text-plum">
            Talk to Aisle
          </button>
          <a href={`mailto:${SITE.email}?subject=Aisle for my store`} className="flex min-h-[52px] items-center rounded-full px-7 font-bold ring-1 ring-white/30 hover:bg-white/10">
            Get Aisle for your store
          </a>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="py-10">
      <Wrap className="flex flex-col items-center justify-between gap-3 text-[0.88rem] text-plum/55 sm:flex-row">
        <p>
          © {new Date().getFullYear()} {SITE.name} · built by{" "}
          <a href={SITE.by.url} className="font-semibold text-plum underline-offset-4 hover:underline">
            {SITE.by.name}
          </a>
        </p>
        <p>Demo store · sample catalogue · no real payments</p>
      </Wrap>
    </footer>
  );
}
