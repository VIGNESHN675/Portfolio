"use client";

import { motion } from "framer-motion";
import { skillGroups } from "@/data/portfolio";
import { SectionHeading } from "./ui/SectionHeading";
import { useReducedMotion } from "@/lib/useReducedMotion";

export function Skills() {
  const reduced = useReducedMotion();
  const groups = skillGroups.filter((g) => g.skills.length > 0);

  if (groups.length === 0) return null;

  return (
    <section id="skills" className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
      <SectionHeading
        title="Tools I reach for"
        description="Grouped by where they fit in the stack — trim or extend this list in data/portfolio.ts."
      />

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group, gi) => (
          <motion.div
            key={group.category}
            initial={reduced ? {} : { opacity: 0, y: 16 }}
            whileInView={reduced ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: gi * 0.05 }}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"
          >
            <h3 className="mb-4 font-[family-name:var(--font-display)] text-base font-medium">
              {group.category}
            </h3>
            <ul className="flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <li key={skill.name}>
                  <span className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1.5 text-sm text-[var(--text)] transition-colors hover:border-[var(--accent)]">
                    {skill.name}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
