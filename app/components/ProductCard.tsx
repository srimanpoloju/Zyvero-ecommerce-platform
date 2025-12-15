"use client";

import Link from "next/link";
import { useCart } from "../store/cart";

type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  rating: number;
};

export default function ProductCard({ p }: { p: Product }) {
  const addItem = useCart((s) => s.addItem);

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col">
      <Link href={`/product/${p.id}`} className="block">
        <img
          src={p.thumbnail}
          alt={p.title}
          className="h-44 w-full object-contain"
        />
        <h3 className="mt-3 font-semibold text-gray-800 line-clamp-2">
          {p.title}
        </h3>
      </Link>

      <div className="mt-2 flex items-center justify-between">
        <span className="text-lg font-bold">${p.price}</span>
        <span className="text-sm text-gray-600">⭐ {p.rating}</span>
      </div>

      <button
        onClick={() =>
          addItem({
            id: p.id,
            title: p.title,
            price: p.price,
            thumbnail: p.thumbnail,
          })
        }
        className="mt-4 bg-yellow-400 hover:bg-yellow-500 rounded py-2 font-semibold"
      >
        Add to cart
      </button>
    </div>
  );
}
