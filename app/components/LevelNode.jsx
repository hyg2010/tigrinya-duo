"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * LevelNode
 * - Circular progress ring with a green inner button (Duolingo vibe).
 * - Props: level (number), href (string), score? (0-100 optional), locked? (bool)
 * - If score not provided, tries to read from localStorage using common keys.
 */
export default function LevelNode({ level = 1, href = "/learn/1", score, locked }) {
  const [pct, setPct] = useState(0);
  const isLocked = !!locked;

  // Try to read score from localStorage if not provided
  useEffect(() => {
    if (typeof score === "number") {
      setPct(Math.max(0, Math.min(100, score)));
      return;
    }
    if (typeof window === "undefined") return;

    const candidates = [
      `score:level:${level}`,
      `level:${level}:score`,
      `level${level}Score`,
      `l${level}`,
      `progress:level:${level}`
    ];

    let found = 0;
    for (const k of candidates) {
      const v = window.localStorage.getItem(k);
      if (v != null) {
        const num = Number(v);
        if (!Number.isNaN(num)) {
          found = num;
          break;
        }
        try {
          const parsed = JSON.parse(v);
          if (typeof parsed === "number") { found = parsed; break; }
          if (parsed && typeof parsed.score === "number") { found = parsed.score; break; }
        } catch {}
      }
    }
    setPct(Math.max(0, Math.min(100, found)));
  }, [level, score]);

  const content = (
    <div
      className="duo-level-wrap"
      style={{ ["--p"]: `${pct}%` }}
      aria-label={`Level ${level} progress ${pct}%`}
    >
      <div className={`duo-level ${isLocked ? "locked" : ""}`}>
        <div className="duo-level-star">★</div>
      </div>
      <div className="duo-level-bubble">LEVEL {level}</div>
    </div>
  );

  if (isLocked) {
    return <div className="duo-level-link locked">{content}</div>;
  }
  return (
    <Link className="duo-level-link" href={href}>
      {content}
    </Link>
  );
}
