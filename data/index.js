// /data/index.js
import { LEVELS as RAW_LEVELS } from './level'; // ← singular
export const LEVELS = RAW_LEVELS;

export const WORDS = Object.fromEntries(
  RAW_LEVELS.map(l => [l.id, Array.isArray(l.words) ? l.words : []])
);
