"use client";

// The store header: offer strip, logo, one search box (filters the shelf as you type; the
// sparkle button hands the sentence to the Aisle agent), cart, and the department bar.
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { MapPin, Search, ShoppingBag, Sparkles, User } from "lucide-react";
import { DEPTS } from "../../data/shop";
import { openAssistant } from "../assistant/Assistant";
import { CAT_ICONS } from "../catIcons";
import { goToShop, useShop } from "./store";

const OFFERS = ["Free delivery over $50", "30-day free returns", "The agent fills the cart — you press pay"];

export default function Header() {
  const { count, setCartOpen, dept, setDept, query, setQuery, lastAdded } = useShop();
  const { scrollY } = useScroll();
  const shadow = useTransform(scrollY, [0, 80], ["0 0 0 rgba(0,0,0,0)", "0 14px 40px -24px rgba(124,22,72,0.45)"]);
  const [offer, setOffer] = useState(0);
  const [bump, setBump] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setOffer((o) => (o + 1) % OFFERS.length), 3500);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (!lastAdded) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBump(true);
    const t = setTimeout(() => setBump(false), 450);
    return () => clearTimeout(t);
  }, [lastAdded]);

  const pickDept = (k: typeof dept) => {
    setDept(k);
    goToShop();
  };

  return (
    <motion.header style={{ boxShadow: shadow }} className="sticky top-0 z-50 bg-[#fffafd]/95 backdrop-blur-md">
      <div className="bg-plum text-center text-[0.8rem] text-white/85">
        <motion.p key={offer} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="py-1.5">
          {OFFERS[offer]}
        </motion.p>
      </div>
      <div className="mx-auto flex max-w-[1320px] items-center gap-3 px-4 py-3 sm:gap-5 sm:px-8">
        <a href="#top" className="shrink-0 font-display text-[1.9rem] italic leading-none">
          aisle<span className="text-berry">.</span>
        </a>
        <button className="hidden shrink-0 items-center gap-1.5 text-left text-[0.78rem] leading-tight text-plum/60 lg:flex">
          <MapPin size={16} className="text-berry" />
          <span>
            Deliver to
            <br />
            <b className="font-medium text-plum">Dhaka 1207</b>
          </span>
        </button>
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            goToShop();
          }}
          className="flex min-w-0 flex-1 items-center rounded-full bg-petal/80 ring-1 ring-plum/10 focus-within:ring-2 focus-within:ring-berry"
        >
          <Search size={18} className="ml-4 shrink-0 text-plum/50" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search products"
            placeholder="Search 2.4 million products, or ask in a sentence"
            className="h-11 min-w-0 flex-1 bg-transparent px-3 text-[0.95rem] outline-none placeholder:text-plum/45"
          />
          <button
            type="button"
            onClick={() => openAssistant("chat", query || undefined)}
            className="mr-1 flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-berry px-3.5 text-[0.85rem] font-medium text-white"
          >
            <Sparkles size={15} /> <span className="hidden sm:inline">Ask Aisle</span>
          </button>
        </form>
        <button className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full hover:bg-petal md:flex" aria-label="Account">
          <User size={20} />
        </button>
        <motion.button
          animate={{ scale: bump ? 1.15 : 1 }}
          onClick={() => setCartOpen(true)}
          aria-label={`Cart, ${count} items`}
          className="relative flex h-11 shrink-0 cursor-pointer items-center gap-2 rounded-full bg-plum px-4 text-white"
        >
          <ShoppingBag size={18} />
          <span className="hidden text-[0.9rem] sm:inline">Cart</span>
          {count > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald px-1 text-[0.72rem] font-semibold">{count}</span>}
        </motion.button>
      </div>
      <nav aria-label="Departments" className="border-t border-plum/10">
        <ul className="mx-auto flex max-w-[1320px] gap-1 overflow-x-auto px-3 py-1.5 [scrollbar-width:none] sm:px-7">
          <li>
            <button onClick={() => pickDept("all")} className={`min-h-[36px] cursor-pointer whitespace-nowrap rounded-full px-3.5 text-[0.88rem] ${dept === "all" ? "bg-plum text-white" : "hover:bg-petal"}`}>
              All
            </button>
          </li>
          {DEPTS.map((d) => {
            const Icon = CAT_ICONS[d.icon] ?? Sparkles;
            return (
              <li key={d.key}>
                <button
                  onClick={() => pickDept(d.key)}
                  className={`flex min-h-[36px] cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-[0.88rem] ${dept === d.key ? "bg-plum text-white" : "hover:bg-petal"}`}
                >
                  <Icon size={15} className={dept === d.key ? "" : "text-berry"} /> {d.name}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </motion.header>
  );
}
