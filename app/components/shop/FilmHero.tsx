"use client";

// The opening film: a 6-second AI-generated shopping story (Kling, from five ChatGPT keyframes)
// scrubbed by scroll — the bag opens, products orbit, three are picked, they go in, a bow ties it.
// Same engine as the Nº77 car: an all-intra mp4 (every frame a keyframe) preloaded into a blob,
// and currentTime easing toward the scroll position so slow scrolling stays silky.
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Search, ShieldCheck, Sparkles } from "lucide-react";
import { openAssistant } from "../assistant/Assistant";

// Film time (seconds) where each beat is on screen; the gaps between beats are film-only.
const BEATS = [
  { from: 0, to: 0.55 },
  { from: 0.75, to: 2.7 },
  { from: 2.95, to: 3.85 },
  { from: 4.1, to: 6.05 },
];

export default function FilmHero() {
  const section = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [beat, setBeat] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [ready, setReady] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    const v = video.current!, el = section.current!;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const url = innerWidth < 760 ? "/film/aisle-film-m.mp4" : "/film/aisle-film.mp4";
    let duration = 0, seekTo = 0, seekAt = 0, attached = false, alive = true, frame = 0, last = -1;

    const attach = (src: string) => {
      if (attached) return;
      attached = true;
      v.addEventListener("loadedmetadata", () => {
        duration = v.duration || 0;
        v.pause();
      });
      const go = () => alive && setReady(true);
      v.addEventListener("loadeddata", go);
      v.addEventListener("error", go);
      v.src = src;
      v.load();
      setTimeout(go, 12000); // never leave the poster stuck
    };
    // Whole file into memory first: seeking inside a blob is instant; over the network it stutters.
    fetch(url)
      .then(async (res) => {
        if (!res.ok || !res.body) throw new Error("fetch");
        const total = +(res.headers.get("content-length") || 0);
        const reader = res.body.getReader();
        const chunks: BlobPart[] = [];
        let got = 0;
        for (;;) {
          const r = await reader.read();
          if (r.done) break;
          chunks.push(r.value);
          got += r.value.length;
          if (alive && total) setLoaded(got / total);
        }
        attach(URL.createObjectURL(new Blob(chunks, { type: "video/mp4" })));
      })
      .catch(() => attach(url));

    // iOS paints nothing from a never-played video: play + pause once on the first touch.
    const unlock = () => {
      const p = v.play();
      if (p && p.then) p.then(() => v.pause()).catch(() => {});
    };
    ["touchstart", "pointerdown", "wheel", "keydown"].forEach((e) => addEventListener(e, unlock, { once: true, passive: true }));

    const tick = () => {
      frame = requestAnimationFrame(tick);
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight || !duration) return;
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - innerHeight)));
      seekTo = p * duration;
      const gap = seekTo - seekAt;
      if (Math.abs(gap) > 0.0008) {
        seekAt += still ? gap : gap * 0.115;
        if (v.readyState >= 2 && !v.seeking) {
          try {
            v.currentTime = seekAt;
          } catch {}
        }
      }
      const b = BEATS.findIndex((x) => seekAt >= x.from && seekAt <= x.to);
      if (b !== last) {
        last = b;
        setBeat(b);
      }
    };
    tick();
    return () => {
      alive = false;
      cancelAnimationFrame(frame);
    };
  }, []);

  const card = (i: number) => `absolute inset-x-5 bottom-[9svh] max-w-[30rem] transition-all duration-500 sm:inset-x-auto sm:left-[max(20px,calc((100vw-1240px)/2+32px))] sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 ${beat === i ? "opacity-100 translate-y-0 sm:-translate-y-1/2" : "pointer-events-none opacity-0 translate-y-3 sm:-translate-y-[45%]"}`;

  return (
    <section id="top" ref={section} className="relative h-[420vh]">
      <div className="sticky top-[104px] h-[calc(100svh-104px)] overflow-hidden bg-[#f4d2da]">
        <video
          ref={video}
          muted
          playsInline
          preload="auto"
          poster="/film/poster.jpg"
          disablePictureInPicture
          aria-label="A frosted-glass shopping bag fills with the products the agent picked"
          className="film-vid absolute right-[2vw] top-1/2 aspect-[1284/724] w-[min(62vw,1284px,calc((100svh-104px)*0.92*1284/724))] -translate-y-1/2 max-sm:right-1/2 max-sm:top-[30%] max-sm:w-[118vw] max-sm:translate-x-1/2"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#f7dde3]/80 via-[#f7dde3]/15 to-transparent max-sm:bg-gradient-to-t max-sm:from-[#fdf2f8]/95 max-sm:via-[#fdf2f8]/40" />
        {!ready && (
          <div className="absolute bottom-5 right-5 rounded-full bg-white/80 px-3 py-1 text-[0.75rem] text-plum/70 backdrop-blur">Loading film {Math.round(loaded * 100)}%</div>
        )}

        <div className={card(0)}>
          <p className="inline-flex items-center gap-2 rounded-full border border-white bg-white/70 px-3 py-1 text-[0.8rem] text-plum/70 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald" /> Your personal shopping agent
          </p>
          <h1 className="mt-4 font-display text-[clamp(2.6rem,5vw,4.6rem)] leading-[0.95]">
            Tell it what you need. <em className="text-berry">It does the shopping.</em>
          </h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              openAssistant("chat", q || undefined);
            }}
            className="mt-6 flex items-center rounded-2xl border border-white bg-white/85 p-1.5 shadow-[0_20px_50px_-30px_rgba(124,22,72,0.5)] backdrop-blur-xl"
          >
            <Sparkles size={18} className="ml-3 shrink-0 text-berry" />
            <input value={q} onChange={(e) => setQ(e.target.value)} aria-label="Ask Aisle" placeholder="e.g. running shoes under $120" className="h-11 min-w-0 flex-1 bg-transparent px-3 outline-none placeholder:text-plum/40" />
            <button className="flex h-11 cursor-pointer items-center gap-1.5 rounded-xl bg-plum px-4 text-[0.9rem] font-medium text-white hover:bg-berry">
              Ask <ArrowRight size={15} />
            </button>
          </form>
          <p className="mt-4 text-[0.85rem] text-plum/55">Scroll to watch it shop.</p>
        </div>

        <div className={card(1)}>
          <p className="text-[0.78rem] font-medium uppercase tracking-[0.2em] text-berry">01 · Search</p>
          <h2 className="mt-3 font-display text-[clamp(2.2rem,4.2vw,3.8rem)] leading-[0.98]">
            It searches <em className="text-berry">2.4 million</em> products.
          </h2>
          <p className="mt-4 flex items-center gap-2 text-plum/70">
            <Search size={16} className="text-berry" /> Catalogue, stock, sizes and reviews — in seconds.
          </p>
        </div>

        <div className={card(2)}>
          <p className="text-[0.78rem] font-medium uppercase tracking-[0.2em] text-berry">02 · Compare</p>
          <h2 className="mt-3 font-display text-[clamp(2.2rem,4.2vw,3.8rem)] leading-[0.98]">
            Picks the best, <em className="text-berry">with reasons.</em>
          </h2>
          <p className="mt-4 text-plum/70">Shoes, a watch, headphones — each one chosen for what you asked.</p>
        </div>

        <div className={card(3)}>
          <p className="text-[0.78rem] font-medium uppercase tracking-[0.2em] text-berry">03 · You confirm</p>
          <h2 className="mt-3 font-display text-[clamp(2.2rem,4.2vw,3.8rem)] leading-[0.98]">
            Bagged and ready. <em className="text-berry">You press pay.</em>
          </h2>
          <ul className="mt-4 space-y-1.5 text-[0.95rem] text-plum/70">
            <li className="flex items-center gap-2"><Check size={16} className="text-emerald" /> Coupon found and applied</li>
            <li className="flex items-center gap-2"><ShieldCheck size={16} className="text-emerald" /> Nothing is paid until you confirm</li>
          </ul>
          <a href="#agent" className="mt-6 inline-flex min-h-[48px] items-center gap-2 rounded-full bg-plum px-6 font-medium text-white hover:bg-berry">
            See the agent at work <ArrowRight size={16} />
          </a>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-plum/[0.06]" />
      </div>
    </section>
  );
}
