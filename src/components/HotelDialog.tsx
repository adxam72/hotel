import { useEffect, useRef, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { copy } from "@/lib/copy";

export default function HotelDialog({ children, onClose, title }: { children: ReactNode; onClose: () => void; title: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  const reduce = useReducedMotion();
  const { language } = useLanguage();
  useEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => { dialog?.close(); document.body.style.overflow = overflow; previous?.focus(); };
  }, []);
  return <dialog ref={ref} className="hotel-dialog" aria-label={title} onCancel={e => { e.preventDefault(); onClose(); }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <motion.div className="dialog-content" initial={{ opacity: 0, y: reduce ? 0 : 24, scale: reduce ? 1 : 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: reduce ? 0 : 0.3 }}>
      <button className="dialog-close icon-button" aria-label={copy[language].close} onClick={onClose}><X size={20} /></button>{children}
    </motion.div>
  </dialog>;
}
