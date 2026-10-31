"use client";

// The storefront: 3D showroom hero, promo banners, departments, today's deals and the full
// catalogue with filters and sorting.
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowRight, Box, ChevronLeft, ChevronRight, SlidersHorizontal, Sparkles, Timer, X } from "lucide-react";
import { DEALS, DEPTS, ITEMS, money, off, type DeptKey } from "../../data/shop";
import { openAssistant } from "../assistant/Assistant";
import { CAT_ICONS } from "../catIcons";
import { Rise, Wrap, ease } from "../kit";
import type { ModelId } from "../three/products";
import ProductCard, { Thumb } from "./ProductCard";
import Showroom from "./Showroom";
import { goToShop, useShop } from "./store";

const ASKS = ["Running shoes for flat feet under $120", "A quiet laptop for college", "Gift for him under $200", "Skincare for oily skin"];

// ── Hero ────────────────────────────────────────────────────────────────────
export function Hero() {
  const { add, view } = useShop();
  const [front, setFront] = useState<ModelId>("p1");
  const it = ITEMS.find((i) => i.model === front)!;
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[44rem] w-[44rem] rounded-full bg-[#f9a8d4]/40 blur-3xl" />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-[30rem] w-[30rem] rounded-full bg-lilac/15 blur-3xl" />
      <Wrap className="relative grid items-center gap-4 pb-8 pt-8 lg:min-h-[calc(100svh-150px)] lg:grid-cols-[0.9fr_1.1fr] lg:pt-4">
        <div className="relative z-10">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[0.8rem] text-plum/70 ring-1 ring-plum/10">
            <span className="h-2 w-2 rounded-full bg-emerald" /> 2.4M products · 10 departments · delivery tomorrow
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.05 }} className="mt-5 font-display text-[clamp(2.8rem,6.2vw,5.6rem)] leading-[0.92]">
            The whole store, <em className="text-berry">found by asking.</em>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.15 }} className="mt-5 max-w-[32rem] text-[1.08rem] text-plum/70">
            Browse every department like any great shop — or say what you need in one sentence. Aisle finds it, compares it, sizes it and fills your cart. You press pay.
          </motion.p>
          <div className="mt-6 flex flex-wrap gap-2">
            {ASKS.map((a) => (
              <button key={a} onClick={() => openAssistant("chat", a)} className="inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-full bg-white px-3.5 text-[0.85rem] ring-1 ring-plum/10 hover:ring-berry">
                <Sparkles size={13} className="text-berry" /> {a}
              </button>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={goToShop} className="inline-flex min-h-[52px] cursor-pointer items-center gap-2 rounded-full bg-plum px-7 font-medium text-white hover:bg-berry">
              Shop all departments <ArrowRight size={17} />
            </button>
            <a href="#deals" className="inline-flex min-h-[52px] items-center rounded-full px-6 font-medium ring-1 ring-plum/20 hover:bg-white">
              Today&apos;s deals
            </a>
          </div>
        </div>
        <div className="relative h-[52svh] min-h-[360px] lg:h-[72svh]">
          <Showroom onFront={setFront} onOpen={(id) => view(ITEMS.find((i) => i.model === id)!.id)} className="absolute inset-0" />
            <motion.div
              key={it.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease }}
              className="glass absolute bottom-3 left-1/2 flex w-[min(25rem,92%)] -translate-x-1/2 items-center gap-3 rounded-2xl p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 text-[0.72rem] uppercase tracking-[0.16em] text-berry">
                  <Box size={12} /> In 3D · {it.brand}
                </p>
                <p className="truncate font-display text-[1.25rem]">{it.name}</p>
                <p className="text-[0.88rem]">
                  <b>{money(it.price)}</b> <span className="text-plum/45 line-through">{money(it.mrp)}</span>
                </p>
              </div>
              <button onClick={() => view(it.id)} className="min-h-[42px] cursor-pointer rounded-full px-3.5 text-[0.85rem] ring-1 ring-plum/20 hover:bg-white">
                View
              </button>
              <button onClick={() => add(it.id)} className="min-h-[42px] cursor-pointer rounded-full bg-plum px-4 text-[0.85rem] font-medium text-white hover:bg-berry">
                Add
              </button>
            </motion.div>
        </div>
      </Wrap>
    </section>
  );
}

