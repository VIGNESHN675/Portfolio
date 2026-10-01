"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { GithubIcon } from "./ui/BrandIcons";
import { projects, type Project } from "@/data/portfolio";
import { SectionHeading } from "./ui/SectionHeading";
import { Modal } from "./ui/Modal";
import { ProjectCard } from "./ProjectCard";

export function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);

  if (projects.length === 0) return null;

  return (
    <section id="projects" className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
      <SectionHeading
        title="Selected work"
        description="A mix of shipped products and self-directed builds. Replace these with your own projects in data/portfolio.ts."
      />

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <ProjectCard
            key={project.slug}
            project={project}
            index={i}
            onViewDetails={setSelected}
          />
        ))}
      </div>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name ?? ""}
      >
        {selected && (
          <div className="space-y-4">
            <p className="text-sm text-[var(--muted)]">{selected.tagline}</p>

            <div>
              <h4 className="mb-1 text-sm font-medium">Overview</h4>
              <p className="text-sm leading-relaxed text-[var(--muted)]">
                {selected.description}
              </p>
            </div>

            <div>
              <h4 className="mb-1 text-sm font-medium">Problem solved</h4>
              <p className="text-sm leading-relaxed text-[var(--muted)]">
                {selected.problem}
              </p>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-medium">Technologies</h4>
              <ul className="flex flex-wrap gap-2">
                {selected.technologies.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-full bg-[var(--surface-2)] px-2.5 py-1 text-xs text-[var(--muted)]"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              {selected.githubUrl && (
                <a
                  href={selected.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-sm transition-colors hover:bg-[var(--surface-2)]"
                >
                  <GithubIcon width={15} height={15} />
                  View code
                </a>
              )}
              {selected.liveUrl && (
                <a
                  href={selected.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--text)] px-4 py-2 text-sm font-medium text-[var(--bg)]"
                >
                  Live demo
                  <ArrowUpRight size={15} />
                </a>
              )}
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
