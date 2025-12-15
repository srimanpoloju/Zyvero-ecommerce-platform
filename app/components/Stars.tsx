export default function Stars({ rating }: { rating: number }) {
  const r = Math.max(0, Math.min(5, rating || 0));
  const full = Math.floor(r);
  const hasHalf = r - full >= 0.5;

  return (
    <div className="inline-flex items-center gap-1" aria-label={`Rating ${r} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const isFull = i < full;
        const isHalfStar = i === full && hasHalf;

        return (
          <span
            key={i}
            className={`text-sm ${
              isFull || isHalfStar ? "text-yellow-500" : "text-gray-300"
            }`}
            style={isHalfStar ? { opacity: 0.65 } : undefined}
          >
            ★
          </span>
        );
      })}
      <span className="ml-1 text-xs text-gray-600">{r.toFixed(2)}</span>
    </div>
  );
}
