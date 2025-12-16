import Skeleton from "./Skeleton";

export default function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <Skeleton className="h-40 w-full rounded-xl" />
      <div className="mt-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="mt-2 flex items-center justify-between">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
