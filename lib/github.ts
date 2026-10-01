export type GithubProfile = {
  login: string;
  name: string | null;
  bio: string | null;
  avatarUrl: string;
  publicRepos: number;
  followers: number;
  htmlUrl: string;
};

export type GithubRepo = {
  name: string;
  htmlUrl: string;
  description: string | null;
  stars: number;
  language: string | null;
  updatedAt: string;
};

export type GithubData = {
  profile: GithubProfile;
  repos: GithubRepo[];
};

/**
 * Fetches public GitHub profile + top repositories for a username.
 * Uses only unauthenticated public endpoints — no token required or exposed.
 * Returns null on any failure so the UI can fall back gracefully.
 */
export async function fetchGithubData(username: string): Promise<GithubData | null> {
  if (!username || username.startsWith("[")) return null;

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, {
        next: { revalidate: 3600 },
        headers: { Accept: "application/vnd.github+json" },
      }),
      fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`,
        { next: { revalidate: 3600 }, headers: { Accept: "application/vnd.github+json" } }
      ),
    ]);

    if (!userRes.ok || !reposRes.ok) return null;

    const user = await userRes.json();
    const repos = await reposRes.json();

    if (!Array.isArray(repos)) return null;

    return {
      profile: {
        login: user.login,
        name: user.name,
        bio: user.bio,
        avatarUrl: user.avatar_url,
        publicRepos: user.public_repos ?? 0,
        followers: user.followers ?? 0,
        htmlUrl: user.html_url,
      },
      repos: repos
        .filter((r: { fork: boolean }) => !r.fork)
        .sort((a: { stargazers_count: number }, b: { stargazers_count: number }) => b.stargazers_count - a.stargazers_count)
        .slice(0, 6)
        .map((r: {
          name: string;
          html_url: string;
          description: string | null;
          stargazers_count: number;
          language: string | null;
          updated_at: string;
        }) => ({
          name: r.name,
          htmlUrl: r.html_url,
          description: r.description,
          stars: r.stargazers_count,
          language: r.language,
          updatedAt: r.updated_at,
        })),
    };
  } catch {
    return null;
  }
}
