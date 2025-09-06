import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
const resources = {
  en: { translation: require('../locales/en.json') },
  ar: { translation: require('../locales/ar.json') },
};

// Create a proper language detector
const languageDetector = {
  init: Function.prototype,
  type: 'languageDetector' as const,
  async: true,
  detect: async (callback: (lng: string) => void) => {
    try {
      const savedLang = await AsyncStorage.getItem('appLanguage');
      if (savedLang) {
        return callback(savedLang);
      }
      
      const locales = Localization.getLocales();
      const deviceLang = locales.length > 0 && locales[0].languageCode === 'ar' ? 'ar' : 'en';
      callback(deviceLang);
    } catch (error) {
      callback('en');
    }
  },
  cacheUserLanguage: async (lng: string) => {
    try {
      await AsyncStorage.setItem('appLanguage', lng);
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  }
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;