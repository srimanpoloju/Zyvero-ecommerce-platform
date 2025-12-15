import Stripe from "stripe";

export const runtime = "nodejs";

type CartItem = {
  id: number;
  title: string;
  price: number;
  qty: number;
  thumbnail?: string;
};

export async function POST(req: Request) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;

    // ✅ Don't crash build; return clean error at runtime if missing
    if (!secretKey) {
      return Response.json(
        {
          error:
            "Stripe is not configured. Missing STRIPE_SECRET_KEY in environment variables.",
        },
        { status: 500 }
      );
    }

    const stripe = new Stripe(secretKey);

    const body = (await req.json()) as { items?: CartItem[] };
    const items = body.items ?? [];

    if (!items.length) {
      return Response.json({ error: "Cart is empty" }, { status: 400 });
    }

    // ✅ Works on Vercel automatically (uses your deployed domain)
    const origin = req.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: items.map((i) => ({
        quantity: i.qty,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(i.price * 100),
          product_data: {
            name: i.title,
            images: i.thumbnail ? [i.thumbnail] : undefined,
          },
        },
      })),
      success_url: `${origin}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
    });

    return Response.json({ url: session.url }, { status: 200 });
  } catch (e: any) {
    return Response.json(
      { error: e?.message || "Stripe error" },
      { status: 500 }
    );
  }
}
