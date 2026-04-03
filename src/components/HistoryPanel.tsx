import { useEffect, useRef, useState } from "react";
import {
  X, Clock, Trash2, Search, ChevronRight, Calendar,
  Brain, Heart, Briefcase, Star, Wind, TrendingUp, Leaf, Shuffle,
} from "lucide-react";
import { Quote, Category } from "../data/quotes";

const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  all:           <Shuffle    size={12} strokeWidth={1.8} />,
  mindset:       <Brain      size={12} strokeWidth={1.8} />,
  relationships: <Heart      size={12} strokeWidth={1.8} />,
  career:        <Briefcase  size={12} strokeWidth={1.8} />,
  "self-love":   <Star       size={12} strokeWidth={1.8} />,
  anxiety:       <Wind       size={12} strokeWidth={1.8} />,
  motivation:    <TrendingUp size={12} strokeWidth={1.8} />,
  healing:       <Leaf       size={12} strokeWidth={1.8} />,
};

const CATEGORY_COLORS: Record<Category, string> = {
  all:           "#ef4444",
  mindset:       "#8b5cf6",
  relationships: "#ec4899",
  career:        "#3b82f6",
  "self-love":   "#f59e0b",
  anxiety:       "#06b6d4",
  motivation:    "#22c55e",
  healing:       "#10b981",
};

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const s = Math.floor(diff / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (s < 5)   return "just now";
  if (s < 60)  return `${s}s ago`;
  if (m < 60)  return `${m}m ago`;
  if (h < 24)  return `${h}h ago`;
  if (d === 1) return "Yesterday";
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function dayLabel(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return "Today";
  const yest = new Date(now); yest.setDate(now.getDate() - 1);
  if (d.toDateString() === yest.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

interface GroupedDay { label: string; items: (Quote & { _histIdx: number })[]; }

interface Props {
  open:     boolean;
  history:  Quote[];
  onClose:  () => void;
  onSelect: (q: Quote) => void;
  onClear:  () => void;
}

export default function HistoryPanel({ open, history, onClose, onSelect, onClear }: Props) {
  const [search,      setSearch]      = useState("");
  const [confirmClear, setConfirmClear] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  /* lock body scroll when open */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  /* close on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  /* reset search + confirm on open */
  useEffect(() => {
    if (open) { setSearch(""); setConfirmClear(false); }
  }, [open]);

  /* filtered list */
  const filtered = history.filter((q) => {
    const q_ = search.toLowerCase();
    return (
      q.text.toLowerCase().includes(q_) ||
      q.author.name.toLowerCase().includes(q_) ||
      q.category.toLowerCase().includes(q_)
    );
  });

  /* group by day */
  const groups: GroupedDay[] = [];
  filtered.forEach((q, i) => {
    const ts = q.timestamp ?? 0;
    const label = dayLabel(ts);
    const last = groups[groups.length - 1];
    const item = { ...q, _histIdx: i + 1 };
    if (!last || last.label !== label) groups.push({ label, items: [item] });
    else last.items.push(item);
  });

  const totalCount = history.length;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 transition-all duration-500"
        style={{
          background: "rgba(0,0,0,0.7)",
          backdropFilter: open ? "blur(4px)" : "none",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
      />

      {/* Drawer */}
      <div
        ref={panelRef}
        className="fixed top-0 right-0 h-full z-50 flex flex-col"
        style={{
          width: "min(420px, 100vw)",
          background: "#0a0a0a",
          borderLeft: "1px solid rgba(255,0,0,0.18)",
          boxShadow: open ? "-8px 0 48px rgba(255,0,0,0.12)" : "none",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.45s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {/* Red top accent */}
        <div style={{ height: "2px", background: "linear-gradient(90deg, transparent, #ef4444, transparent)" }} />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)" }}
            >
              <Clock size={15} strokeWidth={1.8} className="text-red-500" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold leading-tight">History</p>
              <p className="text-white/30 text-xs">{totalCount} quote{totalCount !== 1 ? "s" : ""} collected</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {totalCount > 0 && !confirmClear && (
              <button
                onClick={() => setConfirmClear(true)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white/25 hover:text-red-400 transition-colors duration-200"
                title="Clear history"
              >
                <Trash2 size={14} strokeWidth={1.8} />
              </button>
            )}
            {confirmClear && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setConfirmClear(false)}
                  className="text-xs text-white/40 hover:text-white/70 transition-colors px-2 py-1"
                >
                  Cancel
                </button>
                <button
                  onClick={() => { onClear(); setConfirmClear(false); }}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors font-semibold px-2 py-1 rounded"
                  style={{ background: "rgba(239,68,68,0.12)" }}
                >
                  Clear all
                </button>
              </div>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white/25 hover:text-white/70 transition-colors duration-200"
            >
              <X size={16} strokeWidth={1.8} />
            </button>
          </div>
        </div>

        {/* Search */}
        {totalCount > 0 && (
          <div className="px-4 pt-4 pb-2">
            <div
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <Search size={13} strokeWidth={1.8} className="text-white/25 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search quotes, authors, topics…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-white/70 text-sm placeholder-white/25 outline-none"
              />
              {search && (
                <button onClick={() => setSearch("")} className="text-white/25 hover:text-white/60 transition-colors">
                  <X size={12} strokeWidth={2} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* List */}
        <div className="flex-1 overflow-y-auto scrollbar-history px-4 pb-6 pt-2">

          {/* Empty state */}
          {totalCount === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-6">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <Clock size={22} strokeWidth={1.2} className="text-white/15" />
              </div>
              <div>
                <p className="text-white/30 text-sm font-medium">No history yet</p>
                <p className="text-white/15 text-xs mt-1">Your quotes will appear here as you explore.</p>
              </div>
            </div>
          )}

          {/* No search results */}
          {totalCount > 0 && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
              <Search size={20} strokeWidth={1.2} className="text-white/15" />
              <p className="text-white/25 text-sm">No quotes match "{search}"</p>
            </div>
          )}

          {/* Groups */}
          {groups.map((group) => (
            <div key={group.label} className="mt-4">
              <div className="flex items-center gap-2 mb-3">
                <Calendar size={11} strokeWidth={1.8} className="text-white/20" />
                <span className="text-white/25 text-[10px] uppercase tracking-[0.2em] font-semibold">{group.label}</span>
                <span className="text-white/15 text-[10px]">· {group.items.length}</span>
              </div>

              <div className="space-y-2">
                {group.items.map((item) => {
                  const accent = CATEGORY_COLORS[item.category];
                  const isLatest = item._histIdx === 1;
                  return (
                    <button
                      key={`${item.id}-${item.timestamp}`}
                      onClick={() => onSelect(item)}
                      className="w-full text-left rounded-xl p-4 group transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] relative overflow-hidden"
                      style={{
                        background: "rgba(255,255,255,0.025)",
                        border: `1px solid rgba(255,255,255,0.06)`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = `${accent}30`;
                        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                        e.currentTarget.style.background = "rgba(255,255,255,0.025)";
                      }}
                    >
                      {/* Left accent bar */}
                      <div
                        className="absolute left-0 top-3 bottom-3 w-[2px] rounded-full transition-opacity duration-200"
                        style={{ background: accent, opacity: isLatest ? 1 : 0.3 }}
                      />

                      <div className="pl-3">
                        {/* Badges row */}
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span
                            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
                            style={{ background: `${accent}18`, color: accent, border: `1px solid ${accent}35` }}
                          >
                            {CATEGORY_ICONS[item.category]}
                            <span>{item.category}</span>
                          </span>
                          {isLatest && (
                            <span
                              className="px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide"
                              style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)" }}
                            >
                              Latest
                            </span>
                          )}
                          <span className="text-white/20 text-[10px] ml-auto">
                            {item.timestamp ? timeAgo(item.timestamp) : ""}
                          </span>
                        </div>

                        {/* Quote text */}
                        <p className="text-white/75 text-sm font-playfair italic leading-snug line-clamp-2 group-hover:text-white/90 transition-colors duration-200">
                          "{item.text}"
                        </p>

                        {/* Author */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                              style={{ background: item.author.color }}
                            >
                              {item.author.initials.slice(0, 2)}
                            </div>
                            <span className="text-white/40 text-xs font-medium group-hover:text-white/60 transition-colors duration-200 truncate max-w-[180px]">
                              {item.author.name}
                            </span>
                          </div>
                          <ChevronRight
                            size={12}
                            strokeWidth={2}
                            className="text-white/15 group-hover:text-white/40 transition-all duration-200 group-hover:translate-x-0.5"
                          />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer hint */}
        {totalCount > 0 && (
          <div className="px-5 py-3 border-t border-white/5">
            <p className="text-white/15 text-[10px] text-center tracking-wide">
              Tap any quote to revisit it
            </p>
          </div>
        )}
      </div>
    </>
  );
}
