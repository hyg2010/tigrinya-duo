"use client";
import Link from "next/link";
import { getProgress } from "lib/progress";
import ProgressBar from "components/ProgressBar";

export default function LevelCard({ level }) {
  const progress = getProgress(level.id);
  const isLocked = level.id > 1 && getProgress(level.id - 1) < 80;

  return (
    <div className={`card level-card ${isLocked ? 'locked' : ''}`}>
      <div className="card-title">Level {level.id}: {level.title}</div>
      <div className="card-sub">{level.tag}</div>
      <div style={{ marginTop: '20px', fontSize: '1.2em' }}>Progress: {progress}%</div>
      <ProgressBar value={progress} max={100} />
      {isLocked ? (
        <div style={{ color: 'red', marginTop: '20px', fontSize: '1.2em' }}>Locked 🔒</div>
      ) : (
        <Link href={`/learn/${level.slug}`}>
          <button className="btn" style={{ marginTop: '25px' }}>
            {progress > 0 ? 'Continue' : 'Start Now'}
          </button>
        </Link>
      )}
    </div>
  );
}
