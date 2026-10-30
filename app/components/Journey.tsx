"use client";

// "From a sentence to your door": a pinned scroll story. Each chapter swaps the phone-like
// stage on the right for that agent's moment (intent → picks → compare → size → pay → care).
import { ReactNode, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Check, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { CHAPTERS, PRODUCTS, TONES } from "../data/site";
import { ICONS } from "./assistant/Assistant";
import { RiseWords, Wrap, ease } from "./kit";

export default function Journey() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [step, setStep] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (p) => setStep(Math.min(CHAPTERS.length - 1, Math.max(0, Math.floor(p * CHAPTERS.length)))));
  const c = CHAPTERS[step]!;

  return (
    <section ref={ref} id="journey" className="relative bg-plum text-white lg:h-[520vh]">
      <div className="sticky top-0 hidden h-screen items-center overflow-hidden lg:flex">
        <div className="pointer-events-none absolute right-[8%] top-1/2 h-[36rem] w-[36rem] -translate-y-1/2 rounded-full bg-berry/30 blur-3xl" />
        <Wrap className="relative grid grid-cols-[1fr_0.9fr] items-center gap-16">
          <div>
            <p className="text-[0.8rem] font-bold uppercase tracking-[0.2em] text-[#f9a8d4]">From a sentence to your door</p>
            <div className="relative mt-6 h-[22rem]">
              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5, ease }} className="absolute inset-0">
                  <p className="text-[0.85rem] font-semibold text-white/50">
                    0{step + 1} · {c.agent}
                  </p>
                  <h2 className="mt-3 font-display text-[clamp(2.2rem,3.6vw,3.3rem)] font-bold leading-[1.02]">
                    {c.title.split("*").map((part, i) => (
                      <span key={i} className={i % 2 ? "text-[#f9a8d4]" : ""}>
                        {part}
                      </span>
                    ))}
                  </h2>
                  <p className="mt-5 max-w-[32rem] text-[1.05rem] leading-relaxed text-white/65">{c.body}</p>
                  <p className="mt-6 text-[2.3rem] font-extrabold tracking-tight text-[#6ee7b7]">
                    {c.stat} <span className="ml-2 text-[0.85rem] font-semibold text-white/50">{c.statLabel}</span>
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="mt-4 flex gap-1.5">
              {CHAPTERS.map((_, i) => (
                <span key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === step ? "w-10 bg-[#f9a8d4]" : i < step ? "w-5 bg-white/40" : "w-5 bg-white/15"}`} />
              ))}
            </div>
          </div>
          <Stage step={step} />
        </Wrap>
      </div>

      <Wrap className="space-y-16 py-24 lg:hidden">
        <p className="text-[0.8rem] font-bold uppercase tracking-[0.2em] text-[#f9a8d4]">From a sentence to your door</p>
        {CHAPTERS.map((ch, i) => (
          <div key={ch.agent}>
            <p className="text-[0.85rem] font-semibold text-white/50">
              0{i + 1} · {ch.agent}
            </p>
            <h2 className="mt-2 font-display text-[2.1rem] font-extrabold leading-[1.02]">
              <RiseWords text={ch.title} accent="text-[#f9a8d4]" />
            </h2>
            <p className="mt-3 text-white/65">{ch.body}</p>
            <div className="mt-6">
              <Stage step={i} />
            </div>
          </div>
        ))}
      </Wrap>
    </section>
  );
}

const appear = (d: number) => ({ initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay: d, ease } });

function Phone({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[400px] rounded-[2.2rem] bg-white/10 p-2.5 ring-1 ring-white/20 backdrop-blur">
      <div className="min-h-[30rem] overflow-hidden rounded-[1.8rem] bg-blush p-4 text-plum">
        <div className="mb-4 flex items-center gap-2">
          <span className="h-7 w-7 rounded-full bg-[conic-gradient(from_90deg,#f472b6,#7c3aed,#34d399,#f472b6)]" />
          <p className="text-[0.85rem] font-bold">Aisle</p>
          <span className="ml-auto text-[0.7rem] text-plum/50">agent · online</span>
        </div>
        {children}
      </div>
    </div>
  );
}

function Stage({ step }: { step: number }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div key={step} initial={{ opacity: 0, y: 30, rotateX: 8 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} exit={{ opacity: 0, y: -24 }} transition={{ duration: 0.55, ease }} style={{ transformPerspective: 1200 }}>
        <Phone>
          {step === 0 && <Intent />}
          {step === 1 && <Picks />}
          {step === 2 && <Compare />}
          {step === 3 && <Size />}
          {step === 4 && <Pay />}
          {step === 5 && <Care />}
        </Phone>
      </motion.div>
    </AnimatePresence>
  );
}

const You = ({ children }: { children: ReactNode }) => (
  <motion.p {...appear(0)} className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-berry px-3.5 py-2.5 text-[0.88rem] text-white">
    {children}
  </motion.p>
);
const Bot = ({ children, d = 0.35 }: { children: ReactNode; d?: number }) => (
  <motion.div {...appear(d)} className="mt-3 max-w-[92%] rounded-2xl rounded-bl-md bg-white px-3.5 py-2.5 text-[0.88rem] shadow-sm">
    {children}
  </motion.div>
);

function Intent() {
  const chips = ["Use: running · 10K", "Feet: flat → stability", "Budget ≤ $120", "Arrive before Sat", "Size: UK 9 (from history)"];
  return (
    <>
      <You>Running shoes for flat feet, under $120, before Saturday please</You>
      <Bot>
        <p className="flex items-center gap-1.5 font-semibold">
          <Sparkles size={14} className="text-berry" /> Here&apos;s what I understood:
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {chips.map((c, i) => (
            <motion.span key={c} {...appear(0.6 + i * 0.15)} className="rounded-full bg-petal px-2.5 py-1 text-[0.75rem] font-semibold text-berry">
              {c}
            </motion.span>
          ))}
        </div>
      </Bot>
    </>
  );
}

function Tile({ name, price, note, icon, tone, best, d }: { name: string; price: string; note: string; icon: string; tone: string; best?: boolean; d: number }) {
  const Icon = ICONS[icon] ?? ICONS.bag!;
  return (
    <motion.div {...appear(d)} className={`flex items-center gap-3 rounded-2xl bg-white p-2 ${best ? "ring-2 ring-emerald" : "ring-1 ring-plum/5"}`}>
      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl text-white" style={{ background: tone }}>
        <Icon size={24} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[0.88rem] font-bold">{name}</p>
        <p className="text-[0.75rem] text-plum/55">{note}</p>
      </div>
      <p className="pr-1 font-bold">{price}</p>
    </motion.div>
  );
}

function Picks() {
  return (
    <>
      <Bot d={0}>Three that fit — the Stride Air is my top pick for flat feet.</Bot>
      <div className="mt-3 space-y-2">
        <Tile {...PRODUCTS[0]!} best d={0.3} />
        <Tile name="Cloudline 3" price="$104" note="Stable · 4.5★" icon="shoe" tone={TONES.sky} d={0.45} />
        <Tile name="Tempo Lite" price="$96" note="Light · 4.4★" icon="shoe" tone={TONES.mint} d={0.6} />
      </div>
      <motion.p {...appear(0.9)} className="mt-3 rounded-xl bg-emerald/10 px-3 py-2 text-[0.78rem] font-semibold text-emerald">
        Why: wide fit + firm arch · arrives Thu · 412 reviews mention “flat feet”
      </motion.p>
    </>
  );
}

function Compare() {
  const rows = [
    ["Price", "$112", "$104"],
    ["Arch support", "Firm", "Medium"],
    ["Weight", "260 g", "238 g"],
    ["Arrives", "Thu", "Fri"],
    ["Reviews say", "“Saved my knees”", "“Narrow toe”"],
  ];
  return (
    <>
      <You>Stride vs Cloudline?</You>
      <motion.div {...appear(0.3)} className="mt-3 overflow-hidden rounded-2xl bg-white text-[0.82rem]">
        <div className="grid grid-cols-3 bg-petal px-3 py-2 font-bold">
          <span />
          <span className="text-berry">Stride Air</span>
          <span>Cloudline 3</span>
        </div>
        {rows.map(([k, a, b], i) => (
          <motion.div key={k} {...appear(0.45 + i * 0.1)} className="grid grid-cols-3 border-t border-plum/5 px-3 py-2">
            <span className="text-plum/55">{k}</span>
            <span className="font-semibold">{a}</span>
            <span>{b}</span>
          </motion.div>
        ))}
      </motion.div>
      <Bot d={1.1}>For flat feet, Stride wins on support and arrives sooner.</Bot>
    </>
  );
}

function Size() {
  return (
    <>
      <You>What size?</You>
      <Bot>
        <p className="font-semibold">UK 9 · wide fit</p>
        <p className="mt-1 text-[0.8rem] text-plum/60">You wear UK 9 in two past runners; 31% of reviewers say this model is narrow.</p>
        <div className="mt-3 flex items-end gap-1.5">
          {["7", "8", "9", "10", "11"].map((s) => (
            <span key={s} className={`grid h-10 flex-1 place-items-center rounded-lg text-[0.85rem] font-bold ${s === "9" ? "bg-berry text-white" : "bg-petal text-plum/60"}`}>
              {s}
            </span>
          ))}
        </div>
        <p className="mt-3 text-[0.75rem] font-semibold text-plum/60">Confidence</p>
        <div className="mt-1 h-2 overflow-hidden rounded-full bg-petal">
          <motion.div className="h-full rounded-full bg-emerald" initial={{ width: 0 }} animate={{ width: "86%" }} transition={{ duration: 1.1, delay: 0.7, ease }} />
        </div>
        <p className="mt-1 text-right text-[0.75rem] font-bold text-emerald">86%</p>
      </Bot>
    </>
  );
}

function Pay() {
  const [done, setDone] = useState(false);
  return (
    <>
      <Bot d={0}>Cart ready — coupon applied. Nothing is charged until you confirm.</Bot>
      <motion.div {...appear(0.3)} className="mt-3 rounded-2xl bg-white p-3 text-[0.85rem]">
        {[
          ["Stride Air · UK 9 wide", "$112.00"],
          ["Coupon RUN10", "−$11.20"],
          ["Delivery · Thu", "Free"],
        ].map(([a, b]) => (
          <p key={a} className="flex justify-between py-1">
            <span className="text-plum/65">{a}</span>
            <span className="font-semibold">{b}</span>
          </p>
        ))}
        <p className="mt-1 flex justify-between border-t border-plum/10 pt-2 font-bold">
          <span>Total</span>
          <span>$100.80</span>
        </p>
      </motion.div>
      <motion.button
        {...appear(0.6)}
        onClick={() => setDone(true)}
        className={`mt-3 flex min-h-[48px] w-full cursor-pointer items-center justify-center gap-2 rounded-2xl font-bold text-white ${done ? "bg-emerald" : "bg-berry"}`}
      >
        {done ? <Check size={18} /> : <ShieldCheck size={18} />} {done ? "Paid · order AS-5521" : "Confirm & pay $100.80"}
      </motion.button>
      <motion.p {...appear(0.8)} className="mt-2 text-center text-[0.72rem] text-plum/50">
        The agent can&apos;t pay on its own. Only you can.
      </motion.p>
    </>
  );
}

function Care() {
  const steps = ["Ordered", "Packed", "Shipped", "Out for delivery", "Delivered"];
  return (
    <>
      <You>Where&apos;s my order?</You>
      <Bot>
        <p className="flex items-center gap-1.5 font-semibold">
          <Truck size={15} className="text-berry" /> Out for delivery · 2–4 pm today
        </p>
        <div className="mt-3 space-y-1.5">
          {steps.map((s, i) => (
            <motion.p key={s} {...appear(0.5 + i * 0.12)} className="flex items-center gap-2 text-[0.82rem]">
              <span className={`grid h-4 w-4 place-items-center rounded-full ${i < 4 ? "bg-emerald text-white" : "ring-1 ring-plum/25"}`}>{i < 4 && <Check size={10} />}</span>
              <span className={i < 4 ? "" : "text-plum/45"}>{s}</span>
            </motion.p>
          ))}
        </div>
      </Bot>
      <motion.div {...appear(1.3)}>
        <You>And swap my overshirt for an L</You>
      </motion.div>
      <Bot d={1.6}>Done — free pickup tomorrow 10–12, label sent to WhatsApp.</Bot>
    </>
  );
}
