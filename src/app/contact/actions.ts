"use server";

import type { EnquiryState } from "@/lib/enquiry";
import { site } from "@/lib/site";
import { NOT_CONFIGURED, sendWhatsApp } from "@/lib/whatsapp";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Validates an enquiry and prepares it for WhatsApp.
 *
 * Delivery is a wa.me hand-off: the server checks the fields and writes the
 * message, and the visitor sends it from their own WhatsApp. That means the
 * enquiry arrives from a real number you can reply to directly, with no API
 * credentials involved — but it also means it is only delivered once they
 * press send, which is why the confirmation screen asks them to rather than
 * claiming we already have it.
 */
export async function submitEnquiry(
  _prev: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const brief = String(formData.get("brief") ?? "").trim();
  const budget = String(formData.get("budget") ?? "").trim();
  const services = formData.getAll("services").map(String);

  const fieldErrors: EnquiryState["fieldErrors"] = {};
  if (name.length < 2) fieldErrors.name = "Please tell us your name.";
  if (!EMAIL.test(email)) fieldErrors.email = "That email address does not look right.";
  if (company.length < 2) fieldErrors.company = "Which company are you with?";
  if (brief.length < 20) fieldErrors.brief = "A sentence or two more would help us reply usefully.";

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Some details need another look.",
      fieldErrors,
      values: { name, email, company, phone, brief, budget, services },
    };
  }

  const enquiry: Enquiry = { name, email, company, phone, brief, budget, services };
  const firstName = name.split(" ")[0];

  // A trace in the server log, so an enquiry always leaves a footprint even if
  // the message itself never goes out.
  console.log("[enquiry]", {
    ...enquiry,
    brief: `${brief.slice(0, 80)}…`,
    receivedAt: new Date().toISOString(),
  });

  const delivery = await sendWhatsApp(site.whatsapp, compose(enquiry));

  if (delivery.ok) {
    return {
      status: "success",
      message: `Thanks ${firstName} — your brief is with us on WhatsApp. We reply within three working days.`,
    };
  }

  if (delivery.reason !== NOT_CONFIGURED) {
    console.error("[enquiry] WhatsApp delivery failed:", delivery.reason);
  }

  // Nothing was actually sent, so hand the visitor the message to send
  // themselves rather than telling them it arrived.
  return {
    status: "success",
    message: `Thanks ${firstName} — your brief is written and ready. Send it on WhatsApp and it reaches us straight away.`,
    whatsappUrl: `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(compose(enquiry))}`,
  };
}

type Enquiry = {
  name: string;
  email: string;
  company: string;
  phone: string;
  brief: string;
  budget: string;
  services: string[];
};

/** The enquiry as it reads in WhatsApp. */
function compose(enquiry: Enquiry) {
  return [
    "New enquiry from the Star Tech India website",
    "",
    `Name: ${enquiry.name}`,
    `Company: ${enquiry.company}`,
    `Email: ${enquiry.email}`,
    `Phone: ${enquiry.phone || "Not given"}`,
    `Budget: ${enquiry.budget || "Not specified"}`,
    `Services: ${enquiry.services.length > 0 ? enquiry.services.join(", ") : "Not specified"}`,
    "",
    "Brief:",
    enquiry.brief,
  ].join("\n");
}
