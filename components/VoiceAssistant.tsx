"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Mic,
  MicOff,
  Send,
  X,
  Volume2,
  VolumeX,
  Keyboard,
  Loader2,
  Sparkles,
  Minus,
} from "lucide-react";
import { personal } from "@/data/portfolio";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/useReducedMotion";

type ChatMessage = { role: "user" | "assistant"; content: string };
type AssistantState = "idle" | "listening" | "thinking" | "speaking" | "error";

const WELCOME_MESSAGE: ChatMessage = {
  role: "assistant",
  content: `Hi! I'm ${personal.name}'s portfolio assistant. Ask me about their skills, projects, experience, or how to get in touch.`,
};

// Feature detection via useSyncExternalStore rather than effect+setState:
// the browser's SpeechRecognition support never changes after page load,
// so this is a one-shot external read, not a live subscription.
function noopSubscribe() {
  return () => {};
}
function getSpeechSupportSnapshot() {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}
function getSpeechSupportServerSnapshot() {
  return false;
}

const SUGGESTIONS = [
  "What skills do you have?",
  "What is your strongest project?",
  "Are you available for work?",
  "How can I contact you?",
];

export function VoiceAssistant() {
  const reduced = useReducedMotion();

  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const speechSupported = useSyncExternalStore(
    noopSubscribe,
    getSpeechSupportSnapshot,
    getSpeechSupportServerSnapshot
  );
  const [modeOverride, setModeOverride] = useState<"voice" | "text" | null>(null);
  const inputMode = modeOverride ?? (speechSupported ? "voice" : "text");
  const setInputMode = setModeOverride;
  const [showMicExplainer, setShowMicExplainer] = useState(false);
  const [muted, setMuted] = useState(false);

  const [state, setState] = useState<AssistantState>("idle");
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [draft, setDraft] = useState("");
  const [errorText, setErrorText] = useState("");

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: reduced ? "auto" : "smooth" });
  }, [messages, reduced]);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setState("idle");
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (muted || typeof window === "undefined" || !window.speechSynthesis) {
        setState("idle");
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.onstart = () => setState("speaking");
      utterance.onend = () => setState("idle");
      utterance.onerror = () => setState("idle");
      window.speechSynthesis.speak(utterance);
    },
    [muted]
  );

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      setErrorText("");
      const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
      setMessages(nextMessages);
      setDraft("");
      setState("thinking");

      try {
        const res = await fetch("/api/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: trimmed,
            history: nextMessages.slice(-6),
          }),
        });
        const data = await res.json();
        const reply: string = data?.reply || "Sorry, I couldn't process that.";

        setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
        speak(reply);
      } catch {
        const fallback = "Sorry, I'm having trouble connecting right now. Please try again.";
        setMessages((prev) => [...prev, { role: "assistant", content: fallback }]);
        setState("idle");
      }
    },
    [messages, speak]
  );

  const beginListening = useCallback(() => {
    const SpeechRecognitionCtor =
      typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : undefined;
    if (!SpeechRecognitionCtor) {
      setInputMode("text");
      setErrorText("Voice input isn't supported in this browser — you can type instead.");
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setState("listening");
    recognition.onerror = (event) => {
      setState("idle");
      if (event.error === "not-allowed" || event.error === "permission-denied") {
        setErrorText("Microphone access was denied. You can type your question instead.");
        setInputMode("text");
      } else if (event.error === "no-speech") {
        setErrorText("I didn't catch that — try again or type your question.");
      } else {
        setErrorText("Voice input hit a snag. You can type your question instead.");
      }
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript;
      if (transcript) sendMessage(transcript);
    };
    recognition.onend = () => {
      setState((s) => (s === "listening" ? "idle" : s));
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [sendMessage, setInputMode]);

  const handleMicClick = () => {
    if (state === "listening") {
      recognitionRef.current?.stop();
      setState("idle");
      return;
    }
    const alreadyExplained = typeof window !== "undefined" && window.localStorage.getItem("mic-explainer-seen");
    if (!alreadyExplained) {
      setShowMicExplainer(true);
      return;
    }
    beginListening();
  };

  const confirmMicExplainer = () => {
    window.localStorage.setItem("mic-explainer-seen", "1");
    setShowMicExplainer(false);
    beginListening();
  };

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <>
      {/* Floating trigger */}
      <motion.button
        onClick={() => {
          setOpen(true);
          setMinimized(false);
        }}
        aria-label="Open portfolio AI assistant"
        aria-haspopup="dialog"
        initial={reduced ? {} : { scale: 0, opacity: 0 }}
        animate={reduced ? {} : { scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className={cn(
          "fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105",
          open && !minimized && "pointer-events-none opacity-0"
        )}
        style={{
          background: "radial-gradient(circle at 30% 30%, var(--accent-2), var(--accent))",
        }}
      >
        <span className="absolute inset-0 -z-10 animate-pulse rounded-full bg-[var(--accent)] opacity-30 blur-xl" />
        <Sparkles size={22} className="text-black/80" />
      </motion.button>

      <AnimatePresence>
        {open && !minimized && (
          <motion.div
            role="dialog"
            aria-modal="false"
            aria-label={`${personal.name}'s portfolio assistant`}
            initial={reduced ? {} : { opacity: 0, y: 20, scale: 0.96 }}
            animate={reduced ? {} : { opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? {} : { opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-40 flex h-[520px] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full",
                    state === "listening" && "animate-pulse"
                  )}
                  style={{ background: "radial-gradient(circle at 30% 30%, var(--accent-2), var(--accent))" }}
                >
                  <Sparkles size={15} className="text-black/80" />
                </span>
                <div>
                  <p className="text-sm font-medium leading-tight">Portfolio Assistant</p>
                  <p className="text-xs leading-tight text-[var(--muted)]">
                    {state === "listening"
                      ? "Listening…"
                      : state === "thinking"
                      ? "Thinking…"
                      : state === "speaking"
                      ? "Speaking…"
                      : "Ask me anything"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setMuted((m) => !m)}
                  aria-label={muted ? "Unmute responses" : "Mute responses"}
                  className="rounded-full p-1.5 text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
                >
                  {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
                <button
                  onClick={() => setMinimized(true)}
                  aria-label="Minimize assistant"
                  className="rounded-full p-1.5 text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
                >
                  <Minus size={16} />
                </button>
                <button
                  onClick={() => {
                    stopSpeaking();
                    recognitionRef.current?.abort();
                    setOpen(false);
                  }}
                  aria-label="Close assistant"
                  className="rounded-full p-1.5 text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
                >
                  <p
                    className={cn(
                      "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
                      msg.role === "user"
                        ? "bg-[var(--text)] text-[var(--bg)]"
                        : "bg-[var(--surface-2)] text-[var(--text)]"
                    )}
                  >
                    {msg.content}
                  </p>
                </div>
              ))}
              {state === "thinking" && (
                <div className="flex justify-start">
                  <span className="flex items-center gap-2 rounded-2xl bg-[var(--surface-2)] px-3.5 py-2 text-sm text-[var(--muted)]">
                    <Loader2 size={14} className="animate-spin" />
                    Thinking…
                  </span>
                </div>
              )}
              {errorText && (
                <p className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-xs text-[var(--muted)]">
                  {errorText}
                </p>
              )}

              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--text)]"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-[var(--border)] p-3">
              {state === "speaking" && (
                <button
                  onClick={stopSpeaking}
                  className="mb-2 flex w-full items-center justify-center gap-2 rounded-full border border-[var(--border)] py-1.5 text-xs text-[var(--muted)] hover:bg-[var(--surface-2)]"
                >
                  <VolumeX size={13} />
                  Stop speaking
                </button>
              )}

              {inputMode === "voice" && speechSupported ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleMicClick}
                    aria-label={state === "listening" ? "Stop listening" : "Start voice input"}
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors",
                      state === "listening"
                        ? "border-red-400 bg-red-400/10 text-red-400"
                        : "border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-2)]"
                    )}
                  >
                    {state === "listening" ? <MicOff size={18} /> : <Mic size={18} />}
                  </button>
                  <p className="flex-1 truncate text-sm text-[var(--muted)]">
                    {state === "listening" ? "Listening — speak now…" : "Tap the mic and ask a question"}
                  </p>
                  <button
                    onClick={() => setInputMode("text")}
                    aria-label="Switch to text input"
                    className="rounded-full p-2 text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
                  >
                    <Keyboard size={17} />
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage(draft);
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Type a question…"
                    aria-label="Message the assistant"
                    className="flex-1 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
                  />
                  {speechSupported && (
                    <button
                      type="button"
                      onClick={() => setInputMode("voice")}
                      aria-label="Switch to voice input"
                      className="rounded-full p-2 text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
                    >
                      <Mic size={17} />
                    </button>
                  )}
                  <button
                    type="submit"
                    aria-label="Send message"
                    disabled={!draft.trim()}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--text)] text-[var(--bg)] disabled:opacity-40"
                  >
                    <Send size={15} />
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimized pill */}
      <AnimatePresence>
        {open && minimized && (
          <motion.button
            initial={reduced ? {} : { opacity: 0, y: 10 }}
            animate={reduced ? {} : { opacity: 1, y: 0 }}
            exit={reduced ? {} : { opacity: 0, y: 10 }}
            onClick={() => setMinimized(false)}
            className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm shadow-lg"
          >
            <Sparkles size={15} className="text-[var(--accent)]" />
            Portfolio Assistant
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mic permission explainer */}
      <AnimatePresence>
        {showMicExplainer && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowMicExplainer(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="mic-explainer-title"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"
            >
              <h3 id="mic-explainer-title" className="mb-2 font-[family-name:var(--font-display)] text-lg font-semibold">
                Microphone access
              </h3>
              <p className="mb-5 text-sm leading-relaxed text-[var(--muted)]">
                This assistant can listen to your question using your browser&apos;s built-in speech
                recognition. Audio is processed by your browser, not recorded or stored by this site.
                You can always type your question instead.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowMicExplainer(false);
                    setInputMode("text");
                  }}
                  className="rounded-full border border-[var(--border)] px-4 py-2 text-sm hover:bg-[var(--surface-2)]"
                >
                  Type instead
                </button>
                <button
                  onClick={confirmMicExplainer}
                  className="rounded-full bg-[var(--text)] px-4 py-2 text-sm font-medium text-[var(--bg)]"
                >
                  Allow microphone
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
