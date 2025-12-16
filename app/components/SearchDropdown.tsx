"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearch } from "../store/search";

type Product = {
  id: number;
  title: string;
  price: number;
  rating?: number;
  thumbnail: string;
  category?: string;
  brand?: string;
};

function useDebouncedValue<T>(value: T, ms = 250) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

export default function SearchDropdown({
  open,
  anchorId,
  onClose,
}: {
  open: boolean;
  anchorId: string;
  onClose: () => void;
}) {
  const query = useSearch((s) => s.query);
  const setQuery = useSearch((s) => s.setQuery);

  const q = useDebouncedValue(query.trim(), 250);

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Product[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const panelRef = useRef<HTMLDivElement | null>(null);

  const [pos, setPos] = useState<{ top: number; left: number; width: number }>({
    top: 72,
    left: 16,
    width: 600,
  });

  useEffect(() => setMounted(true), []);

  // Position under input
  useEffect(() => {
    if (!open) return;

    function updatePos() {
      const el = document.getElementById(anchorId);
      if (!el) return;
      const r = el.getBoundingClientRect();
      setPos({ top: r.bottom + 8, left: r.left, width: r.width });
    }

    updatePos();
    window.addEventListener("resize", updatePos);
    window.addEventListener("scroll", updatePos, true);
    return () => {
      window.removeEventListener("resize", updatePos);
      window.removeEventListener("scroll", updatePos, true);
    };
  }, [open, anchorId]);

  // Close on ESC + click outside (NO overlay!)
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      const panel = panelRef.current;
      const input = document.getElementById(anchorId);

      // if click is inside panel or inside input, do nothing
      if (panel?.contains(target)) return;
      if (input?.contains(target)) return;

      onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onMouseDown, true); // capture = true
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onMouseDown, true);
    };
  }, [open, onClose, anchorId]);

  // Fetch results
  useEffect(() => {
    if (!open) return;

    if (!q) {
      setItems([]);
      setErr(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function run() {
      try {
        setLoading(true);
        setErr(null);

        const res = await fetch(
          `https://dummyjson.com/products/search?q=${encodeURIComponent(q)}&limit=8`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error(`Search failed: ${res.status}`);

        const json = await res.json();
        const products = (json?.products ?? []) as Product[];
        if (!cancelled) setItems(products);
      } catch (e: any) {
        if (!cancelled) setErr(e?.message || "Search error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [q, open]);

  const showNoResults = useMemo(() => {
    return !!q && !loading && !err && items.length === 0;
  }, [q, loading, err, items.length]);

  const chips = ["beauty", "fragrances", "smartphones", "laptops", "home", "skincare"];

  if (!open || !mounted) return null;

  return createPortal(
    <div
      ref={panelRef}
      className="fixed z-[9999]"
      style={{ top: pos.top, left: pos.left, width: pos.width }}
    >
      <div className="rounded-2xl border bg-white shadow-2xl overflow-hidden">
        <div className="px-4 py-3 border-b">
          <div className="text-sm font-semibold text-gray-900">
            Search results for <span className="text-gray-700">“{q || ""}”</span>
          </div>
        </div>

        <div className="max-h-[420px] overflow-auto">
          {loading ? (
            <div className="p-4 text-sm text-gray-600">Searching…</div>
          ) : err ? (
            <div className="p-4 text-sm text-red-600">{err}</div>
          ) : items.length > 0 ? (
            <div className="divide-y">
              {items.map((p) => (
                <Link
                  key={p.id}
                  href={`/product/${p.id}`}
                  onClick={onClose}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50"
                >
                  <img
                    src={p.thumbnail}
                    alt={p.title}
                    className="h-10 w-10 rounded bg-white border object-contain"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-gray-900 truncate">
                      {p.title}
                    </div>
                    <div className="text-xs text-gray-600 truncate">
                      {p.brand ? `${p.brand} • ` : ""}
                      {p.category || ""}
                    </div>
                  </div>
                  <div className="text-sm font-bold text-gray-900">${p.price}</div>
                </Link>
              ))}
            </div>
          ) : null}

          {showNoResults ? (
            <div className="p-4">
              <div className="rounded-2xl border bg-gray-50 p-4">
                <h3 className="text-sm font-extrabold text-gray-900">
                  No results for “{q}”
                </h3>
                <p className="mt-1 text-xs text-gray-600">
                  Try checking spelling, using fewer words, or searching by category.
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {chips.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setQuery(t)}
                      className="rounded-full border bg-white px-3 py-1 text-xs hover:bg-gray-50"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="px-4 py-3 border-t flex items-center justify-between">
          <button type="button" onClick={onClose} className="text-xs text-gray-600 hover:underline">
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              window.location.hash = "featured";
            }}
            className="text-xs font-semibold text-blue-700 hover:underline"
          >
            View featured →
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
