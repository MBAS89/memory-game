import { shuffleArray } from "./shuffleArray";

// List of fun, distinct emojis
const SYMBOLS = ['🍎', '🌸', '🚀', '🐞', '🔥', '🎨', '🍄', '🌋', '💸', '🌞', '🎪', '🧩', '🦄', '🍕', '🐧', '🧁', '🌮', '🥑', '🤖', '🐱'];

export const generateSequence = (level: number): string[] => {
    const sequenceLength = 3 + Math.floor(level / 10); // Grows slowly
    const shuffled = shuffleArray(SYMBOLS);
    return shuffled.slice(0, sequenceLength); // Unique symbols
};