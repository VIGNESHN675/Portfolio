"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

export function SectionHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
  /** @deprecated kept for backwards compat, unused */
  eyebrow?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? {} : { opacity: 0, y: 12 }}
      whileInView={reduced ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="max-w-xl"
    >
      <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-[var(--muted)]">{description}</p>
      )}
    </motion.div>
  );
}
