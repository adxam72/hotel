import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Lock,
  LogOut,
  Plus,
  Trash2,
  Edit3,
  Save,
  X,
  Image,
  Video,
  Star,
  MessageSquare,
  Home,
  Eye,
  EyeOff,
  BarChart3,
  Users,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { getAnalytics, getTodayVisits, getWeekVisits, getMonthVisits, getLast7Days } from "@/lib/analytics";

const ADMIN_PASSWORD = "istiqlol2026";

interface RoomData {
  id: string;
  name: string;
  description: string;
  image: string;
  images?: string[];
  videos?: string[];
}

interface Review {
  id: string;
  name: string;
  rating: number;
  date: string;
  text: string;
  isNew?: boolean;
}

function loadRooms(): RoomData[] {
  try {
    const saved = localStorage.getItem("hotel_rooms");
    if (saved) return JSON.parse(saved);
  } catch {}
  return [
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
}

function loadReviews(): Review[] {
  try {
    const saved = localStorage.getItem("hotel_reviews");
    if (saved) return JSON.parse(saved);
  } catch {}
  return [
    {
      id: "1",
      name: "Mikhail",
      rating: 5,
      date: "24-mart, 2023",
      text: "Neplokhoe sochetanie tseny/kachestva. Administrator prekrasno govorit po russki.",
    },
    {
      id: "2",
      name: "Kostya Zyubin",
      rating: 3,
      date: "21-oktyabr', 2025",
      text: "Gostineca polnyy bardak vonaet v komnatakh.",
    },
    {
      id: "3",
      name: "Konstantin Volkov",
      rating: 4,
      date: "15-iyulya, 2024",
      text: "Mylo i shampun' dali 'skreplya serdtsem', v vanne vonaet.",
    },
  ];
}

function saveRooms(rooms: RoomData[]) {
  localStorage.setItem("hotel_rooms", JSON.stringify(rooms));
}

function saveReviews(reviews: Review[]) {
  localStorage.setItem("hotel_reviews", JSON.stringify(reviews));
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// --- Login ---
function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_auth", "true");
      onLogin();
    } else {
      setError("Parol noto'g'ri!");
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-muted-foreground mt-2">Hotel Istiqlol boshqaruvi</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">Parol</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="Admin parolni kiriting"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && <p className="text-destructive text-sm mt-2">{error}</p>}
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white">
            Kirish
          </Button>
        </form>

        <div className="mt-6 text-center">
          <a href="/" className="text-sm text-primary hover:underline flex items-center justify-center gap-1">
            <Home className="w-4 h-4" /> Bosh sahifaga qaytish
          </a>
        </div>
      </Card>
    </div>
  );
}

