import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowDown, ArrowRight, ArrowUpRight, BedDouble, Check, ChevronLeft, ChevronRight, Copy, CreditCard, Images, MapPin, Menu, Phone, Wifi, Wind, X } from "lucide-react";
import { toast } from "sonner";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ReviewsSection from "@/components/ReviewsSection";
import Reveal from "@/components/Reveal";
import HotelDialog from "@/components/HotelDialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { copy } from "@/lib/copy";
import { trackVisit } from "@/lib/analytics";
import { defaultRooms, hotelImages, imageSource, isHotelPhoto, loadRooms, loadSettings, subscribeHotel, type RoomData } from "@/lib/hotel";

function HotelIllustration() {
  return <svg className="hotel-illustration" viewBox="0 0 360 270" fill="none" aria-hidden="true">
    <path d="M22 250H338M55 250V65H305V250M44 65H316V41H44V65M70 41V24H290V41" />
    <path d="M80 91H130V127H80V91ZM155 91H205V127H155V91ZM230 91H280V127H230V91ZM80 150H130V187H80V150ZM230 150H280V187H230V150ZM148 250V165H212V250M180 165V250" />
    <path d="M38 250V217H63M298 250V217H323V250M44 217V201M317 217V201M62 77H297M70 137H290M70 199H140M220 199H290" />
    <circle cx="31" cy="38" r="11" /><path d="M31 18V12M31 64V58M11 38H5M57 38H51M17 24L13 20M45 24L49 20" />
  </svg>;
}
function RoomIllustration() {
  return <div className="room-illustration" aria-hidden="true"><div className="room-grid-lines" /><BedDouble strokeWidth={0.65} /><span className="room-illustration-line" /></div>;
}

