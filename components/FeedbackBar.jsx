// app/components/FeedbackBar.jsx
import React from 'react';

export default function FeedbackBar({ correct, onContinue }) {
  return (
    <div style={{
      marginTop: '20px',
      padding: '15px',
      borderRadius: '8px',
      backgroundColor: correct ? 'var(--green)' : 'red',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <span>{correct ? 'Correct!' : 'Incorrect.'}</span>
      <button
        onClick={onContinue}
        style={{
          background: 'white',
          color: correct ? 'var(--green)' : 'red',
          border: 'none',
          padding: '8px 15px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        Continue
      </button>
    </div>
  );
}
