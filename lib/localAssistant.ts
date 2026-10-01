import { personal, skillGroups, projects, experience, socialLinks, github } from "@/data/portfolio";

type Intent = {
  patterns: RegExp[];
  respond: () => string;
};

function list(items: string[], conjunction = "and"): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, ${conjunction} ${items[items.length - 1]}`;
}

function buildIntents(): Intent[] {
  const allSkills = skillGroups.flatMap((g) => g.skills.map((s) => s.name));
  const email = socialLinks.find((s) => s.icon === "mail");
  const githubLink = socialLinks.find((s) => s.icon === "github");
  const featuredProjects = projects.filter((p) => p.featured).length ? projects.filter((p) => p.featured) : projects;

  return [
    {
      patterns: [/who are you/i, /what are you/i],
      respond: () =>
        `Hi! I'm ${personal.name}'s portfolio assistant. I can tell you about their skills, projects, experience, and how to get in touch.`,
    },
    {
      patterns: [/tell me about yourself/i, /about (him|her|them|you)/i, /introduce/i],
      respond: () => personal.aboutIntro,
    },
    {
      patterns: [/what skills/i, /skills do you have/i, /what technolog(y|ies) do you use/i, /tech stack/i],
      respond: () =>
        allSkills.length > 0
          ? `${personal.name} works with ${list(allSkills.slice(0, 10))}${allSkills.length > 10 ? ", among others" : ""}.`
          : "Skills haven't been configured yet — check back soon.",
    },
    {
      patterns: [/strongest project/i, /best project/i, /favorite project/i],
      respond: () => {
        const top = featuredProjects[0];
        return top
          ? `One project worth highlighting is "${top.name}" — ${top.tagline}`
          : "Project details haven't been configured yet.";
      },
    },
    {
      patterns: [/what projects/i, /projects have you built/i, /show me.*projects/i, /portfolio.*projects/i],
      respond: () =>
        projects.length > 0
          ? `${personal.name} has built ${list(projects.map((p) => `"${p.name}"`))}. Ask about any of them for more detail, or check the Projects section.`
          : "Projects haven't been configured yet.",
    },
    {
      patterns: [/experience/i, /where.*work/i, /work history/i, /background/i],
      respond: () =>
        experience.length > 0
          ? `${personal.name}'s background includes ${list(experience.map((e) => `${e.role} at ${e.organization}`))}.`
          : "Experience details haven't been configured yet.",
    },
    {
      patterns: [/contact/i, /reach (him|her|them|you)/i, /email/i, /get in touch/i],
      respond: () =>
        email
          ? `You can reach ${personal.name} at ${email.url.replace("mailto:", "")}, or use the contact form on this page.`
          : "Use the contact form on this page to get in touch.",
    },
    {
      patterns: [/available/i, /hire/i, /looking for work/i, /open to/i],
      respond: () =>
        personal.availableForWork
          ? `Yes — ${personal.name} is currently available for new opportunities.`
          : `${personal.name} isn't currently looking for new opportunities, but feel free to reach out.`,
    },
    {
      patterns: [/github/i, /repositories/i, /repos/i],
      respond: () =>
        githubLink
          ? `You can find ${personal.name}'s code on GitHub at ${githubLink.url}.`
          : `GitHub username: ${github.username}.`,
    },
    {
      patterns: [/location/i, /where.*based/i, /where.*live/i],
      respond: () => `${personal.name} is based in ${personal.location}.`,
    },
    {
      patterns: [/resume/i, /cv/i],
      respond: () => "You can download a resume using the Resume button in the navigation bar.",
    },
    {
      patterns: [/hello|hi there|^hi$|hey/i],
      respond: () => `Hey! Ask me about ${personal.name}'s skills, projects, experience, or how to get in touch.`,
    },
    {
      patterns: [/thank/i],
      respond: () => "You're welcome! Anything else you'd like to know?",
    },
  ];
}

/**
 * Matches a user message against a small set of portfolio-specific intents.
 * This runs entirely on the server with no external API calls or network
 * access, so it always works even without an AI API key configured.
 */
export function getLocalAssistantReply(message: string): string {
  const intents = buildIntents();
  const trimmed = message.trim();

  for (const intent of intents) {
    if (intent.patterns.some((pattern) => pattern.test(trimmed))) {
      return intent.respond();
    }
  }

  return `I'm not sure about that one. You can ask me about ${personal.name}'s skills, projects, experience, availability, or how to get in touch.`;
}
