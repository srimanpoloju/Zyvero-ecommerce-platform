import AddToCartButton from "./ui/AddToCartButton";
import SimilarProducts from "./ui/SimilarProducts";
import RecentlyViewedTracker from "./ui/RecentlyViewedTracker";

import HorizontalProductRow from "@/app/components/HorizontalProductRow";
import RecentlyViewedRow from "@/app/components/RecentlyViewedRow";

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
  images: string[];
  discountPercentage?: number;
};

async function fetchProduct(id: string): Promise<Product | null> {
  const res = await fetch(`https://dummyjson.com/products/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return (await res.json()) as Product;
}

async function fetchSimilar(
  category: string,
  currentId: number
): Promise<Product[]> {
  const res = await fetch(
    `https://dummyjson.com/products/category/${encodeURIComponent(
      category
    )}?limit=12`,
    { cache: "no-store" }
  );
  if (!res.ok) return [];
  const data = await res.json();
  const list: Product[] = data?.products ?? [];
  return list.filter((p) => p.id !== currentId).slice(0, 12);
}

async function fetchAlsoBought(
  currentId: number,
  currentCategory: string
): Promise<Product[]> {
  const res = await fetch(`https://dummyjson.com/products?limit=24&skip=24`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  const data = await res.json();
  const list: Product[] = data?.products ?? [];
  return list
    .filter((p) => p.id !== currentId && p.category !== currentCategory)
    .slice(0, 12);
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const p = await fetchProduct(id);

  if (!p) {
    return (
      <main className="min-h-screen bg-gray-100 p-6">
        <a
          href="/"
          className="inline-block mb-4 text-sm text-blue-700 hover:underline"
        >
          ← Back to products
        </a>
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p className="mt-2 text-gray-600">Tried ID: {id}</p>
      </main>
    );
  }

  const [similar, alsoBought] = await Promise.all([
    fetchSimilar(p.category, p.id),
    fetchAlsoBought(p.id, p.category),
  ]);

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      {/* ✅ Save recently viewed (client-side) */}
      <RecentlyViewedTracker
        product={{
          id: p.id,
          title: p.title,
          price: p.price,
          rating: p.rating,
          stock: p.stock,
          category: p.category,
          thumbnail: p.thumbnail,
          discountPercentage: p.discountPercentage,
        }}
      />

      <a
        href="/"
        className="inline-block mb-4 text-sm text-blue-700 hover:underline"
      >
        ← Back to products
      </a>

      {/* PRODUCT DETAILS */}
      <div className="bg-white rounded-lg shadow p-6 grid gap-6 md:grid-cols-2">
        <div>
          <img
            src={p.thumbnail}
            alt={p.title}
            className="w-full h-80 object-contain bg-white rounded"
          />

          <div className="mt-4 grid grid-cols-4 gap-2">
            {(p.images ?? []).slice(0, 8).map((img) => (
              <img
                key={img}
                src={img}
                alt="product"
                className="h-20 w-full object-contain border rounded bg-white"
              />
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">{p.title}</h1>
          <p className="text-sm text-gray-600 mt-1">
            Brand: {p.brand} • Category: {p.category}
          </p>

          <div className="mt-3 flex items-center gap-3">
            <span className="text-gray-700 font-semibold">Stock: {p.stock}</span>
          </div>

          <div className="mt-4 text-3xl font-bold">${p.price}</div>

          <p className="mt-4 text-gray-700 leading-relaxed">{p.description}</p>

          <div className="mt-6">
            <AddToCartButton
              product={{
                id: p.id,
                title: p.title,
                price: p.price,
                thumbnail: p.thumbnail,
              }}
            />
          </div>
        </div>
      </div>

      {/* ✅ Customers also bought (horizontal Amazon style) */}
      <HorizontalProductRow
        title="Customers also bought"
        subtitle="Popular picks from other categories"
        products={alsoBought}
      />

      {/* ✅ Similar products (dropdown sorting) */}
      <SimilarProducts products={similar} category={p.category} />

      {/* ✅ Recently viewed row */}
      <RecentlyViewedRow />
    </main>
  );
}