// ── Promo banners: real photos with scroll parallax ─────────────────────────
function Banner({ src, kicker, title, cta, onClick, className = "", tall = false }: { src: string; kicker: string; title: string; cta: string; onClick(): void; className?: string; tall?: boolean }) {
  const ref = useRef<HTMLButtonElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  return (
    <button ref={ref} onClick={onClick} className={`group relative cursor-pointer overflow-hidden rounded-3xl text-left text-white ${tall ? "min-h-[420px]" : "min-h-[200px]"} ${className}`}>
      <motion.img style={{ y, scale: 1.18 }} src={src} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-[filter] duration-700 group-hover:brightness-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-plum/85 via-plum/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6">
        <p className="text-[0.75rem] uppercase tracking-[0.2em] text-white/75">{kicker}</p>
        <p className={`mt-1 font-display leading-[0.98] ${tall ? "text-[clamp(2rem,3.6vw,3.2rem)]" : "text-[1.7rem]"}`}>{title}</p>
        <span className="mt-3 inline-flex items-center gap-1.5 text-[0.9rem] font-medium">
          {cta} <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </button>
  );
}

export function Promos() {
  const { setDept } = useShop();
  const go = (d: DeptKey) => () => (setDept(d), goToShop());
  return (
    <section className="py-6">
      <Wrap className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
        <Banner tall src="/banners/happy.webp" kicker="The autumn edit" title="Layers, knits and denim — up to 30% off" cta="Shop fashion" onClick={go("fashion")} />
        <div className="grid gap-4">
          <Banner src="/banners/bags.webp" kicker="Gifts, wrapped free" title="Watches they'll keep" cta="Shop watches" onClick={go("watches")} />
          <Banner src="/banners/window.webp" kicker="New season" title="Runners & court classics" cta="Shop footwear" onClick={go("footwear")} />
        </div>
      </Wrap>
    </section>
  );
}

// ── Departments: photo tiles that tilt in 3D, the picture floating above the card ──
function DeptTile({ d, i }: { d: (typeof DEPTS)[number]; i: number }) {
  const { setDept } = useShop();
  const ref = useRef<HTMLButtonElement>(null);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const rx = useSpring(my, { stiffness: 200, damping: 18 }), ry = useSpring(mx, { stiffness: 200, damping: 18 });
  const Icon = CAT_ICONS[d.icon] ?? Sparkles;
  const count = ITEMS.filter((x) => x.dept === d.key).length;
  return (
    <Rise delay={(i % 5) * 0.05}>
      <div style={{ perspective: 800 }}>
        <motion.button
          ref={ref}
          onPointerMove={(e) => {
            const r = ref.current!.getBoundingClientRect();
            mx.set(((e.clientX - r.left) / r.width - 0.5) * 16);
            my.set(-((e.clientY - r.top) / r.height - 0.5) * 16);
          }}
          onPointerLeave={() => (mx.set(0), my.set(0))}
          onClick={() => (setDept(d.key), goToShop())}
          style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
          className="group relative block w-full cursor-pointer rounded-3xl bg-white p-2.5 text-left ring-1 ring-plum/[0.08]"
        >
          <div style={{ transform: "translateZ(40px)" }} className="aspect-[4/3] overflow-hidden rounded-2xl bg-petal shadow-[0_20px_40px_-24px_rgba(124,22,72,0.5)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={d.cover} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
          </div>
          <div style={{ transform: "translateZ(24px)" }} className="flex items-center gap-2.5 px-1.5 pb-1 pt-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-petal text-berry">
              <Icon size={17} />
            </span>
            <span className="min-w-0">
              <span className="block font-medium leading-tight">{d.name}</span>
              <span className="block truncate text-[0.78rem] text-plum/55">
                {d.blurb} · {count}
              </span>
            </span>
          </div>
        </motion.button>
      </div>
    </Rise>
  );
}

export function Departments() {
  return (
    <section id="departments" className="py-16">
      <Wrap>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-[clamp(2.2rem,4.4vw,3.8rem)] leading-[0.95]">
            Shop by <em className="text-berry">department</em>
          </h2>
          <button onClick={goToShop} className="inline-flex cursor-pointer items-center gap-1.5 text-[0.95rem] font-medium text-berry">
            See everything <ArrowRight size={16} />
          </button>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {DEPTS.map((d, i) => (
            <DeptTile key={d.key} d={d} i={i} />
          ))}
        </div>
      </Wrap>
    </section>
  );
}

