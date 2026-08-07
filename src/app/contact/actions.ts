"use server";

import type { EnquiryState } from "@/lib/enquiry";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Validates an enquiry and hands it on.
 *
 * The delivery step is intentionally a single seam: drop your transactional
 * email provider, CRM webhook or database write where `deliver` is called and
 * nothing else in the form has to change.
 */
export async function submitEnquiry(
  _prev: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
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
    };
  }

  await deliver({ name, email, company, brief, budget, services });

  return {
    status: "success",
    message: `Thanks ${name.split(" ")[0]} — we have your brief and will reply within three working days.`,
  };
}

type Enquiry = {
  name: string;
  email: string;
  company: string;
  brief: string;
  budget: string;
  services: string[];
};

async function deliver(enquiry: Enquiry) {
  // TODO: replace with the real destination (Resend / SES / CRM webhook).
  // Kept as a server-side log so the form is honest about what it does today.
  console.log("[enquiry]", {
    ...enquiry,
    brief: `${enquiry.brief.slice(0, 80)}…`,
    receivedAt: new Date().toISOString(),
  });
}
