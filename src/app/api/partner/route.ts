// Receives partnership enquiries from the /partner form and emails them to the
// team through Resend's REST API. Server-only: the key never reaches the
// browser. Set in .env.local and in the hosting project settings:
//   RESEND_API_KEY      your Resend API key
//   PARTNER_TO_EMAIL    where enquiries are delivered (comma-separate several)
//   PARTNER_FROM_EMAIL  optional sender on a domain verified in Resend
//                       (defaults to Resend's test sender)

const MESSAGE_MAX = 1000;

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

  const organisation = str(raw.organisation, 200);
  const name = str(raw.name, 200);
  const email = str(raw.email, 200);
  const phone = str(raw.phone, 50);
  const type = str(raw.type, 100);
  const otherType = str(raw.otherType, 200);
  const message = str(raw.message, MESSAGE_MAX);
  const pillars = Array.isArray(raw.pillars)
    ? raw.pillars
        .filter((p): p is string => typeof p === "string")
        .slice(0, 4)
        .map((p) => p.slice(0, 30))
    : [];

  if (
    !organisation ||
    !name ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !type ||
    !message
  ) {
    return Response.json(
      { error: "Please fill in all the required fields." },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.PARTNER_TO_EMAIL;
  if (!apiKey || !to) {
    console.error("Partner form: RESEND_API_KEY or PARTNER_TO_EMAIL not set.");
    return Response.json(
      { error: "Partnership enquiries aren’t available right now." },
      { status: 503 },
    );
  }

  const kind = type === "Other" && otherType ? `Other: ${otherType}` : type;
  const rows: [string, string][] = [
    ["Organisation", organisation],
    ["Contact", name],
    ["Email", email],
    ["Phone", phone || "—"],
    ["Partnership type", kind],
    ["Pillars", pillars.join(", ") || "—"],
  ];
  const html =
    `<table cellpadding="6">${rows
      .map(([k, v]) => `<tr><th align="left">${k}</th><td>${esc(v)}</td></tr>`)
      .join("")}</table>` +
    `<p style="white-space:pre-wrap">${esc(message)}</p>`;
  const text =
    rows.map(([k, v]) => `${k}: ${v}`).join("\n") + `\n\n${message}`;

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
        reply_to: email,
        subject: `Partnership enquiry: ${organisation}`,
        html,
        text,
      }),
    });
  } catch (err) {
    console.error("Partner form: email request failed", err);
    return Response.json({ error: "Couldn’t send. Try again." }, { status: 502 });
  }

  if (!res.ok) {
    console.error("Partner form: Resend error", res.status, await res.text());
    return Response.json({ error: "Couldn’t send. Try again." }, { status: 502 });
  }
  return Response.json({ ok: true });
}
