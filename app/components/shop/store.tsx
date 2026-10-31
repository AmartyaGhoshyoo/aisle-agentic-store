"use client";

// Shop state shared by the header, catalogue, product viewer and cart drawer:
// the cart (kept in this browser), the department/search filter and which product is open.
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { item, type DeptKey } from "../../data/shop";

type Line = { id: string; qty: number };
interface Shop {
  lines: Line[];
  count: number;
  subtotal: number;
  add(id: string, qty?: number): void;
  setQty(id: string, qty: number): void;
  clear(): void;
  cartOpen: boolean;
  setCartOpen(v: boolean): void;
  dept: DeptKey | "all";
  setDept(d: DeptKey | "all"): void;
  query: string;
  setQuery(q: string): void;
  viewing: string | null;
  view(id: string | null): void;
  /** Last product added, for the little "added" toast. */
  lastAdded: { id: string; at: number } | null;
}

const Ctx = createContext<Shop | null>(null);
const KEY = "aisle-cart";

export function ShopProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [dept, setDept] = useState<DeptKey | "all">("all");
  const [query, setQuery] = useState("");
  const [viewing, view] = useState<string | null>(null);
  const [lastAdded, setLastAdded] = useState<Shop["lastAdded"]>(null);

  // Restore the cart once; it's a convenience, so any storage error just means an empty cart.
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? "[]") as Line[];
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (Array.isArray(saved)) setLines(saved.filter((l) => item(l.id) && l.qty > 0));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {}
  }, [lines]);

  const add = useCallback((id: string, qty = 1) => {
    setLines((ls) => (ls.some((l) => l.id === id) ? ls.map((l) => (l.id === id ? { ...l, qty: Math.min(9, l.qty + qty) } : l)) : [...ls, { id, qty }]));
    setLastAdded({ id, at: Date.now() });
  }, []);
  const setQty = useCallback((id: string, qty: number) => setLines((ls) => (qty <= 0 ? ls.filter((l) => l.id !== id) : ls.map((l) => (l.id === id ? { ...l, qty: Math.min(9, qty) } : l)))), []);
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<Shop>(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = lines.reduce((s, l) => s + (item(l.id)?.price ?? 0) * l.qty, 0);
    return { lines, count, subtotal, add, setQty, clear, cartOpen, setCartOpen, dept, setDept, query, setQuery, viewing, view, lastAdded };
  }, [lines, add, setQty, clear, cartOpen, dept, query, viewing, lastAdded]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useShop() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useShop outside ShopProvider");
  return s;
}

/** Jump to the catalogue (used by the header nav, category tiles and search). */
export const goToShop = () => {
  const lenis = (window as unknown as { __lenis?: { scrollTo(t: string, o?: object): void } }).__lenis;
  if (lenis) lenis.scrollTo("#shop", { offset: -110 });
  else document.getElementById("shop")?.scrollIntoView({ block: "start" });
};
