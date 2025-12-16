"use client";

import toast from "react-hot-toast";
import { useCart } from "../../../store/cart";
import { motion } from "framer-motion";

type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
};

export default function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem);

  function handleAdd() {
    const user =
      localStorage.getItem("zyvero_user") ||
      sessionStorage.getItem("zyvero_user");

    if (!user) {
      toast.error("Please sign in to add items to cart");
      return;
    }

    addItem(product);
    toast.success("Added to cart");
  }

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.02 }}
      onClick={handleAdd}
      className="w-full md:w-auto bg-yellow-400 hover:bg-yellow-500 rounded px-6 py-3 font-semibold"
    >
      Add to cart
    </motion.button>
  );
}
