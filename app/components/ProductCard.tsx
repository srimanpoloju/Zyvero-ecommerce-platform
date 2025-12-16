"use client";

import Link from "next/link";
import { useCart } from "../store/cart";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  rating: number;
  stock?: number;
};

export default function ProductCard({ p }: { p: Product }) {
  const addItem = useCart((s) => s.addItem);

  const outOfStock = typeof p.stock === "number" && p.stock <= 0;

  function handleAdd() {
    if (outOfStock) {
      toast.error("Out of stock");
      return;
    }

    addItem({
      id: p.id,
      title: p.title,
      price: p.price,
      thumbnail: p.thumbnail,
    });

    toast.success("Added to cart ✅");
  }

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="group relative bg-white rounded-2xl border shadow-sm p-4 flex flex-col hover:shadow-lg transition overflow-hidden"
    >
      {/* Subtle shine */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition">
        <div className="absolute -left-1/2 top-0 h-full w-1/2 rotate-12 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shine_1.1s_ease-in-out]"></div>
      </div>

      {outOfStock && (
        <span className="absolute top-3 left-3 z-10 text-xs font-bold bg-red-600 text-white px-2 py-1 rounded">
          Out of stock
        </span>
      )}

      <Link href={`/product/${p.id}`} className="block">
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          src={p.thumbnail}
          alt={p.title}
          className="h-44 w-full object-contain"
        />

        <h3 className="mt-3 font-semibold text-gray-800 line-clamp-2">
          {p.title}
        </h3>
      </Link>

      <div className="mt-2 flex items-center justify-between">
        <span className="text-lg font-extrabold">${p.price}</span>
        <span className="text-sm text-gray-600">⭐ {p.rating}</span>
      </div>

      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: outOfStock ? 1 : 1.02 }}
        onClick={handleAdd}
        disabled={outOfStock}
        className={`mt-4 rounded py-2 font-semibold transition ${
          outOfStock
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-yellow-400 hover:bg-yellow-500"
        }`}
      >
        {outOfStock ? "Out of stock" : "Add to cart"}
      </motion.button>

      {/* Local keyframes for shine */}
      <style jsx>{`
        @keyframes shine {
          0% {
            transform: translateX(-120%) rotate(12deg);
          }
          100% {
            transform: translateX(240%) rotate(12deg);
          }
        }
      `}</style>
    </motion.div>
  );
}
