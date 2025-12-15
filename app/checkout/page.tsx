"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../store/cart";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();

  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);

  const [loading, setLoading] = useState(false);

  // simple shipping/tax (you can change later)
  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [items]
  );
  const shipping = subtotal > 50 ? 0 : items.length ? 4.99 : 0;
  const tax = items.length ? +(subtotal * 0.06).toFixed(2) : 0;
  const total = +(subtotal + shipping + tax).toFixed(2);

  // form state (simple for now)
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [payment, setPayment] = useState<"card" | "cod">("card");

  const canPlace =
    items.length > 0 &&
    fullName.trim().length >= 2 &&
    address.trim().length >= 5 &&
    city.trim().length >= 2 &&
    zip.trim().length >= 4;

  function placeOrder() {
    if (!items.length) {
      toast.error("Your cart is empty");
      router.push("/cart");
      return;
    }
    if (!canPlace) {
      toast.error("Please complete shipping details");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      clear();
      toast.success("Order placed ✅");
      router.push("/order-success");
    }, 900);
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Top bar like a real checkout */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-extrabold text-lg">
              Zyvero
            </Link>
            <span className="text-gray-300">/</span>
            <span className="font-semibold">Checkout</span>
          </div>

          <div className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">Secure</span>{" "}
            checkout • SSL
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <Link href="/cart" className="text-sm text-blue-700 hover:underline">
            ← Back to cart
          </Link>

          <div className="text-sm text-gray-600">
            {items.length} item{items.length === 1 ? "" : "s"}
          </div>
        </div>

        {/* Two-column layout (left form, right sticky summary) */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* LEFT: Forms */}
          <section className="lg:col-span-2 space-y-5">
            {/* Shipping */}
            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">
                  1. Shipping address
                </h2>
                <span className="text-xs rounded-full bg-gray-100 px-2 py-1 text-gray-700">
                  Required
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="text-sm font-semibold text-gray-800">
                    Full name
                  </label>
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    autoComplete="name"
                    placeholder="John Doe"
                    className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-sm font-semibold text-gray-800">
                    Address
                  </label>
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    autoComplete="street-address"
                    placeholder="123 Main St, Apt 4B"
                    className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-800">
                    City
                  </label>
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    autoComplete="address-level2"
                    placeholder="Chicago"
                    className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-800">
                    ZIP
                  </label>
                  <input
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    autoComplete="postal-code"
                    placeholder="60601"
                    className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              </div>

              <p className="mt-3 text-xs text-gray-500">
                Tip: Keep fields minimal — fewer inputs = faster checkout.
              </p>
            </div>

            {/* Payment */}
            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                2. Payment method
              </h2>

              <div className="grid gap-3">
                <label className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    checked={payment === "card"}
                    onChange={() => setPayment("card")}
                  />
                  <div className="flex-1">
                    <div className="font-semibold">Card (demo)</div>
                    <div className="text-xs text-gray-600">
                      We’ll add real Stripe payments next.
                    </div>
                  </div>
                </label>

                <label className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    checked={payment === "cod"}
                    onChange={() => setPayment("cod")}
                  />
                  <div className="flex-1">
                    <div className="font-semibold">Cash on delivery</div>
                    <div className="text-xs text-gray-600">
                      Pay when it arrives.
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Review */}
            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                3. Review items
              </h2>

              {items.length === 0 ? (
                <div className="text-sm text-gray-600">
                  Your cart is empty.{" "}
                  <Link href="/" className="text-blue-700 hover:underline">
                    Continue shopping
                  </Link>
                </div>
              ) : (
                <div className="divide-y">
                  {items.map((x) => (
                    <div key={x.id} className="py-3 flex gap-3">
                      <img
                        src={x.thumbnail}
                        alt={x.title}
                        className="h-14 w-14 object-contain rounded bg-white border"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 line-clamp-1">
                          {x.title}
                        </div>
                        <div className="text-sm text-gray-600">
                          Qty: {x.qty}
                        </div>
                      </div>
                      <div className="font-semibold">
                        ${(x.price * x.qty).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* RIGHT: Sticky order summary */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-6 rounded-xl border bg-white p-5 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900">Order summary</h3>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">
                    {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>

                <div className="border-t pt-3 flex justify-between text-base">
                  <span className="font-bold">Total</span>
                  <span className="font-extrabold">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={placeOrder}
                disabled={!canPlace || loading}
                className={`mt-4 w-full rounded-lg py-3 font-semibold transition ${
                  !canPlace || loading
                    ? "bg-yellow-200 cursor-not-allowed"
                    : "bg-yellow-400 hover:bg-yellow-500"
                }`}
              >
                {loading ? "Placing order..." : "Place your order"}
              </button>

              <p className="mt-3 text-xs text-gray-500">
                Amazon-style checkouts keep a visible summary and a clear CTA. 
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
