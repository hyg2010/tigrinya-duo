// app/components/ProgressBar.jsx
import React from 'react';

export default function ProgressBar({ value, max }) {
  const percentage = max === 0 ? 0 : (value / max) * 100;
  return (
    <div className="progress-bar-container">
      <div className="progress-bar-fill" style={{ width: `${percentage}%` }}></div>
    </div>
  );
}
