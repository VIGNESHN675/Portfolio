"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Download } from "lucide-react";
import { personal } from "@/data/portfolio";
import { NetworkVisual } from "./NetworkVisual";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useResumeClick } from "@/lib/useResumeClick";

export function Hero() {
  const reduced = useReducedMotion();
  const onResumeClick = useResumeClick();

  const fadeUp = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.55, delay, ease: "easeOut" as const },
        };

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden pt-28 pb-16"
    >
      {/* Subtle background grid + glow — non-distracting, static after load */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-[0.35] grid-fade"
          style={{
            backgroundImage:
              "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[var(--accent)] opacity-[0.10] blur-[120px]" />
      </div>

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
        <div>
          {personal.availableForWork && (
            <motion.div
              {...fadeUp(0)}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--muted)]"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Available for opportunities
            </motion.div>
          )}

          <motion.p {...fadeUp(0.05)} className="mb-3 text-lg text-[var(--muted)]">
            {personal.heroGreeting}
          </motion.p>

          <motion.h1
            {...fadeUp(0.12)}
            className="text-balance font-[family-name:var(--font-display)] text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
          >
            {personal.heroHeadline}
          </motion.h1>

          <motion.p
            {...fadeUp(0.22)}
            className="mt-6 max-w-lg text-balance text-base leading-relaxed text-[var(--muted)] sm:text-lg"
          >
            {personal.heroSubtext}
          </motion.p>

          <motion.div {...fadeUp(0.32)} className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--text)] px-5 py-3 text-sm font-medium text-[var(--bg)] transition-transform hover:-translate-y-0.5"
            >
              View my projects
              <ArrowRight size={16} />
            </a>
            <a
              href={personal.resumeUrl}
              onClick={onResumeClick}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-5 py-3 text-sm font-medium transition-colors hover:bg-[var(--surface-2)]"
            >
              <Download size={16} />
              Download resume
            </a>
          </motion.div>

          <motion.a
            {...fadeUp(0.4)}
            href="#contact"
            className="mt-6 inline-flex items-center gap-1 text-sm text-[var(--muted)] transition-colors hover:text-[var(--text)]"
          >
            Let&apos;s connect
            <ArrowUpRight size={14} />
          </motion.a>
        </div>

        <motion.div
          initial={reduced ? {} : { opacity: 0, scale: 0.94 }}
          animate={reduced ? {} : { opacity: 1, scale: 1 }}
          transition={reduced ? {} : { duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="relative mx-auto aspect-square w-full max-w-md"
          aria-hidden={false}
        >
          <div className="absolute inset-0 rounded-3xl border border-[var(--border)] bg-[var(--surface)]/40" />
          <NetworkVisual />
        </motion.div>
      </div>
    </section>
  );
}
