import { createContext, useContext, useState, ReactNode } from "react";

type Language = "uz" | "ru" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  uz: {
    // Navigation
    "nav.rooms": "Xonalar",
    "nav.amenities": "Xususiyatlar",
    "nav.location": "Joylashuvi",
    "nav.reviews": "Sharhlari",

    // Hero
    "hero.title": "Hotel Istiqlol",
    "hero.subtitle": "Markaziy Osiya tarixining qo'nchisida, zamonaviy rahatligi bilan",
    "hero.button": "☎️ Xona bronlash",

    // About
    "about.title": "Biz haqida",
    "about.desc1": "Hotel Istiqlol Qashqadaryo viloyati Dehqonobod tumani markazida joylashgan. Biz mehmonlarimizga zamonaviy rahatligi va Markaziy Osiya milliy mehmondostiligini birlashtirib taqdim etamiz.",
    "about.desc2": "Har bir xona zamonaviy jihozlar bilan jihozlangan va milliy dizayn elementlari bilan bezatilgan.",
    "about.rating": "Reyting",
    "about.reviews": "Baholash",

    // Rooms
    "rooms.title": "Bizning Xonalar",
    "rooms.subtitle": "Har bir xona sizning rahatligi uchun maxsus tayyorlangan",
    "rooms.deluxe": "Deluxe Xona",
    "rooms.deluxe_desc": "Yuqori darajali xona, katta oyna, zamonaviy jihozlar",
    "rooms.standard": "Standard Xona",
    "rooms.standard_desc": "Qulay, toza, zamonaviy dizayn bilan",
    "rooms.amenities": "✓ Zamonaviy jihozlar",
    "rooms.wifi": "✓ Bepul Wi-Fi",
    "rooms.ac": "✓ Konditsioner",
    "rooms.bathroom": "✓ Xususiy hammom",

    // Amenities
    "amenities.title": "Xususiyatlar",
    "amenities.subtitle": "Sizning qulay bo'lishingiz uchun barcha zaruriy xizmatlar",
    "amenities.wifi": "Bepul Wi-Fi",
    "amenities.wifi_desc": "Barcha xonalarda",
    "amenities.ac": "Konditsioner",
    "amenities.ac_desc": "Zamonaviy sistema",
    "amenities.card": "Karta to'lash",
    "amenities.card_desc": "Barcha kartalar qabul",
    "amenities.restaurant": "Restoran",
    "amenities.restaurant_desc": "Milliy taomlar",

    // Location
    "location.title": "Joylashuvi",
    "location.desc": "Qashqadaryo viloyatining markaziy joyida, Dehqonobod tumanida joylashgan. Shahar markazidan 5 km masofada.",
    "location.address": "Manzil",
    "location.address_value": "Qashqadaryo viloyati, Dehqonobod tumani, Karashina shahar",
    "location.phone": "Telefon",
    "location.route": "Marshrut boshlash",

    // Contact
    "contact.title": "Bizga Bog'lanish",
    "contact.subtitle": "Sizning barcha savollaringiz uchun biz shu yerda turibmiz",
    "contact.phone": "Telefon",
    "contact.address": "Manzil",
    "contact.address_value": "Karashina shahar, Dehqonobod",

    // Footer
    "footer.title": "Hotel Istiqlol",
    "footer.desc": "Markaziy Osiya tarixining qo'nchisida, zamonaviy rahatligi bilan",
    "footer.links": "Tezkor Havolalar",
    "footer.contact": "Aloqa",
    "footer.copyright": "© 2026 Hotel Istiqlol. Barcha huquqlar himoyalangan.",

    // Reviews
    "reviews.title": "Foydalanuvchi Sharhlari",
    "reviews.subtitle": "Bizning mehmonlarning fikrlari",
    "reviews.add": "Sharh qoldirish",
    "reviews.name": "Ismingiz",
    "reviews.rating": "Reyting",
    "reviews.comment": "Sharhingiz",
    "reviews.submit": "Yuborish",
  },
  ru: {
    // Navigation
    "nav.rooms": "Номера",
    "nav.amenities": "Удобства",
    "nav.location": "Местоположение",
    "nav.reviews": "Отзывы",

    // Hero
    "hero.title": "Hotel Istiqlol",
    "hero.subtitle": "В центре истории Центральной Азии с современным комфортом",
    "hero.button": "☎️ Забронировать номер",

    // About
    "about.title": "О нас",
    "about.desc1": "Hotel Istiqlol расположен в центре Дехканабадского района Кашкадарьинской области. Мы предлагаем нашим гостям современный комфорт в сочетании с традиционным гостеприимством Центральной Азии.",
    "about.desc2": "Каждый номер оснащен современной мебелью и украшен элементами национального дизайна.",
    "about.rating": "Рейтинг",
    "about.reviews": "Оценок",

    // Rooms
    "rooms.title": "Наши номера",
    "rooms.subtitle": "Каждый номер специально подготовлен для вашего комфорта",
    "rooms.deluxe": "Номер Deluxe",
    "rooms.deluxe_desc": "Люкс номер, большое окно, современная мебель",
    "rooms.standard": "Стандартный номер",
    "rooms.standard_desc": "Удобный, чистый, современный дизайн",
    "rooms.amenities": "✓ Современная мебель",
    "rooms.wifi": "✓ Бесплатный Wi-Fi",
    "rooms.ac": "✓ Кондиционер",
    "rooms.bathroom": "✓ Собственная ванная",

    // Amenities
    "amenities.title": "Удобства",
    "amenities.subtitle": "Все необходимые услуги для вашего комфорта",
    "amenities.wifi": "Бесплатный Wi-Fi",
    "amenities.wifi_desc": "Во всех номерах",
    "amenities.ac": "Кондиционер",
    "amenities.ac_desc": "Современная система",
    "amenities.card": "Оплата картой",
    "amenities.card_desc": "Все карты приняты",
    "amenities.restaurant": "Ресторан",
    "amenities.restaurant_desc": "Национальные блюда",

    // Location
    "location.title": "Местоположение",
    "location.desc": "Расположен в центре Дехканабадского района Кашкадарьинской области. В 5 км от центра города.",
    "location.address": "Адрес",
    "location.address_value": "Кашкадарьинская область, Дехканабадский район, город Карашина",
    "location.phone": "Телефон",
    "location.route": "Начать маршрут",

    // Contact
    "contact.title": "Свяжитесь с нами",
    "contact.subtitle": "Мы здесь, чтобы ответить на все ваши вопросы",
    "contact.phone": "Телефон",
    "contact.address": "Адрес",
    "contact.address_value": "Город Карашина, Дехканабадский район",

    // Footer
    "footer.title": "Hotel Istiqlol",
    "footer.desc": "В центре истории Центральной Азии с современным комфортом",
    "footer.links": "Быстрые ссылки",
    "footer.contact": "Контакты",
    "footer.copyright": "© 2026 Hotel Istiqlol. Все права защищены.",

    // Reviews
    "reviews.title": "Отзывы гостей",
    "reviews.subtitle": "Мнения наших гостей",
    "reviews.add": "Оставить отзыв",
    "reviews.name": "Ваше имя",
    "reviews.rating": "Рейтинг",
    "reviews.comment": "Ваш отзыв",
    "reviews.submit": "Отправить",
  },
  en: {
    // Navigation
    "nav.rooms": "Rooms",
    "nav.amenities": "Amenities",
    "nav.location": "Location",
    "nav.reviews": "Reviews",

    // Hero
    "hero.title": "Hotel Istiqlol",
    "hero.subtitle": "In the heart of Central Asian history with modern comfort",
    "hero.button": "☎️ Book a Room",

    // About
    "about.title": "About Us",
    "about.desc1": "Hotel Istiqlol is located in the center of Dehqonobod District of Qashqadarya Province. We offer our guests modern comfort combined with traditional Central Asian hospitality.",
    "about.desc2": "Each room is equipped with modern furniture and decorated with elements of national design.",
    "about.rating": "Rating",
    "about.reviews": "Reviews",

    // Rooms
    "rooms.title": "Our Rooms",
    "rooms.subtitle": "Each room is specially prepared for your comfort",
    "rooms.deluxe": "Deluxe Room",
    "rooms.deluxe_desc": "Luxury room, large window, modern furniture",
    "rooms.standard": "Standard Room",
    "rooms.standard_desc": "Comfortable, clean, modern design",
    "rooms.amenities": "✓ Modern furniture",
    "rooms.wifi": "✓ Free Wi-Fi",
    "rooms.ac": "✓ Air conditioning",
    "rooms.bathroom": "✓ Private bathroom",

    // Amenities
    "amenities.title": "Amenities",
    "amenities.subtitle": "All necessary services for your comfort",
    "amenities.wifi": "Free Wi-Fi",
    "amenities.wifi_desc": "In all rooms",
    "amenities.ac": "Air Conditioning",
    "amenities.ac_desc": "Modern system",
    "amenities.card": "Card Payment",
    "amenities.card_desc": "All cards accepted",
    "amenities.restaurant": "Restaurant",
    "amenities.restaurant_desc": "National cuisine",

    // Location
    "location.title": "Location",
    "location.desc": "Located in the center of Dehqonobod District of Qashqadarya Province. 5 km from the city center.",
    "location.address": "Address",
    "location.address_value": "Qashqadarya Province, Dehqonobod District, Karashina City",
    "location.phone": "Phone",
    "location.route": "Get Directions",

    // Contact
    "contact.title": "Contact Us",
    "contact.subtitle": "We are here to answer all your questions",
    "contact.phone": "Phone",
    "contact.address": "Address",
    "contact.address_value": "Karashina City, Dehqonobod District",

    // Footer
    "footer.title": "Hotel Istiqlol",
    "footer.desc": "In the heart of Central Asian history with modern comfort",
    "footer.links": "Quick Links",
    "footer.contact": "Contact",
    "footer.copyright": "© 2026 Hotel Istiqlol. All rights reserved.",

    // Reviews
    "reviews.title": "Guest Reviews",
    "reviews.subtitle": "What our guests say",
    "reviews.add": "Leave a Review",
    "reviews.name": "Your Name",
    "reviews.rating": "Rating",
    "reviews.comment": "Your Review",
    "reviews.submit": "Submit",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("language");
      return (saved as Language) || "uz";
    }
    return "uz";
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    return (translations[language] as any)[key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
