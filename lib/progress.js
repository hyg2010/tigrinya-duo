// lib/progress.js

const KEY_V1 = "tgduo:progress";          // old shape: { [levelId]: number }
const KEY    = "tgduo:progress:v2";       // new shape: { levels: { [id]: { pct, completed, updatedAt } } }

function clamp(n) {
  n = Number(n) || 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

function safeParse(str, fallback) {
  try { return JSON.parse(str ?? ""); } catch { return fallback; }
}

function load() {
  if (typeof window === "undefined") return { levels: {} };

  // v2 present?
  const raw = localStorage.getItem(KEY);
  if (raw) return safeParse(raw, { levels: {} });

  // migrate v1 → v2 (keeps your existing progress)
  const v1raw = localStorage.getItem(KEY_V1);
  const v1 = safeParse(v1raw, null);
  if (v1 && typeof v1 === "object") {
    const now = Date.now();
    const levels = Object.fromEntries(
      Object.entries(v1).map(([id, pct]) => {
        const p = clamp(pct);
        return [id, { pct: p, completed: p >= 100, updatedAt: now }];
      })
    );
    const data = { levels };
    localStorage.setItem(KEY, JSON.stringify(data));
    // optional: remove old key
    // localStorage.removeItem(KEY_V1);
    return data;
  }

  return { levels: {} };
}

function save(data) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(data));
  // Broadcast to other tabs/components if you want to listen for it
  try {
    window.dispatchEvent(new CustomEvent("tgduo:progress-changed", { detail: data }));
  } catch {}
}

/** Get 0–100 progress for a level */
export function getProgress(levelId) {
  const { levels } = load();
  return levels?.[levelId]?.pct ?? 0;
}

/** Set 0–100 progress and return the clamped value */
export function setProgress(levelId, value) {
  if (typeof window === "undefined") return 0;
  const data = load();
  const pct = clamp(value);
  data.levels[levelId] = {
    pct,
    completed: pct >= 100,
    updatedAt: Date.now(),
  };
  save(data);
  return pct;
}

/** Increment progress by delta and return the new value */
export function bumpProgress(levelId, delta) {
  const current = getProgress(levelId);
  return setProgress(levelId, current + (Number(delta) || 0));
}

/** Mark a level as completed (100%) */
export function markComplete(levelId) {
  return setProgress(levelId, 100);
}

/** Map of { [levelId]: pct } for quick summaries */
export function getAllProgress() {
  const { levels } = load();
  return Object.fromEntries(Object.entries(levels).map(([id, rec]) => [id, rec.pct]));
}

/** Locking logic for your UI (Level 1 always unlocked; others require previous completed) */
export function isLevelUnlocked(levelId) {
  const id = Number(levelId);
  if (!id || id <= 1) return true;
  const { levels } = load();
  const prev = levels[id - 1];
  return !!(prev && (prev.completed || prev.pct >= 100));
}

/** Reset progress: pass a levelId to clear just that level, or omit to clear all */
export function resetProgress(levelId) {
  if (typeof window === "undefined") return;
  if (levelId == null) {
    localStorage.removeItem(KEY);
    return;
  }
  const data = load();
  delete data.levels[levelId];
  save(data);
}
