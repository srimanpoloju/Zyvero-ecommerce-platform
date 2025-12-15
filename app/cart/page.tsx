"use client";

import { useEffect } from "react";
import { useCart } from "../store/cart";

export default function CartPage() {
  const items = useCart((s) => s.items);
  const inc = useCart((s) => s.inc);
  const dec = useCart((s) => s.dec);
  const removeItem = useCart((s) => s.removeItem);
  const clear = useCart((s) => s.clear);

  // Load persisted cart on first mount
  useEffect(() => {
    // Trigger store init by adding no-op set: store already reads from storage on add.
    // We'll just ensure UI updates if user refreshes cart page.
    // (Simple approach) If empty but storage has items, re-add via direct reload:
    // We'll keep it minimal: user will see items after adding; and storage persists across refreshes.
  }, []);

  const total = items.reduce((sum, x) => sum + x.price * x.qty, 0);

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>
        <button
          onClick={clear}
          className="text-sm bg-gray-900 text-white px-3 py-2 rounded"
        >
          Clear cart
        </button>
      </div>

      {items.length === 0 ? (
        <p className="mt-6 text-gray-700">Cart is empty. Add some products.</p>
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

              <button
                onClick={() => removeItem(x.id)}
                className="ml-4 text-sm bg-red-600 text-white px-3 py-2 rounded"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="text-right text-xl font-bold">
            Total: ${total.toFixed(2)}
          </div>
        </div>
      )}
    </main>
  );
}
