import { escapeHtml } from "@/lib/validate";

/** Corps HTML simple d'un e-mail à partir du récapitulatif texte (les *gras* WhatsApp deviennent <strong>). */
export const emailHtml = (text: string) =>
  `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#2B231C;white-space:pre-wrap">${escapeHtml(text).replace(/\*(.+?)\*/g, "<strong>$1</strong>")}</div>`;
