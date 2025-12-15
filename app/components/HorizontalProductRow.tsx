"use client";

import { useMemo, useRef } from "react";
import ProductCard from "./ProductCard";

type Product = {
  id: number;
  title: string;
  price: number;
  rating: number;
  stock?: number;
  category: string;
  thumbnail: string;
  discountPercentage?: number;
};

export default function HorizontalProductRow({
  title,
  subtitle,
  products,
}: {
  title: string;
  subtitle?: string;
  products: Product[];
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  const list = useMemo(() => (products ?? []).slice(0, 12), [products]);

  function scrollBy(px: number) {
    ref.current?.scrollBy({ left: px, behavior: "smooth" });
  }

  if (!list.length) return null;

  return (
    <section className="mt-10">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => scrollBy(-520)}
            className="rounded-lg border bg-white px-3 py-2 text-sm font-semibold hover:bg-gray-50"
          >
            ←
          </button>
          <button
            onClick={() => scrollBy(520)}
            className="rounded-lg border bg-white px-3 py-2 text-sm font-semibold hover:bg-gray-50"
          >
            →
          </button>
        </div>
      </div>

      <div
        ref={ref}
        className="mt-4 flex gap-4 overflow-x-auto pb-2 [scrollbar-width:thin]"
      >
        {list.map((p) => (
          <div key={p.id} className="min-w-[220px] max-w-[220px]">
            <ProductCard p={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
