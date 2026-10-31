"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useInView } from "motion/react";
import { Check, ShieldCheck } from "lucide-react";
import { CHANNELS, GUARDRAILS, MERCHANT, SITE } from "../data/site";
import { Rise, RiseWords, Wrap, ease } from "./kit";
import { PHOTO_CREDIT } from "../data/shop";

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

function Credits() {
  return (
    <details className="relative inline-block">
      <summary className="cursor-pointer list-none underline-offset-4 hover:underline">Photo credits</summary>
      <ul className="absolute bottom-7 right-0 z-10 w-[min(26rem,85vw)] space-y-1 rounded-2xl bg-white p-4 text-left text-[0.8rem] text-plum/75 shadow-xl ring-1 ring-plum/10">
        {[PHOTO_CREDIT].map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
    </details>
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
        <div>Demo store · no real payments · <Credits /></div>
      </Wrap>
    </footer>
  );
}
