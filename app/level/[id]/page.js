'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { LEVELS, WORDS } from '../../../data';

// Icons
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
);
const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);

// util
function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

export default function LevelPage() {
  const { id } = useParams();
  const levelId = Number(id);
  const router = useRouter();

  // meta + words from your data layer
  const meta  = useMemo(() => LEVELS.find(l => l.id === levelId) ?? null, [levelId]);
  const words = useMemo(() => WORDS?.[levelId] ?? [], [levelId]);

  // quiz state
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [checked, setChecked] = useState(false);

  // build the current question on the fly
  const q = useMemo(() => {
    const w = words[idx];
    if (!w) return null;

    // Prompt: blank out a middle word in the EN phrase
    const parts = (w.en || '').split(' ');
    const mid = Math.min(Math.max(1, Math.floor(parts.length / 2)), parts.length - 1);
    parts[mid] = '_____';
    const prompt = parts.join(' ');

    // Options: 3 wrong + 1 correct using latin
    const pool = words.filter(x => x.latin !== w.latin).map(x => x.latin);
    const options = shuffle([...shuffle(pool).slice(0, 3), w.latin]);

    return { prompt, options, answer: w.latin, translation: w.en };
  }, [words, idx]);

  if (!meta) return <main className="p-6">Level not found.</main>;
  if (!q)    return <main className="p-6">No questions in this level.</main>;

  const total = words.length || 1;
  const progress = Math.round((idx / total) * 100);
  const isCorrect = checked && picked === q.answer;

  const onCheck = () => { if (picked) setChecked(true); };
  const onContinue = () => {
    if (idx + 1 < total) {
      setIdx(idx + 1);
      setPicked(null);
      setChecked(false);
    } else {
      router.push('/'); // done with level for now
    }
  };

  return (
    <main className="mx-auto w-full max-w-2xl p-6">
      {/* Progress */}
      <div className="h-2 w-full rounded-full bg-zinc-200">
        <div className="h-2 rounded-full bg-emerald-500 transition-all" style={{ width: `${progress}%` }} />
      </div>

      <h1 className="mt-4 text-2xl font-semibold">Level {levelId}</h1>
      <div className="text-sm text-zinc-600">{meta.tag}</div>

      {/* Prompt */}
      <div className="mt-6 text-center">
        <div className="mb-2 text-sm text-zinc-600">Complete the Sentence</div>
        <div className="text-2xl font-semibold">
          {q.prompt.split('_____')[0]}
          <span className="mx-2 rounded-full border border-zinc-300 px-3 py-1">
            {picked || '_____'}
          </span>
          {q.prompt.split('_____')[1]}
        </div>
      </div>

      {/* Options */}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {q.options.map(opt => (
          <button
            key={opt}
            onClick={() => !checked && setPicked(opt)}
            disabled={checked}
            className={`rounded-xl border px-4 py-2 text-sm transition
              ${picked === opt ? 'border-emerald-600' : 'border-zinc-200 hover:border-emerald-400'}`}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* Actions */}
      {!checked ? (
        <div className="mt-6 flex justify-center">
          <button
            onClick={onCheck}
            disabled={!picked}
            className="rounded-xl bg-zinc-900 px-4 py-2 text-white disabled:opacity-50"
          >
            Check Answer
          </button>
        </div>
      ) : (
        <div className="mt-6 flex justify-center">
          <button
            onClick={onContinue}
            className={`rounded-xl px-4 py-2 text-white ${isCorrect ? 'bg-emerald-600' : 'bg-red-500'}`}
          >
            Continue
          </button>
        </div>
      )}

      {/* Feedback */}
      {checked && (
        <div className={`mt-6 flex items-center justify-center gap-3 ${isCorrect ? 'text-emerald-600' : 'text-red-600'}`}>
          {isCorrect ? <CheckIcon /> : <XIcon />}
          <div className="text-center">
            <div className="font-medium">{isCorrect ? 'Good Job!' : 'Not Quite!'}</div>
            <div className="text-sm text-zinc-600">Translation: “{q.translation}”</div>
          </div>
        </div>
      )}
    </main>
  );
}
