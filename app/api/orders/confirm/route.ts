import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

async function sendEmailReceipt(to: string, subject: string, html: string) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "Zyvero <onboarding@resend.dev>";

  // 🚨 Do not silently skip. Throw clear errors.
  if (!key) throw new Error("Missing RESEND_API_KEY in environment variables");
  if (!to) throw new Error("Missing customer email (Stripe session has no email)");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html }),
  });

  const text = await res.text();

  if (!res.ok) {
    throw new Error(`Resend failed (${res.status}): ${text}`);
  }

  return { ok: true, response: text };
}

export async function POST(req: Request) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return Response.json({ error: "Missing STRIPE_SECRET_KEY" }, { status: 500 });
    }

    const { session_id } = (await req.json()) as { session_id?: string };
    if (!session_id) {
      return Response.json({ error: "Missing session_id" }, { status: 400 });
    }

    const stripe = new Stripe(stripeKey);

    // Get session + line items
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items"],
    });

    const email =
      session.customer_details?.email ||
      session.customer_email ||
      null;

    const lineItems = (session.line_items?.data ?? []).map((li) => ({
      description: li.description,
      quantity: li.quantity,
      amount_total: li.amount_total,
      currency: li.currency,
    }));

    const admin = supabaseAdmin();

    // Insert order (idempotent via unique stripe_session_id)
    const { data: existing } = await admin
      .from("orders")
      .select("stripe_session_id")
      .eq("stripe_session_id", session.id)
      .maybeSingle();

    let dbInserted = false;

    if (!existing) {
      const { error: insertErr } = await admin.from("orders").insert({
        stripe_session_id: session.id,
        user_email: email,
        amount_total: session.amount_total,
        currency: session.currency,
        payment_status: session.payment_status,
        items: lineItems,
      });

      if (insertErr) throw insertErr;
      dbInserted = true;
    }

    // ✅ Email receipt (now returns status)
    let emailResult: any = { skipped: true };

    if (email) {
      const total =
        session.amount_total != null ? (session.amount_total / 100).toFixed(2) : "—";
      const cur = (session.currency || "usd").toUpperCase();

      emailResult = await sendEmailReceipt(
        email,
        "Your Zyvero order receipt ✅",
        `
          <div style="font-family:Arial,sans-serif;line-height:1.5">
            <h2>Thanks for your order!</h2>
            <p><b>Order ID:</b> ${session.id}</p>
            <p><b>Total Paid:</b> ${cur} ${total}</p>
            <p><b>Status:</b> ${session.payment_status}</p>
            <h3>Items</h3>
            <ul>
              ${lineItems
                .map((i) => `<li>${i.description} — Qty: ${i.quantity ?? 1}</li>`)
                .join("")}
            </ul>
            <p>— Zyvero</p>
          </div>
        `
      );
    } else {
      emailResult = { skipped: true, reason: "Stripe session email is null" };
    }

    return Response.json(
      {
        ok: true,
        stripe_session_id: session.id,
        user_email: email,
        dbInserted,
        emailResult,
      },
      { status: 200 }
    );
  } catch (e: any) {
    return Response.json(
      { error: e?.message || "Failed to confirm order" },
      { status: 500 }
    );
  }
}
