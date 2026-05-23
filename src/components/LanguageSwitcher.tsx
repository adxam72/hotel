import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex gap-2 items-center">
      <Button
        variant={language === "uz" ? "default" : "outline"}
        size="sm"
        onClick={() => setLanguage("uz")}
        className="text-xs md:text-sm px-2 md:px-3 py-1 md:py-2"
      >
        Uz
      </Button>
      <Button
        variant={language === "ru" ? "default" : "outline"}
        size="sm"
        onClick={() => setLanguage("ru")}
        className="text-xs md:text-sm px-2 md:px-3 py-1 md:py-2"
      >
        Ру
      </Button>
      <Button
        variant={language === "en" ? "default" : "outline"}
        size="sm"
        onClick={() => setLanguage("en")}
        className="text-xs md:text-sm px-2 md:px-3 py-1 md:py-2"
      >
        En
      </Button>
    </div>
  );
}
