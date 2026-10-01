"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type Theme = "dark" | "light";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
const STORAGE_KEY = "portfolio-theme";

let listeners: Array<() => void> = [];

function readStoredTheme(): Theme {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function getSnapshot(): Theme {
  if (typeof window === "undefined") return "dark";
  return readStoredTheme();
}

// Matches the default applied by the inline script in layout.tsx, so the
// server-rendered HTML and the first client render agree (no hydration
// flash/mismatch) before the real preference is read.
function getServerSnapshot(): Theme {
  return "dark";
}

function subscribe(callback: () => void) {
  listeners.push(callback);
  const mq = window.matchMedia("(prefers-color-scheme: light)");
  mq.addEventListener("change", callback);
  return () => {
    listeners = listeners.filter((l) => l !== callback);
    mq.removeEventListener("change", callback);
  };
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Keep the <html> class in sync with the current snapshot. This runs
  // during render rather than an effect because it only touches the DOM
  // node outside React's own tree (documentElement), is idempotent, and
  // must be correct before paint to avoid a flash of the wrong theme.
  if (typeof window !== "undefined") {
    applyTheme(theme);
  }

  const toggleTheme = useCallback(() => {
    const next: Theme = readStoredTheme() === "dark" ? "light" : "dark";
    window.localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
    listeners.forEach((listener) => listener());
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
