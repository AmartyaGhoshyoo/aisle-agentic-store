"use client";

// The product sheet (HD photo, quantity, add to cart, ask the agent)
// and the cart drawer (quantities, totals, and an agent-prepared checkout you confirm).
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Minus, Plus, RotateCcw, ShieldCheck, Sparkles, Trash2, Truck, X } from "lucide-react";
import { DEPTS, ITEMS, item, money, off } from "../../data/shop";
import { openAssistant } from "../assistant/Assistant";
import { ease } from "../kit";
import { Stars, Thumb } from "./ProductCard";
import { useShop } from "./store";

function useEscape(open: boolean, close: () => void) {
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, close]);
}

function Qty({ value, set }: { value: number; set(n: number): void }) {
  return (
    <div className="inline-flex items-center rounded-full ring-1 ring-plum/15">
      <button onClick={() => set(value - 1)} aria-label="Less" className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full hover:bg-petal">
        <Minus size={14} />
      </button>
      <span className="w-6 text-center text-[0.95rem] tabular-nums">{value}</span>
      <button onClick={() => set(value + 1)} aria-label="More" className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full hover:bg-petal">
        <Plus size={14} />
      </button>
    </div>
  );
}

export function ProductSheet() {
  const { viewing, view, add, setCartOpen } = useShop();
  const it = viewing ? item(viewing) : undefined;
  const [qty, setQty] = useState(1);
  const close = () => view(null);
  useEscape(!!it, close);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQty(1);
  }, [viewing]);
  const related = it ? ITEMS.filter((x) => x.dept === it.dept && x.id !== it.id).slice(0, 4) : [];
  const dept = it ? DEPTS.find((d) => d.key === it.dept) : undefined;

  return (
    <AnimatePresence>
      {it && (
        <motion.div key="sheet" className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div onClick={close} className="absolute inset-0 bg-plum/45 backdrop-blur-sm" />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={it.name}
            data-lenis-prevent
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ duration: 0.4, ease }}
            className="relative grid max-h-[92svh] w-full max-w-[1040px] overflow-y-auto rounded-t-3xl bg-[#fffafd] sm:rounded-3xl md:grid-cols-[1.1fr_1fr]"
          >
            <button onClick={close} aria-label="Close" className="absolute right-3 top-3 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/90 shadow">
              <X size={18} />
            </button>
            <div className="relative aspect-square bg-[radial-gradient(circle_at_50%_40%,#fff,#fce7f3_75%)] md:aspect-auto md:min-h-[560px]">
              <Thumb it={it} className="absolute inset-0" />
            </div>
            <div className="flex flex-col p-6 sm:p-8">
              <p className="text-[0.75rem] uppercase tracking-[0.18em] text-plum/50">
                {dept?.name} · {it.brand}
              </p>
              <h2 className="mt-2 font-display text-[clamp(1.8rem,3vw,2.5rem)] leading-[1.02]">{it.name}</h2>
              <div className="mt-3">
                <Stars r={it.rating} n={it.reviews} />
              </div>
              <div className="mt-5 flex items-baseline gap-3">
                <span className="text-[2rem] font-semibold">{money(it.price)}</span>
                <span className="text-plum/45 line-through">{money(it.mrp)}</span>
                <span className="rounded-full bg-emerald/10 px-2 py-0.5 text-[0.85rem] font-medium text-emerald">{off(it)}% off</span>
              </div>
              <p className="mt-3 text-plum/70">{it.note}. Prices and stock come from the store catalogue — the agent never invents them.</p>
              <ul className="mt-5 space-y-2 text-[0.9rem] text-plum/75">
                <li className="flex items-center gap-2">
                  <Truck size={16} className="text-emerald" /> {it.fast ? "Arrives tomorrow" : "Arrives in 2–4 days"} · free over $50
                </li>
                <li className="flex items-center gap-2">
                  <RotateCcw size={16} className="text-emerald" /> 30-day free returns, label in chat
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald" /> You confirm every payment
                </li>
              </ul>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Qty value={qty} set={(n) => setQty(Math.max(1, Math.min(9, n)))} />
                <button
                  onClick={() => {
                    add(it.id, qty);
                    close();
                    setCartOpen(true);
                  }}
                  className="min-h-[48px] flex-1 cursor-pointer rounded-full bg-plum px-6 font-medium text-white hover:bg-berry"
                >
                  Add to cart · {money(it.price * qty)}
                </button>
              </div>
              <button onClick={() => openAssistant("chat", `Tell me about ${it.name} — is it right for me?`)} className="mt-3 inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-full ring-1 ring-berry/40 text-[0.92rem] text-berry hover:bg-petal">
                <Sparkles size={16} /> Ask Aisle about this
              </button>
              {related.length > 0 && (
                <div className="mt-8">
                  <p className="text-[0.8rem] uppercase tracking-[0.18em] text-plum/50">More in {dept?.name}</p>
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {related.map((r) => (
                      <button key={r.id} onClick={() => view(r.id)} className="cursor-pointer overflow-hidden rounded-xl bg-petal ring-1 ring-plum/10 hover:ring-berry" aria-label={r.name}>
                        <div className="aspect-square">
                          <Thumb it={r} />
                        </div>
                        <p className="truncate px-1.5 py-1 text-left text-[0.72rem]">{money(r.price)}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function CartDrawer() {
  const { lines, count, subtotal, setQty, clear, cartOpen, setCartOpen, view } = useShop();
  const [stage, setStage] = useState<"cart" | "review" | "done">("cart");
  const close = () => {
    setCartOpen(false);
    if (stage === "done") setStage("cart");
  };
  useEscape(cartOpen, close);
  const delivery = subtotal === 0 || subtotal >= 50 ? 0 : 4.99;
  const coupon = subtotal >= 200 ? Math.round(subtotal * 0.05) : 0;
  const total = subtotal + delivery - coupon;

  return (
    <AnimatePresence>
      {cartOpen && (
        <motion.div key="cart" className="fixed inset-0 z-[70]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div onClick={close} className="absolute inset-0 bg-plum/40 backdrop-blur-sm" />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Cart"
            data-lenis-prevent
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease }}
            className="absolute right-0 top-0 flex h-full w-full max-w-[440px] flex-col bg-[#fffafd] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-plum/10 px-5 py-4">
              <h2 className="font-display text-[1.6rem] italic">Your cart {count > 0 && <span className="font-sans text-[1rem] not-italic text-plum/50">({count})</span>}</h2>
              <button onClick={close} aria-label="Close cart" className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:bg-petal">
                <X size={18} />
              </button>
            </div>

            {stage === "done" ? (
              <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16 }} className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald text-white">
                  <Check size={40} />
                </motion.div>
                <h3 className="mt-6 font-display text-[2rem]">Order placed</h3>
                <p className="mt-2 max-w-[18rem] text-plum/65">Demo store — nothing was charged. Tracking would arrive by WhatsApp and email.</p>
                <button onClick={close} className="mt-6 min-h-[46px] cursor-pointer rounded-full bg-plum px-6 font-medium text-white">
                  Keep shopping
                </button>
              </div>
            ) : lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                <p className="font-display text-[1.8rem] italic">Nothing here yet.</p>
                <p className="mt-2 text-plum/60">Add something from the shelf, or tell Aisle what you need.</p>
                <button
                  onClick={() => {
                    close();
                    openAssistant("chat");
                  }}
                  className="mt-6 inline-flex min-h-[46px] cursor-pointer items-center gap-2 rounded-full bg-berry px-6 font-medium text-white"
                >
                  <Sparkles size={16} /> Ask Aisle
                </button>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-plum/10 overflow-y-auto px-5">
                  <AnimatePresence initial={false}>
                    {lines.map((l) => {
                      const it = item(l.id)!;
                      return (
                        <motion.li key={l.id} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, height: 0 }} className="flex gap-3 py-4">
                          <button onClick={() => view(it.id)} className="h-20 w-20 shrink-0 cursor-pointer overflow-hidden rounded-xl bg-petal" aria-label={it.name}>
                            <Thumb it={it} />
                          </button>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium">{it.name}</p>
                            <p className="text-[0.8rem] text-plum/50">{it.brand}</p>
                            <div className="mt-2 flex items-center justify-between">
                              <Qty value={l.qty} set={(n) => setQty(l.id, n)} />
                              <span className="font-semibold">{money(it.price * l.qty)}</span>
                            </div>
                          </div>
                          <button onClick={() => setQty(l.id, 0)} aria-label={`Remove ${it.name}`} className="self-start p-1 text-plum/40 hover:text-berry">
                            <Trash2 size={16} />
                          </button>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>
                <div className="border-t border-plum/10 p-5 pb-24">
                  {subtotal < 50 && (
                    <div className="mb-4">
                      <p className="text-[0.82rem] text-plum/65">Add {money(Math.ceil(50 - subtotal))} more for free delivery</p>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-petal">
                        <div className="h-full rounded-full bg-emerald" style={{ width: `${(subtotal / 50) * 100}%` }} />
                      </div>
                    </div>
                  )}
                  <dl className="space-y-1.5 text-[0.92rem]">
                    <div className="flex justify-between">
                      <dt className="text-plum/60">Subtotal</dt>
                      <dd>{money(subtotal)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-plum/60">Delivery</dt>
                      <dd>{delivery ? "$4.99" : "Free"}</dd>
                    </div>
                    {coupon > 0 && (
                      <div className="flex justify-between text-emerald">
                        <dt>Agent found coupon AISLE5</dt>
                        <dd>−{money(coupon)}</dd>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-plum/10 pt-2 text-[1.1rem] font-semibold">
                      <dt>Total</dt>
                      <dd>${total.toFixed(2)}</dd>
                    </div>
                  </dl>
                  {stage === "review" ? (
                    <div className="mt-4 rounded-2xl bg-petal p-4 text-[0.88rem]">
                      <p className="flex items-center gap-2 font-medium">
                        <Sparkles size={15} className="text-berry" /> Aisle prepared your order
                      </p>
                      <p className="mt-1 text-plum/65">Address: home (Dhanmondi) · Slot: tomorrow 10–12 · Card ending 4242. Nothing is charged until you confirm.</p>
                      <button
                        onClick={() => {
                          setStage("done");
                          clear();
                        }}
                        className="mt-3 inline-flex min-h-[48px] w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-emerald font-medium text-white"
                      >
                        <ShieldCheck size={17} /> Confirm & pay ${total.toFixed(2)}
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setStage("review")} className="mt-4 min-h-[50px] w-full cursor-pointer rounded-full bg-plum font-medium text-white hover:bg-berry">
                      Checkout
                    </button>
                  )}
                </div>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
