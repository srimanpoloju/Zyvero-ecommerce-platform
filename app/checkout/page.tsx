"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../store/cart";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

/* ------------------ COUNTRY & STATE DATA ------------------ */
const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "IN", name: "India" },
] as const;

const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware",
  "Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky",
  "Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi",
  "Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico",
  "New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania",
  "Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont",
  "Virginia","Washington","West Virginia","Wisconsin","Wyoming",
];

const INDIA_STATES_UT = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan",
  "Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli and Daman and Diu",
  "Delhi","Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry",
];

type CountryCode = (typeof COUNTRIES)[number]["code"];

export default function CheckoutPage() {
  const router = useRouter();

  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);

  const [loading, setLoading] = useState(false);

  /* ------------------ PRICE CALCULATION ------------------ */
  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [items]
  );
  const shipping = subtotal > 50 ? 0 : items.length ? 4.99 : 0;
  const tax = items.length ? +(subtotal * 0.06).toFixed(2) : 0;
  const total = +(subtotal + shipping + tax).toFixed(2);

  /* ------------------ SHIPPING FORM STATE ------------------ */
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState<CountryCode>("US");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");

  const [payment, setPayment] = useState<"card" | "cod">("card");

  const stateOptions = country === "US" ? US_STATES : INDIA_STATES_UT;

  const canPlace =
    items.length > 0 &&
    fullName.trim().length >= 2 &&
    address.trim().length >= 5 &&
    city.trim().length >= 2 &&
    state.trim().length >= 2 &&
    zip.trim().length >= (country === "US" ? 5 : 6);

  /* ------------------ COD PLACE ORDER ------------------ */
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

  /* ------------------ STRIPE CHECKOUT REDIRECT ------------------ */
  async function payWithStripe() {
    if (!items.length) {
      toast.error("Your cart is empty");
      router.push("/cart");
      return;
    }

    if (!canPlace) {
      toast.error("Please complete shipping details");
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to start Stripe checkout");
      }

      if (!data?.url) {
        throw new Error("Missing Stripe Checkout URL");
      }

      // Redirect to Stripe hosted Checkout
      window.location.href = data.url;
    } catch (err: any) {
      toast.error(err?.message || "Payment failed");
      setLoading(false);
    }
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
                    Country
                  </label>
                  <select
                    value={country}
                    onChange={(e) => {
                      const next = e.target.value as CountryCode;
                      setCountry(next);
                      setState("");
                      setZip("");
                    }}
                    className="mt-1 w-full rounded-lg border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-800">
                    State
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="mt-1 w-full rounded-lg border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    <option value="">Select state</option>
                    {stateOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-800">
                    {country === "US" ? "ZIP code" : "PIN code"}
                  </label>
                  <input
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    autoComplete="postal-code"
                    placeholder={country === "US" ? "60601" : "500001"}
                    className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {country === "US"
                      ? "ZIP should be at least 5 characters."
                      : "PIN should be at least 6 characters."}
                  </p>
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
                    <div className="font-semibold">Card (Stripe)</div>
                    <div className="text-xs text-gray-600">
                      You’ll be redirected to Stripe Checkout.
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
                    <div className="text-xs text-gray-600">Pay when it arrives.</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Review items */}
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
                        <div className="text-sm text-gray-600">Qty: {x.qty}</div>
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
                onClick={payment === "card" ? payWithStripe : placeOrder}
                disabled={!canPlace || loading}
                className={`mt-4 w-full rounded-lg py-3 font-semibold transition ${
                  !canPlace || loading
                    ? "bg-yellow-200 cursor-not-allowed"
                    : "bg-yellow-400 hover:bg-yellow-500"
                }`}
              >
                {loading
                  ? "Redirecting..."
                  : payment === "card"
                  ? "Pay with Stripe"
                  : "Place your order"}
              </button>

              <p className="mt-3 text-xs text-gray-500">
                Payment is processed securely via Stripe Checkout (test mode).
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
