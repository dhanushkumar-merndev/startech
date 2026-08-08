"use client";

import { useActionState, useState } from "react";
import { FaWhatsapp } from "react-icons/fa6";
import { submitEnquiry } from "@/app/contact/actions";
import { initialEnquiryState } from "@/lib/enquiry";
import { services } from "@/lib/site";

const budgets = ["Under ₹25K", "₹25K – ₹50K", "₹50K – ₹1.5L", "₹1.5L+", "Not sure yet"];

const initialFormValues = {
  name: "",
  email: "",
  company: "",
  phone: "",
  brief: "",
  budget: budgets[1],
  services: [] as string[],
};

const field =
  "w-full border-0 border-b border-line bg-transparent px-0 py-3.5 text-[0.9375rem] outline-none transition-colors duration-300 placeholder:text-muted/60 focus:border-brand";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitEnquiry, initialEnquiryState);
  const [values, setValues] = useState(initialFormValues);

  if (state.status === "success") {
    return (
      <div className="rounded-[22px] border border-line bg-bone p-10 md:p-14">
        <span className="grid size-12 place-items-center rounded-full bg-brand text-white">
          <FaWhatsapp aria-hidden className="size-6" />
        </span>
        <h2 className="d3 mt-8 font-display">One tap to send.</h2>
        <p className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-muted">{state.message}</p>
        {state.whatsappUrl && (
          <a
            href={state.whatsappUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="btn btn-red mt-8 !gap-2.5"
          >
            <FaWhatsapp aria-hidden className="size-[1.15em]" />
            Send on WhatsApp
          </a>
        )}
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="space-y-10">
      <div className="grid gap-8 sm:grid-cols-2">
        <Field label="Your name" error={state.fieldErrors?.name}>
          <input
            name="name"
            type="text"
            value={values.name}
            onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))}
            placeholder="Priya Nair"
            className={field}
            required
          />
        </Field>

        <Field label="Work email" error={state.fieldErrors?.email}>
          <input
            name="email"
            type="email"
            inputMode="email"
            value={values.email}
            onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))}
            placeholder="priya@company.in"
            className={field}
            required
          />
        </Field>

        <Field label="Company" error={state.fieldErrors?.company}>
          <input
            name="company"
            type="text"
            value={values.company}
            onChange={(event) => setValues((current) => ({ ...current, company: event.target.value }))}
            placeholder="Company name"
            className={field}
            required
          />
        </Field>

        <Field label="Phone (optional)">
          <input
            name="phone"
            type="tel"
            inputMode="tel"
            value={values.phone}
            onChange={(event) => setValues((current) => ({ ...current, phone: event.target.value }))}
            placeholder="+91"
            className={field}
          />
        </Field>
      </div>

      <fieldset>
        <legend className="eyebrow text-muted">What do you need?</legend>
        <div className="mt-5 flex flex-wrap gap-2">
          {services.map((s) => (
            <label
              key={s.id}
              className="tag cursor-pointer text-muted transition-colors duration-300 has-[:checked]:border-brand has-[:checked]:bg-brand has-[:checked]:text-white"
            >
              <input
                type="checkbox"
                name="services"
                value={s.title}
                checked={values.services.includes(s.title)}
                onChange={() =>
                  setValues((current) => ({
                    ...current,
                    services: current.services.includes(s.title)
                      ? current.services.filter((service) => service !== s.title)
                      : [...current.services, s.title],
                  }))
                }
                className="sr-only"
              />
              {s.title}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="eyebrow text-muted">Budget range</legend>
        <input type="hidden" name="budget" value={values.budget} />
        <div className="mt-5 flex flex-wrap gap-2">
          {budgets.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setValues((current) => ({ ...current, budget: b }))}
              aria-pressed={values.budget === b}
              className={`tag transition-colors duration-300 ${
                values.budget === b ? "border-ink bg-ink text-white" : "text-muted hover:border-ink/40"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </fieldset>

      <Field label="What are you trying to fix?" error={state.fieldErrors?.brief}>
        <textarea
          name="brief"
          rows={5}
          value={values.brief}
          onChange={(event) => setValues((current) => ({ ...current, brief: event.target.value }))}
          placeholder="The process that is costing you time or money, roughly how many people it touches, and any deadline you are working to."
          className={`${field} resize-none`}
          required
        />
      </Field>

      <div className="flex flex-wrap items-center gap-6 pt-2">
        <button type="submit" disabled={pending} className="btn btn-primary disabled:opacity-60">
          {pending ? "Sending…" : "Send brief"}
        </button>

        {state.status === "error" && (
          <p role="alert" className="text-sm text-brand">
            {state.message}
          </p>
        )}

        {state.status === "idle" && (
          <p className="text-sm text-muted">We reply within three working days.</p>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="eyebrow text-muted">{label}</span>
      <div className="mt-1">{children}</div>
      {error && (
        <span role="alert" className="mt-2 block text-xs text-brand">
          {error}
        </span>
      )}
    </label>
  );
}
