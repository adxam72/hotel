import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Phone, Wifi, Wind, CreditCard, Star, X, Copy, Check } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import ReviewsSection from "@/components/ReviewsSection";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { trackVisit } from "@/lib/analytics";

/**
 * Hotel Istiqlol Website - Home Page
 * Design: Central Asian Heritage & Modern Minimalism
 * Color Palette: Sand (#D4A574), Taupe (#8B7355), Blue (#2C5F7F), Cream (#FFFFFF)
 * Typography: Playfair Display (headings), Poppins (body)
 * Layout: Asymmetric with diagonal cuts and geometric patterns
 * Animations: Smooth scroll-triggered reveals, hover effects, transitions
 * Mobile-First: Fully responsive design optimized for phones
 * Languages: Uzbek, Russian, English
 */

interface RoomData {
  id: string;
  name: string;
  description: string;
  image: string;
}

const defaultRooms: RoomData[] = [
  {
    id: "deluxe",
    name: "Deluxe Xona",
    description: "Yuqori darajali xona, katta oyna, zamonaviy jihozlar",
    image: "https://avatars.mds.yandex.net/get-altay/5098065/2a00000181967c2e529094fc8b7196c16543/XXL_height",
  },
  {
    id: "standard",
    name: "Standard Xona",
    description: "Qulay, toza, zamonaviy dizayn bilan",
    image: "https://avatars.mds.yandex.net/get-altay/6057477/2a000001819974311cd47c77a79eece7fac1/XXL_height",
  },
];

function loadRooms(): RoomData[] {
  try {
    const saved = localStorage.getItem("hotel_rooms");
    if (saved) return JSON.parse(saved);
  } catch {}
  return defaultRooms;
}

function saveRooms(rooms: RoomData[]) {
  localStorage.setItem("hotel_rooms", JSON.stringify(rooms));
}

