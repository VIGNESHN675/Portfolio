import { Mail, Globe } from "lucide-react";
import { GithubIcon, LinkedinIcon, XIcon } from "./ui/BrandIcons";
import { personal, socialLinks } from "@/data/portfolio";

const ICONS = { github: GithubIcon, linkedin: LinkedinIcon, mail: Mail, globe: Globe, twitter: XIcon };

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row sm:px-8">
        <p className="text-sm text-[var(--muted)]">
          © {new Date().getFullYear()} {personal.name}. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          {socialLinks.map((link) => {
            const Icon = ICONS[link.icon];
            return (
              <a
                key={link.label}
                href={link.url}
                target={link.icon === "mail" ? undefined : "_blank"}
                rel="noreferrer"
                aria-label={link.label}
                className="text-[var(--muted)] transition-colors hover:text-[var(--text)]"
              >
                <Icon width={17} height={17} />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
