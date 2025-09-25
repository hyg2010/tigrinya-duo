'use client';

import { useMemo, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { WORDS } from '../../data';

// -------- config --------
const PAIRS = 5;                // 5 pairs = 10 tiles
const SHOW_TRANSLIT = true;     // show latin under TI
const REVEAL_ON_MATCH = false;  // if true, show latin only after correct

// -------- utils --------
const shuffle = (a) => [...a].sort(() => Math.random() - 0.5);
const sample  = (a, n) => shuffle(a).slice(0, n);

// -------- Tile (minimal, light UI) --------
function Tile({ item, onClick, subtitle }) {
  const base =
    'group flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition ' +
    'outline-none focus-visible:ring-2 focus-visible:ring-sky-400';

  const palette = {
    idle:     'bg-white border-zinc-200 text-zinc-900 hover:border-zinc-400',
    selected: 'bg-white border-sky-500 ring-1 ring-sky-300',
    correct:  'bg-emerald-50 border-emerald-500 text-emerald-800',
    wrong:    'bg-rose-50 border-rose-500 text-rose-800',
  };

  const cls = palette[item.state] ?? palette.idle;

  return (
    <button
      onClick={onClick}
      disabled={item.state === 'correct'}
      className={`${base} ${cls} disabled:opacity-85`}
    >
      <span className="grid h-6 w-6 place-items-center rounded-md border border-zinc-300 text-[11px] text-zinc-600">
        {item.badge}
      </span>

      <div className={`mx-2 flex-1 ${item.side === 'R' ? 'ethiopic' : ''}`}>
        <div className="leading-tight">{item.text}</div>
        {subtitle ? <div className="text-xs leading-tight text-zinc-500">{subtitle}</div> : null}
      </div>

      <span className="opacity-0 transition group-hover:opacity-100 text-zinc-500">↗</span>
    </button>
  );
}

// -------- Win Overlay (clean modal + confetti) --------
function WinOverlay({ accuracyPct, xp, onContinue, nextLabel }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-[min(560px,92vw)] rounded-3xl border border-zinc-200 bg-white p-8 text-center shadow-[0_8px_40px_rgba(0,0,0,0.12)]">
        {/* confetti */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 32 }).map((_, i) => (
            <span
              key={i}
              className="absolute text-xl"
              style={{
                left: `${(i * 97) % 100}%`,
                top: `-10%`,
                animation: `fall ${1.5 + (i % 10) * 0.12}s linear ${(i % 12) * 0.05}s 1`,
              }}
            >
              🎉
            </span>
          ))}
        </div>

        <h3 className="mb-3 text-3xl font-semibold">Great job!</h3>
        <p className="mb-6 text-zinc-600">Practice complete</p>

        <div className="mx-auto mb-6 grid w-full max-w-md grid-cols-2 gap-3">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="text-xs tracking-wide text-zinc-500">TOTAL XP</div>
            <div className="mt-1 text-2xl font-semibold">{xp}</div>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="text-xs tracking-wide text-zinc-500">ACCURACY</div>
            <div className="mt-1 text-2xl font-semibold">{accuracyPct}%</div>
          </div>
        </div>

        <button
          onClick={onContinue}
          className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 font-medium text-white hover:bg-emerald-500"
        >
          {nextLabel} →
        </button>

        {/* keyframes (scoped) */}
        <style jsx>{`
          @keyframes fall {
            0%   { transform: translateY(-10%) rotate(0deg);   opacity: 0; }
            10%  { opacity: 1; }
            100% { transform: translateY(120vh) rotate(360deg); opacity: 0; }
          }
        `}</style>
      </div>
    </div>
  );
}

