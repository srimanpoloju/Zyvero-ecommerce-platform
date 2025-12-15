"use client";

import toast from "react-hot-toast";
import { useCart } from "../../../store/cart";

type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
};

export default function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem);

  function handleAddToCart() {
    // 🔐 Check login (supports multiple auth keys)
    const user =
      localStorage.getItem("zyvero_user") ||
      localStorage.getItem("user") ||
      localStorage.getItem("email") ||
      sessionStorage.getItem("zyvero_user") ||
      sessionStorage.getItem("user") ||
      sessionStorage.getItem("email");

    if (!user) {
      toast.error("Please sign in to add items to cart");
      return;
    }

    // 🛒 Add item
    addItem(product);

    // 🔔 Success toast
    toast.success("Added to cart");
  }

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      className="w-full md:w-auto bg-yellow-400 hover:bg-yellow-500 rounded px-6 py-3 font-semibold transition relative z-50"
    >
      Add to cart
    </button>
  );
}
