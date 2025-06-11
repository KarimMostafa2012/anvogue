// src/i18n.js
'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from '../locales/en/translation.json';
// import translationAR from '../locales/ar/translation.json';
// import translationCKB from '../locales/ckb/translation.json';
// import translationDE from '../locales/de/translation.json';
// import translationUK from '../locales/uk/translation.json';
import { localStorageUtil } from './localStorage';

// Get the initial language from localStorage or default to 'en'
const defaultLanguage = typeof window !== 'undefined' ? localStorageUtil.get('language') || 'en' : 'en';

// the translations
const resources = {
    en: {
        translation: translationEN // English translations
    },
    // ckb: {
    //     translation: translationCKB // Central Kurdish translations
    // },
    // de: {
    //     translation: translationDE // German translations
    // },
    // uk: {
    //     translation: translationUK // Ukrainian translations
    // },
    // ar: {
    //     translation: translationAR // Arabic translations
    // }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: defaultLanguage, // default language
        fallbackLng: 'en', // fallback language
        interpolation: {
            escapeValue: false
        },
        react: {
            useSuspense: false // This is important for Next.js
        }
    });

export default i18n;
