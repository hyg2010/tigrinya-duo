'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// Lock Icon SVG
const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
);

export default function HomePage() {
  // We'll manage the levels with state later, for now, it's static.
  const [currentLevel, setCurrentLevel] = useState(1);
  const totalLevels = 5; // Example total levels
  const completedLevels = 1; // Example: User has completed level 1

  const handleNextLevel = () => {
    if (currentLevel < totalLevels) {
      setCurrentLevel(currentLevel + 1);
    }
  };

  const handlePrevLevel = () => {
    if (currentLevel > 1) {
      setCurrentLevel(currentLevel - 1);
    }
  };

  const isLevelLocked = currentLevel > completedLevels + 1;

  return (
    <div className="home-page-container">
      <h1 className="home-page-title">Home Page</h1>
      <div className="level-selector">
        <button onClick={handlePrevLevel} disabled={currentLevel === 1} className="level-arrow">
          &larr; <span className="arrow-text">Previous Level</span>
        </button>

        <div className={`level-card-main ${isLevelLocked ? 'locked' : ''}`}>
            <h2>Level {currentLevel}</h2>
            <p>Greetings</p>
        </div>

        <div className="next-level-container">
            <button onClick={handleNextLevel} disabled={currentLevel === totalLevels} className="level-arrow">
                <span className="arrow-text">Next Level</span> &rarr;
            </button>
            {currentLevel + 1 > completedLevels + 1 && (
                 <div className="level-lock-indicator">
                    <LockIcon />
                    <span>Level {currentLevel + 1}</span>
                 </div>
            )}
        </div>
      </div>
      <Link href={isLevelLocked ? "#" : `/level/${currentLevel}`} className={`start-now-button ${isLevelLocked ? 'disabled' : ''}`}>
        Start Now
      </Link>
    </div>
  );
}
