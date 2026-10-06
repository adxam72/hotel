import { useRef, useState } from "react";
import { Images, Save, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { imageSource, loadSettings, saveSettings, validImage, type HotelSettings, type Language } from "@/lib/hotel";
import { readImage } from "@/lib/media";

export default function HotelSettingsEditor() {
  const [settings, setSettings] = useState<HotelSettings>(loadSettings);
  const [language, setLanguage] = useState<Language>("uz");
  const [photoUrl, setPhotoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const heroInput = useRef<HTMLInputElement>(null);
  const galleryInput = useRef<HTMLInputElement>(null);
  const update = <K extends keyof HotelSettings>(key: K, value: HotelSettings[K]) => setSettings(current => ({ ...current, [key]: value }));
  const updateText = (key: "subtitle" | "about" | "address", value: string) => setSettings(current => ({ ...current, [key]: { ...current[key], [language]: value } }));
  const upload = async (files: FileList | null, hero: boolean) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      const images = await Promise.all(Array.from(files).map(readImage));
      if (hero) update("heroImage", images[0]);
      else setSettings(current => ({ ...current, gallery: [...current.gallery, ...images] }));
    } catch (error) { toast.error(error instanceof Error ? error.message : "Rasm yuklanmadi"); }
    finally { setUploading(false); }
  };
  const addPhoto = () => {
    if (!validImage(photoUrl.trim())) { toast.error("To‘g‘ri rasm havolasini kiriting"); return; }
    setSettings(current => ({ ...current, gallery: [...current.gallery, photoUrl.trim()] }));
    setPhotoUrl("");
  };
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings.name.trim() || !/^\+?[\d\s()-]{7,25}$/.test(settings.phone) || !validImage(settings.heroImage)) { toast.error("Nom, telefon yoki asosiy rasmni tekshiring"); return; }
    try { saveSettings(settings); toast.success("Mehmonxona ma’lumotlari saqlandi"); }
    catch { toast.error("Saqlash uchun joy yetarli emas. Rasm havolalaridan foydalaning yoki rasmlar sonini kamaytiring."); }
  };
  return <form onSubmit={save}>
    <div className="settings-grid">
      <section className="settings-card"><h2>Mehmonxona ma’lumotlari</h2>
        <div className="settings-field"><label htmlFor="hotel-name">Mehmonxona nomi</label><Input id="hotel-name" required maxLength={80} value={settings.name} onChange={e => update("name", e.target.value)} /></div>
        <div className="settings-field"><label htmlFor="hotel-phone">Telefon</label><Input id="hotel-phone" type="tel" required value={settings.phone} onChange={e => update("phone", e.target.value)} /></div>
        <div className="settings-language-tabs" aria-label="Ma’lumot tili">{(["uz", "ru", "en"] as const).map(lang => <button type="button" key={lang} aria-pressed={lang === language} onClick={() => setLanguage(lang)}>{lang.toUpperCase()}</button>)}</div>
        <div className="settings-field"><label htmlFor="hotel-subtitle">Asosiy sahifa tavsifi ({language.toUpperCase()})</label><Textarea id="hotel-subtitle" required rows={2} value={settings.subtitle[language]} onChange={e => updateText("subtitle", e.target.value)} /></div>
        <div className="settings-field"><label htmlFor="hotel-about">Mehmonxona haqida ({language.toUpperCase()})</label><Textarea id="hotel-about" required rows={5} value={settings.about[language]} onChange={e => updateText("about", e.target.value)} /></div>
        <div className="settings-field"><label htmlFor="hotel-address">Manzil ({language.toUpperCase()})</label><Textarea id="hotel-address" required rows={2} value={settings.address[language]} onChange={e => updateText("address", e.target.value)} /></div>
        <div className="grid grid-cols-2 gap-4"><div className="settings-field"><label htmlFor="hotel-latitude">Xarita: kenglik</label><Input id="hotel-latitude" type="number" min="-90" max="90" step="any" required value={settings.latitude} onChange={e => update("latitude", Number(e.target.value))} /></div><div className="settings-field"><label htmlFor="hotel-longitude">Xarita: uzunlik</label><Input id="hotel-longitude" type="number" min="-180" max="180" step="any" required value={settings.longitude} onChange={e => update("longitude", Number(e.target.value))} /></div></div>
      </section>
      <section className="settings-card"><h2>Asosiy rasm</h2>
        <div className="settings-field"><label htmlFor="hotel-hero">Rasm havolasi</label><Input id="hotel-hero" value={settings.heroImage.startsWith("data:") ? "" : settings.heroImage} onChange={e => update("heroImage", e.target.value)} placeholder="https://…" /></div>
        {validImage(settings.heroImage) && <img src={imageSource(settings.heroImage)} alt="Asosiy rasm" className="settings-hero-preview" />}
        <input ref={heroInput} type="file" accept="image/jpeg,image/png,image/webp,image/avif" hidden onChange={e => { void upload(e.target.files, true); e.target.value = ""; }} />
        <Button type="button" variant="outline" disabled={uploading} onClick={() => heroInput.current?.click()}><Upload size={16} /> Rasm yuklash</Button>
      </section>
      <section className="settings-card settings-gallery-card"><h2>Mehmonxona galereyasi</h2>
        <div className="settings-field"><label htmlFor="hotel-gallery-url">Yangi rasm havolasi</label><div className="flex gap-2"><Input id="hotel-gallery-url" value={photoUrl} onChange={e => setPhotoUrl(e.target.value)} placeholder="https://…" /><Button type="button" onClick={addPhoto}>Qo‘shish</Button></div></div>
        <input ref={galleryInput} type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif" hidden onChange={e => { void upload(e.target.files, false); e.target.value = ""; }} />
        <Button type="button" variant="outline" disabled={uploading} onClick={() => galleryInput.current?.click()}><Images size={16} /> Rasmlar yuklash</Button>
        <div className="settings-gallery">{settings.gallery.map((src, i) => <div key={`${src}-${i}`} className="settings-gallery-item"><img src={imageSource(src)} alt={`Galereya rasmi ${i + 1}`} /><button type="button" aria-label={`Galereyadan ${i + 1}-rasmni olib tashlash`} onClick={() => update("gallery", settings.gallery.filter((_, index) => index !== i))}><X size={14} /></button></div>)}</div>
      </section>
    </div>
    <div className="settings-actions"><p>O‘zgarishlar shu brauzerda saqlanadi. Uchala til ma’lumotlarini tahrirlashingiz mumkin.</p><Button type="submit" disabled={uploading}><Save size={16} /> {uploading ? "Rasm tayyorlanmoqda…" : "Ma’lumotlarni saqlash"}</Button></div>
  </form>;
}
