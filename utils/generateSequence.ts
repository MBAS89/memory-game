import { shuffleArray } from './shuffleArray';

// Keep it small and distinct
const SYMBOLS = [
  '🍎', '🌸', '🚀', '🐞', '🔥', '🎨', '🍄', '🌋', '💸', '🌞',
  '🎪', '🧩', '🦄', '🍕', '🐧', '🧁', '🌮', '🥑', '🤖', '🐱',
];

export const generateSequence = (level: number): string[] => {
  // Grows slowly; clamp to symbol count
  const sequenceLength = Math.min(3 + Math.floor(level / 10), SYMBOLS.length);
  const shuffled = shuffleArray(SYMBOLS);
  return shuffled.slice(0, sequenceLength);
};