export default function Home() {
  const { language, t } = useLanguage();
  const c = copy[language];
  const [settings, setSettings] = useState(loadSettings);
  const [rooms, setRooms] = useState(loadRooms);
  const [menu, setMenu] = useState(false);
  const [phone, setPhone] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomData | null>(null);
  const [photo, setPhoto] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const taps = useRef(0);
  const tapTime = useRef(0);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hero = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const { scrollYProgress: heroProgress } = useScroll({ target: hero, offset: ["start start", "end start"] });
  const imageY = useTransform(heroProgress, [0, 1], [0, 65]);
  const nav = ["rooms", "amenities", "location", "reviews"];
  const gallery = Array.from(new Set([...settings.gallery, ...rooms.flatMap(r => [r.image, ...(r.images || [])]).filter(src => !isHotelPhoto(src))].filter(Boolean).map(imageSource)));
  const roomName = (r: RoomData) => defaultRooms.some(d => d.id === r.id && d.name === r.name) ? t(`rooms.${r.id}`) : r.name;
  const roomDescription = (r: RoomData) => defaultRooms.some(d => d.id === r.id && d.description === r.description) ? t(`rooms.${r.id}_desc`) : r.description;
  const phoneLink = `tel:${settings.phone.replace(/[^+\d]/g, "")}`;
  const routeLink = `https://www.google.com/maps/dir/?api=1&destination=${settings.latitude},${settings.longitude}&travelmode=driving`;
  const mapLink = `https://www.openstreetmap.org/export/embed.html?bbox=${settings.longitude - 0.01}%2C${settings.latitude - 0.007}%2C${settings.longitude + 0.01}%2C${settings.latitude + 0.007}&layer=mapnik&marker=${settings.latitude}%2C${settings.longitude}`;
  const photoLabel = (src: string) => src === hotelImages[0] ? c.interior : src === hotelImages[1] ? c.exterior : settings.name;
  const amenities = [{ icon: Wifi, key: "wifi" }, { icon: Wind, key: "ac" }, { icon: CreditCard, key: "card" }];

  useEffect(() => {
    try { trackVisit(); } catch { /* Analytics cannot block the hotel website. */ }
    const unsubscribe = subscribeHotel(() => { setRooms(loadRooms()); setSettings(loadSettings()); });
    const keyboard = (e: KeyboardEvent) => { if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") { e.preventDefault(); window.location.href = "/admin"; } };
    window.addEventListener("keydown", keyboard);
    return () => { unsubscribe(); window.removeEventListener("keydown", keyboard); if (copyTimer.current) clearTimeout(copyTimer.current); };
  }, []);
  useEffect(() => { setMenu(false); document.title = settings.name; }, [language, settings.name]);
  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu(false);
      if (photo === null || gallery.length === 0) return;
      if (event.key === "ArrowRight") { event.preventDefault(); setPhoto(current => current === null ? null : (current + 1) % gallery.length); }
      if (event.key === "ArrowLeft") { event.preventDefault(); setPhoto(current => current === null ? null : (current + gallery.length - 1) % gallery.length); }
    };
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, [photo, gallery.length]);
  const secretTap = () => {
    const now = Date.now(); taps.current = now - tapTime.current < 2000 ? taps.current + 1 : 1; tapTime.current = now;
    if (taps.current === 5) window.location.href = "/admin";
  };
  const copyPhone = async () => {
    try { await navigator.clipboard.writeText(settings.phone); setCopied(true); if (copyTimer.current) clearTimeout(copyTimer.current); copyTimer.current = setTimeout(() => setCopied(false), 2000); }
    catch { toast.error(c.copyError); }
  };
  const openPhoto = (src: string) => { const index = gallery.indexOf(imageSource(src)); if (index >= 0) setPhoto(index); };

  return <div className="hotel-site">
    <a className="skip-link" href="#main">{c.skip}</a>
    <motion.div className="scroll-progress" style={{ scaleX: reduce ? scrollYProgress : progress }} />
    <header className="site-header">
      <div className="shell header-inner">
        <a href="#" className="brand" aria-label={settings.name}><span className="brand-symbol" aria-hidden="true">I<span /></span><span className="brand-name">{settings.name}</span></a>
        <nav className="desktop-nav" aria-label={c.menu}>{nav.map(n => <a key={n} href={`#${n}`}>{t(`nav.${n}`)}</a>)}</nav>
        <div className="header-actions"><LanguageSwitcher /><button className="button button-dark header-book" onClick={() => setPhone(true)}>{c.book}<ArrowUpRight size={17} /></button><button className="icon-button menu-toggle" aria-label={c.menu} aria-expanded={menu} aria-controls="mobile-nav" onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button></div>
      </div>
      <AnimatePresence>{menu && <motion.nav id="mobile-nav" className="mobile-nav" aria-label={c.menu} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduce ? 0 : 0.25 }}>{nav.map(n => <a key={n} href={`#${n}`} onClick={() => setMenu(false)}>{t(`nav.${n}`)}<ArrowUpRight size={18} /></a>)}<button onClick={() => { setMenu(false); setPhone(true); }}>{c.book}<Phone size={18} /></button></motion.nav>}</AnimatePresence>
    </header>
    <main id="main">
      <section className="hero" ref={hero}>
        <motion.div className="hero-visual" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9 }}>
          <motion.img src={imageSource(settings.heroImage)} alt={isHotelPhoto(settings.heroImage) ? photoLabel(imageSource(settings.heroImage)) : settings.name} fetchPriority="high" style={{ y: reduce ? 0 : imageY }} />
          <div className="hero-image-shade" />
        </motion.div>
        <div className="hero-content shell">
          <Reveal className="hero-copy"><p className="eyebrow"><span />{settings.address[language]}</p><h1>{settings.name}</h1><p className="hero-intro">{settings.subtitle[language]}</p><div className="hero-actions"><button className="button button-blue" onClick={() => setPhone(true)}>{c.book}<ArrowUpRight size={20} /></button><a className="hero-explore" href="#rooms">{c.explore}<ArrowRight size={19} /></a></div></Reveal>
          <div className="hero-bottom"><a className="scroll-cue" href="#about"><span>{t("about.title")}</span><ArrowDown size={19} /></a>{gallery.length > 0 && <button className="hero-gallery" onClick={() => setPhoto(0)}><Images size={18} /><span>{c.allPhotos}</span><ArrowUpRight size={16} /></button>}</div>
        </div>
        <div className="hero-side-label" aria-hidden="true">{settings.name.toLocaleUpperCase()}</div>
      </section>
      <div className="amenity-strip"><div className="shell">{amenities.map(({ icon: Icon, key }) => <a key={key} href="#amenities"><Icon size={20} strokeWidth={1.5} /><span>{t(`amenities.${key}`)}</span><ArrowUpRight size={15} /></a>)}</div></div>

      <section id="about" className="section shell about-grid">
        <Reveal className="about-copy"><p className="eyebrow"><span className="section-number">01</span>{t("about.title")}</p><h2>{settings.subtitle[language]}</h2><p>{settings.about[language]}</p><p>{t("about.desc2")}</p><a className="text-link" href="#rooms">{c.explore}<ArrowUpRight size={20} /></a><div className="about-bottom"><span>{settings.name}</span><HotelIllustration /></div></Reveal>
        <Reveal className="about-image" delay={0.1}><button onClick={() => openPhoto(settings.gallery[0] || settings.heroImage)} aria-label={c.photo}><img src={imageSource(settings.gallery[0] || settings.heroImage)} alt={photoLabel(imageSource(settings.gallery[0] || settings.heroImage))} loading="lazy" /><span className="image-open"><ArrowUpRight size={21} /></span></button><div className="image-caption"><span>{photoLabel(imageSource(settings.gallery[0] || settings.heroImage))}</span><span>01 / {String(gallery.length).padStart(2, "0")}</span></div></Reveal>
      </section>

      <section id="rooms" className="section rooms-section"><div className="shell">
        <Reveal className="section-heading"><div><p className="eyebrow"><span className="section-number">02</span>{c.roomTypes}</p><h2>{t("rooms.title")}</h2></div><p>{t("rooms.subtitle")}</p></Reveal>
        <div className="rooms-grid">{rooms.map((r, i) => <Reveal key={r.id} delay={Math.min(i * 0.08, 0.3)}><motion.article className="room-card" whileHover={reduce ? undefined : { y: -6 }} transition={{ duration: 0.25 }}>
          <button className={`room-photo ${isHotelPhoto(r.image) || !r.image ? "room-photo-illustrated" : ""}`} onClick={() => setSelectedRoom(r)} aria-label={`${c.details}: ${roomName(r)}`}>
            {r.image && !isHotelPhoto(r.image) ? <img src={imageSource(r.image)} alt={roomName(r)} loading="lazy" /> : <RoomIllustration />}
            <span className="room-tag">{String(i + 1).padStart(2, "0")}</span><span className="photo-arrow"><ArrowUpRight size={23} /></span>
          </button>
          <div className="room-info"><h3>{roomName(r)}</h3><p>{roomDescription(r)}</p><div className="room-meta"><span><Wifi size={15} />Wi-Fi</span><span><Wind size={15} />{t("amenities.ac")}</span></div><div className="room-actions"><button className="text-link" onClick={() => setSelectedRoom(r)}>{c.details}<ArrowRight size={18} /></button><button className="room-book" onClick={() => setPhone(true)}>{c.book}<ArrowUpRight size={18} /></button></div></div>
        </motion.article></Reveal>)}</div>{rooms.length === 0 && <p className="empty-state">{c.roomsEmpty}</p>}
      </div></section>

      <section id="amenities" className="section shell amenities-section">
        <Reveal className="section-heading"><div><p className="eyebrow"><span className="section-number">03</span>{t("nav.amenities")}</p><h2>{t("amenities.title")}</h2></div><p>{t("amenities.subtitle")}</p></Reveal>
        <div className="amenities-grid">{amenities.map(({ icon: Icon, key }, i) => <Reveal key={key} delay={i * 0.1}><div className="amenity"><span className="amenity-index">0{i + 1}</span><span className="amenity-icon"><Icon size={31} strokeWidth={1.4} /></span><h3>{t(`amenities.${key}`)}</h3><p>{t(`amenities.${key}_desc`)}</p><span className="amenity-decoration" aria-hidden="true" /></div></Reveal>)}</div>
      </section>

      {gallery.length > 0 && <section id="gallery" className="section gallery-section"><div className="shell"><Reveal className="section-heading"><div><p className="eyebrow"><span className="section-number">04</span>{settings.name}</p><h2>{c.gallery}</h2></div><span className="gallery-count">{String(gallery.length).padStart(2, "0")}<Images size={24} strokeWidth={1.2} /></span></Reveal><div className="gallery-grid">{gallery.map((src, i) => <Reveal key={src} delay={Math.min(i * 0.1, 0.3)}><button className="gallery-photo" onClick={() => setPhoto(i)} aria-label={`${c.photo} ${i + 1}`}><img src={src} alt={photoLabel(src)} loading="lazy" /><span className="gallery-caption"><span><small>{String(i + 1).padStart(2, "0")}</small>{photoLabel(src)}</span><ArrowUpRight size={26} /></span></button></Reveal>)}</div></div></section>}

      <section id="location" className="section location-section"><div className="shell location-grid"><Reveal><p className="eyebrow"><span className="section-number">05</span>{t("nav.location")}</p><h2>{t("location.title")}</h2><div className="location-detail"><MapPin size={22} strokeWidth={1.3} /><div><span>{t("location.address")}</span><p>{settings.address[language]}</p></div></div><div className="location-detail"><Phone size={22} strokeWidth={1.3} /><div><span>{t("location.phone")}</span><a href={phoneLink}>{settings.phone}</a></div></div><a className="button button-blue" href={routeLink} target="_blank" rel="noopener noreferrer">{t("location.route")}<ArrowUpRight size={20} /></a></Reveal><Reveal className="map-wrap"><iframe src={mapLink} loading="lazy" title={t("location.title")} /><div className="map-label"><span className="map-dot" /><div>{settings.name}<small>{settings.address[language]}</small></div></div></Reveal></div></section>
      <ReviewsSection />
      <section id="contact" className="contact-section"><div className="shell"><Reveal className="contact-inner"><div><p className="eyebrow">{settings.name}</p><h2>{t("contact.title")}</h2><p>{t("contact.subtitle")}</p><a className="contact-phone" href={phoneLink}>{settings.phone}<ArrowUpRight size={36} /></a><button className="button button-white" onClick={() => setPhone(true)}>{c.book}<ArrowUpRight size={20} /></button></div><div className="contact-art"><HotelIllustration /></div></Reveal></div></section>
    </main>

    <footer className="site-footer"><div className="shell"><div className="footer-top"><a href="#" className="brand"><span className="brand-symbol" aria-hidden="true">I<span /></span><span className="brand-name">{settings.name}</span></a><nav aria-label={t("footer.links")}>{nav.map(n => <a key={n} href={`#${n}`}>{t(`nav.${n}`)}</a>)}</nav><a className="footer-phone" href={phoneLink}>{settings.phone}<ArrowUpRight size={17} /></a></div><div className="footer-bottom"><p onClick={secretTap}>© {new Date().getFullYear()} {settings.name}</p><span>{settings.address[language]}</span></div></div></footer>
    <div className="mobile-booking"><span>{settings.name}</span><button className="button button-blue" onClick={() => setPhone(true)}>{c.book}<Phone size={16} /></button></div>

    {phone && <HotelDialog title={c.book} onClose={() => { setPhone(false); setCopied(false); }}><div className="phone-dialog"><span className="dialog-icon"><Phone size={28} strokeWidth={1.3} /></span><p className="eyebrow">{settings.name}</p><h2>{c.book}</h2><p>{t("contact.subtitle")}</p><a className="dialog-phone" href={phoneLink}>{settings.phone}</a><a className="button button-blue" href={phoneLink}><Phone size={18} />{c.call}</a><button className="text-link copy-phone" onClick={copyPhone}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? c.copied : c.copy}</button><small>{settings.address[language]}</small></div></HotelDialog>}
    {selectedRoom && <HotelDialog title={roomName(selectedRoom)} onClose={() => setSelectedRoom(null)}>
      {selectedRoom.image && !isHotelPhoto(selectedRoom.image) ? <img className="dialog-room-image" src={imageSource(selectedRoom.image)} alt={roomName(selectedRoom)} /> : <RoomIllustration />}
      <div className="dialog-room-body"><p className="eyebrow">{settings.name} / {c.details}</p><h2>{roomName(selectedRoom)}</h2><p>{roomDescription(selectedRoom)}</p><ul className="room-features">{["amenities", "wifi", "ac", "bathroom"].map(key => <li key={key}>{t(`rooms.${key}`)}</li>)}</ul>
        {selectedRoom.images?.length ? <div className="room-detail-gallery">{selectedRoom.images.map((src, i) => <button key={`${src}-${i}`} aria-label={`${c.photo} ${i + 1}`} onClick={() => { setSelectedRoom(null); openPhoto(src); }}><img src={imageSource(src)} alt={`${roomName(selectedRoom)} ${i + 1}`} loading="lazy" /></button>)}</div> : null}
        {selectedRoom.videos?.map((src, i) => <video className="room-video" key={`${src}-${i}`} controls preload="metadata" src={src} aria-label={`${roomName(selectedRoom)} ${i + 1}`} />)}
        <button className="button button-blue" onClick={() => { setSelectedRoom(null); setPhone(true); }}>{c.book}<ArrowUpRight size={20} /></button>
      </div>
    </HotelDialog>}
    {photo !== null && gallery[photo] && <HotelDialog title={c.gallery} onClose={() => setPhoto(null)}><div className="lightbox"><AnimatePresence mode="wait"><motion.img key={gallery[photo]} src={gallery[photo]} alt={photoLabel(gallery[photo])} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : 0.18 }} /></AnimatePresence><div className="lightbox-controls"><button className="icon-button" aria-label={c.previous} onClick={() => setPhoto((photo + gallery.length - 1) % gallery.length)}><ChevronLeft /></button><span>{photoLabel(gallery[photo])} · {photo + 1} / {gallery.length}</span><button className="icon-button" aria-label={c.next} onClick={() => setPhoto((photo + 1) % gallery.length)}><ChevronRight /></button></div></div></HotelDialog>}
  </div>;
}
