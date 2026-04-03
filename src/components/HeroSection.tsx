import { BookOpen, Zap } from "lucide-react";

interface Props {
  onFix: () => void;
}

const PREVIEW_QUOTES = [
  { text: "The wound is the place where the Light enters you.", author: "Rumi" },
  { text: "Whether you think you can or you can't — you're right.", author: "Henry Ford" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
];

export default function HeroSection({ onFix }: Props) {
  return (
    <div className="flex flex-col items-center justify-center text-center w-full max-w-2xl mx-auto px-4 py-16 gap-0">

      {/* Zap icon with pulse ring */}
      <div className="relative mb-8 anim-fade-0">
        <div
          className="ping-red absolute rounded-full bg-red-600"
          style={{ width: 56, height: 56, top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}
        />
        <div
          className="relative w-14 h-14 rounded-full flex items-center justify-center select-none z-10 text-red-500"
          style={{
            background: "#000",
            border: "1px solid rgba(239,68,68,0.8)",
            boxShadow: "0 0 18px rgba(239,68,68,0.4)",
          }}
        >
          <BookOpen size={22} strokeWidth={1.8} />
        </div>
      </div>

      {/* Title */}
      <h1 className="font-playfair font-black leading-none tracking-tight anim-title mb-4">
        <span className="block text-6xl sm:text-7xl md:text-8xl text-white">Fix My</span>
        <span
          className="block text-7xl sm:text-8xl md:text-9xl italic"
          style={{ color: "#ef4444", textShadow: "0 0 40px rgba(239,68,68,0.5)" }}
        >
          Life.
        </span>
      </h1>

      {/* Divider */}
      <div className="w-24 my-5 anim-fade-1">
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, #ef4444, transparent)" }} />
      </div>

      {/* Subtitle */}
      <p className="anim-fade-1 text-white/50 text-base sm:text-lg tracking-[0.22em] uppercase font-light mb-2">
        One click.&nbsp; Brutal honesty.
      </p>
      <p className="anim-fade-2 text-white/25 text-sm mb-3">
        500+ quotes from history's greatest minds — philosophers, leaders, artists & thinkers.
      </p>

      {/* Stats row */}
      <div className="anim-fade-2 flex items-center gap-5 mb-10 text-white/25 text-xs tracking-wider uppercase">
        <span>500+ Quotes</span>
        <span className="w-[3px] h-[3px] rounded-full bg-red-600 opacity-60" />
        <span>100+ Thinkers</span>
        <span className="w-[3px] h-[3px] rounded-full bg-red-600 opacity-60" />
        <span>7 Categories</span>
      </div>

      {/* CTA */}
      <div className="anim-fade-3 w-full flex justify-center mb-5">
        <button
          onClick={onFix}
          className="relative btn-red-shimmer btn-red-glow text-white font-bold py-5 px-14 rounded-xl text-xl tracking-wide transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden group"
        >
          <span className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent rounded-xl pointer-events-none" />
          <span className="relative z-10 flex items-center gap-3">
            <Zap size={20} strokeWidth={1.8} fill="currentColor" />
            <span>Fix My Life</span>
          </span>
        </button>
      </div>

      <p className="anim-fade-4 text-white/15 text-xs">
        No login required · No fluff · Just the wisdom you needed to hear
      </p>

      {/* Preview quotes */}
      <div className="mt-10 w-full space-y-3 anim-fade-4">
        {PREVIEW_QUOTES.map((q, i) => (
          <div
            key={i}
            className="rounded-xl px-5 py-3.5 text-left"
            style={{
              background: "rgba(255,255,255,0.018)",
              border: "1px solid rgba(255,255,255,0.05)",
              opacity: 0.32 - i * 0.08,
            }}
          >
            <p className="text-white/60 text-sm italic font-playfair">"{q.text}"</p>
            <p className="text-white/30 text-xs mt-1 font-medium">— {q.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
