/**
 * Server-side WhatsApp delivery via Meta's Cloud API.
 *
 * Credentials come from the environment, so nothing secret lives in the repo
 * and the integration is entirely optional — with nothing configured the
 * caller falls back to handing the visitor a pre-written wa.me link instead of
 * pretending the message went out.
 *
 * One rule of the platform shapes this file: an enquiry notification is a
 * *business-initiated* message, and those must use an approved template unless
 * the recipient messaged the business number within the last 24 hours. Set
 * WHATSAPP_TEMPLATE_NAME once your template is approved. Without it this sends
 * plain text, which Meta accepts only inside that 24-hour window — fine for
 * testing, not something to rely on in production.
 */

const GRAPH_VERSION = "v21.0";

export type SendResult = { ok: true } | { ok: false; reason: string };

/** Distinguishes "no credentials yet" from "the send actually failed". */
export const NOT_CONFIGURED = "not-configured";

/**
 * Template variables reject newlines, tabs and runs of spaces, and are capped
 * well below the free-text limit — so the brief is flattened to one line.
 */
function flatten(text: string, limit = 900) {
  const single = text.replace(/\s+/g, " ").trim();
  return single.length > limit ? `${single.slice(0, limit - 1)}…` : single;
}

export async function sendWhatsApp(to: string, message: string): Promise<SendResult> {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneNumberId) return { ok: false, reason: NOT_CONFIGURED };

  const templateName = process.env.WHATSAPP_TEMPLATE_NAME;
  const payload = templateName
    ? {
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: templateName,
          language: { code: process.env.WHATSAPP_TEMPLATE_LANGUAGE ?? "en" },
          components: [{ type: "body", parameters: [{ type: "text", text: flatten(message) }] }],
        },
      }
    : { messaging_product: "whatsapp", to, type: "text", text: { body: message } };

  try {
    const response = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      },
    );

    if (response.ok) return { ok: true };

    // Meta puts the useful part in error.message; keep enough of it to debug
    // from the server log without dumping the whole payload.
    const detail = await response.text();
    return { ok: false, reason: `${response.status} ${detail.slice(0, 300)}` };
  } catch (error) {
    return { ok: false, reason: error instanceof Error ? error.message : "request failed" };
  }
}
