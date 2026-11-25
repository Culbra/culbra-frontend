// Receives messages from the footer's "Call for Entries" contact card and
// emails them to the team through Resend. Server-only. Uses the same
// RESEND_API_KEY and PARTNER_FROM_EMAIL as the partner form. Delivered to
// CONTACT_TO_EMAIL, or to PARTNER_TO_EMAIL when that isn't set.

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

const str = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

export async function POST(request: Request) {
  let raw: Record<string, unknown>;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  // Hidden field that real visitors never fill in; bots do. Pretend success.
  if (str(raw.website, 100)) return Response.json({ ok: true });

  const name = str(raw.name, 200);
  const email = str(raw.email, 200);
  const message = str(raw.message, 250);

  if (!name || !message || (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
    return Response.json(
      { error: "Please enter your name and a message." },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? process.env.PARTNER_TO_EMAIL;
  if (!apiKey || !to) {
    console.error("Contact form: RESEND_API_KEY or recipient not set.");
    return Response.json(
      { error: "Messages aren’t available right now." },
      { status: 503 },
    );
  }

  let res: Response;
  try {
    res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from:
          process.env.PARTNER_FROM_EMAIL ?? "CULBRA <onboarding@resend.dev>",
        to: to.split(",").map((s) => s.trim()),
        ...(email ? { reply_to: email } : {}),
        subject: `Website message from ${name}`,
        html:
          `<p><b>Name:</b> ${esc(name)}<br><b>Email:</b> ${esc(email || "—")}</p>` +
          `<p style="white-space:pre-wrap">${esc(message)}</p>`,
        text: `Name: ${name}\nEmail: ${email || "—"}\n\n${message}`,
      }),
    });
  } catch (err) {
    console.error("Contact form: email request failed", err);
    return Response.json({ error: "Couldn’t send. Try again." }, { status: 502 });
  }

  if (!res.ok) {
    console.error("Contact form: Resend error", res.status, await res.text());
    return Response.json({ error: "Couldn’t send. Try again." }, { status: 502 });
  }
  return Response.json({ ok: true });
}
