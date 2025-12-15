"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

type LineItem = {
  description: string | null;
  quantity: number | null;
  amount_total: number | null;
  currency: string | null;
};

type SessionData = {
  id: string;
  amount_total: number | null;
  currency: string | null;
  payment_status: string | null;
  customer_email: string | null;
  line_items: LineItem[];
};

export default function OrderSuccessPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SessionData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sessionId = useMemo(() => {
    if (typeof window === "undefined") return null;
    return new URLSearchParams(window.location.search).get("session_id");
  }, []);

  useEffect(() => {
    async function load() {
      if (!sessionId) {
        setError("Missing session_id. Please return to checkout.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/stripe/session?session_id=${sessionId}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || "Failed to load order");

        setData(json);
      } catch (e: any) {
        setError(e?.message || "Failed to load order");
        toast.error(e?.message || "Failed to load order");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [sessionId]);

  const money = (cents: number | null | undefined, currency: string | null) => {
    if (cents == null) return "—";
    const cur = (currency || "usd").toUpperCase();
    return `${cur} ${(cents / 100).toFixed(2)}`;
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow max-w-2xl w-full">
        {loading ? (
          <>
            <h1 className="text-2xl font-bold text-gray-900">Confirming your order…</h1>
            <p className="mt-2 text-gray-600">Fetching payment details from Stripe.</p>
          </>
        ) : error ? (
          <>
            <h1 className="text-2xl font-bold text-gray-900">Couldn’t load your order</h1>
            <p className="mt-2 text-gray-700">{error}</p>

            <div className="mt-6 flex gap-3">
              <Link
                href="/checkout"
                className="bg-yellow-400 hover:bg-yellow-500 px-6 py-3 rounded font-semibold"
              >
                Back to checkout
              </Link>
              <Link href="/" className="px-6 py-3 rounded border font-semibold">
                Home
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-green-600">Order Successful 🎉</h1>
                <p className="mt-2 text-gray-700">Thank you for shopping with Zyvero!</p>
                <p className="mt-1 text-sm text-gray-500">
                  Email: <strong>{data?.customer_email || "—"}</strong>
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-mono font-semibold">{data?.id}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border bg-gray-50 p-4">
                <p className="text-xs text-gray-500">Payment status</p>
                <p className="font-semibold text-gray-900">{data?.payment_status || "—"}</p>
              </div>

              <div className="rounded-lg border bg-gray-50 p-4">
                <p className="text-xs text-gray-500">Total paid</p>
                <p className="text-xl font-extrabold text-gray-900">
                  {money(data?.amount_total, data?.currency ?? null)}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-lg border p-4">
              <h2 className="text-lg font-bold text-gray-900">Items</h2>

              <div className="mt-3 divide-y">
                {(data?.line_items ?? []).length === 0 ? (
                  <p className="text-sm text-gray-600">No items found.</p>
                ) : (
                  data!.line_items.map((li, idx) => (
                    <div key={idx} className="py-3 flex items-center gap-3">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">
                          {li.description || "Item"}
                        </div>
                        <div className="text-sm text-gray-600">Qty: {li.quantity ?? 1}</div>
                      </div>
                      <div className="font-semibold">
                        {money(li.amount_total, li.currency)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/"
                className="inline-block bg-yellow-400 hover:bg-yellow-500 px-6 py-3 rounded font-semibold"
              >
                Continue Shopping
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