// ── Deals of the day ────────────────────────────────────────────────────────
function Countdown() {
  const [left, setLeft] = useState("");
  useEffect(() => {
    const tick = () => {
      const now = new Date(), end = new Date(now);
      end.setHours(24, 0, 0, 0);
      const s = Math.floor((end.getTime() - now.getTime()) / 1000);
      setLeft([Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60].map((n) => String(n).padStart(2, "0")).join(":"));
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);
  return <span className="font-mono tabular-nums">{left}</span>;
}

export function Deals() {
  const { add, view } = useShop();
  const row = useRef<HTMLDivElement>(null);
  const scroll = (d: number) => row.current?.scrollBy({ left: d * row.current.clientWidth * 0.8, behavior: "smooth" });
  return (
    <section id="deals" className="bg-plum py-16 text-white">
      <Wrap>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[0.85rem]">
              <Timer size={15} className="text-[#f9a8d4]" /> Ends in <Countdown />
            </p>
            <h2 className="mt-3 font-display text-[clamp(2.2rem,4.4vw,3.8rem)] leading-[0.95]">
              Deals of the <em className="text-[#f9a8d4]">day</em>
            </h2>
          </div>
          <div className="flex gap-2">
            <button onClick={() => scroll(-1)} aria-label="Previous deals" className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full ring-1 ring-white/25 hover:bg-white/10">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => scroll(1)} aria-label="More deals" className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full ring-1 ring-white/25 hover:bg-white/10">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        <div ref={row} data-lenis-prevent-horizontal className="mt-8 flex snap-x gap-4 overflow-x-auto pb-2 [scrollbar-width:none]">
          {DEALS.map((it) => (
            <div key={it.id} className="w-[220px] shrink-0 snap-start sm:w-[250px]">
              <button onClick={() => view(it.id)} className="relative block aspect-square w-full cursor-pointer overflow-hidden rounded-2xl bg-white" aria-label={it.name}>
                <Thumb it={it} />
                <span className="absolute left-2.5 top-2.5 rounded-full bg-berry px-2.5 py-1 text-[0.8rem] font-semibold">−{off(it)}%</span>
              </button>
              <p className="mt-3 truncate font-medium">{it.name}</p>
              <div className="mt-1 flex items-center justify-between">
                <p>
                  <b className="text-[1.1rem]">{money(it.price)}</b> <span className="text-[0.85rem] text-white/45 line-through">{money(it.mrp)}</span>
                </p>
                <button onClick={() => add(it.id)} className="min-h-[36px] cursor-pointer rounded-full bg-white px-3.5 text-[0.82rem] font-medium text-plum hover:bg-[#f9a8d4]">
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </Wrap>
    </section>
  );
}

// ── Catalogue with filters ──────────────────────────────────────────────────
const SORTS = {
  featured: "Featured",
  low: "Price: low to high",
  high: "Price: high to low",
  rated: "Top rated",
  off: "Biggest discount",
} as const;
type Sort = keyof typeof SORTS;

export function Catalog() {
  const { dept, setDept, query, setQuery } = useShop();
  const [sort, setSort] = useState<Sort>("featured");
  const [maxPrice, setMaxPrice] = useState(2000);
  const [minRating, setMinRating] = useState(0);
  const [fast, setFast] = useState(false);
  const [only3d, setOnly3d] = useState(false);
  const [panel, setPanel] = useState(false);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    const words = q.split(/\s+/).filter((w) => w.length > 1);
    const r = ITEMS.filter(
      (i) =>
        (dept === "all" || i.dept === dept) &&
        i.price <= maxPrice &&
        i.rating >= minRating &&
        (!fast || i.fast) &&
        (!only3d || i.model) &&
        (!words.length || words.every((w) => `${i.name} ${i.brand} ${i.note} ${i.dept}`.toLowerCase().includes(w))),
    );
    const s = [...r];
    if (sort === "low") s.sort((a, b) => a.price - b.price);
    if (sort === "high") s.sort((a, b) => b.price - a.price);
    if (sort === "rated") s.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    if (sort === "off") s.sort((a, b) => off(b) - off(a));
    return s;
  }, [dept, query, sort, maxPrice, minRating, fast, only3d]);

  const reset = () => {
    setDept("all");
    setQuery("");
    setMaxPrice(2000);
    setMinRating(0);
    setFast(false);
    setOnly3d(false);
  };
  const deptName = dept === "all" ? "All departments" : DEPTS.find((d) => d.key === dept)!.name;

  const filters = (
    <div className="space-y-7">
      <div>
        <p className="text-[0.75rem] font-medium uppercase tracking-[0.18em] text-plum/50">Department</p>
        <ul className="mt-2 space-y-0.5">
          {[{ key: "all" as const, name: "All departments" }, ...DEPTS].map((d) => (
            <li key={d.key}>
              <button onClick={() => setDept(d.key)} className={`flex min-h-[34px] w-full cursor-pointer items-center justify-between rounded-lg px-2.5 text-left text-[0.92rem] ${dept === d.key ? "bg-plum text-white" : "hover:bg-petal"}`}>
                {d.name}
                <span className={`text-[0.78rem] ${dept === d.key ? "text-white/70" : "text-plum/40"}`}>{d.key === "all" ? ITEMS.length : ITEMS.filter((x) => x.dept === d.key).length}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <label htmlFor="price" className="text-[0.75rem] font-medium uppercase tracking-[0.18em] text-plum/50">
          Max price · <span className="text-plum">{maxPrice >= 2000 ? "any" : money(maxPrice)}</span>
        </label>
        <input id="price" type="range" min={25} max={2000} step={25} value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} className="mt-3 w-full accent-[#be185d]" />
      </div>
      <div>
        <p className="text-[0.75rem] font-medium uppercase tracking-[0.18em] text-plum/50">Rating</p>
        <div className="mt-2 flex gap-2">
          {[0, 4.5, 4.7].map((r) => (
            <button key={r} onClick={() => setMinRating(r)} className={`min-h-[34px] cursor-pointer rounded-full px-3 text-[0.85rem] ring-1 ${minRating === r ? "bg-plum text-white ring-plum" : "ring-plum/15 hover:bg-petal"}`}>
              {r ? `${r}★ & up` : "Any"}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2.5">
        {[
          { v: fast, set: setFast, label: "Arrives tomorrow" },
          { v: only3d, set: setOnly3d, label: "Has a 3D view" },
        ].map((f) => (
          <label key={f.label} className="flex cursor-pointer items-center gap-2.5 text-[0.92rem]">
            <input type="checkbox" checked={f.v} onChange={(e) => f.set(e.target.checked)} className="h-4 w-4 accent-[#be185d]" />
            {f.label}
          </label>
        ))}
      </div>
      <button onClick={reset} className="text-[0.88rem] text-berry underline-offset-4 hover:underline">
        Clear all filters
      </button>
    </div>
  );

  return (
    <section id="shop" className="scroll-mt-32 py-16">
      <Wrap className="max-w-[1320px]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[0.8rem] uppercase tracking-[0.2em] text-plum/50">The shelf</p>
            <h2 className="mt-1 font-display text-[clamp(2.2rem,4.4vw,3.8rem)] leading-[0.95]">{deptName}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setPanel(true)} className="inline-flex min-h-[42px] cursor-pointer items-center gap-2 rounded-full px-4 text-[0.9rem] ring-1 ring-plum/15 lg:hidden">
              <SlidersHorizontal size={16} /> Filters
            </button>
            <label className="sr-only" htmlFor="sort">
              Sort
            </label>
            <select id="sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="min-h-[42px] cursor-pointer rounded-full bg-white px-4 text-[0.9rem] ring-1 ring-plum/15 outline-none">
              {Object.entries(SORTS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-8 grid gap-8 lg:grid-cols-[230px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-36">{filters}</div>
          </aside>
          <div>
            <p className="mb-4 text-[0.9rem] text-plum/60">
              {list.length} {list.length === 1 ? "product" : "products"}
              {query && (
                <>
                  {" "}
                  for “<b className="text-plum">{query}</b>”{" "}
                  <button onClick={() => setQuery("")} className="ml-1 text-berry underline-offset-4 hover:underline">
                    clear
                  </button>
                </>
              )}
            </p>
            {list.length === 0 ? (
              <div className="rounded-3xl bg-white p-10 text-center ring-1 ring-plum/10">
                <p className="font-display text-[1.8rem] italic">No exact match on the shelf.</p>
                <p className="mt-2 text-plum/60">Aisle can search the full 2.4M catalogue for you.</p>
                <button onClick={() => openAssistant("chat", query || undefined)} className="mt-5 inline-flex min-h-[46px] cursor-pointer items-center gap-2 rounded-full bg-berry px-6 font-medium text-white">
                  <Sparkles size={16} /> Ask Aisle
                </button>
              </div>
            ) : (
              <motion.div layout className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                <AnimatePresence mode="popLayout">
                  {list.map((it) => (
                    <motion.div key={it.id} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.3, ease }}>
                      <ProductCard it={it} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </Wrap>
      <AnimatePresence>
        {panel && (
          <motion.div className="fixed inset-0 z-[70] lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div onClick={() => setPanel(false)} className="absolute inset-0 bg-plum/40" />
            <motion.div data-lenis-prevent initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ duration: 0.4, ease }} className="absolute inset-x-0 bottom-0 max-h-[85svh] overflow-y-auto rounded-t-3xl bg-[#fffafd] p-6">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-display text-[1.6rem] italic">Filters</p>
                <button onClick={() => setPanel(false)} aria-label="Close filters" className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-petal">
                  <X size={18} />
                </button>
              </div>
              {filters}
              <button onClick={() => setPanel(false)} className="mt-6 min-h-[48px] w-full rounded-full bg-plum font-medium text-white">
                Show {list.length} products
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
