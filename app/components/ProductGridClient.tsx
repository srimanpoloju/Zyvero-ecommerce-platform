"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useSearch } from "../store/search";
import ProductCard from "./ProductCard";
import Link from "next/link";

type Product = {
  id: number;
  title: string;
  price: number;
  rating: number;
  stock: number;
  category: string;
  thumbnail: string;
  discountPercentage?: number;
};

export default function ProductGridClient({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const params = useSearchParams();
  const category = params.get("category") || "";
  const query = useSearch((s) => s.query) || "";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (initialProducts ?? []).filter((p) => {
      const matchQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);

      const matchCategory = !category || p.category === category;
      return matchQuery && matchCategory;
    });
  }, [initialProducts, query, category]);

  return (
    <>
      {/* Active filters */}
      <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
        {category && (
          <span className="rounded-full bg-gray-100 px-3 py-1">
            Category: <b>{category}</b>
          </span>
        )}
        {query && (
          <span className="rounded-full bg-gray-100 px-3 py-1">
            Search: <b>{query}</b>
          </span>
        )}
        {(category || query) && (
          <Link
            href="/#featured"
            className="rounded-full bg-blue-50 px-3 py-1 text-blue-700 hover:underline"
          >
            Clear
          </Link>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {filtered.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-10 rounded-xl border bg-gray-50 p-6 text-gray-700">
          No products match your filters.
        </div>
      )}
    </>
  );
}
