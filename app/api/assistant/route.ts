import { NextRequest, NextResponse } from "next/server";
import { getLocalAssistantReply } from "@/lib/localAssistant";
import { assistantKnowledgeBase, personal } from "@/data/portfolio";

export const runtime = "nodejs";

type ChatMessage = { role: "user" | "assistant"; content: string };

const MAX_MESSAGE_LENGTH = 500;
const MAX_HISTORY = 6;

// Simple in-memory rate limiter, per server instance.
const requests = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 20;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (requests.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  requests.set(ip, timestamps);
  return timestamps.length > MAX_PER_WINDOW;
}

function buildSystemPrompt(): string {
  return `You are ${personal.name}'s portfolio assistant, embedded on their personal website.
Answer only using the structured knowledge base below. Keep answers short (1-3 sentences),
friendly, and professional — suitable for being read aloud by text-to-speech.
If asked something outside this knowledge base (e.g. unrelated general knowledge, opinions
on other people, or anything not about ${personal.name}'s work), politely say you can only
answer questions about ${personal.name}'s background, skills, projects, and contact info.
Never invent facts that are not present in the knowledge base.

Knowledge base:
${JSON.stringify(assistantKnowledgeBase, null, 2)}`;
}

/** Calls an external AI API server-side. API key never reaches the client. */
async function getExternalAssistantReply(
  message: string,
  history: ChatMessage[]
): Promise<string | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 300,
        system: buildSystemPrompt(),
        messages: [...history, { role: "user", content: message }],
      }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    const text = data?.content
      ?.map((block: { type: string; text?: string }) => (block.type === "text" ? block.text : ""))
      .filter(Boolean)
      .join(" ");

    return text || null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { reply: "I'm getting a lot of questions right now — please try again in a moment." },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);
    const rawMessage = typeof body?.message === "string" ? body.message : "";
    const message = rawMessage.trim().slice(0, MAX_MESSAGE_LENGTH);

    if (!message) {
      return NextResponse.json({ reply: "Could you rephrase that?" }, { status: 400 });
    }

    const rawHistory: unknown[] = Array.isArray(body?.history) ? body.history : [];
    const history: ChatMessage[] = rawHistory
      .filter(
        (m): m is ChatMessage =>
          typeof m === "object" &&
          m !== null &&
          (m as ChatMessage).role &&
          typeof (m as ChatMessage).content === "string"
      )
      .slice(-MAX_HISTORY)
      .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_LENGTH) }));

    const externalReply = await getExternalAssistantReply(message, history);
    if (externalReply) {
      return NextResponse.json({ reply: externalReply, source: "ai" });
    }

    // Local fallback — always available, no API key required.
    const reply = getLocalAssistantReply(message);
    return NextResponse.json({ reply, source: "local" });
  } catch (err) {
    console.error("[assistant] Unexpected error:", err);
    return NextResponse.json(
      { reply: "Sorry, something went wrong on my end. Please try again." },
      { status: 500 }
    );
  }
}
