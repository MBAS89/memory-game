import { Audio } from 'expo-av';
import { useEffect, useRef } from 'react';

// Map of sound names to asset paths
const SOUND_FILES = {
  countdown: require('../assets/sounds/countdown.mp3'),
  success: require('../assets/sounds/success.mp3'),
  failure: require('../assets/sounds/failure.mp3'),
  tap: require('../assets/sounds/tap.mp3'),
};

type SoundName = keyof typeof SOUND_FILES;

export const useSound = () => {
  const soundRefs = useRef<Record<SoundName, Audio.Sound | null>>({
    countdown: null,
    success: null,
    failure: null,
    tap: null,
  });

  useEffect(() => {
    // Pre-load all sounds
    const loadSounds = async () => {
      for (const key in SOUND_FILES) {
        const soundName = key as SoundName;
        const { sound } = await Audio.Sound.createAsync(SOUND_FILES[soundName]);
        soundRefs.current[soundName] = sound;
      }
    };

    loadSounds();

    return () => {
      // Clean up sounds on unmount
      Object.values(soundRefs.current).forEach((sound) => {
        sound?.unloadAsync();
      });
    };
  }, []);

  const playSound = (name: SoundName) => {
    const sound = soundRefs.current[name];
    if (sound) {
      sound.replayAsync?.().catch(console.warn); // replay if already playing
    }
  };

  return { playSound };
};