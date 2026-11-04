import { Resend } from "resend";
import site from "@/data/site.json";
import { getDict } from "@/lib/i18n";
import { quoteMessage } from "@/lib/quote";
import { emailHtml as html } from "@/lib/email";
import { parseLang, parseQuote } from "@/lib/validate";

// E-mails envoyés seulement si RESEND_API_KEY et NOTIFY_EMAIL sont configurés (Vercel → Environment Variables).
// RESEND_FROM doit utiliser un domaine vérifié dans Resend, ex. « L'Orientale du Sud <contact@domaine.fr> ».
// La demande part de toute façon sur WhatsApp côté client : l'e-mail en est la copie.

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const lang = parseLang(body?.lang);
  const quote = parseQuote(body?.quote, lang);
  if (!body || !quote) return Response.json({ ok: false }, { status: 400 });
  const d = getDict(lang);
  const ref = typeof body.ref === "string" ? body.ref.slice(0, 20) : undefined;

  const key = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL;
  if (!key || !to) return Response.json({ ok: true, emailed: false });

  const text = quoteMessage(quote, lang, d, ref);
  // La cheffe reçoit toujours la version française, suivie de la version du client
  const shopText = lang === "fr" ? text : `${quoteMessage(quote, "fr", getDict("fr"), ref)}\n\n— ${lang.toUpperCase()} —\n\n${text}`;
  const resend = new Resend(key);
  const from = process.env.RESEND_FROM ?? "L'Orientale du Sud <onboarding@resend.dev>";
  try {
    await resend.emails.send({ from, to, subject: `${getDict("fr").email.subjectBusiness}${ref ? ` · ${ref}` : ""}`, html: html(shopText), text: shopText, replyTo: quote.email || undefined });
    if (quote.email) {
      const clientText = `${d.email.intro}\n\n${text}\n\nWhatsApp : ${site.phoneIntl}\n${site.instagram}`;
      await resend.emails.send({ from, to: quote.email, replyTo: to, subject: d.email.subjectClient, html: html(clientText), text: clientText });
    }
    return Response.json({ ok: true, emailed: true });
  } catch {
    return Response.json({ ok: true, emailed: false });
  }
}
