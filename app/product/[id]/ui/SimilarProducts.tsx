"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ProductCard from "@/app/components/ProductCard";

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

type SortKey =
  | "recommended"
  | "price_low"
  | "price_high"
  | "rating_high"
  | "title_az";

export default function SimilarProducts({
  products,
  category,
}: {
  products: Product[];
  category: string;
}) {
  const [sort, setSort] = useState<SortKey>("recommended");
  const [showAll, setShowAll] = useState(false);

  const sorted = useMemo(() => {
    const list = [...(products ?? [])];

    switch (sort) {
      case "price_low":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price_high":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating_high":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "title_az":
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return list;
  }, [products, sort]);

  const visible = showAll ? sorted : sorted.slice(0, 8);

  return (
    <section className="mt-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Similar products</h2>
          <p className="mt-1 text-sm text-gray-600">
            Based on category: <span className="font-semibold">{category}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-lg border bg-white px-3 py-2 text-sm"
          >
            <option value="recommended">Sort: Recommended</option>
            <option value="price_low">Price: Low → High</option>
            <option value="price_high">Price: High → Low</option>
            <option value="rating_high">Rating: High → Low</option>
            <option value="title_az">Title: A → Z</option>
          </select>

          <Link
            href={`/?category=${encodeURIComponent(category)}#featured`}
            className="text-sm font-semibold text-blue-700 hover:underline"
          >
            View more →
          </Link>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="mt-4 bg-white rounded-lg shadow p-6 text-gray-700">
          No similar products found.
        </div>
      ) : (
        <>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {visible.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>

          {sorted.length > 8 && (
            <div className="mt-5 flex justify-center">
              <button
                onClick={() => setShowAll((s) => !s)}
                className="rounded-lg border bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
              >
                {showAll ? "Show less" : "Show more"}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
