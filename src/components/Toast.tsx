import { useEffect, useState } from "react";
import { Check } from "lucide-react";

interface Props {
  message: string;
  visible: boolean;
  onHide: () => void;
}

export default function Toast({ message, visible, onHide }: Props) {
  const [animClass, setAnimClass] = useState("");

  useEffect(() => {
    if (visible) {
      setAnimClass("toast-enter");
      const timer = setTimeout(() => {
        setAnimClass("toast-exit");
        setTimeout(onHide, 320);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [visible, onHide]);

  if (!visible && !animClass) return null;

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-black border border-red-500/50 border-red-glow text-white px-6 py-4 rounded-xl shadow-2xl ${animClass}`}
    >
      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-red-600 text-white">
        <Check size={14} strokeWidth={2.5} />
      </div>
      <div>
        <p className="font-semibold text-sm text-white">{message}</p>
        <p className="text-xs text-white/35 mt-0.5">Share with someone who needs it</p>
      </div>
    </div>
  );
}
