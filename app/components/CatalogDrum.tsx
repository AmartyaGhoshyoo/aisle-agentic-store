"use client";

// The whole store as a slowly turning 3D drum of product tiles (CSS 3D, one transform per frame).
// When the agent searches, a light scan sweeps the drum, everything that doesn't match dims, and
// the matching tiles lift out and glow.
import { useEffect, useMemo, useRef } from "react";
import { CATEGORIES } from "../data/site";
import { CAT_ICONS } from "./catIcons";

const COLS = 26, ROWS = 3, TILE = 118, GAP = 12;
const RADIUS = Math.round((COLS * (TILE + GAP)) / (2 * Math.PI));

export type DrumPhase = "idle" | "scan" | "match";

export default function CatalogDrum({ phase, cat }: { phase: DrumPhase; cat: string | null }) {
  const drum = useRef<HTMLDivElement>(null);
  const speed = useRef(1);
  useEffect(() => {
    // Slow down while the agent shows matches so they can be read.
    speed.current = phase === "match" ? 0.25 : phase === "scan" ? 2.4 : 1;
  }, [phase]);

  useEffect(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let a = 0, frame = 0, last = performance.now();
    const loop = () => {
      frame = requestAnimationFrame(loop);
      const now = performance.now();
      if (!still) a += ((now - last) / 1000) * 5 * speed.current;
      last = now;
      // Phones get a smaller drum so a few columns still fit across the screen.
      const sc = window.innerWidth < 768 ? 0.62 : 1;
      if (drum.current) drum.current.style.transform = `scale(${sc}) translateZ(-${RADIUS}px) rotateX(-9deg) rotateY(${a.toFixed(2)}deg)`;
    };
    loop();
    return () => cancelAnimationFrame(frame);
  }, []);

  // Fill the drum: categories round-robin so every category appears several times.
  const tiles = useMemo(
    () =>
      Array.from({ length: COLS * ROWS }, (_, n) => {
        const c = CATEGORIES[(n * 7) % CATEGORIES.length]!;
        const item = c.items[n % c.items.length]!;
        return { c, name: item[0], price: item[1], col: n % COLS, row: Math.floor(n / COLS) };
      }),
    [],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden [perspective:1300px] [mask-image:linear-gradient(90deg,transparent,#000_14%,#000_86%,transparent)]">
      <div ref={drum} className="absolute left-1/2 top-1/2 [transform-style:preserve-3d]" style={{ width: 0, height: 0 }}>
        {tiles.map((t, i) => {
          const Icon = CAT_ICONS[t.c.icon] ?? CAT_ICONS.smartphone!;
          const hit = cat !== null && t.c.key === cat;
          const dim = phase === "match" && cat !== null && !hit;
          const lift = phase === "match" && hit ? 70 : 0;
          return (
            <div
              key={i}
              className="absolute [backface-visibility:hidden]"
              style={{
                width: TILE,
                height: TILE * 1.22,
                left: -TILE / 2,
                top: (t.row - ROWS / 2) * (TILE * 1.22 + GAP),
                transform: `rotateY(${(t.col * 360) / COLS}deg) translateZ(${RADIUS + lift}px)`,
                transition: "transform .7s cubic-bezier(.22,1,.36,1), opacity .5s, filter .5s",
                opacity: dim ? 0.12 : 1,
                filter: dim ? "grayscale(1)" : "none",
              }}
            >
              <div className={`h-full rounded-2xl bg-white p-2 shadow-[0_18px_40px_-22px_rgba(91,18,56,0.45)] ${hit && phase === "match" ? "ring-[3px] ring-berry shadow-[0_0_40px_-4px_rgba(190,24,93,0.7)]" : "ring-1 ring-plum/5"}`}>
                <div className="grid h-[58%] place-items-center rounded-xl text-white" style={{ background: t.c.tone }}>
                  <Icon size={34} strokeWidth={1.5} />
                </div>
                <p className="mt-1.5 truncate text-[0.75rem] font-medium text-plum">{t.name}</p>
                <p className="flex items-center justify-between text-[0.72rem] text-plum/55">
                  <span>{t.price}</span>
                  <span className="text-emerald">★ 4.{(i * 3) % 9}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
      {phase === "scan" && <div className="absolute inset-y-0 w-[22%] animate-[sweep_1.2s_ease-in-out] bg-gradient-to-r from-transparent via-berry/25 to-transparent" />}
    </div>
  );
}
