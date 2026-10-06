import { defaultReviews, type Review } from "./reviews-data";

export type Language = "uz" | "ru" | "en";
export type Localized = Record<Language, string>;
export interface RoomData {
  id: string;
  name: string;
  description: string;
  image: string;
  images?: string[];
  videos?: string[];
}
export interface HotelSettings {
  name: string;
  subtitle: Localized;
  about: Localized;
  address: Localized;
  phone: string;
  latitude: number;
  longitude: number;
  heroImage: string;
  gallery: string[];
}
export const originalImages = [
  "https://avatars.mds.yandex.net/get-altay/5098065/2a00000181967c2e529094fc8b7196c16543/XXL_height",
  "https://avatars.mds.yandex.net/get-altay/6057477/2a000001819974311cd47c77a79eece7fac1/XXL_height",
];
export const hotelImages = ["/images/istiqlol-01.jpg", "/images/istiqlol-02.jpg"];
export function imageSource(src: string) {
  const index = originalImages.indexOf(src);
  return index >= 0 ? hotelImages[index] : src;
}
export function isHotelPhoto(src: string) { return [...originalImages, ...hotelImages].includes(src); }
export function validImage(src: unknown): src is string {
  return typeof src === "string" && (/^https?:\/\//i.test(src) || /^data:image\/(png|jpeg|jpg|webp|gif|avif);base64,/i.test(src) || /^\/(?!\/)/.test(src));
}
export const defaultRooms: RoomData[] = [
  { id: "deluxe", name: "Deluxe Xona", description: "Yuqori darajali xona, katta oyna, zamonaviy jihozlar", image: originalImages[0] },
  { id: "standard", name: "Standard Xona", description: "Qulay, toza, zamonaviy dizayn bilan", image: originalImages[1] },
];
export const defaultSettings: HotelSettings = {
  name: "Hotel Istiqlol",
  subtitle: { uz: "Milliy mehmondo‘stlik va zamonaviy qulaylik", ru: "Традиционное гостеприимство и современный комфорт", en: "Traditional hospitality and modern comfort" },
  about: {
    uz: "Hotel Istiqlol Qashqadaryo viloyati Dehqonobod tumani markazida joylashgan. Biz mehmonlarimizga zamonaviy qulaylik va Markaziy Osiya milliy mehmondo‘stligini birlashtirib taqdim etamiz.",
    ru: "Hotel Istiqlol расположен в центре Дехканабадского района Кашкадарьинской области. Мы предлагаем нашим гостям современный комфорт в сочетании с традиционным гостеприимством Центральной Азии.",
    en: "Hotel Istiqlol is located in the center of Dehqonobod District of Qashqadarya Province. We offer our guests modern comfort combined with traditional Central Asian hospitality.",
  },
  address: { uz: "Qashqadaryo viloyati, Dehqonobod tumani, Karashina shahar", ru: "Кашкадарьинская область, Дехканабадский район, город Карашина", en: "Qashqadarya Province, Dehqonobod District, Karashina City" },
  phone: "+998 77 150 81 60",
  latitude: 38.341547,
  longitude: 66.557003,
  heroImage: originalImages[1],
  gallery: originalImages,
};
function read(key: string): unknown {
  try { return JSON.parse(localStorage.getItem(key) || "null"); } catch { return null; }
}
function localized(value: unknown, fallback: Localized): Localized {
  const v = value as Partial<Localized> | null;
  return { uz: typeof v?.uz === "string" ? v.uz : fallback.uz, ru: typeof v?.ru === "string" ? v.ru : fallback.ru, en: typeof v?.en === "string" ? v.en : fallback.en };
}
export function loadSettings(): HotelSettings {
  const saved = read("hotel_settings") as Partial<HotelSettings> | null;
  if (!saved || typeof saved !== "object") return defaultSettings;
  return {
    name: typeof saved.name === "string" && saved.name.trim() ? saved.name : defaultSettings.name,
    phone: typeof saved.phone === "string" && saved.phone.trim() ? saved.phone : defaultSettings.phone,
    latitude: typeof saved.latitude === "number" && Number.isFinite(saved.latitude) && Math.abs(saved.latitude) <= 90 ? saved.latitude : defaultSettings.latitude,
    longitude: typeof saved.longitude === "number" && Number.isFinite(saved.longitude) && Math.abs(saved.longitude) <= 180 ? saved.longitude : defaultSettings.longitude,
    heroImage: validImage(saved.heroImage) ? saved.heroImage : defaultSettings.heroImage,
    subtitle: localized(saved.subtitle, defaultSettings.subtitle),
    about: localized(saved.about, defaultSettings.about),
    address: localized(saved.address, defaultSettings.address),
    gallery: Array.isArray(saved.gallery) ? saved.gallery.filter(validImage) : defaultSettings.gallery,
  };
}
export function loadRooms(): RoomData[] {
  const saved = read("hotel_rooms");
  if (!Array.isArray(saved)) return defaultRooms;
  return saved.filter(r => r && typeof r.id === "string" && typeof r.name === "string" && typeof r.description === "string" && typeof r.image === "string").map(r => ({
    ...r, image: validImage(r.image) ? r.image : "", images: Array.isArray(r.images) ? r.images.filter(validImage) : [], videos: Array.isArray(r.videos) ? r.videos.filter((v: unknown) => typeof v === "string" && /^(https?:\/\/|data:video\/|\/(?!\/))/.test(v)) : [],
  }));
}
export function loadReviews(): Review[] {
  const saved = read("hotel_reviews");
  if (!Array.isArray(saved)) return defaultReviews;
  return saved.filter(r => r && typeof r.id === "string" && typeof r.name === "string" && typeof r.text === "string" && typeof r.date === "string" && Number.isInteger(r.rating) && r.rating >= 1 && r.rating <= 5);
}
function save(key: string, data: unknown) {
  localStorage.setItem(key, JSON.stringify(data));
  window.dispatchEvent(new Event("hotel-content-updated"));
}
export function saveSettings(data: HotelSettings) { save("hotel_settings", data); }
export function saveRooms(data: RoomData[]) { save("hotel_rooms", data); }
export function saveReviews(data: Review[]) { save("hotel_reviews", data); }
export function subscribeHotel(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("hotel-content-updated", callback);
  return () => { window.removeEventListener("storage", callback); window.removeEventListener("hotel-content-updated", callback); };
}
