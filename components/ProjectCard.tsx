"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Code2 } from "lucide-react";
import { GithubIcon } from "./ui/BrandIcons";
import type { Project } from "@/data/portfolio";
import { useReducedMotion } from "@/lib/useReducedMotion";

export function ProjectCard({
  project,
  index,
  onViewDetails,
}: {
  project: Project;
  index: number;
  onViewDetails: (project: Project) => void;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.article
      initial={reduced ? {} : { opacity: 0, y: 20 }}
      whileInView={reduced ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition-colors hover:border-[var(--accent)]/50"
    >
      <div className="relative flex aspect-video items-center justify-center overflow-hidden border-b border-[var(--border)] bg-[var(--surface-2)]">
        {project.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image}
            alt={`${project.name} preview`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <Code2 size={32} className="text-[var(--muted)]" aria-hidden="true" />
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-[family-name:var(--font-display)] text-lg font-medium">
          {project.name}
        </h3>
        <p className="mt-2 text-sm text-[var(--muted)]">{project.tagline}</p>

        <ul className="mt-4 flex flex-wrap gap-2">
          {project.technologies.slice(0, 4).map((tech) => (
            <li
              key={tech}
              className="rounded-full bg-[var(--surface-2)] px-2.5 py-1 text-xs text-[var(--muted)]"
            >
              {tech}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex items-center justify-between border-t border-[var(--border)] pt-4">
          <div className="flex items-center gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.name} on GitHub`}
                className="text-[var(--muted)] transition-colors hover:text-[var(--text)]"
              >
                <GithubIcon width={17} height={17} />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.name} live demo`}
                className="text-[var(--muted)] transition-colors hover:text-[var(--text)]"
              >
                <ArrowUpRight size={17} />
              </a>
            )}
          </div>
          <button
            onClick={() => onViewDetails(project)}
            className="text-sm font-medium text-[var(--accent)] transition-opacity hover:opacity-80"
          >
            View details
          </button>
        </div>
      </div>
    </motion.article>
  );
}
