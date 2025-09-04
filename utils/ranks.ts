
export type Rank = {
    name: string;
    icon: string;
    xpRequired: number;
    description: string;
};

export const RANKS: Rank[] = [
    { name: 'Novice', icon: '🧠', xpRequired: 0, description: 'Just starting your memory journey' },
    { name: 'Rememberer', icon: '🔍', xpRequired: 200, description: 'You never forget a pattern' },
    { name: 'Mnemonist', icon: '🧩', xpRequired: 500, description: 'Master of mental patterns' },
    { name: 'Cognoscente', icon: '🔮', xpRequired: 1000, description: 'Sees patterns in chaos' },
    { name: 'Archivist', icon: '📚', xpRequired: 10000, description: 'Your mind is a library' },
    { name: 'Synaptic', icon: '⚡', xpRequired: 100000, description: 'Neural pathways firing fast' },
    { name: 'Savant', icon: '🌟', xpRequired: 500000, description: 'Genius-level recall' },
    { name: 'Oracle', icon: '🕊️', xpRequired: 1000000, description: 'Sees the unseen' },
];

export const getCurrentRank = (xp: number): Rank => {
    let rank = RANKS[0];
    for (const r of RANKS) {
        if (xp >= r.xpRequired) {
        rank = r;
        } else {
        break;
        }
    }
    return rank;
};

export const getNextRank = (xp: number): Rank | null => {
    return RANKS.find(r => xp < r.xpRequired) || null;
};