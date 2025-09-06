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
        
        // If we've already claimed today, do nothing.
        if (profile.lastHeartClaimDate === today) {
            return false;
        }
        
        // Handle the case where lastHeartClaimDate is null (first time claim)
        const lastClaimDateStr = profile.lastHeartClaimDate || today; // If null, use today to avoid errors
        const lastClaimDate = new Date(lastClaimDateStr);
        const currentDate = new Date();
        
        // Calculate days since last claim. If lastClaimDate is today, this will be 0.
        const timeDiff = currentDate.getTime() - lastClaimDate.getTime();
        const daysSinceLastClaim = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        
        // Cap the days to claim at the maximum possible needed to fill the hearts (5)
        const heartsToAdd = Math.min(daysSinceLastClaim, 5 - profile.hearts);
        
        if (heartsToAdd > 0) {
            updateProfile({
                hearts: profile.hearts + heartsToAdd,
                lastHeartClaimDate: today, // Important: set it to today, not the last claim date
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