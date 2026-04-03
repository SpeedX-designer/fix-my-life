import {
  Shuffle, Brain, Heart, Briefcase, Star, Wind, TrendingUp, Leaf,
} from "lucide-react";
import { Category, CATEGORIES } from "../data/quotes";

const ICONS: Record<Category, React.ReactNode> = {
  all:           <Shuffle    size={14} strokeWidth={1.8} />,
  mindset:       <Brain      size={14} strokeWidth={1.8} />,
  relationships: <Heart      size={14} strokeWidth={1.8} />,
  career:        <Briefcase  size={14} strokeWidth={1.8} />,
  "self-love":   <Star       size={14} strokeWidth={1.8} />,
  anxiety:       <Wind       size={14} strokeWidth={1.8} />,
  motivation:    <TrendingUp size={14} strokeWidth={1.8} />,
  healing:       <Leaf       size={14} strokeWidth={1.8} />,
};

const ACCENT: Record<Category, string> = {
  all:           "#ef4444",
  mindset:       "#8b5cf6",
  relationships: "#ec4899",
  career:        "#3b82f6",
  "self-love":   "#f59e0b",
  anxiety:       "#06b6d4",
  motivation:    "#22c55e",
  healing:       "#10b981",
};

interface Props {
  selected: Category;
  onChange: (c: Category) => void;
}

export default function CategoryPicker({ selected, onChange }: Props) {
  return (
    <div className="w-full">
      <p className="text-white/25 text-[10px] uppercase tracking-[0.25em] text-center mb-3 font-medium">
        Choose a topic
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {CATEGORIES.map(({ value, label }) => {
          const isActive = value === selected;
          const accent   = ACCENT[value];
          return (
            <button
              key={value}
              onClick={() => onChange(value)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 hover:scale-105 active:scale-95"
              style={
                isActive
                  ? {
                      background: `${accent}22`,
                      border: `1px solid ${accent}70`,
                      color: accent,
                      boxShadow: `0 0 12px ${accent}25`,
                    }
                  : {
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "rgba(255,255,255,0.45)",
                    }
              }
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = `${accent}40`;
                  e.currentTarget.style.color = "rgba(255,255,255,0.75)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.45)";
                }
              }}
            >
              <span className="leading-none">{ICONS[value]}</span>
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
