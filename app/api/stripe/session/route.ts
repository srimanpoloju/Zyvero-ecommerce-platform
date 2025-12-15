import Stripe from "stripe";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return Response.json({ error: "Missing STRIPE_SECRET_KEY" }, { status: 500 });
    }

    const stripe = new Stripe(secretKey);

    const { searchParams } = new URL(req.url);
    const session_id = searchParams.get("session_id");
    if (!session_id) {
      return Response.json({ error: "Missing session_id" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items"],
    });

    return Response.json(
      {
        id: session.id,
        amount_total: session.amount_total,
        currency: session.currency,
        payment_status: session.payment_status,
        customer_email: session.customer_details?.email || session.customer_email,
        line_items: (session.line_items?.data ?? []).map((li) => ({
          description: li.description,
          quantity: li.quantity,
          amount_total: li.amount_total,
          currency: li.currency,
        })),
      },
      { status: 200 }
    );
  } catch (e: any) {
    return Response.json({ error: e?.message || "Failed to load session" }, { status: 500 });
  }
}
