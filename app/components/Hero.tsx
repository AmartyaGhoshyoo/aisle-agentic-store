"use client";

// Hero: an editorial headline over a 3D turntable of products. The product facing you is
// named below with the agent's one-line reason; the prompt bar opens the assistant.
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUp, MoveHorizontal } from "lucide-react";
import { AISLES, SHOWCASE, SITE, byId } from "../data/site";
import { openAssistant } from "./assistant/Assistant";
import Showcase from "./three/Showcase";
import { Wrap, ease } from "./kit";

const PROMPTS = ["Running shoes for flat feet, under $120", "A gift for my sister, around $80", "A cabin case that fits my laptop", "Swap my overshirt for a size up"];

export default function Hero() {
  const [front, setFront] = useState(0);
  const p = byId(SHOWCASE[front]!);
  const why = AISLES.find((a) => a.id === p.id)?.why;

  const [pi, setPi] = useState(0);
  const [typed, setTyped] = useState("");
  useEffect(() => {
    const full = PROMPTS[pi]!;
    let n = 0;
    let next: ReturnType<typeof setTimeout>;
    const id = setInterval(() => {
      n++;
      setTyped(full.slice(0, n));
      if (n >= full.length) {
        clearInterval(id);
        next = setTimeout(() => setPi((v) => (v + 1) % PROMPTS.length), 2200);
      }
    }, 38);
    return () => {
      clearInterval(id);
      clearTimeout(next);
    };
  }, [pi]);

  const rise = (d: number) => ({ initial: { opacity: 0, y: 26 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1, delay: d, ease } });

  return (
    <section id="shop" className="relative overflow-hidden pt-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[80vh] bg-[radial-gradient(60%_60%_at_50%_30%,#fbcfe8_0%,transparent_70%)]" />
      <Wrap className="relative text-center">
        <motion.p {...rise(0.05)} className="text-[0.78rem] font-medium uppercase tracking-[0.35em] text-berry">
          {SITE.tagline}
        </motion.p>
        <motion.h1 {...rise(0.15)} className="mt-4 font-display text-[clamp(3.2rem,9vw,8.6rem)] leading-[0.9] tracking-[-0.02em]">
          Don&apos;t search. <em className="text-berry">Just ask.</em>
        </motion.h1>
      </Wrap>

      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.4, delay: 0.25, ease }} className="relative mx-auto -mt-[4vh] h-[46vh] min-h-[340px] max-w-[1300px] md:h-[68vh]">
        <Showcase onFront={setFront} className="absolute inset-0" />
        <p className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 text-[0.78rem] text-plum/50">
          <MoveHorizontal size={14} /> drag to spin
        </p>
      </motion.div>

      <Wrap className="relative grid gap-5 pb-16 md:grid-cols-[1fr_1fr] md:items-end">
        <div className="min-h-[8.5rem]">
          <AnimatePresence mode="wait">
            <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }}>
              <p className="text-[0.75rem] font-medium uppercase tracking-[0.3em] text-plum/50">Now facing you</p>
              <p className="mt-1 font-display text-[2rem] italic leading-tight">
                {p.name} <span className="not-italic text-berry">{p.price}</span>
              </p>
              <p className="mt-1 max-w-[30rem] text-plum/65">
                <span className="font-semibold text-emerald">Aisle says: </span>
                {why}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="md:justify-self-end">
          <button onClick={() => openAssistant("chat", PROMPTS[pi])} className="flex w-full cursor-pointer items-center gap-3 rounded-full border border-plum/15 bg-white/80 p-2 pl-6 text-left shadow-[0_20px_50px_-25px_rgba(91,18,56,0.5)] backdrop-blur md:w-[30rem]">
            <span className="min-h-[1.5rem] flex-1 truncate text-[1rem] text-plum/80">
              {typed}
              <span className="ml-0.5 inline-block h-5 w-[2px] translate-y-1 animate-pulse bg-berry" />
            </span>
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-berry text-white">
              <ArrowUp size={20} />
            </span>
          </button>
          <div className="mt-3 flex flex-wrap gap-2 md:justify-end">
            <button onClick={() => openAssistant("voice")} className="min-h-[42px] cursor-pointer rounded-full bg-plum px-5 text-[0.9rem] font-medium text-white">
              Talk to Aisle
            </button>
            <button onClick={() => openAssistant("chat", `Tell me about the ${p.name}`)} className="min-h-[42px] cursor-pointer rounded-full border border-plum/15 px-5 text-[0.9rem] font-medium">
              Ask about this
            </button>
          </div>
        </div>
      </Wrap>
    </section>
  );
}
