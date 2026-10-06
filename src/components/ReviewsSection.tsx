import { useEffect, useState } from "react";
import Reveal from "@/components/Reveal";
import { useLanguage } from "@/contexts/LanguageContext";
import { copy } from "@/lib/copy";

import { Star } from "lucide-react";
import { toast } from "sonner";

/**
 * Reviews Section Component
 * Design: Istiqlol Hotel - Central Asian Heritage
 * Allows users to view and submit reviews with animations
 */

import { loadReviews, saveReviews, subscribeHotel } from "@/lib/hotel";
import type { Review } from "@/lib/reviews-data";
function ReviewCard({ review }: { review: Review }) {
  const [expanded, setExpanded] = useState(false);
  const { language } = useLanguage();
  const c = copy[language];
  return <article className="review-card">
    <div className="review-top"><span className="review-avatar">{review.name.charAt(0).toUpperCase()}</span><div><h3>{review.name}</h3><small>{review.date}</small></div><div className="review-stars" aria-label={`${review.rating} / 5`}>{Array.from({ length: 5 }, (_, i) => <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />)}</div></div>
    <p className={expanded ? "" : "review-clamped"}>{review.text}</p>
    {review.text.length > 180 && <button className="text-link" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>{expanded ? c.less : c.more}</button>}
  </article>;
}
export default function ReviewsSection() {
  const { language, t } = useLanguage();
  const c = copy[language];
  const [reviews, setReviews] = useState<Review[]>(loadReviews);
  useEffect(() => subscribeHotel(() => setReviews(loadReviews())), []);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const average = reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : "—";
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !text.trim()) return;
    const review: Review = { id: crypto.randomUUID(), name: name.trim(), rating, text: text.trim(), date: new Date().toLocaleDateString({ uz: "uz-UZ", ru: "ru-RU", en: "en-GB" }[language]), isNew: true };
    const updated = [review, ...reviews];
    try { saveReviews(updated); setReviews(updated); setName(""); setText(""); setRating(5); toast.success(c.saved); }
    catch { toast.error(c.error); }
  };
  return <section id="reviews" className="section reviews-section"><div className="shell">
    <Reveal className="section-heading"><div><p className="eyebrow">{t("nav.reviews")}</p><h2>{t("reviews.title")}</h2></div><p>{t("reviews.subtitle")}</p></Reveal>
    <div className="reviews-layout"><div className="review-list">{reviews.length ? reviews.map(r => <Reveal key={r.id}><ReviewCard review={r} /></Reveal>) : <p>{c.empty}</p>}</div>
    <Reveal><form className="review-form" onSubmit={submit}><div className="review-summary"><strong>{average}</strong><div><div className="review-stars" aria-hidden="true">{Array.from({ length: 5 }, (_, i) => <Star key={i} size={14} fill={i < Math.round(Number(average)) ? "currentColor" : "none"} />)}</div><small>{reviews.length} · {t("about.reviews")}</small></div></div><h3>{t("reviews.add")}</h3>
      <div className="form-field"><label htmlFor="review-name">{t("reviews.name")}</label><input id="review-name" autoComplete="name" required maxLength={80} value={name} onChange={e => setName(e.target.value)} /></div>
      <fieldset className="form-field"><legend>{t("reviews.rating")}</legend><div className="rating-buttons">{Array.from({ length: 5 }, (_, i) => <button key={i} type="button" aria-label={`${i + 1} / 5`} aria-pressed={rating === i + 1} onClick={() => setRating(i + 1)}><Star size={25} strokeWidth={1.3} fill={i < rating ? "currentColor" : "none"} /></button>)}</div></fieldset>
      <div className="form-field"><label htmlFor="review-text">{t("reviews.comment")}</label><textarea id="review-text" required maxLength={2000} rows={4} value={text} onChange={e => setText(e.target.value)} /></div><button className="button button-dark" type="submit">{t("reviews.submit")}</button><p className="local-note">{c.reviewNote}</p>
    </form></Reveal></div>
  </div></section>;
}
