"use client";

import { useState } from "react";
import InfoModal, { InfoModalData } from "./InfoModal";

const TRUST: Record<string, InfoModalData> = {
  secure: {
    title: "Secure Checkout",
    subtitle: "Encrypted payments + safer shopping",
    imageUrl:
      "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=1400&q=80",
    bullets: [
      "Payments are processed securely (Stripe-ready flow).",
      "We never store card numbers on Zyvero servers.",
      "SSL encryption keeps your checkout protected.",
      "Fraud checks can be added as we scale.",
    ],
    ctaText: "Go to Checkout",
    ctaHref: "/checkout",
  },
  shipping: {
    title: "Fast Shipping",
    subtitle: "Quick dispatch + delivery tracking",
    imageUrl:
      "https://images.unsplash.com/photo-1607082349566-1870f6fdc1a2?auto=format&fit=crop&w=1400&q=80",
    bullets: [
      "Same-day processing for many items (demo logic for now).",
      "Delivery ETA will show during checkout (coming next).",
      "Tracking integration can be added (UPS/FedEx/USPS).",
      "Free shipping thresholds supported.",
    ],
    ctaText: "Browse Products",
    ctaHref: "/#featured",
  },
  returns: {
    title: "Easy Returns",
    subtitle: "Hassle-free returns & refunds",
    imageUrl:
      "https://images.unsplash.com/photo-1605902711622-cfb43c44367f?auto=format&fit=crop&w=1400&q=80",
    bullets: [
      "Simple return rules with clear policy pages.",
      "Refund status can be tracked inside your account.",
      "Support contact available for fast resolution.",
      "Return windows (7/14/30 days) can be configured.",
    ],
    ctaText: "View Returns Policy",
    ctaHref: "/returns",
  },
  ratings: {
    title: "Verified Ratings",
    subtitle: "Real reviews build trust",
    imageUrl:
      "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1400&q=80",
    bullets: [
      "Ratings help customers choose confidently.",
      "We can restrict reviews to verified purchases later.",
      "Sort by top rated / newest / most helpful (future).",
      "Report spam reviews support can be added.",
    ],
    ctaText: "Shop Top Rated",
    ctaHref: "/#trending",
  },
};

export default function TrustCards() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<InfoModalData | null>(null);

  function show(key: keyof typeof TRUST) {
    setData(TRUST[key]);
    setOpen(true);
  }

  return (
    <>
      <div className="mt-8 grid grid-cols-2 gap-3 text-sm text-white/80 sm:grid-cols-4">
        <button
          onClick={() => show("secure")}
          className="rounded-lg bg-white/10 p-3 text-left hover:bg-white/15 transition"
        >
          🔒 Secure checkout
        </button>
        <button
          onClick={() => show("shipping")}
          className="rounded-lg bg-white/10 p-3 text-left hover:bg-white/15 transition"
        >
          🚚 Fast shipping
        </button>
        <button
          onClick={() => show("returns")}
          className="rounded-lg bg-white/10 p-3 text-left hover:bg-white/15 transition"
        >
          ↩️ Easy returns
        </button>
        <button
          onClick={() => show("ratings")}
          className="rounded-lg bg-white/10 p-3 text-left hover:bg-white/15 transition"
        >
          ⭐ Verified ratings
        </button>
      </div>

      <InfoModal open={open} onClose={() => setOpen(false)} data={data} />
    </>
  );
}
