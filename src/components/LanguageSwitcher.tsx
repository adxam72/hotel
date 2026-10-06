import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  return <div className="language-switcher" aria-label="Language">
    {(["uz", "ru", "en"] as const).map(lang => <button key={lang} lang={lang} aria-label={{ uz: "O‘zbekcha", ru: "Русский", en: "English" }[lang]} aria-pressed={language === lang} onClick={() => setLanguage(lang)}>{lang.toUpperCase()}</button>)}
  </div>;
}
