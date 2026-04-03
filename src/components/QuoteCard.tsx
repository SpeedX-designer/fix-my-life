import { useEffect, useRef, useState } from "react";
import {
  Brain, Heart, Briefcase, Star, Wind, TrendingUp, Leaf, Shuffle,
  Zap, Copy, RefreshCw, Globe, Calendar,
} from "lucide-react";
import { Quote, Category } from "../data/quotes";
import { speakQuote, stopSpeech } from "../utils/textToSpeech";

const CATEGORY_META: Record<Category, { label: string; icon: React.ReactNode; color: string }> = {
  all:           { label: "All Topics",    icon: <Shuffle    size={13} strokeWidth={1.8} />, color: "#ef4444" },
  mindset:       { label: "Mindset",       icon: <Brain      size={13} strokeWidth={1.8} />, color: "#8b5cf6" },
  relationships: { label: "Relationships", icon: <Heart      size={13} strokeWidth={1.8} />, color: "#ec4899" },
  career:        { label: "Career",        icon: <Briefcase  size={13} strokeWidth={1.8} />, color: "#3b82f6" },
  "self-love":   { label: "Self-Love",     icon: <Star       size={13} strokeWidth={1.8} />, color: "#f59e0b" },
  anxiety:       { label: "Anxiety",       icon: <Wind       size={13} strokeWidth={1.8} />, color: "#06b6d4" },
  motivation:    { label: "Motivation",    icon: <TrendingUp size={13} strokeWidth={1.8} />, color: "#22c55e" },
  healing:       { label: "Healing",       icon: <Leaf       size={13} strokeWidth={1.8} />, color: "#10b981" },
};

interface Props {
  quote:   Quote;
  onNew:   () => void;
  onShare: () => void;
  audioEnabled?: boolean;
}

