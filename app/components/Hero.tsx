"use client";

// Hero: the agent orb with the catalogue orbiting it on a tilted ring. Scrolling (pinned on
// desktop) makes the orb pull three picks out of the ring into "Aisle's picks"; the rest fade.
// On phones the gather/scatter loops on its own.
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUp } from "lucide-react";
import { PRODUCTS, SITE } from "../data/site";
import { ICONS, openAssistant } from "./assistant/Assistant";
import Orb from "./Orb";
import { Wrap, ease } from "./kit";

const PICKS = ["p1", "p3", "p2"];
const PROMPTS = ["Running gear for my first 10K, under $350", "A gift for my sister, around $50", "Noise-cancelling headphones for flights", "Swap my overshirt for a size up"];

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export default function Hero() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const energy = useTransform(scrollYProgress, [0.2, 0.55, 1], [0, 1, 0.3]);
  const picksLabel = useTransform(scrollYProgress, [0.55, 0.75], [0, 1]);

  useEffect(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const start = performance.now();
    const loop = () => {
      frame = requestAnimationFrame(loop);
      const box = stage.current;
      if (!box) return;
      const t = still ? 0 : (performance.now() - start) / 1000;
      const W = box.clientWidth, H = box.clientHeight;
      const wide = window.innerWidth >= 1024;
      // How far the picks have been pulled: from scroll on desktop, a slow loop on phones.
      const k = still ? 0 : wide ? smooth(0.25, 0.7, scrollYProgress.get()) : smooth(0.2, 0.8, 0.5 - 0.5 * Math.cos(t * 0.45));
      const rx = W * 0.44, ry = H * 0.17;
      PRODUCTS.forEach((p, i) => {
        const el = cards.current[i];
        if (!el) return;
        const a = t * 0.32 + (i / PRODUCTS.length) * Math.PI * 2;
        const depth = Math.sin(a); // -1 back … 1 front
        let x = Math.cos(a) * rx, y = depth * ry - H * 0.02;
        let s = 0.72 + (depth + 1) * 0.18;
        let o = 0.55 + (depth + 1) * 0.225;
        let z = depth > 0 ? 20 : 5;
        const isPick = PICKS.includes(p.id);
        if (isPick) {
          const slot = PICKS.indexOf(p.id) - 1; // -1, 0, 1
          const tx = slot * Math.min(W * 0.3, 190), ty = H * 0.36;
          x += (tx - x) * k;
          y += (ty - y) * k;
          s += (1.02 - s) * k;
          o += (1 - o) * k;
          if (k > 0.5) z = 30;
        } else {
          o *= 1 - k * 0.85;
          s *= 1 - k * 0.25;
        }
        el.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${s.toFixed(3)})`;
        el.style.opacity = o.toFixed(3);
        el.style.zIndex = String(z);
        el.style.filter = !isPick || k < 0.5 ? `blur(${Math.max(0, -depth * 1.6).toFixed(1)}px)` : "none";
      });
    };
    loop();
    return () => cancelAnimationFrame(frame);
  }, [scrollYProgress]);

  // Typewriter prompt
  const [pi, setPi] = useState(0);
  const [typed, setTyped] = useState("");
  useEffect(() => {
    const full = PROMPTS[pi]!;
    let n = 0;
    const id = setInterval(() => {
      n++;
      setTyped(full.slice(0, n));
      if (n >= full.length) {
        clearInterval(id);
        setTimeout(() => setPi((v) => (v + 1) % PROMPTS.length), 2200);
      }
    }, 38);
    return () => clearInterval(id);
  }, [pi]);

  const rise = (d: number) => ({ initial: { opacity: 0, y: 22 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, delay: d, ease } });

  return (
    <section ref={section} id="top" className="relative lg:h-[230vh]">
      <div className="relative overflow-hidden lg:sticky lg:top-0 lg:h-screen">
        <div className="pointer-events-none absolute -left-40 top-10 h-[34rem] w-[34rem] rounded-full bg-[#f9a8d4]/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-[30rem] w-[30rem] rounded-full bg-[#c4b5fd]/35 blur-3xl" />
        <Wrap className="relative grid min-h-[100svh] items-center gap-4 pt-24 lg:h-full lg:grid-cols-[0.95fr_1.15fr] lg:pt-16">
          <div className="relative z-40">
            <motion.p {...rise(0.05)} className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-[0.8rem] font-semibold text-berry ring-1 ring-berry/15">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald" /> {SITE.tagline}
            </motion.p>
            <motion.h1 {...rise(0.15)} className="mt-5 font-display text-[clamp(2.6rem,5.4vw,5rem)] font-bold leading-[0.98]">
              Don&apos;t search. <span className="text-berry">Just ask.</span>
            </motion.h1>
            <motion.p {...rise(0.3)} className="mt-5 max-w-[30rem] text-[1.08rem] leading-relaxed text-plum/70">
              Aisle is a shop with an AI agent at the counter. Say what you need — it finds three great picks, compares them, gets your size right and fills the cart. You press pay.
            </motion.p>
            <motion.button
              {...rise(0.45)}
              onClick={() => openAssistant("chat", PROMPTS[pi])}
              className="glass mt-8 flex w-full max-w-[30rem] cursor-pointer items-center gap-3 rounded-2xl p-2 pl-5 text-left"
            >
              <span className="min-h-[1.5rem] flex-1 text-[1rem] text-plum/80">
                {typed}
                <span className="ml-0.5 inline-block h-5 w-[2px] translate-y-1 animate-pulse bg-berry" />
              </span>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-berry text-white">
                <ArrowUp size={20} />
              </span>
            </motion.button>
            <motion.div {...rise(0.55)} className="mt-4 flex flex-wrap gap-2 text-[0.85rem]">
              <button onClick={() => openAssistant("voice")} className="min-h-[40px] cursor-pointer rounded-full bg-plum px-4 font-semibold text-white">
                Talk to Aisle
              </button>
              <button onClick={() => openAssistant("chat", "Where is my order?")} className="min-h-[40px] cursor-pointer rounded-full bg-white/70 px-4 font-semibold ring-1 ring-plum/10">
                Where&apos;s my order?
              </button>
            </motion.div>
          </div>

          <motion.div ref={stage} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.3, delay: 0.2, ease }} className="relative h-[460px] sm:h-[540px] lg:h-[82vh]">
            <Orb energy={energy} className="absolute left-1/2 top-[42%] z-10 h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2" />
            {PRODUCTS.map((p, i) => {
              const Icon = ICONS[p.icon] ?? ICONS.bag!;
              return (
                <div
                  key={p.id}
                  ref={(el) => {
                    cards.current[i] = el;
                  }}
                  className="glass absolute left-1/2 top-[42%] w-[104px] rounded-2xl p-1.5 will-change-transform sm:w-[132px]"
                >
                  <div className="grid h-[72px] place-items-center rounded-xl text-white sm:h-[92px]" style={{ background: p.tone }}>
                    <Icon size={30} strokeWidth={1.6} />
                  </div>
                  <p className="mt-1.5 truncate px-1 text-[0.72rem] font-bold sm:text-[0.8rem]">{p.name}</p>
                  <p className="px-1 pb-0.5 text-[0.7rem] text-plum/60 sm:text-[0.76rem]">{p.price}</p>
                </div>
              );
            })}
            <motion.p style={{ opacity: picksLabel }} className="absolute left-1/2 top-[64%] z-30 -translate-x-1/2 whitespace-nowrap rounded-full bg-emerald px-3 py-1 text-[0.78rem] font-bold text-white max-lg:hidden">
              ✓ Aisle&apos;s 3 picks for your first 10K
            </motion.p>
          </motion.div>
        </Wrap>
      </div>
    </section>
  );
}
