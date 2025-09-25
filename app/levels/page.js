// app/levels/page.js
import Link from 'next/link';
import { LEVELS } from '../../data'; // if this errors, try '../../data/level' or '../../data/levels'

export default function LevelsIndex() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">Levels</h1>
      <ul className="grid gap-3">
        {LEVELS.map((l) => (
          <li key={l.id}>
            <Link
              href={`/level/${l.id}`}
              className="block rounded-xl border border-zinc-200 p-4 hover:border-emerald-500"
            >
              <div className="text-lg font-medium">Level {l.id}</div>
              <div className="text-sm text-zinc-600">{l.title}</div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
