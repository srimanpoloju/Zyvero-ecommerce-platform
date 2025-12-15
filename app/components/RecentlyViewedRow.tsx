"use client";

import { useEffect, useState } from "react";
import HorizontalProductRow from "./HorizontalProductRow";

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

export default function RecentlyViewedRow() {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      const parsed = raw ? (JSON.parse(raw) as Product[]) : [];
      setItems(Array.isArray(parsed) ? parsed : []);
    } catch {
      setItems([]);
    }
  }, []);

  if (!items.length) return null;

  return (
    <HorizontalProductRow
      title="Recently viewed"
      subtitle="Pick up where you left off"
      products={items}
    />
  );
}
