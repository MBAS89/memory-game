

// useSound.ts - Simple hook using global sound manager
import { soundManager } from "@/utils/SoundManager";

type SoundName = 'countdown' | 'success' | 'failure' | 'tap';

export const useSound = () => {
  const playSound = async (name: SoundName) => {
    await soundManager.playSound(name);
  };

  const stopSound = async (name: SoundName) => {
    await soundManager.stopSound(name);
  };

  const stopAllSounds = async () => {
    await soundManager.stopAllSounds();
  };

  return { 
    playSound, 
    stopSound, 
    stopAllSounds,
    isReady: soundManager.initialized 
  };
};