import Link from "next/link";
import ProductGridClient from "./components/ProductGridClient";
import RecentlyViewedRow from "./components/RecentlyViewedRow";
import ProductCard from "./components/ProductCard";
import HeroCarousel from "./components/HeroCarousel";
import SectionReveal from "./components/SectionReveal";
import HorizontalProductRow from "./components/HorizontalProductRow";
import Reveal from "./components/Reveal";

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
    fetch("https://dummyjson.com/products?limit=36", { cache: "no-store" }),
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

  const spotlight = products.slice(0, 2);
  const trending = [...products]
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 12);
  const under25 = products.filter((p) => p.price <= 25).slice(0, 12);

  const slides = [
    {
      title: "Zyvero — Shop smarter, faster.",
      subtitle:
        "A real e-commerce experience: search, cart, checkout, and product discovery. Smooth UI, responsive layout.",
      ctaText: "Shop featured deals",
      ctaHref: "#featured",
      image: spotlight[0]?.thumbnail || products[0]?.thumbnail || "",
      badge: "✨ New storefront • Built with Next.js",
    },
    {
      title: "Trending picks you’ll actually like.",
      subtitle: "High-rated items, clean product cards, and quick add-to-cart flow.",
      ctaText: "Browse trending",
      ctaHref: "#trending",
      image: trending[0]?.thumbnail || products[1]?.thumbnail || "",
      badge: "🔥 Trending now",
    },
    {
      title: "Everyday value under $25.",
      subtitle: "Low price, solid ratings — perfect for quick checkout tests too.",
      ctaText: "Shop under $25",
      ctaHref: "#under25",
      image: under25[0]?.thumbnail || products[2]?.thumbnail || "",
      badge: "💛 Budget favorites",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* HERO CAROUSEL */}
      <Reveal>
        <HeroCarousel slides={slides} />
      </Reveal>

      <div className="mx-auto max-w-6xl px-4">
        {/* CATEGORIES */}
        <Reveal delay={0.05}>
          <section id="categories" className="py-10">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900">Shop by category</h2>
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
                  className="group rounded-2xl border bg-white p-4 shadow-sm hover:shadow transition"
                >
                  <p className="font-semibold text-gray-900 line-clamp-1 group-hover:text-black">
                    {c.name}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">Explore deals</p>
                </Link>
              ))}
            </div>
          </section>
        </Reveal>

        {/* “SPOTLIGHT” SMALL GRID */}
        <Reveal delay={0.08}>
          <section className="pb-4">
            <div className="rounded-2xl bg-white p-5 shadow-sm border">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-900">Today’s spotlight</p>
                <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs text-yellow-900">
                  Limited-time
                </span>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {spotlight.map((p) => (
                  <div key={p.id} className="rounded-xl bg-gray-50 p-2">
                    <ProductCard p={p as any} />
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
                Pro tip: Use the search bar to filter instantly.
              </div>
            </div>
          </section>
        </Reveal>

        {/* TRENDING ROW */}
        <Reveal delay={0.1}>
          <div id="trending">
            <HorizontalProductRow
              title="Trending now"
              subtitle="Top rated picks — swipe to browse."
              products={trending as any}
              viewAllHref="#featured"
            />
          </div>
        </Reveal>

        {/* UNDER 25 ROW */}
        <Reveal delay={0.12}>
          <div id="under25">
            <HorizontalProductRow
              title="Under $25"
              subtitle="Everyday value that sells."
              products={under25 as any}
              viewAllHref="#featured"
            />
          </div>
        </Reveal>

        {/* RECENTLY VIEWED */}
        <Reveal delay={0.14}>
          <section className="py-6">
            <RecentlyViewedRow />
          </section>
        </Reveal>
      </div>

      {/* FEATURED GRID */}
      <section id="featured" className="bg-white border-t">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <Reveal>
            <h2 className="text-2xl font-extrabold text-gray-900">Featured for you</h2>
            <p className="mt-1 text-gray-600">Deals + stars + clean product cards.</p>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="mt-6">
              <ProductGridClient initialProducts={products} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA FOOTER */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <Reveal>
          <div className="rounded-2xl bg-gray-900 p-8 text-white">
            <h3 className="text-2xl font-extrabold">Get deal drops in your inbox</h3>
            <p className="mt-2 text-white/75">Weekly highlights and new arrivals.</p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <input
                placeholder="you@example.com"
                className="w-full rounded-lg px-4 py-3 text-black"
              />
              <button className="rounded-lg bg-yellow-400 px-6 py-3 font-semibold text-black hover:bg-yellow-500">
                Subscribe
              </button>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
