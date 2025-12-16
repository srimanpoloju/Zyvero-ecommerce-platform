import Link from "next/link";
import ProductCard from "./ProductCard";

type Product = {
  id: number;
  title: string;
  price: number;
  rating: number;
  thumbnail: string;
  brand?: string;
  category?: string;
  discountPercentage?: number;
};

export default function HorizontalProductRow({
  title,
  subtitle,
  products,
  viewAllHref = "#featured",
}: {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
}) {
  if (!products?.length) return null;

  return (
    <section className="py-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm text-gray-600">{subtitle}</p> : null}
        </div>
        <Link href={viewAllHref} className="text-sm font-semibold text-blue-700 hover:underline">
          View all →
        </Link>
      </div>

      <div className="mt-4 overflow-x-auto">
        <div className="flex gap-4 pb-2">
          {products.slice(0, 12).map((p) => (
            <div key={p.id} className="min-w-[220px] max-w-[220px]">
              <ProductCard p={p as any} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
