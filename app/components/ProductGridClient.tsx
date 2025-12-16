"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { useSearch } from "../store/search";

type Product = {
  id: number;
  title: string;
  description?: string;
  price: number;
  rating: number;
  stock?: number;
  brand?: string;
  category?: string;
  thumbnail: string;
  discountPercentage?: number;
};

function buildRecommendations(all: Product[], q: string) {
  const query = (q || "").trim().toLowerCase();
  const tokens = query.split(/\s+/).filter(Boolean);

  // 1) Try "soft match" recommendations: category/brand contains any token
  const soft = all.filter((p) => {
    const cat = (p.category || "").toLowerCase();
    const brand = (p.brand || "").toLowerCase();
    return tokens.some((t) => cat.includes(t) || brand.includes(t));
  });

  // 2) Trending fallback: top-rated
  const trending = [...all].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

  // Merge unique
  const seen = new Set<number>();
  const merged: Product[] = [];

  for (const p of [...soft, ...trending]) {
    if (!seen.has(p.id)) {
      seen.add(p.id);
      merged.push(p);
    }
    if (merged.length >= 12) break;
  }

  return merged;
}

export default function ProductGridClient({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const query = useSearch((s) => s.query);

  const [products, setProducts] = useState<Product[]>(initialProducts ?? []);
  const [loading, setLoading] = useState(false);

  // Sync if parent updates products
  useEffect(() => {
    setProducts(initialProducts ?? []);
  }, [initialProducts]);

  // Shimmer while searching (premium UX)
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, [query]);

  const filtered = useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    if (!q) return products;

    return products.filter((p) => {
      const hay = `${p.title} ${p.brand ?? ""} ${p.category ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [products, query]);

  const recommendations = useMemo(() => {
    return buildRecommendations(products, query);
  }, [products, query]);

  return (
    <div>
      {/* Status row */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {loading ? "Updating results..." : `${filtered.length} items`}
        </p>
      </div>

      {/* Loading skeleton */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 && (query || "").trim() ? (
        <>
          {/* No results + suggestions */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-extrabold text-gray-900">
              No results for <span className="text-gray-700">“{query}”</span>
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Try checking spelling, using fewer words, or searching by category (example:{" "}
              <span className="font-semibold">beauty</span>,{" "}
              <span className="font-semibold">phones</span>).
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {["beauty", "fragrances", "smartphones", "laptops", "home", "skincare"].map((t) => (
                <button
                  key={t}
                  onClick={() => useSearch.getState().setQuery(t)}
                  className="rounded-full border px-3 py-1 text-sm hover:bg-gray-50"
                  type="button"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Recommended products */}
          <div className="mt-8">
            <div className="flex items-end justify-between">
              <div>
                <h4 className="text-xl font-extrabold text-gray-900">
                  Recommended for you
                </h4>
                <p className="text-sm text-gray-600">
                  Popular items you might like (top-rated picks)
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {recommendations.slice(0, 12).map((p) => (
                <ProductCard key={p.id} p={p as any} />
              ))}
            </div>
          </div>
        </>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border bg-white p-6 text-center text-gray-700">
          No products to show.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} p={p as any} />
          ))}
        </div>
      )}
    </div>
  );
}