export default function Home() {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [rooms, setRooms] = useState<RoomData[]>(loadRooms);
  const [showPhone, setShowPhone] = useState(false);
  const [copied, setCopied] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { t } = useLanguage();

  const handleSecretTap = () => {
    const next = tapCount + 1;
    if (next >= 5) {
      setTapCount(0);
      window.location.href = "/admin";
      return;
    }
    setTapCount(next);
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    tapTimerRef.current = setTimeout(() => setTapCount(0), 2000);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText("+998771508160");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    trackVisit();
  }, []);

  useEffect(() => {
    const handleStorage = () => setRooms(loadRooms());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const amenities = [
    { icon: Wifi, name: t("amenities.wifi"), description: t("amenities.wifi_desc") },
    { icon: Wind, name: t("amenities.ac"), description: t("amenities.ac_desc") },
    { icon: CreditCard, name: t("amenities.card"), description: t("amenities.card_desc") },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation - Mobile Optimized */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="container flex items-center justify-between h-14 md:h-16 px-4 md:px-0">
          <div className="text-xl md:text-2xl font-bold text-primary">Istiqlol</div>
          <div className="hidden md:flex gap-8 items-center">
            <a 
              href="#rooms" 
              className="text-foreground hover:text-primary transition-colors duration-300 hover:underline underline-offset-4"
            >
              {t("nav.rooms")}
            </a>
            <a 
              href="#amenities" 
              className="text-foreground hover:text-primary transition-colors duration-300 hover:underline underline-offset-4"
            >
              {t("nav.amenities")}
            </a>
            <a 
              href="#location" 
              className="text-foreground hover:text-primary transition-colors duration-300 hover:underline underline-offset-4"
            >
              {t("nav.location")}
            </a>
            <a 
              href="#reviews" 
              className="text-foreground hover:text-primary transition-colors duration-300 hover:underline underline-offset-4"
            >
              {t("nav.reviews")}
            </a>
          </div>
          {/* Language Switcher */}
          <div className="flex gap-3 items-center">
            <LanguageSwitcher />
            <button onClick={() => setShowPhone(true)} className="p-2 hover:bg-secondary rounded-lg transition-colors md:hidden">
              <Phone className="w-5 h-5 text-primary" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Diagonal Cut - Mobile Optimized */}
      <section className="relative h-[400px] md:h-[600px] overflow-hidden">
        <img
          src="https://avatars.mds.yandex.net/get-altay/6057477/2a000001819974311cd47c77a79eece7fac1/XXL_height"
          alt={t("hero.title")}
          className="w-full h-full object-cover animate-in fade-in duration-1000"
        />
        {/* Diagonal overlay with geometric pattern */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"
          style={{
            clipPath: "polygon(0 0, 100% 0, 100% 85%, 0 100%)",
          }}
        />
        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-center items-start px-4 md:px-0">
          <div className="max-w-2xl animate-in fade-in slide-in-from-left-8 duration-1000 fill-mode-both">
            <h1 className="text-4xl md:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight">
              {t("hero.title")}
            </h1>
            <p className="text-base md:text-xl text-white/90 mb-6 md:mb-8 font-light">
              {t("hero.subtitle")}
            </p>
            <Button
              size="lg"
              onClick={() => setShowPhone(true)}
              className="bg-primary hover:bg-primary/90 text-white text-base md:text-lg px-6 md:px-8 py-5 md:py-6 rounded-lg transition-all hover:scale-105 active:scale-97 duration-200 w-full md:w-auto"
            >
              {t("hero.button")}
            </Button>
          </div>
        </div>
      </section>

      {/* Geometric Divider */}
      <div className="h-12 md:h-20 bg-gradient-to-b from-transparent to-secondary/20" />

      {/* About Section - Mobile Optimized */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container px-4 md:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="animate-in fade-in slide-in-from-left-8 duration-700 fill-mode-both order-2 md:order-1">
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 md:mb-6">
                {t("about.title")}
              </h2>
              <p className="text-base md:text-lg text-muted-foreground mb-4 md:mb-6 leading-relaxed">
                {t("about.desc1")}
              </p>
              <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 leading-relaxed">
                {t("about.desc2")}
              </p>
              <div className="flex gap-6 md:gap-6">
                <div className="hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl md:text-4xl font-bold text-primary flex items-center gap-1">
                    4.4 <Star className="w-6 h-6 fill-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">{t("about.rating")}</p>
                </div>
                <div className="hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl md:text-4xl font-bold text-primary">41</div>
                  <p className="text-sm text-muted-foreground">{t("about.reviews")}</p>
                </div>
              </div>
            </div>
            <img
              src="https://avatars.mds.yandex.net/get-altay/5098065/2a00000181967c2e529094fc8b7196c16543/XXL_height"
              alt={t("about.title")}
              className="rounded-lg shadow-lg animate-in fade-in slide-in-from-right-8 duration-700 fill-mode-both hover:shadow-2xl transition-shadow duration-300 order-1 md:order-2"
            />
          </div>
        </div>
      </section>

      {/* Rooms Section - Mobile Optimized */}
      <section id="rooms" className="py-12 md:py-20 bg-secondary/10">
        <div className="container px-4 md:px-0">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-2 md:mb-4 text-center animate-in fade-in duration-700 fill-mode-both">
            {t("rooms.title")}
          </h2>
          <p className="text-center text-muted-foreground mb-10 md:mb-16 text-base md:text-lg animate-in fade-in duration-700 fill-mode-both delay-100">
            {t("rooms.subtitle")}
          </p>

          <div className={`grid grid-cols-1 ${rooms.length >= 3 ? "md:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2"} gap-6 md:gap-8`}>
            {rooms.map((room, idx) => (
              <Card
                key={room.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:translate-x-2 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
                style={{ animationDelay: `${idx * 100}ms` }}
                onClick={() => setSelectedRoom(selectedRoom === room.id ? null : room.id)}
              >
                <div className="relative h-48 md:h-64 overflow-hidden">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 md:p-6">
                  <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                    {room.name}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-4">
                    {room.description}
                  </p>
                  {selectedRoom === room.id && (
                    <div className="mt-4 pt-4 border-t border-border animate-in fade-in duration-300">
                      <ul className="space-y-2 text-xs md:text-sm text-muted-foreground">
                        <li className="animate-in fade-in slide-in-from-left-4 duration-300 fill-mode-both">{t("rooms.amenities")}</li>
                        <li className="animate-in fade-in slide-in-from-left-4 duration-300 fill-mode-both delay-75">{t("rooms.wifi")}</li>
                        <li className="animate-in fade-in slide-in-from-left-4 duration-300 fill-mode-both delay-150">{t("rooms.ac")}</li>
                        <li className="animate-in fade-in slide-in-from-left-4 duration-300 fill-mode-both delay-200">{t("rooms.bathroom")}</li>
                      </ul>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities Section - Mobile Optimized */}
      <section id="amenities" className="py-12 md:py-20 bg-white">
        <div className="container px-4 md:px-0">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-2 md:mb-4 text-center animate-in fade-in duration-700 fill-mode-both">
            {t("amenities.title")}
          </h2>
          <p className="text-center text-muted-foreground mb-10 md:mb-16 text-base md:text-lg animate-in fade-in duration-700 fill-mode-both delay-100">
            {t("amenities.subtitle")}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {amenities.map((amenity, idx) => {
              const Icon = amenity.icon;
              return (
                <div
                  key={idx}
                  className="text-center p-4 md:p-6 rounded-lg bg-secondary/10 hover:bg-secondary/20 transition-all duration-300 hover:shadow-md hover:scale-105 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
                  style={{ animationDelay: `${idx * 75}ms` }}
                >
                  <Icon className="w-10 md:w-12 h-10 md:h-12 text-primary mx-auto mb-3 md:mb-4 animate-in zoom-in duration-500" />
                  <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">
                    {amenity.name}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    {amenity.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Location Section with Map - Mobile Optimized */}
      <section id="location" className="py-12 md:py-20 bg-secondary/10">
        <div className="container px-4 md:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start mb-12 md:mb-16">
            <div className="animate-in fade-in slide-in-from-left-8 duration-700 fill-mode-both">
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 md:mb-6">
                {t("location.title")}
              </h2>
              <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 leading-relaxed">
                {t("location.desc")}
              </p>
              <div className="space-y-4">
                <div className="flex gap-4 items-start hover:translate-x-2 transition-transform duration-300">
                  <MapPin className="w-5 md:w-6 h-5 md:h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-foreground text-sm md:text-base">{t("location.address")}</p>
                    <p className="text-muted-foreground text-sm md:text-base">{t("location.address_value")}</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start hover:translate-x-2 transition-transform duration-300">
                  <Phone className="w-5 md:w-6 h-5 md:h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-foreground text-sm md:text-base">{t("location.phone")}</p>
                    <a href="tel:+998771508160" className="text-primary hover:underline text-sm md:text-base">
                      +998 77 150 81 60
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="animate-in fade-in slide-in-from-right-8 duration-700 fill-mode-both relative group">
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=66.547%2C38.335%2C66.567%2C38.348&layer=mapnik&marker=38.341547%2C66.557003"
                className="w-full h-[400px] md:h-[500px] rounded-lg shadow-lg border-0"
                loading="lazy"
                title="Hotel Istiqlol - Joylashuvi"
              />
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=38.341547,66.557003&travelmode=driving"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 transition-all hover:scale-105 text-sm md:text-base font-semibold"
              >
                <MapPin className="w-5 h-5" />
                {t("location.route")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews">
        <ReviewsSection />
      </section>

      {/* Contact Section - Mobile Optimized */}
      <section className="py-12 md:py-20 bg-primary text-white">
        <div className="container px-4 md:px-0 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 animate-in fade-in duration-700 fill-mode-both">
            {t("contact.title")}
          </h2>
          <p className="text-base md:text-xl text-white/90 mb-10 md:mb-12 max-w-2xl mx-auto animate-in fade-in duration-700 fill-mode-both delay-100">
            {t("contact.subtitle")}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-2xl mx-auto mb-10 md:mb-12">
            <div onClick={() => setShowPhone(true)} className="hover:scale-105 transition-transform duration-300 cursor-pointer">
              <div className="bg-white/10 backdrop-blur-sm p-6 md:p-8 rounded-lg hover:bg-white/20 transition-all duration-300">
                <Phone className="w-8 h-8 mx-auto mb-4 animate-in zoom-in duration-500" />
                <p className="text-base md:text-lg font-semibold mb-2">{t("contact.phone")}</p>
                <p className="text-white/90">+998 77 150 81 60</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 md:p-8 rounded-lg hover:bg-white/20 transition-all duration-300 hover:scale-105 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both delay-100">
              <MapPin className="w-8 h-8 mx-auto mb-4 animate-in zoom-in duration-500" />
              <p className="text-base md:text-lg font-semibold mb-2">{t("contact.address")}</p>
              <p className="text-white/90">{t("contact.address_value")}</p>
            </div>
          </div>

          <Button
            size="lg"
            onClick={() => setShowPhone(true)}
            className="bg-white text-primary hover:bg-white/90 text-base md:text-lg px-6 md:px-8 py-5 md:py-6 rounded-lg transition-all hover:scale-105 active:scale-97 duration-200 w-full md:w-auto animate-in fade-in duration-700 fill-mode-both delay-200"
          >
            {t("hero.button")}
          </Button>
        </div>
      </section>

      {/* Footer - Mobile Optimized */}
      <footer className="bg-foreground text-white/80 py-8 md:py-12">
        <div className="container px-4 md:px-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
            <div className="animate-in fade-in duration-700 fill-mode-both">
              <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">{t("footer.title")}</h3>
              <p className="text-sm md:text-base text-white/70">
                {t("footer.desc")}
              </p>
            </div>
            <div className="animate-in fade-in duration-700 fill-mode-both delay-75">
              <h4 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4">{t("footer.links")}</h4>
              <ul className="space-y-2 text-sm md:text-base text-white/70">
                <li><a href="#rooms" className="hover:text-white transition-colors duration-300">{t("nav.rooms")}</a></li>
                <li><a href="#amenities" className="hover:text-white transition-colors duration-300">{t("nav.amenities")}</a></li>
                <li><a href="#location" className="hover:text-white transition-colors duration-300">{t("nav.location")}</a></li>
                <li><a href="#reviews" className="hover:text-white transition-colors duration-300">{t("nav.reviews")}</a></li>
              </ul>
            </div>
            <div className="animate-in fade-in duration-700 fill-mode-both delay-150">
              <h4 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4">{t("footer.contact")}</h4>
              <p className="text-sm md:text-base text-white/70 mb-2">
                <button onClick={() => setShowPhone(true)} className="hover:text-white transition-colors">
                  +998 77 150 81 60
                </button>
              </p>
              <p className="text-sm md:text-base text-white/70">{t("contact.address_value")}</p>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 md:pt-8 text-center text-xs md:text-sm text-white/60">
            <p onClick={handleSecretTap} className="select-none">{t("footer.copyright")}</p>
          </div>
        </div>
      </footer>

      {/* Phone Modal */}
      {showPhone && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setShowPhone(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" />
          <div
            className="relative bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-md w-full animate-in fade-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPhone(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-secondary/20 transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">{t("hero.button")}</h3>
              <p className="text-muted-foreground mb-6">{t("contact.subtitle")}</p>

              <div className="bg-secondary/10 rounded-xl p-4 mb-6">
                <p className="text-sm text-muted-foreground mb-1">{t("contact.phone")}</p>
                <p className="text-2xl md:text-3xl font-bold text-primary tracking-wide">
                  +998 77 150 81 60
                </p>
              </div>

              <div className="flex gap-3">
                <a
                  href="tel:+998771508160"
                  className="flex-1"
                >
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white py-3">
                    <Phone className="w-4 h-4 mr-2" />
                    {t("contact.phone")}
                  </Button>
                </a>
                <Button
                  variant="outline"
                  onClick={handleCopyPhone}
                  className="px-4 py-3"
                >
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground mt-4">
                {t("location.address_value")}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
