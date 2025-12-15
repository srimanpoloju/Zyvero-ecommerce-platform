"use client";

import Link from "next/link";
import { useCart } from "../store/cart";

export default function CartPage() {
  const items = useCart((s) => s.items);
  const inc = useCart((s) => s.inc);
  const dec = useCart((s) => s.dec);
  const removeItem = useCart((s) => s.removeItem);
  const clear = useCart((s) => s.clear);

  const total = items.reduce((sum, x) => sum + x.price * x.qty, 0);

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>

        {items.length > 0 && (
          <button
            onClick={clear}
            className="text-sm bg-gray-900 text-white px-3 py-2 rounded"
          >
            Clear cart
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="mt-6">
          <p className="text-gray-700">Cart is empty. Add some products.</p>
          <Link
            href="/"
            className="inline-block mt-4 text-sm text-blue-700 hover:underline"
          >
            ← Continue shopping
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {items.map((x) => (
            <div
              key={x.id}
              className="bg-white rounded-lg shadow p-4 flex items-center gap-4"
            >
              <img
                src={x.thumbnail}
                alt={x.title}
                className="h-20 w-20 object-contain"
              />

              <div className="flex-1">
                <div className="font-semibold text-gray-800">{x.title}</div>
                <div className="text-gray-600">${x.price}</div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => dec(x.id)}
                  className="px-3 py-1 bg-gray-200 rounded"
                >
                  -
                </button>
                <span className="w-8 text-center font-semibold">{x.qty}</span>
                <button
                  onClick={() => inc(x.id)}
                  className="px-3 py-1 bg-gray-200 rounded"
                >
                  +
                </button>
              </div>
              <p className="mt-3 text-sm text-gray-500 text-center">
                ✅ Free shipping on orders over $100
              </p>

              <button
                onClick={() => removeItem(x.id)}
                className="ml-4 text-sm bg-red-600 text-white px-3 py-2 rounded"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between text-lg font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <Link
              href="/checkout"
              className="mt-4 block text-center bg-yellow-400 hover:bg-yellow-500 py-3 rounded font-semibold"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
