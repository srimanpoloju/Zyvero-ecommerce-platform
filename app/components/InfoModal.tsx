"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

export type InfoModalData = {
  title: string;
  subtitle?: string;
  imageUrl: string;
  bullets: string[];
  ctaText?: string;
  ctaHref?: string;
};

export default function InfoModal({
  open,
  onClose,
  data,
}: {
  open: boolean;
  onClose: () => void;
  data: InfoModalData | null;
}) {
  // ESC close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // lock body scroll while modal open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && data && (
        <motion.div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* backdrop */}
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />

          {/* modal */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b p-4">
              <div>
                <div className="text-lg font-extrabold text-gray-900">
                  {data.title}
                </div>
                {data.subtitle ? (
                  <div className="text-sm text-gray-600">{data.subtitle}</div>
                ) : null}
              </div>

              <button
                onClick={onClose}
                className="text-gray-600 hover:text-gray-900 text-2xl leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="grid gap-0 md:grid-cols-2">
              <div className="bg-gray-50 p-4 md:p-6">
                <img
                  src={data.imageUrl}
                  alt={data.title}
                  className="h-64 w-full rounded-xl object-cover"
                />
                <div className="mt-3 text-xs text-gray-500">
                  *Image is a visual example (we can replace with your own later).
                </div>
              </div>

              <div className="p-4 md:p-6">
                <ul className="space-y-2 text-sm text-gray-800">
                  {data.bullets.map((b, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-[2px]">✅</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                {data.ctaText && data.ctaHref ? (
                  <a
                    href={data.ctaHref}
                    className="mt-6 inline-flex w-full justify-center rounded-xl bg-yellow-400 px-5 py-3 font-semibold text-black hover:bg-yellow-500"
                  >
                    {data.ctaText}
                  </a>
                ) : null}

                <button
                  onClick={onClose}
                  className="mt-3 w-full rounded-xl border px-5 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
