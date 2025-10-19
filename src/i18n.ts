import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import I18NextHttpBackend from "i18next-http-backend";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(initReactI18next)
  .use(I18NextHttpBackend)
  .use(I18nextBrowserLanguageDetector)
  .init({
    fallbackLng: 'en',
    debug: true,
    supportedLngs: ['nl', 'en'],

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    }
  });

export default i18n;