// --- Stats Tab ---
function StatsTab() {
  const analytics = getAnalytics();
  const todayVisits = getTodayVisits();
  const weekVisits = getWeekVisits();
  const monthVisits = getMonthVisits();
  const last7 = getLast7Days();
  const maxCount = Math.max(...last7.map((d) => d.count), 1);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("uz-UZ", { day: "numeric", month: "short" });
  };

  const dayNames = (dateStr: string) => {
    const d = new Date(dateStr);
    const days = ["Yak", "Dush", "Sesh", "Chor", "Pay", "Jum", "Shan"];
    return days[d.getDay()];
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{analytics.totalVisits}</p>
              <p className="text-xs text-muted-foreground">Jami tashriflar</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{todayVisits}</p>
              <p className="text-xs text-muted-foreground">Bugun</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{weekVisits}</p>
              <p className="text-xs text-muted-foreground">Bu hafta</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{monthVisits}</p>
              <p className="text-xs text-muted-foreground">Bu oy</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Chart - Last 7 Days */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-6">Oxirgi 7 kun</h3>
        <div className="flex items-end gap-2 h-48">
          {last7.map((day) => (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-semibold text-foreground">{day.count}</span>
              <div
                className="w-full bg-primary/80 rounded-t-md transition-all duration-500 min-h-[4px]"
                style={{ height: `${(day.count / maxCount) * 160}px` }}
              />
              <div className="text-center">
                <p className="text-[10px] text-muted-foreground leading-tight">{dayNames(day.date)}</p>
                <p className="text-[10px] text-muted-foreground leading-tight">{formatDate(day.date)}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">So'nggi faoliyat</h3>
        {analytics.dailyVisits.length > 0 ? (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {[...analytics.dailyVisits]
              .sort((a, b) => b.date.localeCompare(a.date))
              .slice(0, 30)
              .map((day) => (
                <div key={day.date} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm text-foreground">{formatDate(day.date)}</span>
                  <span className="text-sm font-semibold text-primary">{day.count} tashrif</span>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">Hali statistika mavjud emas</p>
        )}
      </Card>
    </div>
  );
}

// --- Room Editor ---
function RoomEditor({
  room,
  onSave,
  onCancel,
}: {
  room: RoomData | null;
  onSave: (room: RoomData) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(room?.name ?? "");
  const [description, setDescription] = useState(room?.description ?? "");
  const [image, setImage] = useState(room?.image ?? "");
  const [images, setImages] = useState<string[]>(room?.images ?? []);
  const [videos, setVideos] = useState<string[]>(room?.videos ?? []);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleMainImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Rasm 5MB dan katta bo'lmasligi kerak");
      return;
    }
    const base64 = await fileToBase64(file);
    setImage(base64);
  };

  const handleGalleryImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newImages: string[] = [];
    for (const file of Array.from(files)) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} — 5MB dan katta`);
        continue;
      }
      newImages.push(await fileToBase64(file));
    }
    setImages([...images, ...newImages]);
  };

  const handleVideos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newVideos: string[] = [];
    for (const file of Array.from(files)) {
      if (file.size > 50 * 1024 * 1024) {
        toast.error(`${file.name} — 50MB dan katta`);
        continue;
      }
      newVideos.push(await fileToBase64(file));
    }
    setVideos([...videos, ...newVideos]);
  };

  const handleSave = () => {
    if (!name.trim() || !description.trim()) {
      toast.error("Nom va tavsifni to'ldiring");
      return;
    }
    if (!image) {
      toast.error("Asosiy rasmni yuklang");
      return;
    }
    onSave({
      id: room?.id ?? Date.now().toString(),
      name: name.trim(),
      description: description.trim(),
      image,
      images,
      videos,
    });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">{room ? "Xonani tahrirlash" : "Yangi xona qo'shish"}</h3>
        <button onClick={onCancel} className="p-2 hover:bg-secondary/20 rounded-lg">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold mb-2 block">Xona nomi</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Masalan: Deluxe Xona" />
        </div>

        <div>
          <label className="text-sm font-semibold mb-2 block">Tavsif</label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Xona haqida qisqa ma'lumot" rows={3} />
        </div>

        {/* Main Image */}
        <div>
          <label className="text-sm font-semibold mb-2 block">Asosiy rasm</label>
          <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleMainImage} />
          {image ? (
            <div className="relative">
              <img src={image} alt="Asosiy" className="w-full h-48 object-cover rounded-lg" />
              <button
                onClick={() => imageInputRef.current?.click()}
                className="absolute bottom-2 right-2 bg-white/90 hover:bg-white p-2 rounded-lg shadow"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => imageInputRef.current?.click()}
              className="w-full h-48 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <Image className="w-8 h-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Rasm yuklash</span>
            </button>
          )}
        </div>

        {/* Gallery */}
        <div>
          <label className="text-sm font-semibold mb-2 block">Qo'shimcha rasmlar</label>
          <input ref={galleryInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryImages} />
          <div className="grid grid-cols-3 gap-2">
            {images.map((img, i) => (
              <div key={i} className="relative group">
                <img src={img} alt="" className="w-full h-24 object-cover rounded-lg" />
                <button
                  onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                  className="absolute top-1 right-1 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button
              onClick={() => galleryInputRef.current?.click()}
              className="h-24 border-2 border-dashed border-border rounded-lg flex items-center justify-center hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <Plus className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Videos */}
        <div>
          <label className="text-sm font-semibold mb-2 block">Videolar</label>
          <input ref={videoInputRef} type="file" accept="video/*" multiple className="hidden" onChange={handleVideos} />
          <div className="space-y-2">
            {videos.map((vid, i) => (
              <div key={i} className="relative group">
                <video src={vid} className="w-full h-32 object-cover rounded-lg" controls />
                <button
                  onClick={() => setVideos(videos.filter((_, idx) => idx !== i))}
                  className="absolute top-1 right-1 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button
              onClick={() => videoInputRef.current?.click()}
              className="w-full h-20 border-2 border-dashed border-border rounded-lg flex items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <Video className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Video yuklash</span>
            </button>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button onClick={handleSave} className="flex-1 bg-primary hover:bg-primary/90 text-white">
            <Save className="w-4 h-4 mr-2" /> Saqlash
          </Button>
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Bekor qilish
          </Button>
        </div>
      </div>
    </Card>
  );
}

// --- Main Admin Panel ---
type Tab = "stats" | "rooms" | "reviews";

export default function AdminPanel() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("admin_auth") === "true");
  const [tab, setTab] = useState<Tab>("stats");
  const [rooms, setRooms] = useState<RoomData[]>(loadRooms);
  const [reviews, setReviews] = useState<Review[]>(loadReviews);
  const [editingRoom, setEditingRoom] = useState<RoomData | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    saveRooms(rooms);
  }, [rooms]);

  useEffect(() => {
    saveReviews(reviews);
  }, [reviews]);

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    setAuthed(false);
  };

  const handleSaveRoom = (room: RoomData) => {
    const exists = rooms.find((r) => r.id === room.id);
    if (exists) {
      setRooms(rooms.map((r) => (r.id === room.id ? room : r)));
      toast.success("Xona yangilandi");
    } else {
      setRooms([...rooms, room]);
      toast.success("Yangi xona qo'shildi");
    }
    setEditingRoom(null);
    setIsAdding(false);
  };

  const handleDeleteRoom = (id: string) => {
    if (!confirm("Bu xonani o'chirishni tasdiqlaysizmi?")) return;
    setRooms(rooms.filter((r) => r.id !== id));
    toast.success("Xona o'chirildi");
  };

  const handleDeleteReview = (id: string) => {
    if (!confirm("Bu sharhni o'chirishni tasdiqlaysizmi?")) return;
    setReviews(reviews.filter((r) => r.id !== id));
    toast.success("Sharh o'chirildi");
  };

  if (!authed) return <LoginForm onLogin={() => setAuthed(true)} />;

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="container flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-primary">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" className="p-2 hover:bg-secondary/20 rounded-lg transition-colors" title="Saytni ko'rish">
              <Home className="w-5 h-5 text-muted-foreground" />
            </a>
            <button onClick={handleLogout} className="p-2 hover:bg-destructive/10 rounded-lg transition-colors" title="Chiqish">
              <LogOut className="w-5 h-5 text-destructive" />
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="container px-4 pt-6">
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <button
            onClick={() => setTab("stats")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors whitespace-nowrap ${
              tab === "stats" ? "bg-primary text-white" : "bg-secondary/20 text-foreground hover:bg-secondary/30"
            }`}
          >
            <BarChart3 className="w-4 h-4" /> Statistika
          </button>
          <button
            onClick={() => setTab("rooms")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors whitespace-nowrap ${
              tab === "rooms" ? "bg-primary text-white" : "bg-secondary/20 text-foreground hover:bg-secondary/30"
            }`}
          >
            <Image className="w-4 h-4" /> Xonalar ({rooms.length})
          </button>
          <button
            onClick={() => setTab("reviews")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors whitespace-nowrap ${
              tab === "reviews" ? "bg-primary text-white" : "bg-secondary/20 text-foreground hover:bg-secondary/30"
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Izohlar ({reviews.length})
          </button>
        </div>

        {/* Stats Tab */}
        {tab === "stats" && <StatsTab />}

        {/* Rooms Tab */}
        {tab === "rooms" && (
          <div>
            {editingRoom || isAdding ? (
              <RoomEditor
                room={editingRoom}
                onSave={handleSaveRoom}
                onCancel={() => { setEditingRoom(null); setIsAdding(false); }}
              />
            ) : (
              <>
                <Button onClick={() => setIsAdding(true)} className="mb-6 bg-primary hover:bg-primary/90 text-white">
                  <Plus className="w-4 h-4 mr-2" /> Yangi xona qo'shish
                </Button>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rooms.map((room) => (
                    <Card key={room.id} className="overflow-hidden">
                      <img src={room.image} alt={room.name} className="w-full h-48 object-cover" />
                      <div className="p-4">
                        <h3 className="text-lg font-bold mb-1">{room.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{room.description}</p>
                        {(room.images?.length || room.videos?.length) && (
                          <div className="flex gap-3 text-xs text-muted-foreground mb-3">
                            {room.images?.length ? (
                              <span className="flex items-center gap-1">
                                <Image className="w-3 h-3" /> {room.images.length} rasm
                              </span>
                            ) : null}
                            {room.videos?.length ? (
                              <span className="flex items-center gap-1">
                                <Video className="w-3 h-3" /> {room.videos.length} video
                              </span>
                            ) : null}
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingRoom(room)}
                            className="flex-1"
                          >
                            <Edit3 className="w-4 h-4 mr-1" /> Tahrirlash
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteRoom(room.id)}
                            className="text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {rooms.length === 0 && (
                  <div className="text-center py-16 text-muted-foreground">
                    <Image className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Hali xonalar qo'shilmagan</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Reviews Tab */}
        {tab === "reviews" && (
          <div className="space-y-3">
            {reviews.map((review) => (
              <Card key={review.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold">{review.name}</h4>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < review.rating ? "fill-primary text-primary" : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">{review.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.text}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="p-2 hover:bg-destructive/10 rounded-lg transition-colors ml-3 flex-shrink-0"
                    title="O'chirish"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              </Card>
            ))}

            {reviews.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Hali izohlar yo'q</p>
              </div>
            )}
          </div>
        )}

        <div className="h-12" />
      </div>
    </div>
  );
}
