"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type HeroSlide = {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  image: string;
  badge?: string;
};

export default function HeroCarousel({
  slides,
  intervalMs = 4500,
}: {
  slides: HeroSlide[];
  intervalMs?: number;
}) {
  const safeSlides = useMemo(() => slides.filter(Boolean), [slides]);
  const [i, setI] = useState(0);

  useEffect(() => {
    if (safeSlides.length <= 1) return;
    const t = setInterval(() => setI((x) => (x + 1) % safeSlides.length), intervalMs);
    return () => clearInterval(t);
  }, [safeSlides.length, intervalMs]);

  if (!safeSlides.length) return null;

  const s = safeSlides[i];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          {/* LEFT */}
          <div>
            {s.badge ? (
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs">
                {s.badge}
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs">
                ⚡ Deals drop daily • Fast checkout • Easy returns
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
              >
                <h1 className="mt-4 text-4xl font-extrabold tracking-tight md:text-5xl">
                  {s.title}
                </h1>
                <p className="mt-4 text-white/80 leading-relaxed">{s.subtitle}</p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={s.ctaHref}
                    className="inline-flex justify-center rounded-lg bg-yellow-400 px-5 py-3 font-semibold text-black hover:bg-yellow-500"
                  >
                    {s.ctaText}
                  </Link>
                  <Link
                    href="#categories"
                    className="inline-flex justify-center rounded-lg border border-white/20 px-5 py-3 font-semibold text-white hover:bg-white/10"
                  >
                    Browse categories
                  </Link>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3 text-sm text-white/80 sm:grid-cols-4">
                  <div className="rounded-lg bg-white/10 p-3">🔒 Secure checkout</div>
                  <div className="rounded-lg bg-white/10 p-3">🚚 Fast shipping</div>
                  <div className="rounded-lg bg-white/10 p-3">↩️ Easy returns</div>
                  <div className="rounded-lg bg-white/10 p-3">⭐ Verified ratings</div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* dots */}
            <div className="mt-8 flex items-center gap-2">
              {safeSlides.map((_, idx) => (
                <button
                  key={idx}
                  aria-label={`Go to slide ${idx + 1}`}
                  onClick={() => setI(idx)}
                  className={`h-2.5 rounded-full transition ${
                    idx === i ? "w-8 bg-yellow-400" : "w-2.5 bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative">
            <div className="absolute -inset-8 rounded-3xl bg-yellow-400/10 blur-2xl" />
            <AnimatePresence mode="wait">
              <motion.div
                key={s.image + i}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.35 }}
                className="relative rounded-2xl bg-white/5 p-4 shadow-lg ring-1 ring-white/10"
              >
                <div className="rounded-xl bg-white p-4">
                  <img
                    src={s.image}
                    alt={s.title}
                    className="h-72 w-full object-contain md:h-80"
                  />
                </div>

                <div className="mt-4 flex items-center justify-between text-sm text-white/80">
                  <span>New picks • curated for you</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setI((x) => (x - 1 + safeSlides.length) % safeSlides.length)}
                      className="rounded-lg border border-white/15 px-3 py-2 hover:bg-white/10"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => setI((x) => (x + 1) % safeSlides.length)}
                      className="rounded-lg border border-white/15 px-3 py-2 hover:bg-white/10"
                    >
                      →
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
