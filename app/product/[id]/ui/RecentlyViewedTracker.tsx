"use client";

import { useEffect } from "react";

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

const KEY = "zyvero_recent";

export default function RecentlyViewedTracker({ product }: { product: Product }) {
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      const list: Product[] = raw ? JSON.parse(raw) : [];

      const cleaned = Array.isArray(list) ? list : [];
      const next = [
        product,
        ...cleaned.filter((p) => p?.id !== product.id),
      ].slice(0, 6);

      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, [product]);

  return null;
}
