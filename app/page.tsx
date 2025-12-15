import Link from "next/link";
import ProductGridClient from "./components/ProductGridClient";
import RecentlyViewedRow from "./components/RecentlyViewedRow";
import ProductCard from "./components/ProductCard";

type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  discountPercentage?: number;
};

type Category = { slug: string; name: string };

async function getHomeData(): Promise<{ products: Product[]; categories: Category[] }> {
  const [productsRes, categoriesRes] = await Promise.all([
    fetch("https://dummyjson.com/products?limit=24", { cache: "no-store" }),
    fetch("https://dummyjson.com/products/categories", { cache: "no-store" }),
  ]);

  const productsJson = await productsRes.json();
  const categoriesJson = await categoriesRes.json();

  const products = (productsJson?.products ?? []) as Product[];

  const categories: Category[] = (categoriesJson ?? [])
    .map((c: any) => {
      if (typeof c === "string") return { slug: c, name: c };
      const slug = String(c?.slug ?? c?.name ?? "");
      const name = String(c?.name ?? c?.slug ?? slug);
      return { slug, name };
    })
    .filter((c: Category) => c.slug.length > 0);

  return { products, categories };
}

export default async function HomePage() {
  const { products, categories } = await getHomeData();
  const topCategories = categories.slice(0, 8);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs">
                ⚡ Deals drop daily • Fast checkout • Easy returns
              </p>

              <h1 className="mt-4 text-4xl font-extrabold tracking-tight md:text-5xl">
                Zyvero — Shop smarter, faster.
              </h1>

              <p className="mt-4 text-white/80 leading-relaxed">
                A real e-commerce experience: search, cart, login, deals, and product discovery.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="#featured"
                  className="inline-flex justify-center rounded-lg bg-yellow-400 px-5 py-3 font-semibold text-black hover:bg-yellow-500"
                >
                  Shop featured deals
                </Link>

                <Link
                  href="#categories"
                  className="inline-flex justify-center rounded-lg border border-white/20 px-5 py-3 font-semibold text-white hover:bg-white/10"
                >
                  Browse categories
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3 text-sm text-white/80 sm:grid-cols-4">
                <div className="rounded-lg bg-white/10 p-3">🔒 Secure checkout</div>
                <div className="rounded-lg bg-white/10 p-3">🚚 Fast shipping</div>
                <div className="rounded-lg bg-white/10 p-3">↩️ Easy returns</div>
                <div className="rounded-lg bg-white/10 p-3">⭐ Verified ratings</div>
              </div>
            </div>

            {/* Spotlight cards */}
            <div className="rounded-2xl bg-white/5 p-5 shadow-lg ring-1 ring-white/10">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Today’s spotlight</p>
                <span className="rounded-full bg-yellow-400/20 px-3 py-1 text-xs text-yellow-200">
                  Limited-time
                </span>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {(products ?? []).slice(0, 2).map((p) => (
                  <div key={p.id} className="rounded-xl bg-white/5 p-1">
                    <ProductCard p={p} />
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-xl bg-white/5 p-4 text-sm text-white/80">
                Pro tip: Use search to filter instantly.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="categories" className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Shop by category</h2>
            <p className="mt-1 text-gray-600">Jump into what you need.</p>
          </div>
          <Link href="#featured" className="text-sm font-semibold text-blue-700 hover:underline">
            View featured →
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {topCategories.map((c) => (
            <Link
              key={c.slug}
              href={`/?category=${encodeURIComponent(c.slug)}#featured`}
              className="rounded-xl border bg-white p-4 shadow-sm hover:shadow transition"
            >
              <p className="font-semibold text-gray-900 line-clamp-1">{c.name}</p>
              <p className="mt-1 text-sm text-gray-600">Explore deals</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Recently viewed */}
      <section className="mx-auto max-w-6xl px-4">
        <RecentlyViewedRow />
      </section>

      {/* FEATURED */}
      <section id="featured" className="bg-white border-t">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h2 className="text-2xl font-bold text-gray-900">Featured for you</h2>
          <p className="mt-1 text-gray-600">Deals + stars + clean product cards.</p>

          <ProductGridClient initialProducts={products} />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="rounded-2xl bg-gray-900 p-8 text-white">
          <h3 className="text-2xl font-bold">Get deal drops in your inbox</h3>
          <p className="mt-2 text-white/75">Weekly highlights and new arrivals.</p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input placeholder="you@example.com" className="w-full rounded-lg px-4 py-3 text-black" />
            <button className="rounded-lg bg-yellow-400 px-6 py-3 font-semibold text-black hover:bg-yellow-500">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
