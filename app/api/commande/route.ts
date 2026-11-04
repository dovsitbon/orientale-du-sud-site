import { Resend } from "resend";
import site from "@/data/site.json";
import { emailHtml as html } from "@/lib/email";
import { getDict } from "@/lib/i18n";
import { orderMessage } from "@/lib/order";
import { parseLang, parseOrder } from "@/lib/validate";

// Copie e-mail d'une commande à emporter / à domicile (la commande part d'abord sur WhatsApp).
// Mêmes variables que /api/devis : RESEND_API_KEY, NOTIFY_EMAIL, RESEND_FROM.

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const lang = parseLang(body?.lang);
  const order = parseOrder(body?.order);
  if (!body || !order) return Response.json({ ok: false }, { status: 400 });
  const d = getDict(lang);
  const ref = typeof body.ref === "string" ? body.ref.slice(0, 20) : undefined;

  const key = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL;
  if (!key || !to) return Response.json({ ok: true, emailed: false });

  const text = orderMessage(order, lang, d, ref);
  const shopText = lang === "fr" ? text : `${orderMessage(order, "fr", getDict("fr"), ref)}\n\n— ${lang.toUpperCase()} —\n\n${text}`;
  const resend = new Resend(key);
  const from = process.env.RESEND_FROM ?? "L'Orientale du Sud <onboarding@resend.dev>";
  try {
    await resend.emails.send({ from, to, subject: `${getDict("fr").email.subjectOrder}${ref ? ` · ${ref}` : ""}`, html: html(shopText), text: shopText, replyTo: order.email || undefined });
    if (order.email) {
      const clientText = `${d.email.intro}\n\n${text}\n\nWhatsApp : ${site.phoneIntl}\n${site.instagram}`;
      await resend.emails.send({ from, to: order.email, replyTo: to, subject: d.email.subjectClient, html: html(clientText), text: clientText });
    }
    return Response.json({ ok: true, emailed: true });
  } catch {
    return Response.json({ ok: true, emailed: false });
  }
}
