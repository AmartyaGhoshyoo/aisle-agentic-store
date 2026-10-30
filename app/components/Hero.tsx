"use client";

// Marketplace hero: the whole catalogue turns on a 3D drum behind one big question box.
// The agent "asks" a demo question, scans the drum, lights up the matching category and slides
// up its three picks. Visitors can pick a question or type their own (opens the assistant).
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUp, Check, Mic, Plus } from "lucide-react";
import { CATEGORIES, SEARCHES } from "../data/site";
import { openAssistant } from "./assistant/Assistant";
import CatalogDrum, { type DrumPhase } from "./CatalogDrum";
import { CAT_ICONS } from "./catIcons";
import { Wrap, ease } from "./kit";

export default function Hero() {
  const [si, setSi] = useState(0);
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<DrumPhase>("idle");
  const [paused, setPaused] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const s = SEARCHES[si]!;
  const cat = CATEGORIES.find((c) => c.key === s.cat)!;
  const Icon = CAT_ICONS[cat.icon] ?? CAT_ICONS.smartphone!;

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  // One demo search: type → scan → match (hold) → next.
  const run = useCallback((i: number) => {
    clear();
    const q = SEARCHES[i]!.q;
    setSi(i);
    setPhase("idle");
    setTyped("");
    const at = (ms: number, fn: () => void) => timers.current.push(setTimeout(fn, ms));
    for (let n = 1; n <= q.length; n++) at(n * 34, () => setTyped(q.slice(0, n)));
    const typedAt = q.length * 34 + 250;
    at(typedAt, () => setPhase("scan"));
    at(typedAt + 1200, () => setPhase("match"));
  }, []);

  useEffect(() => {
    const start = setTimeout(() => run(0), 400);
    return () => {
      clearTimeout(start);
      clear();
    };
  }, [run]);

  // Auto-advance unless the visitor is looking at the results.
  useEffect(() => {
    if (phase !== "match" || paused) return;
    const id = setTimeout(() => run((si + 1) % SEARCHES.length), 5200);
    return () => clearTimeout(id);
  }, [phase, paused, si, run]);

  const rise = (d: number) => ({ initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1, delay: d, ease } });

  return (
    <section id="shop" className="relative min-h-[100svh] overflow-hidden pb-10 pt-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[70vh] bg-[radial-gradient(60%_60%_at_50%_25%,#fbcfe8_0%,transparent_70%)]" />
      <Wrap className="relative z-20 text-center">
        <motion.p {...rise(0.05)} className="text-[0.78rem] font-medium uppercase tracking-[0.35em] text-berry">
          The store that shops with you
        </motion.p>
        <motion.h1 {...rise(0.15)} className="mt-3 font-display text-[clamp(2.5rem,6vw,5.2rem)] leading-[0.95] tracking-[-0.02em]">
          12 million products. <em className="text-berry">One question.</em>
        </motion.h1>
      </Wrap>

      {/* The drum sits behind the search box */}
      <motion.div {...rise(0.3)} className="relative mt-2 h-[min(50vh,500px)] min-h-[380px]">
        <CatalogDrum phase={phase} cat={phase === "idle" ? null : s.cat} />
        <div className="absolute inset-x-0 top-1/2 z-20 -translate-y-1/2 px-4">
          <div className="mx-auto max-w-[44rem]" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
            <div className="flex w-full items-center gap-2 rounded-full border border-white bg-white/90 p-2.5 pl-6 shadow-[0_30px_80px_-30px_rgba(91,18,56,0.6)] backdrop-blur-xl">
              <button onClick={() => openAssistant("chat", s.q)} className="min-h-[1.6rem] flex-1 cursor-pointer truncate text-left text-[1.05rem] text-plum sm:text-[1.15rem]">
                {typed}
                <span className="ml-0.5 inline-block h-5 w-[2px] translate-y-1 animate-pulse bg-berry" />
              </button>
              <button onClick={() => openAssistant("voice")} className="hidden h-12 w-12 shrink-0 cursor-pointer place-items-center rounded-full text-plum/60 hover:bg-petal sm:grid" aria-label="Ask by voice">
                <Mic size={20} />
              </button>
              <button onClick={() => openAssistant("chat", s.q)} className="grid h-12 w-12 shrink-0 cursor-pointer place-items-center rounded-full bg-berry text-white" aria-label="Ask Aisle">
                <ArrowUp size={20} />
              </button>
            </div>
            <div className="mt-3 flex min-h-[1.5rem] items-center justify-center gap-2 text-[0.85rem] text-plum/70">
              <AnimatePresence mode="wait">
                {phase === "scan" && (
                  <motion.span key="scan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-1">
                    <span className="h-2 w-2 animate-ping rounded-full bg-berry" /> Reading {s.scanned}, reviews and delivery dates…
                  </motion.span>
                )}
                {phase === "match" && (
                  <motion.span key="match" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-1">
                    <Check size={15} className="text-emerald" /> Checked {s.scanned} — here are the 3 that fit
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>

      {/* The agent's three picks */}
      <Wrap className="relative z-20 -mt-6">
        <div className="mx-auto grid min-h-[9.5rem] max-w-[60rem] gap-3 sm:grid-cols-3" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <AnimatePresence mode="popLayout">
            {phase === "match" &&
              s.picks.map((p, i) => (
                <motion.div
                  key={`${si}-${p.name}`}
                  initial={{ opacity: 0, y: 40, rotateX: -25 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  exit={{ opacity: 0, y: -20, transition: { duration: 0.25 } }}
                  transition={{ duration: 0.6, delay: i * 0.12, ease }}
                  style={{ transformPerspective: 900 }}
                  className="flex items-center gap-3 rounded-3xl bg-white p-3 shadow-[0_24px_60px_-30px_rgba(91,18,56,0.55)] ring-1 ring-plum/5"
                >
                  <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-white" style={{ background: cat.tone }}>
                    <Icon size={28} strokeWidth={1.5} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-baseline justify-between gap-2">
                      <span className="truncate font-medium">{p.name}</span>
                      <span className="font-display text-[1.15rem] text-berry">{p.price}</span>
                    </p>
                    <p className="text-[0.8rem] leading-snug text-plum/60">{p.why}</p>
                  </div>
                  <button onClick={() => openAssistant("chat", `Add the ${p.name} to my cart`)} aria-label={`Add ${p.name}`} className="grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-full bg-plum text-white">
                    <Plus size={18} />
                  </button>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {SEARCHES.map((q, i) => (
            <button
              key={q.q}
              onClick={() => run(i)}
              className={`min-h-[40px] cursor-pointer rounded-full px-4 text-[0.88rem] transition-colors ${i === si ? "bg-plum text-white" : "border border-plum/15 bg-white/60 hover:bg-white"}`}
            >
              {q.q}
            </button>
          ))}
        </div>
      </Wrap>
    </section>
  );
}
