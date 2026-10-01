"use client";

import { motion } from "framer-motion";
import { Download, MapPin, GraduationCap, Compass, Sparkles } from "lucide-react";
import { personal } from "@/data/portfolio";
import { SectionHeading } from "./ui/SectionHeading";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useResumeClick } from "@/lib/useResumeClick";

const infoCards = [
  {
    icon: Compass,
    label: "Current focus",
    value: personal.currentFocus,
  },
  {
    icon: Sparkles,
    label: "Career interests",
    value: personal.careerInterests,
  },
  {
    icon: MapPin,
    label: "Location",
    value: personal.location,
  },
];

export function About() {
  const reduced = useReducedMotion();
  const onResumeClick = useResumeClick();

  return (
    <section id="about" className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
      <SectionHeading title="A little about how I work" />

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          initial={reduced ? {} : { opacity: 0, y: 16 }}
          whileInView={reduced ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="space-y-5"
        >
          <p className="text-lg leading-relaxed text-[var(--text)]">{personal.aboutIntro}</p>
          <p className="leading-relaxed text-[var(--muted)]">{personal.aboutStory}</p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href={personal.resumeUrl}
              onClick={onResumeClick}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--text)] px-5 py-2.5 text-sm font-medium text-[var(--bg)] transition-opacity hover:opacity-85"
            >
              <Download size={15} />
              Download resume
            </a>
          </div>

          {personal.education.length > 0 && (
            <div className="!mt-8 space-y-3 border-t border-[var(--border)] pt-6">
              {personal.education.map((edu) => (
                <div key={edu.school} className="flex items-start gap-3">
                  <GraduationCap size={18} className="mt-0.5 shrink-0 text-[var(--accent)]" />
                  <div>
                    <p className="text-sm font-medium">{edu.degree}</p>
                    <p className="text-sm text-[var(--muted)]">
                      {edu.school} · {edu.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={reduced ? {} : { opacity: 0, y: 16 }}
          whileInView={reduced ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1"
        >
          {infoCards.map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
            >
              <card.icon size={18} className="mb-3 text-[var(--accent-2)]" />
              <p className="text-sm text-[var(--muted)]">{card.label}</p>
              <p className="mt-1 text-sm leading-relaxed">{card.value}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
