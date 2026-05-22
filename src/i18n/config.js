import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en.json';
import kaTranslations from './locales/ka.json';
import ruTranslations from './locales/ru.json';

const resources = {
  en: { translation: enTranslations },
  ka: { translation: kaTranslations },
  ru: { translation: ruTranslations },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
