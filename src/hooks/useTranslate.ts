import {useTranslation} from "react-i18next";

export interface LocalString {
  en: string
  nl: string
}

export const useTranslate = () => {
  const { t, i18n } = useTranslation();

  return {
    t,
    l: (string?: LocalString | null) => i18n.language === "nl" ? string?.nl : string?.en,
    i18n
  };
}