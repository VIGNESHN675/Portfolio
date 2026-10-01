"use client";

import { useCallback } from "react";
import { useToast } from "./toast";
import { personal } from "@/data/portfolio";

/**
 * Returns an onClick handler for resume download/open links. Checks the
 * file actually exists first so a missing /public/resume.pdf shows a clear,
 * friendly message instead of a broken-link 404.
 */
export function useResumeClick() {
  const { showToast } = useToast();

  return useCallback(
    async (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      try {
        const res = await fetch(personal.resumeUrl, { method: "HEAD" });
        if (res.ok) {
          window.open(personal.resumeUrl, "_blank");
          return;
        }
      } catch {
        // fall through to the toast below
      }
      showToast("Resume not uploaded yet — add resume.pdf to /public to enable this button.");
    },
    [showToast]
  );
}
