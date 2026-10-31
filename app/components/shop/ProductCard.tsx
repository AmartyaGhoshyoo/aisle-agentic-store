"use client";

// Product photo, rating chip and the compact shelf card.
import { useState } from "react";
import { Plus, Star, Truck } from "lucide-react";
import { money, off, type Item } from "../../data/shop";
import { useShop } from "./store";

export function Thumb({ it, className = "" }: { it: Item; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={it.img} alt={it.name} loading="lazy" draggable={false} className={`h-full w-full object-cover ${className}`} />;
}

export function Stars({ r, n }: { r: number; n: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-[0.78rem] text-plum/55">
      <span className="inline-flex items-center gap-0.5 rounded bg-emerald px-1.5 py-px font-semibold text-white">
        {r.toFixed(1)} <Star size={10} fill="currentColor" />
      </span>
      ({n.toLocaleString("en-US")})
    </span>
  );
}

export default function ProductCard({ it }: { it: Item }) {
  const { add, view } = useShop();
  const [added, setAdded] = useState(false);
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/70 bg-white/70 shadow-[0_18px_40px_-28px_rgba(42,15,31,0.45)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_-30px_rgba(42,15,31,0.55)]">
      <button onClick={() => view(it.id)} className="relative aspect-square cursor-pointer overflow-hidden bg-petal" aria-label={`View ${it.name}`}>
        <Thumb it={it} className="transition-transform duration-700 group-hover:scale-[1.05]" />
        <span className="absolute left-2.5 top-2.5 rounded-full bg-white/90 px-2 py-0.5 text-[0.7rem] font-semibold text-berry backdrop-blur">−{off(it)}%</span>
      </button>
      <div className="flex flex-1 flex-col p-3.5">
        <p className="text-[0.68rem] uppercase tracking-[0.14em] text-plum/45">{it.brand}</p>
        <button onClick={() => view(it.id)} className="mt-0.5 line-clamp-2 cursor-pointer text-left text-[0.92rem] font-medium leading-snug hover:text-berry">
          {it.name}
        </button>
        <div className="mt-1.5">
          <Stars r={it.rating} n={it.reviews} />
        </div>
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div>
            <p className="text-[1.08rem] font-semibold leading-none">{money(it.price)}</p>
            <p className="mt-1 text-[0.75rem] text-plum/40 line-through">{money(it.mrp)}</p>
          </div>
          <button
            onClick={() => {
              add(it.id);
              setAdded(true);
              setTimeout(() => setAdded(false), 1200);
            }}
            aria-label={`Add ${it.name} to cart`}
            className={`flex h-9 cursor-pointer items-center gap-1 rounded-full px-3 text-[0.8rem] font-medium text-white transition-colors ${added ? "bg-emerald" : "bg-plum hover:bg-berry"}`}
          >
            <Plus size={14} /> {added ? "Added" : "Add"}
          </button>
        </div>
        {it.fast && (
          <p className="mt-2 inline-flex items-center gap-1 text-[0.72rem] text-emerald">
            <Truck size={12} /> Arrives tomorrow
          </p>
        )}
      </div>
    </article>
  );
}
