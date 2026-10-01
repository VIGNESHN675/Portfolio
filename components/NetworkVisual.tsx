"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

// A hand-placed node graph — evokes "connections / systems / code" rather
// than a generic gradient blob or stock illustration.
const NODES = [
  { id: "a", x: 60, y: 60, r: 5 },
  { id: "b", x: 180, y: 40, r: 3.5 },
  { id: "c", x: 260, y: 110, r: 6 },
  { id: "d", x: 140, y: 150, r: 4 },
  { id: "e", x: 40, y: 200, r: 3.5 },
  { id: "f", x: 220, y: 220, r: 5 },
  { id: "g", x: 320, y: 190, r: 4 },
  { id: "h", x: 300, y: 60, r: 3 },
  { id: "i", x: 150, y: 260, r: 3.5 },
];

const EDGES: [string, string][] = [
  ["a", "b"],
  ["b", "c"],
  ["a", "d"],
  ["c", "d"],
  ["d", "e"],
  ["c", "f"],
  ["f", "g"],
  ["c", "h"],
  ["f", "i"],
  ["d", "i"],
];

const nodeMap = Object.fromEntries(NODES.map((n) => [n.id, n]));

export function NetworkVisual() {
  const reduced = useReducedMotion();

  return (
    <svg
      viewBox="0 0 360 300"
      className="h-full w-full"
      role="img"
      aria-label="Abstract animated network graph representing connected systems"
    >
      <defs>
        <linearGradient id="edgeGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--accent-2)" stopOpacity="0.35" />
        </linearGradient>
        <radialGradient id="nodeGlow">
          <stop offset="0%" stopColor="var(--accent-2)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--accent-2)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {EDGES.map(([from, to], i) => {
        const a = nodeMap[from];
        const b = nodeMap[to];
        return (
          <motion.line
            key={`${from}-${to}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="url(#edgeGradient)"
            strokeWidth={1}
            initial={reduced ? { opacity: 0.5 } : { pathLength: 0, opacity: 0 }}
            animate={reduced ? { opacity: 0.5 } : { pathLength: 1, opacity: 0.5 }}
            transition={reduced ? {} : { duration: 1.2, delay: 0.3 + i * 0.07, ease: "easeOut" }}
          />
        );
      })}

      {NODES.map((n, i) => (
        <g key={n.id}>
          <circle cx={n.x} cy={n.y} r={n.r * 3.5} fill="url(#nodeGlow)" opacity={0.25} />
          <motion.circle
            cx={n.x}
            cy={n.y}
            r={n.r}
            fill="var(--text)"
            initial={reduced ? { opacity: 0.9 } : { scale: 0, opacity: 0 }}
            animate={
              reduced
                ? { opacity: 0.9 }
                : { scale: 1, opacity: 0.9, y: [0, -4, 0] }
            }
            transition={
              reduced
                ? {}
                : {
                    scale: { duration: 0.4, delay: i * 0.08 },
                    opacity: { duration: 0.4, delay: i * 0.08 },
                    y: { duration: 3 + (i % 3), repeat: Infinity, ease: "easeInOut", delay: i * 0.3 },
                  }
            }
          />
        </g>
      ))}
    </svg>
  );
}
