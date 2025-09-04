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
        if (profile.lastHeartClaimDate !== today) {
            updateProfile({
                hearts: Math.min(profile.hearts + 1, 5),
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