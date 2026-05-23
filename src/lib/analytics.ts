interface VisitRecord {
  date: string;
  count: number;
}

interface AnalyticsData {
  totalVisits: number;
  dailyVisits: VisitRecord[];
  lastVisit: string;
}

const STORAGE_KEY = "hotel_analytics";

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

function loadAnalytics(): AnalyticsData {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return { totalVisits: 0, dailyVisits: [], lastVisit: "" };
}

function saveAnalytics(data: AnalyticsData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function trackVisit() {
  const data = loadAnalytics();
  const today = getToday();

  const sessionKey = "hotel_visit_tracked";
  if (sessionStorage.getItem(sessionKey)) return;
  sessionStorage.setItem(sessionKey, "true");

  data.totalVisits += 1;
  data.lastVisit = today;

  const todayRecord = data.dailyVisits.find((d) => d.date === today);
  if (todayRecord) {
    todayRecord.count += 1;
  } else {
    data.dailyVisits.push({ date: today, count: 1 });
  }

  // Keep last 90 days only
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 90);
  const cutoffStr = cutoff.toISOString().split("T")[0];
  data.dailyVisits = data.dailyVisits.filter((d) => d.date >= cutoffStr);

  saveAnalytics(data);
}

export function getAnalytics(): AnalyticsData {
  return loadAnalytics();
}

export function getTodayVisits(): number {
  const data = loadAnalytics();
  const today = getToday();
  return data.dailyVisits.find((d) => d.date === today)?.count ?? 0;
}

export function getWeekVisits(): number {
  const data = loadAnalytics();
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekStr = weekAgo.toISOString().split("T")[0];
  return data.dailyVisits
    .filter((d) => d.date >= weekStr)
    .reduce((sum, d) => sum + d.count, 0);
}

export function getMonthVisits(): number {
  const data = loadAnalytics();
  const monthAgo = new Date();
  monthAgo.setDate(monthAgo.getDate() - 30);
  const monthStr = monthAgo.toISOString().split("T")[0];
  return data.dailyVisits
    .filter((d) => d.date >= monthStr)
    .reduce((sum, d) => sum + d.count, 0);
}

export function getLast7Days(): VisitRecord[] {
  const data = loadAnalytics();
  const result: VisitRecord[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const existing = data.dailyVisits.find((v) => v.date === dateStr);
    result.push({ date: dateStr, count: existing?.count ?? 0 });
  }
  return result;
}
