"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Loader2, Send } from "lucide-react";
import { personal, socialLinks } from "@/data/portfolio";
import { SectionHeading } from "./ui/SectionHeading";
import { useReducedMotion } from "@/lib/useReducedMotion";

type Status = "idle" | "loading" | "success" | "error";

type Errors = Partial<Record<"name" | "email" | "message", string>>;

function validate(values: { name: string; email: string; message: string }): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = "Please enter your name.";
  if (!values.email.trim()) {
    errors.email = "Please enter your email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (!values.message.trim() || values.message.trim().length < 10) {
    errors.message = "Your message should be at least 10 characters.";
  }
  return errors;
}

export function Contact() {
  const reduced = useReducedMotion();
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validation = validate(values);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setStatusMessage(
          data?.message || "Something went wrong sending your message. Please try again."
        );
        return;
      }

      setStatus("success");
      setStatusMessage("Your message has been sent. I'll get back to you soon.");
      setValues({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
      setStatusMessage("Network error — please check your connection and try again.");
    }
  };

  return (
    <section id="contact" className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
      <SectionHeading
        title="Let's build something great together."
        description="Have a project, an opportunity, or just want to say hi? Send a message."
      />

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1fr]">
        <motion.form
          initial={reduced ? {} : { opacity: 0, y: 16 }}
          whileInView={reduced ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
          noValidate
          className="space-y-5"
        >
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              value={values.name}
              onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--accent)]"
            />
            {errors.name && (
              <p id="name-error" className="mt-1.5 text-xs text-red-400">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--accent)]"
            />
            {errors.email && (
              <p id="email-error" className="mt-1.5 text-xs text-red-400">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              value={values.message}
              onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "message-error" : undefined}
              className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--accent)]"
            />
            {errors.message && (
              <p id="message-error" className="mt-1.5 text-xs text-red-400">
                {errors.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--text)] px-5 py-3 text-sm font-medium text-[var(--bg)] transition-opacity hover:opacity-85 disabled:opacity-60"
          >
            {status === "loading" ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
            Send message
          </button>

          <div role="status" aria-live="polite">
            {status === "success" && (
              <p className="flex items-center gap-2 text-sm text-emerald-400">
                <CheckCircle2 size={16} />
                {statusMessage}
              </p>
            )}
            {status === "error" && (
              <p className="flex items-center gap-2 text-sm text-red-400">
                <AlertCircle size={16} />
                {statusMessage}
              </p>
            )}
          </div>
        </motion.form>

        <motion.div
          initial={reduced ? {} : { opacity: 0, y: 16 }}
          whileInView={reduced ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"
        >
          <p className="text-sm text-[var(--muted)]">
            Prefer email or social? Reach me directly here.
          </p>
          <ul className="mt-4 space-y-3">
            {socialLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.url}
                  target={link.icon === "mail" ? undefined : "_blank"}
                  rel="noreferrer"
                  className="text-sm font-medium text-[var(--text)] transition-colors hover:text-[var(--accent)]"
                >
                  {link.label} — {link.url.replace("mailto:", "")}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-[var(--muted)]">
            Location: {personal.location}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
