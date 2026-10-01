"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Moon, Sun, FileText } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./ui/BrandIcons";
import { useTheme } from "@/lib/theme";
import { personal, socialLinks } from "@/data/portfolio";
import { cn } from "@/lib/cn";
import { useResumeClick } from "@/lib/useResumeClick";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const onResumeClick = useResumeClick();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const github = socialLinks.find((s) => s.icon === "github");
  const linkedin = socialLinks.find((s) => s.icon === "linkedin");

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled ? "glass border-b border-[var(--border)]" : "bg-transparent"
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8"
      >
        <a
          href="#home"
          className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight"
        >
          {personal.name}
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--text)]"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-4 md:flex">
          {github && (
            <a
              href={github.url}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub profile"
              className="text-[var(--muted)] transition-colors hover:text-[var(--text)]"
            >
              <GithubIcon width={18} height={18} />
            </a>
          )}
          {linkedin && (
            <a
              href={linkedin.url}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn profile"
              className="text-[var(--muted)] transition-colors hover:text-[var(--text)]"
            >
              <LinkedinIcon width={18} height={18} />
            </a>
          )}
          <button
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            className="rounded-full border border-[var(--border)] p-2 text-[var(--muted)] transition-colors hover:text-[var(--text)]"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <a
            href={personal.resumeUrl}
            onClick={onResumeClick}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--text)] px-4 py-2 text-sm font-medium text-[var(--bg)] transition-opacity hover:opacity-85"
          >
            <FileText size={15} />
            Resume
          </a>
        </div>

        <button
          className="text-[var(--text)] md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="glass overflow-hidden border-b border-[var(--border)] md:hidden"
          >
            <ul className="flex flex-col gap-1 px-5 py-4">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-2 py-3 text-base text-[var(--text)] hover:bg-[var(--surface-2)]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between border-t border-[var(--border)] px-5 py-4">
              <div className="flex items-center gap-4">
                {github && (
                  <a href={github.url} target="_blank" rel="noreferrer" aria-label="GitHub profile">
                    <GithubIcon width={20} height={20} />
                  </a>
                )}
                {linkedin && (
                  <a href={linkedin.url} target="_blank" rel="noreferrer" aria-label="LinkedIn profile">
                    <LinkedinIcon width={20} height={20} />
                  </a>
                )}
                <button onClick={toggleTheme} aria-label="Toggle theme">
                  {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              </div>
              <a
                href={personal.resumeUrl}
                onClick={onResumeClick}
                className="rounded-full bg-[var(--text)] px-4 py-2 text-sm font-medium text-[var(--bg)]"
              >
                Resume
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
