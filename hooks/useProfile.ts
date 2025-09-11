import { usePersistedState } from './usePersistedState';

export type Profile = {
    username: string;
    xp: number;
    coins: number;
    hearts: number;
    lastHeartClaimDate: string | null;
    totalLevelsCompleted: number;
};

const defaultProfile: Profile = {
    username: '',
    xp: 0,
    coins: 0,
    hearts: 5,
    lastHeartClaimDate: null,
    totalLevelsCompleted: 0,
};

export const useProfile = () => {
    const [profile, setProfile, loading] = usePersistedState<Profile>('userProfile', defaultProfile);

    const updateProfile = (updates: Partial<Profile>) => {
        setProfile({ ...profile, ...updates });
    };

    const claimDailyHeart = () => {
        const today = new Date().toISOString().split('T')[0];
        
        if (profile.lastHeartClaimDate === today) {
            return false;
        }
        
        const lastClaimDateStr = profile.lastHeartClaimDate || today;
        const lastClaimDate = new Date(lastClaimDateStr);
        const currentDate = new Date();
        
        const timeDiff = currentDate.getTime() - lastClaimDate.getTime();
        const daysSinceLastClaim = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        
        const heartsToAdd = Math.min(daysSinceLastClaim, 5 - profile.hearts);
        
        if (heartsToAdd > 0) {
            updateProfile({
                hearts: profile.hearts + heartsToAdd,
                lastHeartClaimDate: today,
            });
            return true;
        }
        return false;
    };

    return {
        profile,
        updateProfile,
        claimDailyHeart,
        loading,
    };
};