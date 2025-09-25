import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-6">
      {/* Title */}
      <h1 className="text-3xl font-semibold">Home</h1>

      {/* Level 1 card */}
      <div className="relative w-full max-w-xl text-center">
        <div className="rounded-[20px] border border-emerald-300 bg-emerald-200/80 px-6 py-8 shadow-sm">
          <div className="text-2xl font-semibold">Level 1</div>
          <div className="mt-1 text-sm text-zinc-700">Greetings</div>
        </div>

        {/* Start Now button beneath the card */}
        <div className="mt-5">
          <Link
            href="/level/1"
            className="inline-block rounded-xl border border-zinc-300 bg-white px-6 py-3 font-medium hover:border-emerald-500 hover:bg-emerald-50"
          >
            Start Now
          </Link>
        </div>
      </div>

      {/* Right-side Level 2 pill with lock */}
      <div className="w-full max-w-xl">
        <div className="flex justify-end gap-2">
          <span className="rounded-full border border-zinc-300 bg-white px-3 py-1 text-sm">
            Level 2
          </span>
          <span aria-label="locked" title="Locked until Level 1 is complete">🔒</span>
        </div>
        <div className="p-4 bg-emerald-500 text-white rounded-xl">Tailwind is ON</div>
<div className="p-4 bg-emerald-500 text-white rounded-xl">Tailwind is ON</div>

      </div>
    </main>
  );
}
