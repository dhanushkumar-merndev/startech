/**
 * Shape of the contact form's action state.
 *
 * This lives outside `app/contact/actions.ts` deliberately: a `"use server"`
 * module may only export async functions, so the initial-state constant
 * cannot sit alongside the action itself.
 */
export type EnquiryState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "company" | "brief", string>>;
};

export const initialEnquiryState: EnquiryState = { status: "idle" };
