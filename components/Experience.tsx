"use client";

import { motion } from "framer-motion";
import { experience } from "@/data/portfolio";
import { SectionHeading } from "./ui/SectionHeading";
import { useReducedMotion } from "@/lib/useReducedMotion";

export function Experience() {
  const reduced = useReducedMotion();

  if (experience.length === 0) return null;

  const hasWorkExperience = experience.some((e) => e.type === "work");
  const title = hasWorkExperience ? "Where I've worked" : "Projects & learning journey";
  const description = hasWorkExperience
    ? "A timeline of roles and the technologies involved."
    : "I'm early in my career — here's how I've been building and learning.";

  return (
    <section id="experience" className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
      <SectionHeading title={title} description={description} />

      <ol className="mt-12 space-y-10 border-l border-[var(--border)] pl-8">
        {experience.map((entry, i) => (
          <motion.li
            key={`${entry.role}-${entry.organization}`}
            initial={reduced ? {} : { opacity: 0, x: -12 }}
            whileInView={reduced ? {} : { opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="relative"
          >
            <span className="absolute -left-[2.28rem] top-1.5 h-3 w-3 rounded-full border-2 border-[var(--bg)] bg-[var(--accent)]" />

            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="font-[family-name:var(--font-display)] text-lg font-medium">
                {entry.role}
              </h3>
              <span className="text-sm text-[var(--muted)]">{entry.date}</span>
            </div>
            <p className="text-sm text-[var(--muted)]">
              {entry.organization}
              {entry.location ? ` · ${entry.location}` : ""}
            </p>

            <ul className="mt-3 list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-[var(--text)]">
              {entry.responsibilities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            {entry.technologies && entry.technologies.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-2">
                {entry.technologies.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-full bg-[var(--surface-2)] px-2.5 py-1 text-xs text-[var(--muted)]"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            )}
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