export default function QuoteCard({ quote, onNew, onShare, audioEnabled = false }: Props) {
  const [displayed,   setDisplayed]   = useState("");
  const [showAuthor,  setShowAuthor]  = useState(false);
  const [showActions, setShowActions] = useState(false);
  const idxRef   = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const catMeta = CATEGORY_META[quote.category];

  useEffect(() => {
    setDisplayed("");
    setShowAuthor(false);
    setShowActions(false);
    stopSpeech();
    idxRef.current = 0;
    if (timerRef.current) clearTimeout(timerRef.current);

    const type = () => {
      if (idxRef.current < quote.text.length) {
        setDisplayed(quote.text.slice(0, idxRef.current + 1));
        idxRef.current++;
        timerRef.current = setTimeout(type, 18);
      } else {
        timerRef.current = setTimeout(() => {
          setShowAuthor(true);
          timerRef.current = setTimeout(() => {
            setShowActions(true);
            // Auto-play audio when actions are shown and audioEnabled is true
            if (audioEnabled) {
              speakQuote(quote.text, quote.author.name);
            }
          }, 400);
        }, 200);
      }
    };

    timerRef.current = setTimeout(type, 80);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [quote, audioEnabled]);

  const isTyping = displayed.length < quote.text.length;

  return (
    <div className="w-full max-w-2xl anim-card">

      {/* ── Main glass card ── */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.028)",
          border: "1px solid rgba(255,0,0,0.22)",
          boxShadow: "0 0 0 1px rgba(255,0,0,0.06), 0 8px 40px rgba(255,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.04)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Top accent line */}
        <div
          className="h-[2px] w-full"
          style={{ background: `linear-gradient(90deg, transparent, ${catMeta.color}, transparent)` }}
        />

        {/* Category badge — top left */}
        <div className="px-6 pt-5 pb-0 flex items-center justify-between">
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase"
            style={{
              background: `${catMeta.color}18`,
              border: `1px solid ${catMeta.color}40`,
              color: catMeta.color,
            }}
          >
            <span className="leading-none">{catMeta.icon}</span>
            <span>{catMeta.label}</span>
          </div>

          {/* Quote mark decoration */}
          <span
            className="font-playfair text-6xl leading-none select-none"
            style={{ color: "rgba(255,0,0,0.12)", lineHeight: 1 }}
          >
            "
          </span>
        </div>

        {/* Quote text */}
        <div className="px-6 pt-4 pb-5 min-h-[100px]">
          <blockquote
            className="font-playfair font-bold text-white leading-snug"
            style={{ fontSize: "clamp(1.25rem, 3vw, 1.75rem)" }}
          >
            {displayed}
            {isTyping && (
              <span
                className="cursor-blink inline-block w-[2px] h-6 ml-1 align-middle rounded-full"
                style={{ background: "#ef4444" }}
              />
            )}
          </blockquote>
        </div>

        {/* Divider */}
        <div className="mx-6">
          <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,0,0,0.2), transparent)" }} />
        </div>

        {/* Author section */}
        <div
          className="px-6 py-5 transition-all duration-700"
          style={{
            opacity: showAuthor ? 1 : 0,
            transform: showAuthor ? "translateY(0)" : "translateY(12px)",
            transitionProperty: "opacity, transform",
          }}
        >
          <div className="flex items-center gap-4">

            {/* Avatar */}
            <div
              className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-white text-sm select-none"
              style={{
                background: `linear-gradient(135deg, ${quote.author.color}cc, ${quote.author.color}66)`,
                border: `1px solid ${quote.author.color}50`,
                boxShadow: `0 4px 16px ${quote.author.color}30`,
                fontFamily: "Inter, sans-serif",
                letterSpacing: "0.05em",
              }}
            >
              {quote.author.initials}
            </div>

            {/* Author info */}
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-base leading-tight truncate">
                {quote.author.name}
              </p>
              <p className="text-white/50 text-sm mt-0.5 leading-snug line-clamp-1">
                {quote.author.title}
              </p>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="flex items-center gap-1 text-white/30 text-xs">
                  <Calendar size={11} strokeWidth={1.8} />
                  {quote.author.era}
                </span>
                <span className="flex items-center gap-1 text-white/30 text-xs">
                  <Globe size={11} strokeWidth={1.8} />
                  {quote.author.nationality}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Inner glow overlay */}
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{ background: "radial-gradient(ellipse at top left, rgba(255,0,0,0.04) 0%, transparent 60%)" }}
        />

        {/* Watermark */}
        <div className="absolute bottom-4 right-5 pointer-events-none select-none" style={{ color: "rgba(255,255,255,0.025)" }}>
          <Zap size={56} strokeWidth={1} />
        </div>
      </div>

      {/* ── Action buttons ── */}
      <div
        className="mt-4 flex flex-col sm:flex-row gap-3 transition-all duration-500"
        style={{
          opacity: showActions ? 1 : 0,
          transform: showActions ? "translateY(0)" : "translateY(12px)",
          transitionProperty: "opacity, transform",
          pointerEvents: showActions ? "auto" : "none",
        }}
      >
        {/* Next quote */}
        <button
          onClick={onNew}
          className="flex-1 relative btn-red-shimmer btn-red-glow text-white font-bold py-4 px-8 rounded-xl text-base tracking-wide transition-all duration-300 hover:scale-[1.04] active:scale-[0.96] flex items-center justify-center gap-2 overflow-hidden"
        >
          <span className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent rounded-xl pointer-events-none" />
          <span className="relative z-10 flex items-center gap-2">
            <RefreshCw size={15} strokeWidth={2} />
            <span>Next Quote</span>
          </span>
        </button>

        {/* Copy */}
        <button
          onClick={onShare}
          className="flex-[0.55] text-white/60 hover:text-white font-semibold py-4 px-6 rounded-xl text-base transition-all duration-300 hover:scale-[1.04] active:scale-[0.96] flex items-center justify-center gap-2"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(255,0,0,0.35)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
        >
          <Copy size={14} strokeWidth={1.8} />
          <span>Copy</span>
        </button>
      </div>
    </div>
  );
}
