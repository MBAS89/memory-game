import { Profile, useProfile as useProfileHook } from '@/hooks/useProfile';
import React, { createContext, ReactNode, useContext } from 'react';

interface ProfileContextType {
    profile: Profile;
    updateProfile: (updates: Partial<Profile>) => void;
    claimDailyHeart: () => boolean;
    loading: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const profileData = useProfileHook();

    return (
        <ProfileContext.Provider value={profileData}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfileContext = () => {
    const context = useContext(ProfileContext);
    if (context === undefined) {
        throw new Error('useProfileContext must be used within a ProfileProvider');
    }
    return context;
};