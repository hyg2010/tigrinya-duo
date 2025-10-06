'use client';

export default function LevelBadge({ id, title, progress = 0, locked = false }) {
  // Make sure progress is 0–100
  const pct = Math.max(0, Math.min(100, progress));
  const deg = pct * 3.6;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Progress ring */}
      <div
        className="relative h-36 w-36 rounded-full"
        style={{
          background: `conic-gradient(#22c55e ${deg}deg, #e5e7eb 0deg)`, // green -> gray
        }}
        aria-label={`Level ${id} progress ${pct}%`}
      >
        {/* Inner circle to create the ring */}
        <div className="absolute inset-2 rounded-full bg-white shadow-sm flex items-center justify-center">
          <span className="text-3xl font-bold text-slate-900 select-none">
            {id}
          </span>
        </div>

        {/* Small lock badge if locked */}
        {locked && (
          <div className="absolute -right-1 -top-1 h-8 w-8 rounded-full bg-white shadow flex items-center justify-center">
            <svg
              className="h-5 w-5 text-slate-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M7 10V7a5 5 0 1110 0v3" />
              <rect x="5" y="10" width="14" height="10" rx="2" />
            </svg>
          </div>
        )}
      </div>

      {/* Subtitle */}
      <div className="text-center">
        <div className="text-lg font-semibold text-slate-900">Level {id}</div>
        {title ? (
          <div className="text-sm text-slate-500">{title}</div>
        ) : null}
      </div>

      {/* Progress text */}
      <div className="text-xs text-slate-400">{pct}% complete</div>
    </div>
  );
}
