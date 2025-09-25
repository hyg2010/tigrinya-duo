// components/Sidebar.jsx
'use client';

import Link from 'next/link';

function RailItem({ href, children }) {
  return (
    <Link
      href={href}
      className="block rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm hover:border-zinc-400"
    >
      {children}
    </Link>
  );
}

export default function Sidebar() {
  return (
    <aside className="flex flex-col gap-3">
      {/* App icon */}
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-zinc-900 text-white">
        T
      </div>

      {/* Left buttons, per sketch */}
      <RailItem href="/levels">Levels</RailItem>
      <RailItem href="/wordbanks">Word Bank</RailItem>
      <RailItem href="/profile">Profile</RailItem>
    </aside>
  );
}
