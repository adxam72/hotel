import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Star } from "lucide-react";
import { toast } from "sonner";

/**
 * Reviews Section Component
 * Design: Istiqlol Hotel - Central Asian Heritage
 * Allows users to view and submit reviews with animations
 */

interface Review {
  id: string;
  name: string;
  rating: number;
  date: string;
  text: string;
  isNew?: boolean;
}

const defaultReviews: Review[] = [
  {
    id: "1",
    name: "Mikhail",
    rating: 5,
    date: "24-mart, 2023",
    text: "Neplokhoe sochetanie tseny/kachestva. Administrator prekrasno govorit po russki. Ochen' lyubeznо pokazal gde mozhno pouzhinat' i predupredil v etom zavedenii vsekh chtoby vstrеtili khorosho. Nomer chistenkoi. Postel'noe bel'e samoe prostoe. Matras - porolon, no v principe norm. Vydayut mylo i shampun', est' odnorazovye tapki. V obshchem rekomenduyu kak mesto dlya perenochevat'.",
  },
  {
    id: "2",
    name: "Kostya Zyubin",
    rating: 3,
    date: "21-oktyabr', 2025",
    text: "Gostineca polnyy bardak vonaet v komnatakh sanuzеl tol'ko tarakany i vse slomana i von' uzhasnaya stoit a sam personal pri vide inostrantsa prosyat 3-kh tseny i klientam grubiyan",
  },
  {
    id: "3",
    name: "Konstantin Volkov",
    rating: 4,
    date: "15-iyulya, 2024",
    text: "Mylo i shampun' dali 'skreplya serdtsem', v vanne vonaet, shtorka otrvana, smesitel' sam zakryvaetsya (nuzhno derzhat' rukoy, chtoby prinyat' dush). Po telefonu - odna tsena za nomer, po faktu ona stanovitsya tsenoy za cheloveka.",
  },
];

function loadReviews(): Review[] {
  try {
    const saved = localStorage.getItem("hotel_reviews");
    if (saved) return JSON.parse(saved);
  } catch {}
  return defaultReviews;
}

function saveReviews(reviews: Review[]) {
  localStorage.setItem("hotel_reviews", JSON.stringify(reviews));
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>(loadReviews);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !text.trim()) {
      toast.error("Iltimos, barcha maydonlarni to'ldiring");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newReview: Review = {
        id: Date.now().toString(),
        name: name.trim(),
        rating,
        date: new Date().toLocaleDateString("uz-UZ", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        text: text.trim(),
        isNew: true,
      };

      const updated = [newReview, ...reviews];
      setReviews(updated);
      saveReviews(updated);
      setName("");
      setText("");
      setRating(5);
      setIsSubmitting(false);

      toast.success("Sharhingiz muvaffaqiyatli qo'shildi!");
    }, 800);
  };

  const averageRating = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  ).toFixed(1);

  return (
    <section className="py-20 bg-white">
      <div className="container">
        <h2 className="text-5xl font-bold text-foreground mb-4 text-center">
          Foydalanuvchi Sharhlari
        </h2>
        <p className="text-center text-muted-foreground mb-12 text-lg">
          Boshqa mehmonlarning fikrlarini o'qing va o'z fikringizni qoldiring
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-4">
            {reviews.map((review, idx) => (
              <Card
                key={review.id}
                className={`p-6 hover:shadow-lg transition-all duration-300 ${
                  review.isNew ? "animate-in fade-in slide-in-from-top-2" : ""
                }`}
                style={{
                  animationDelay: review.isNew ? "0ms" : `${idx * 50}ms`,
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-lg font-semibold text-foreground">
                      {review.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {review.date}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? "fill-primary text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {review.text}
                </p>
              </Card>
            ))}
          </div>

          {/* Review Form */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24 bg-secondary/5 border-2 border-primary/20">
              <div className="mb-6">
                <div className="text-center mb-2">
                  <div className="text-4xl font-bold text-primary">
                    {averageRating}
                  </div>
                  <div className="flex gap-1 justify-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(parseFloat(averageRating))
                            ? "fill-primary text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {reviews.length} ta sharh
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-foreground mb-2 block">
                    Ismingiz
                  </label>
                  <Input
                    placeholder="Ismingizni kiriting"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isSubmitting}
                    className="border-border"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground mb-2 block">
                    Reyting
                  </label>
                  <div className="flex gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setRating(i + 1)}
                        disabled={isSubmitting}
                        className="transition-all hover:scale-110"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            i < rating
                              ? "fill-primary text-primary"
                              : "text-muted-foreground"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground mb-2 block">
                    Sharh
                  </label>
                  <Textarea
                    placeholder="O'z fikringizni yozing..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={isSubmitting}
                    className="border-border resize-none"
                    rows={4}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary/90 text-white transition-all"
                >
                  {isSubmitting ? "Yuborilmoqda..." : "Sharh yuborish"}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
