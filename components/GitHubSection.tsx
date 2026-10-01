import Image from "next/image";
import { Star, GitFork, ArrowUpRight } from "lucide-react";
import { GithubIcon } from "./ui/BrandIcons";
import { fetchGithubData } from "@/lib/github";
import { github, projects } from "@/data/portfolio";
import { SectionHeading } from "./ui/SectionHeading";

export async function GitHubSection() {
  const data = await fetchGithubData(github.username);

  return (
    <section id="github" className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
      <SectionHeading
        title="On GitHub"
        description={
          data
            ? "A live snapshot of my public repositories."
            : "Configure NEXT_PUBLIC_GITHUB_USERNAME to show a live snapshot of repositories here."
        }
      />

      <div className="mt-12">
        {data ? (
          <>
            <div className="mb-8 flex flex-wrap items-center gap-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
              <Image
                src={data.profile.avatarUrl}
                alt={`${data.profile.login}'s GitHub avatar`}
                width={64}
                height={64}
                className="h-16 w-16 rounded-full border border-[var(--border)]"
              />
              <div className="flex-1">
                <p className="font-[family-name:var(--font-display)] text-lg font-medium">
                  {data.profile.name || data.profile.login}
                </p>
                {data.profile.bio && (
                  <p className="text-sm text-[var(--muted)]">{data.profile.bio}</p>
                )}
                <div className="mt-2 flex gap-4 text-sm text-[var(--muted)]">
                  <span>{data.profile.publicRepos} repositories</span>
                  <span>{data.profile.followers} followers</span>
                </div>
              </div>
              <a
                href={data.profile.htmlUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-sm transition-colors hover:bg-[var(--surface-2)]"
              >
                View GitHub profile
                <ArrowUpRight size={15} />
              </a>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.repos.map((repo) => (
                <a
                  key={repo.name}
                  href={repo.htmlUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-colors hover:border-[var(--accent)]/50"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <p className="font-medium">{repo.name}</p>
                    <ArrowUpRight
                      size={15}
                      className="text-[var(--muted)] opacity-0 transition-opacity group-hover:opacity-100"
                    />
                  </div>
                  {repo.description && (
                    <p className="mb-3 line-clamp-2 text-sm text-[var(--muted)]">
                      {repo.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-[var(--muted)]">
                    {repo.language && <span>{repo.language}</span>}
                    <span className="inline-flex items-center gap-1">
                      <Star size={12} />
                      {repo.stars}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-10 text-center">
            <GithubIcon width={28} height={28} className="mx-auto mb-3 text-[var(--muted)]" />
            <p className="text-sm text-[var(--muted)]">
              GitHub data isn&apos;t available right now — showing configured projects instead.
            </p>
            <a
              href={github.profileUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-sm transition-colors hover:bg-[var(--surface-2)]"
            >
              View GitHub profile
              <ArrowUpRight size={15} />
            </a>
            {projects.length > 0 && (
              <div className="mt-6 grid grid-cols-1 gap-4 text-left sm:grid-cols-2 lg:grid-cols-3">
                {projects.slice(0, 3).map((p) => (
                  <div key={p.slug} className="rounded-xl border border-[var(--border)] p-4">
                    <p className="flex items-center gap-2 text-sm font-medium">
                      <GitFork size={13} className="text-[var(--muted)]" />
                      {p.name}
                    </p>
                    <p className="mt-1 text-xs text-[var(--muted)]">{p.tagline}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
