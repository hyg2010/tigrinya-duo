export function getProgress(levelId) {
  if (typeof window === 'undefined') return 0; // Server-side rendering check
  const progressData = JSON.parse(localStorage.getItem("tgduo:progress") || "{}");
  return progressData[levelId] || 0;
}

export function setProgress(levelId, value) {
  if (typeof window === 'undefined') return; // Server-side rendering check
  const clampedValue = Math.max(0, Math.min(100, value));
  const progressData = JSON.parse(localStorage.getItem("tgduo:progress") || "{}");
  progressData[levelId] = clampedValue;
  localStorage.setItem("tgduo:progress", JSON.stringify(progressData));
}

export function bumpProgress(levelId, delta) {
  if (typeof window === 'undefined') return; // Server-side rendering check
  const currentProgress = getProgress(levelId);
  setProgress(levelId, currentProgress + delta);
}