export default function WordBankPage() {
  const search = useSearchParams();
  const router = useRouter();

  const levelId = Number(search.get('level') || 1);
  const words = WORDS[levelId] || [];

  // choose pairs once per level
  const totalPairs = Math.min(PAIRS, words.length);
  const basePairs = useMemo(() => {
    const chosen = sample(words, totalPairs);
    return chosen.map((w, i) => ({
      key: i,
      en: w.en,
      ti: w.ti,
      latin: w.latin || '',
    }));
  }, [words, totalPairs]);

  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);
  const [selL, setSelL] = useState(null);
  const [selR, setSelR] = useState(null);
  const [wrongs, setWrongs] = useState(0);       // for accuracy
  const [showWin, setShowWin] = useState(false); // overlay

  // seed tiles
  useEffect(() => {
    setLeft(
      shuffle(
        basePairs.map((p, i) => ({
          id: `L${i}`,
          side: 'L',
          key: p.key,
          text: p.en,      // EN on left
          badge: i + 1,
          state: 'idle',
        })),
      ),
    );
    setRight(
      shuffle(
        basePairs.map((p, i) => ({
          id: `R${i}`,
          side: 'R',
          key: p.key,
          text: p.ti,      // TI on right
          latin: p.latin,  // latin transliteration
          badge: i + 6,
          state: 'idle',
        })),
      ),
    );
    setSelL(null);
    setSelR(null);
    setWrongs(0);
    setShowWin(false);
  }, [basePairs]);

  const matched = left.filter((t) => t.state === 'correct').length;
  const progressPct = Math.round((matched / (totalPairs || 1)) * 100);
  const nextLevelExists = Boolean(WORDS[levelId + 1]);

  // finish overlay trigger + progress save
  useEffect(() => {
    if (matched === totalPairs && totalPairs > 0) {
      try {
        localStorage.setItem(`wb.completed.${levelId}`, '1');
      } catch {}
      setShowWin(true);
    }
  }, [matched, totalPairs, levelId]);

  // evaluate a pair
  useEffect(() => {
    if (selL == null || selR == null) return;
    const l = left[selL];
    const r = right[selR];
    const good = l.key === r.key;

    const setState = (setter, arr, idx, state) => {
      const next = [...arr];
      next[idx] = { ...next[idx], state };
      setter(next);
    };

    if (good) {
      setState(setLeft, left, selL, 'correct');
      setState(setRight, right, selR, 'correct');
      setSelL(null);
      setSelR(null);
    } else {
      setWrongs((n) => n + 1);
      setState(setLeft, left, selL, 'wrong');
      setState(setRight, right, selR, 'wrong');
      const lIdx = selL, rIdx = selR;
      setTimeout(() => {
        setState(setLeft, left, lIdx, 'idle');
        setState(setRight, right, rIdx, 'idle');
        setSelL(null);
        setSelR(null);
      }, 650);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selL, selR]);

  const pickLeft = (idx) => {
    if (left[idx].state === 'correct') return;
    setLeft((arr) =>
      arr.map((t, i) => (i === idx ? { ...t, state: 'selected' } : t.state === 'selected' ? { ...t, state: 'idle' } : t)),
    );
    setSelL(idx);
  };

  const pickRight = (idx) => {
    if (right[idx].state === 'correct') return;
    setRight((arr) =>
      arr.map((t, i) => (i === idx ? { ...t, state: 'selected' } : t.state === 'selected' ? { ...t, state: 'idle' } : t)),
    );
    setSelR(idx);
  };

  // accuracy + XP (simple model: 10 XP + streak bonus later)
  const tries = matched + wrongs || 1;
  const accuracyPct = Math.max(0, Math.min(100, Math.round((matched / tries) * 100)));
  const xp = 10;

  return (
    <main className="min-h-screen w-full bg-white text-zinc-900">
      <section className="mx-auto my-8 max-w-4xl rounded-3xl border border-zinc-200 bg-white p-8 shadow-[0_6px_30px_rgba(0,0,0,0.06)]">
        {/* top bar */}
        <div className="mb-8 flex items-center gap-3">
          <button onClick={() => router.push('/')} className="text-zinc-500 hover:text-zinc-800">✕</button>
          <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200">
            <div
              className="h-2 rounded-full bg-emerald-500 transition-[width] duration-300 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">10</div>
        </div>

        <h2 className="mb-6 text-center text-3xl font-semibold">Select the matching pairs</h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-3">
            {left.map((item, i) => (
              <Tile key={item.id} item={item} onClick={() => pickLeft(i)} />
            ))}
          </div>
          <div className="space-y-3">
            {right.map((item, i) => {
              const showLatin =
                SHOW_TRANSLIT && (!REVEAL_ON_MATCH || item.state === 'correct');
              return (
                <Tile
                  key={item.id}
                  item={item}
                  onClick={() => pickRight(i)}
                  subtitle={showLatin ? item.latin : ''}
                />
              );
            })}
          </div>
        </div>
      </section>

      {showWin && (
        <WinOverlay
          accuracyPct={accuracyPct}
          xp={xp}
          nextLabel={nextLevelExists ? 'Next word bank' : 'Home'}
          onContinue={() =>
            nextLevelExists ? router.push(`/wordbanks?level=${levelId + 1}`) : router.push('/')
          }
        />
      )}
    </main>
  );
}
