/**
 * Shape of the contact form's action state.
 *
 * This lives outside `app/contact/actions.ts` deliberately: a `"use server"`
 * module may only export async functions, so the initial-state constant
 * cannot sit alongside the action itself.
 */
export type EnquiryValues = {
  name: string;
  email: string;
  company: string;
  phone: string;
  brief: string;
  budget: string;
  services: string[];
};

export type EnquiryState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "company" | "brief", string>>;
  /** Values returned after validation fails, so visitors never have to retype them. */
  values?: EnquiryValues;
  /** wa.me link with the brief pre-written, handed back on a valid submit. */
  whatsappUrl?: string;
};

export const initialEnquiryState: EnquiryState = { status: "idle" };
