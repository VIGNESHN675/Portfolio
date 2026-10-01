import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitize(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

// Very small in-memory rate limiter (per server instance) to slow down abuse.
// For real protection in production, use a durable store (e.g. Upstash) or
// a platform-level rate limit / WAF rule.
const submissions = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (submissions.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  submissions.set(ip, timestamps);
  return timestamps.length > MAX_PER_WINDOW;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { message: "Too many requests. Please try again in a minute." },
        { status: 429 }
      );
    }

    const body = (await req.json().catch(() => null)) as ContactPayload | null;
    if (!body) {
      return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
    }

    const name = sanitize(body.name, 120);
    const email = sanitize(body.email, 200);
    const message = sanitize(body.message, 5000);

    if (!name || !email || !message || !EMAIL_RE.test(email) || message.length < 10) {
      return NextResponse.json(
        { message: "Please provide a valid name, email, and message." },
        { status: 400 }
      );
    }

    // --- Configure exactly ONE of the providers below via environment
    // variables. Nothing is sent, and no fake success is returned, until
    // one is configured. See README.md → "Contact form setup".

    if (process.env.FORMSPREE_ENDPOINT) {
      const res = await fetch(process.env.FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) {
        return NextResponse.json(
          { message: "The message service is temporarily unavailable. Please try again later." },
          { status: 502 }
        );
      }
      return NextResponse.json({ message: "Message sent." }, { status: 200 });
    }

    if (process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || "Portfolio <onboarding@resend.dev>",
          to: process.env.CONTACT_TO_EMAIL,
          reply_to: email,
          subject: `New portfolio message from ${name}`,
          text: message,
        }),
      });
      if (!res.ok) {
        return NextResponse.json(
          { message: "The message service is temporarily unavailable. Please try again later." },
          { status: 502 }
        );
      }
      return NextResponse.json({ message: "Message sent." }, { status: 200 });
    }

    if (process.env.CONTACT_WEBHOOK_URL) {
      const res = await fetch(process.env.CONTACT_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) {
        return NextResponse.json(
          { message: "The message service is temporarily unavailable. Please try again later." },
          { status: 502 }
        );
      }
      return NextResponse.json({ message: "Message sent." }, { status: 200 });
    }

    // No provider configured — say so plainly instead of pretending it worked.
    console.warn(
      "[contact] No email provider configured. Set FORMSPREE_ENDPOINT, or RESEND_API_KEY + CONTACT_TO_EMAIL, or CONTACT_WEBHOOK_URL. See README.md."
    );
    return NextResponse.json(
      {
        message:
          "The contact form isn't configured yet. See README.md → Contact form setup to connect Formspree, Resend, or a custom webhook.",
      },
      { status: 501 }
    );
  } catch (err) {
    console.error("[contact] Unexpected error:", err);
    return NextResponse.json(
      { message: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
