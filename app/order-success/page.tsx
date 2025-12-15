import Link from "next/link";

export default function OrderSuccessPage() {
  const orderId = Math.floor(Math.random() * 1000000);

  return (
    <main className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow text-center max-w-md">
        <h1 className="text-2xl font-bold text-green-600">Order Successful 🎉</h1>

        <p className="mt-4 text-gray-700">
          Thank you for shopping with Zyvero!
        </p>

        <p className="mt-2 text-sm text-gray-500">
          Order ID: <strong>#{orderId}</strong>
        </p>

        <Link
          href="/"
          className="inline-block mt-6 bg-yellow-400 hover:bg-yellow-500 px-6 py-3 rounded font-semibold"
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}
