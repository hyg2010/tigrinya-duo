'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LEVELS } from 'data/index';        // you already export LEVELS
import { getProgress } from 'lib/progress'; // your existing localStorage helper

// Inline circular badge (no separate file needed)
function LevelBadge({ id, title, progress = 0, locked = false }) {
  const pct = Math.max(0, Math.min(100, progress));
  const deg = pct * 3.6;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Progress ring */}
      <div
        className="relative h-40 w-40 rounded-full"
        style={{ background: `conic-gradient(#22c55e ${deg}deg, #e5e7eb 0deg)` }}
        aria-label={`Level ${id} progress ${pct}%`}
      >
        {/* Inner circle */}
        <div className="absolute inset-3 rounded-full bg-white shadow-sm flex items-center justify-center">
          <span className="text-4xl font-bold text-slate-900 select-none">{id}</span>
        </div>

        {/* Lock badge */}
        {locked && (
          <div className="absolute -right-1 -top-1 h-8 w-8 rounded-full bg-white shadow flex items-center justify-center">
            <svg className="h-5 w-5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 10V7a5 5 0 1110 0v3" />
              <rect x="5" y="10" width="14" height="10" rx="2" />
            </svg>
          </div>
        )}
      </div>

      {/* Label */}
      <div className="text-center">
        <div className="text-lg font-semibold text-slate-900">Level {id}</div>
        {title ? <div className="text-sm text-slate-500">{title}</div> : null}
      </div>

      <div className="text-xs text-slate-400">{pct}% complete</div>
    </div>
  );
}

const CURRENT_KEY = 'tgduo:currentLevel';

export default function Home() {
  const router = useRouter();

  // current level (1-indexed)
  const [currentId, setCurrentId] = useState(1);
  const [progress, setProgress] = useState(0);

  // Load saved current level
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = Number(localStorage.getItem(CURRENT_KEY) || '1');
    const clamped = Math.min(Math.max(saved, 1), LEVELS.length || 1);
    setCurrentId(clamped);
  }, []);

  // Read progress for current level
  useEffect(() => {
    setProgress(getProgress(String(currentId)) || 0);
  }, [currentId]);

  // Current/Prev/Next
  const { current, prev, next } = useMemo(() => {
    const idx = Math.max(0, Math.min(currentId - 1, LEVELS.length - 1));
    return {
      current: LEVELS[idx],
      prev: idx > 0 ? LEVELS[idx - 1] : null,
      next: idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null,
    };
  }, [currentId]);

  // Lock next until current hits 100%
  const nextLocked = useMemo(() => !next || progress < 100, [next, progress]);

  // Persist currentId
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CURRENT_KEY, String(currentId));
  }, [currentId]);

  const goPrev = () => prev && setCurrentId((i) => Math.max(1, i - 1));
  const goNext = () => next && !nextLocked && setCurrentId((i) => Math.min(LEVELS.length, i + 1));
  const startOrContinue = () => router.push(`/level/${currentId}`);

  const primaryLabel = progress > 0 && progress < 100 ? 'Continue' : 'Start Now';

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-8">
      <h1 className="text-3xl font-semibold">Home</h1>

      {/* Centered controls like Duolingo */}
      <div className="flex items-center justify-center gap-10">
        {/* Prev */}
        <button
          onClick={goPrev}
          disabled={!prev}
          className="rounded-full border border-slate-200 p-3 disabled:opacity-30"
          aria-label="Previous level"
          title={prev ? `Go to Level ${currentId - 1}` : 'No previous level'}
        >
          <svg className="h-6 w-6 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Badge */}
        <LevelBadge
          id={current?.id ?? currentId}
          title={current?.title}
          progress={progress}
          locked={false}
        />

        {/* Next (locked until 100%) */}
        <button
          onClick={goNext}
          disabled={!next || nextLocked}
          className="relative rounded-full border border-slate-200 p-3 disabled:opacity-30"
          aria-label="Next level"
          title={
            !next
              ? 'No next level'
              : nextLocked
              ? 'Finish this level to unlock the next'
              : `Go to Level ${currentId + 1}`
          }
        >
          {next && nextLocked && (
            <svg className="absolute -right-2 -top-2 h-5 w-5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 10V7a5 5 0 1110 0v3" />
              <rect x="5" y="10" width="14" height="10" rx="2" />
            </svg>
          )}
          <svg className="h-6 w-6 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Primary CTA */}
      <button
        onClick={startOrContinue}
        className="rounded-2xl bg-slate-900 px-6 py-3 text-white shadow hover:bg-slate-800 active:scale-[0.99]"
      >
        {primaryLabel}
      </button>

      <p className="text-sm text-slate-500">Complete this level to unlock the next one.</p>
    </main>
  );
}
