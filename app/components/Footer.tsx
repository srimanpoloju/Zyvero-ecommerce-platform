import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <div className="text-lg font-extrabold text-gray-900">Zyvero</div>
            <p className="mt-2 text-sm text-gray-600">
              A modern e-commerce experience built with Next.js.
            </p>
          </div>

          <div>
            <div className="text-sm font-bold text-gray-900">Policies</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link className="text-gray-700 hover:underline" href="/privacy">Privacy Policy</Link></li>
              <li><Link className="text-gray-700 hover:underline" href="/terms">Terms of Service</Link></li>
              <li><Link className="text-gray-700 hover:underline" href="/shipping">Shipping Policy</Link></li>
              <li><Link className="text-gray-700 hover:underline" href="/returns">Returns / Refund Policy</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-bold text-gray-900">Support</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link className="text-gray-700 hover:underline" href="/contact">Contact / Support</Link></li>
              <li><Link className="text-gray-700 hover:underline" href="/faq">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-bold text-gray-900">Quick links</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link className="text-gray-700 hover:underline" href="/#featured">Featured</Link></li>
              <li><Link className="text-gray-700 hover:underline" href="/cart">Cart</Link></li>
              <li><Link className="text-gray-700 hover:underline" href="/checkout">Checkout</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t pt-6 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} Zyvero. All rights reserved.</div>
          <div>Built for learning → production-ready path.</div>
        </div>
      </div>
    </footer>
  );
}
