export const runtime = "nodejs";

export async function POST(req: Request) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "Zyvero <onboarding@resend.dev>";
  const { to } = (await req.json()) as { to?: string };

  if (!key) return Response.json({ error: "Missing RESEND_API_KEY" }, { status: 500 });
  if (!to) return Response.json({ error: "Missing to" }, { status: 400 });

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: "Zyvero test email ✅",
      html: "<p>If you got this, email sending works.</p>",
    }),
  });

  const text = await res.text();
  return Response.json({ ok: res.ok, status: res.status, response: text });
}
