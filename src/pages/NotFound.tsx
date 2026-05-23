import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <p className="text-lg text-muted-foreground">Sahifa topilmadi</p>
      <a href="/">
        <Button>Bosh sahifaga qaytish</Button>
      </a>
    </div>
  );
}
