// SoundManager.ts - Global sound manager
import { Audio } from 'expo-av';

const SOUND_FILES = {
  countdown: require('../assets/sounds/countdown.mp3'),
  success: require('../assets/sounds/success.mp3'),
  failure: require('../assets/sounds/failure.mp3'),
  tap: require('../assets/sounds/tap.mp3'),
  outOfHearts:require('../assets/sounds/out_of_hearts.mp3')
};

type SoundName = keyof typeof SOUND_FILES;

class SoundManager {
  private sounds: Partial<Record<SoundName, Audio.Sound>> = {};
  private isInitialized = false;
  private isInitializing = false;

  async initialize(): Promise<void> {
    if (this.isInitialized || this.isInitializing) return;
    
    this.isInitializing = true;
    console.log('🔊 Loading sounds...');

    try {
      // Set audio mode for better performance
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        interruptionModeIOS: 2,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: 2,
        playThroughEarpieceAndroid: false,
      });

      // Load all sounds in parallel for faster loading
      const loadPromises = (Object.keys(SOUND_FILES) as SoundName[]).map(async (key) => {
        try {
          const sound = new Audio.Sound();
          await sound.loadAsync(SOUND_FILES[key]);
          this.sounds[key] = sound;
          console.log(`✅ Loaded sound: ${key}`);
        } catch (error) {
          console.error(`❌ Failed to load sound ${key}:`, error);
        }
      });

      await Promise.all(loadPromises);
      this.isInitialized = true;
      this.isInitializing = false;
      console.log('🎵 All sounds loaded successfully!');
    } catch (error) {
      console.error('❌ Failed to initialize sound manager:', error);
      this.isInitializing = false;
    }
  }

  async playSound(name: SoundName): Promise<void> {
    if (!this.isInitialized) {
      console.warn(`Sound ${name} not ready - sounds not initialized`);
      return;
    }

    const sound = this.sounds[name];
    if (!sound) {
      console.warn(`Sound ${name} not found`);
      return;
    }

    try {
      const status = await sound.getStatusAsync();
      if (!status.isLoaded) return;

      // Stop current playback to prevent overlap
      if (status.isPlaying) {
        await sound.stopAsync();
      }

      // Reset to beginning and play
      await sound.setPositionAsync(0);
      await sound.playAsync();
    } catch (error) {
      console.warn(`Failed to play sound ${name}:`, error);
    }
  }

  async stopSound(name: SoundName): Promise<void> {
    if (!this.isInitialized) return;

    const sound = this.sounds[name];
    if (!sound) return;

    try {
      const status = await sound.getStatusAsync();
      if (!status.isLoaded) return;

      if (status.isPlaying) {
        await sound.stopAsync();
      }
    } catch (error) {
      console.warn(`Failed to stop sound ${name}:`, error);
    }
  }

  async stopAllSounds(): Promise<void> {
    if (!this.isInitialized) return;

    const stopPromises = (Object.keys(this.sounds) as SoundName[]).map(
      (name) => this.stopSound(name)
    );
    await Promise.all(stopPromises);
  }

  async cleanup(): Promise<void> {
    console.log('🧹 Cleaning up sounds...');
    
    const unloadPromises = Object.values(this.sounds).map(async (sound) => {
      if (sound) {
        try {
          const status = await sound.getStatusAsync();
          if (status.isLoaded) {
            await sound.stopAsync();
            await sound.unloadAsync();
          }
        } catch (error) {
          console.warn('Error during sound cleanup:', error);
        }
      }
    });

    await Promise.all(unloadPromises);
    this.sounds = {};
    this.isInitialized = false;
    console.log('✅ Sound cleanup complete');
  }

  get initialized(): boolean {
    return this.isInitialized;
  }
}

// Export singleton instance
export const soundManager = new SoundManager();