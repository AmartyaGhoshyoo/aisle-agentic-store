"use client";

// A product photo (or, for model-only products, a studio render of the 3D model), and the
// shelf card that tilts in 3D under the cursor.
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { Box, Plus, Star, Truck } from "lucide-react";
import { money, off, type Item } from "../../data/shop";
import { productShots, type ModelId } from "../three/products";
import { useShop } from "./store";

let cachedShots: Record<ModelId, string> | null = null;
export function useShots() {
  const [shots, setShots] = useState<Record<string, string>>(cachedShots ?? {});
  useEffect(() => {
    if (cachedShots) return;
    let live = true;
    productShots().then((s) => {
      cachedShots = s;
      if (live) setShots(s);
    });
    return () => {
      live = false;
    };
  }, []);
  return shots;
}

export function Thumb({ it, className = "", sizes = "300px" }: { it: Item; className?: string; sizes?: string }) {
  const shots = useShots();
  if (it.img)
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={it.img} alt={it.name} sizes={sizes} loading="lazy" draggable={false} className={`h-full w-full object-cover ${className}`} />;
  const src = it.model ? shots[it.model] : undefined;
  return (
    <div className={`flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_50%_40%,#fff,#fce7f3_70%)] ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {src ? <img src={src} alt={it.name} draggable={false} className="h-[86%] w-[86%] object-contain" /> : <div className="h-1/2 w-1/2 animate-pulse rounded-full bg-petal" />}
    </div>
  );
}

export function Stars({ r, n }: { r: number; n: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-[0.8rem] text-plum/60">
      <span className="inline-flex items-center gap-0.5 rounded bg-emerald px-1.5 py-px font-semibold text-white">
        {r.toFixed(1)} <Star size={11} fill="currentColor" />
      </span>
      ({n.toLocaleString("en-US")})
    </span>
  );
}

export default function ProductCard({ it }: { it: Item }) {
  const { add, view } = useShop();
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5), my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [7, -7]), { stiffness: 220, damping: 20 });
  const ry = useSpring(useTransform(mx, [0, 1], [-9, 9]), { stiffness: 220, damping: 20 });
  const shine = useTransform([mx, my] as never, ([x, y]: number[]) => `radial-gradient(circle at ${x! * 100}% ${y! * 100}%, rgba(255,255,255,0.45), transparent 55%)`);
  const [added, setAdded] = useState(false);

  return (
    <div style={{ perspective: 900 }}>
      <motion.article
        ref={ref}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse") return;
          const r = ref.current!.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width);
          my.set((e.clientY - r.top) / r.height);
        }}
        onPointerLeave={() => (mx.set(0.5), my.set(0.5))}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-plum/[0.08] transition-shadow hover:shadow-[0_30px_60px_-30px_rgba(124,22,72,0.45)]"
      >
        <button onClick={() => view(it.id)} className="relative aspect-square cursor-pointer overflow-hidden bg-petal" aria-label={`View ${it.name}`}>
          <div className="h-full w-full transition-transform duration-700 group-hover:scale-[1.06]">
            <Thumb it={it} />
          </div>
          <motion.div style={{ background: shine }} className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100" />
          <span className="absolute left-2.5 top-2.5 rounded-full bg-berry px-2 py-0.5 text-[0.72rem] font-semibold text-white">−{off(it)}%</span>
          {it.model && (
            <span style={{ transform: "translateZ(30px)" }} className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-plum/85 px-2 py-0.5 text-[0.72rem] font-medium text-white backdrop-blur">
              <Box size={12} /> 3D
            </span>
          )}
        </button>
        <div className="flex flex-1 flex-col p-3.5" style={{ transform: "translateZ(18px)" }}>
          <p className="text-[0.72rem] uppercase tracking-[0.14em] text-plum/45">{it.brand}</p>
          <button onClick={() => view(it.id)} className="mt-0.5 cursor-pointer text-left text-[0.95rem] font-medium leading-snug hover:text-berry">
            {it.name}
          </button>
          <div className="mt-1.5">
            <Stars r={it.rating} n={it.reviews} />
          </div>
          <p className="mt-1 text-[0.8rem] text-plum/55">{it.note}</p>
          <div className="mt-auto flex items-end justify-between gap-2 pt-3">
            <div>
              <p className="text-[1.15rem] font-semibold leading-none">{money(it.price)}</p>
              <p className="mt-1 text-[0.78rem] text-plum/45 line-through">{money(it.mrp)}</p>
            </div>
            <button
              onClick={() => {
                add(it.id);
                setAdded(true);
                setTimeout(() => setAdded(false), 1200);
              }}
              aria-label={`Add ${it.name} to cart`}
              className={`flex h-10 cursor-pointer items-center gap-1 rounded-full px-3.5 text-[0.85rem] font-medium text-white transition-colors ${added ? "bg-emerald" : "bg-plum hover:bg-berry"}`}
            >
              <Plus size={15} /> {added ? "Added" : "Add"}
            </button>
          </div>
          {it.fast && (
            <p className="mt-2 inline-flex items-center gap-1 text-[0.75rem] text-emerald">
              <Truck size={13} /> Arrives tomorrow
            </p>
          )}
        </div>
      </motion.article>
    </div>
  );
}
