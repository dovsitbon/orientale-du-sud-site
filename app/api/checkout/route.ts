import Stripe from "stripe";
import { getItem } from "@/lib/catalog";
import { getDict } from "@/lib/i18n";
import { cartTotals, itemName } from "@/lib/order";
import { parseLang, parseOrder } from "@/lib/validate";

// Paiement en ligne (Stripe Checkout), DÉSACTIVÉ par défaut : la cheffe valide d'abord chaque commande sur WhatsApp.
// Il ne s'active que si NEXT_PUBLIC_PAYMENT_MODE=stripe et STRIPE_SECRET_KEY sont définis,
// et seulement pour un panier entièrement chiffré et en retrait (les frais de livraison ne sont pas encore fixés).
// Les prix sont toujours recalculés ici à partir de data/menu.json.

export async function POST(req: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (process.env.NEXT_PUBLIC_PAYMENT_MODE !== "stripe" || !secret) return Response.json({ error: "payment-disabled" }, { status: 503 });

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const lang = parseLang(body?.lang);
  const order = parseOrder(body?.order);
  if (!order) return Response.json({ error: "invalid" }, { status: 400 });
  if (cartTotals(order.items).unpriced > 0 || order.mode === "delivery") return Response.json({ error: "unpriced" }, { status: 400 });

  const d = getDict(lang);
  const origin = new URL(req.url).origin;
  const stripe = new Stripe(secret);
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: order.items.map((l) => ({
      quantity: l.qty,
      price_data: { currency: "eur", unit_amount: Math.round((getItem(l.id)?.price ?? 0) * 100), product_data: { name: itemName(d, l.id) } },
    })),
    customer_email: order.email || undefined,
    locale: lang === "ar" ? "auto" : lang,
    metadata: { ref: String(body?.ref ?? "").slice(0, 20), date: order.date, slot: order.slot, phone: order.phone, name: order.name },
    success_url: `${origin}/${lang}?commande=ok`,
    cancel_url: `${origin}/${lang}/commande`,
  });
  return Response.json({ url: session.url });
}
