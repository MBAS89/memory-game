import { useTranslation } from "react-i18next";

export type Rank = {
    name: string;
    icon: string;
    xpRequired: number;
    description: string;
};


export const RANKSEnglish: Rank[] = [
    { name: 'Newbie', icon: '🧠', xpRequired: 0, description: 'Your memory adventure begins now!' },
    { name: 'Learner', icon: '🔍', xpRequired: 500, description: 'You’re starting to connect the dots!' },
    { name: 'Thinker', icon: '🧩', xpRequired: 1000, description: 'You see patterns others miss.' },
    { name: 'Strategist', icon: '🎯', xpRequired: 5000, description: 'You master the game of memory.' },
    { name: 'Sage', icon: '📚', xpRequired: 10000, description: 'A wise library of knowledge.' },
    { name: 'Lightning Mind', icon: '⚡', xpRequired: 100000, description: 'Your recall is instant and powerful.' },
    { name: 'Genius', icon: '🌟', xpRequired: 500000, description: 'A true master of mental prowess.' },
    { name: 'Memory Legend', icon: '🏆', xpRequired: 1000000, description: 'You have achieved the impossible.' },
];

export const RANKSArabic: Rank[] = [
    { name: 'مبتدئ', icon: '🧠', xpRequired: 0, description: 'رحلة ذاكرتك الجميلة تبدأ الآن!' },
    { name: 'متدرب', icon: '🔍', xpRequired: 500, description: 'بدأت تربط الأفكار بذكاء!' },
    { name: 'محلل', icon: '🧩', xpRequired: 1000, description: 'ترى الأنماط الخفية بسهولة.' },
    { name: 'خطّاط', icon: '🎯', xpRequired: 5000, description: 'تخطط وتتذكر ببراعة.' },
    { name: 'حكيم', icon: '📚', xpRequired: 10000, description: 'عقلك كنز من الحكمة والمعرفة.' },
    { name: 'برق', icon: '⚡', xpRequired: 100000, description: 'ذاكرتك سريعة كالبرق!' },
    { name: 'عبقري', icon: '🌟', xpRequired: 500000, description: 'لقد وصلت إلى مستوى الابتكار.' },
    { name: 'أسطورة', icon: '🏆', xpRequired: 1000000, description: 'لقد تجاوزت المألوف وصرت أسطورة!' },
];

export const getCurrentRank = (xp: number): Rank => {
    const { i18n } = useTranslation(); 

    let rank = i18n.language === 'en' ? RANKSEnglish[0]: RANKSArabic[0];

    for (const r of i18n.language === 'en' ?RANKSEnglish : RANKSArabic) {
        if (xp >= r.xpRequired) {
        rank = r;
        } else {
        break;
        }
    }
    return rank;
};

export const getNextRank = (xp: number): Rank | null => {
    const { i18n } = useTranslation();

    return i18n.language === 'en' ? RANKSEnglish.find(r => xp < r.xpRequired) || null :  RANKSArabic.find(r => xp < r.xpRequired) || null;
};