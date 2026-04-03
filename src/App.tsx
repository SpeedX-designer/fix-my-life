import { useState, useCallback, useEffect } from "react";
import { Zap, ArrowLeft, Clock } from "lucide-react";
import HeroSection    from "./components/HeroSection";
import CategoryPicker from "./components/CategoryPicker";
import AudioToggle    from "./components/AudioToggle";
import QuoteCard      from "./components/QuoteCard";
import HistoryPanel   from "./components/HistoryPanel";
import Toast          from "./components/Toast";
import Footer         from "./components/Footer";
import {
  Category,
  Quote,
  getRandomQuote,
} from "./data/quotes";

const HISTORY_KEY = "fml_quote_history_v2";
const AUDIO_TOGGLE_KEY = "fml_audio_enabled_v1";

function loadHistory(): Quote[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as Quote[];
    return [];
  } catch { return []; }
}

function saveHistory(history: Quote[]) {
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(history)); }
  catch { /* quota exceeded */ }
}

function loadAudioToggle(): boolean {
  try {
    const raw = localStorage.getItem(AUDIO_TOGGLE_KEY);
    return raw ? JSON.parse(raw) : false;
  } catch { return false; }
}

function saveAudioToggle(enabled: boolean) {
  try { localStorage.setItem(AUDIO_TOGGLE_KEY, JSON.stringify(enabled)); }
  catch { /* quota exceeded */ }
}

export default function App() {
  const [category,     setCategory]     = useState<Category>("all");
  const [quote,        setQuote]        = useState<Quote | null>(null);
  const [history,      setHistory]      = useState<Quote[]>(loadHistory);
  const [historyOpen,  setHistoryOpen]  = useState(false);
  const [cardKey,      setCardKey]      = useState(0);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg,     setToastMsg]     = useState("");
  const [audioEnabled, setAudioEnabled] = useState(loadAudioToggle);

  /* Persist history */
  useEffect(() => { saveHistory(history); }, [history]);

  /* Persist audio toggle */
  useEffect(() => { saveAudioToggle(audioEnabled); }, [audioEnabled]);

  /* Push quote to history with timestamp */
  const pushToHistory = useCallback((q: Quote) => {
    const stamped: Quote = { ...q, timestamp: Date.now() };
    setHistory((prev) => {
      if (prev[0]?.id === stamped.id) return prev;
      return [stamped, ...prev].slice(0, 50);
    });
  }, []);

  /* Fetch a new random quote */
  const fetchQuote = useCallback((cat: Category, excludeId?: number) => {
    const q = getRandomQuote(cat, excludeId);
    setQuote(q);
    setCardKey((k) => k + 1);
    pushToHistory(q);
  }, [pushToHistory]);

  const handleFix = useCallback(() => {
    fetchQuote(category, quote?.id);
  }, [category, quote, fetchQuote]);

  const handleCategoryChange = useCallback((c: Category) => {
    setCategory(c);
    if (quote) fetchQuote(c, quote.id);
  }, [quote, fetchQuote]);

  const handleShare = useCallback(async () => {
    if (!quote) return;
    const text = `"${quote.text}"\n\n— ${quote.author.name}\n\nvia Fix My Life`;
    try {
      if (navigator.clipboard) await navigator.clipboard.writeText(text);
    } catch { /* silent */ }
    setToastMsg("Copied to clipboard");
    setToastVisible(true);
  }, [quote]);

  const handleReset = useCallback(() => {
    setQuote(null);
    setCategory("all");
  }, []);

  const handleSelectHistory = useCallback((q: Quote) => {
    setQuote(q);
    setCategory(q.category);
    setCardKey((k) => k + 1);
    setHistoryOpen(false);
  }, []);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  }, []);

  /* Toast auto-hide */
  useEffect(() => {
    if (!toastVisible) return;
    const t = setTimeout(() => setToastVisible(false), 2400);
    return () => clearTimeout(t);
  }, [toastVisible]);

  return (
    <div className="relative min-h-screen bg-black overflow-x-hidden">

      {/* Ambient red glows */}
      <div className="red-ambient" />
      <div className="grain" />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">

        {/* ── HERO VIEW ── */}
        {!quote && (
          <div className="flex-1 flex items-center justify-center">

            {/* History button — fixed top-right */}
            <button
              onClick={() => setHistoryOpen(true)}
              title="View history"
              className="fixed top-5 right-5 z-30 flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all duration-250 hover:scale-105 active:scale-95 group"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(239,68,68,0.35)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
            >
              <Clock size={15} strokeWidth={1.8} className="text-white/35 group-hover:text-white/70 transition-colors" />
              {history.length > 0 && (
                <span className="text-xs font-semibold text-red-400/80 group-hover:text-red-400 transition-colors">
                  {history.length}
                </span>
              )}
            </button>

            <HeroSection onFix={handleFix} />
          </div>
        )}

        {/* ── QUOTE VIEW ── */}
        {quote && (
          <div className="flex-1 flex flex-col items-center px-4 pt-8 pb-6 gap-5 w-full max-w-2xl mx-auto">

            {/* Mini nav */}
            <nav className="w-full flex items-center justify-between anim-fade-0">
              <div className="flex items-center gap-2">
                <span className="text-red-500"><Zap size={14} strokeWidth={1.8} fill="currentColor" /></span>
                <span className="font-playfair italic text-white font-bold text-sm tracking-wide">
                  Fix My <span className="text-red-500">Life.</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Audio Toggle */}
                <AudioToggle
                  isEnabled={audioEnabled}
                  onChange={setAudioEnabled}
                />

                {/* History */}
                <button
                  onClick={() => setHistoryOpen(true)}
                  title="View history"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 group"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(239,68,68,0.35)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}
                >
                  <Clock size={13} strokeWidth={1.8} className="text-white/30 group-hover:text-white/70 transition-colors" />
                  {history.length > 0 && (
                    <span className="text-[11px] font-semibold text-red-400/70 group-hover:text-red-400 transition-colors">
                      {history.length}
                    </span>
                  )}
                </button>

                {/* Back */}
                <button
                  onClick={handleReset}
                  className="text-white/30 hover:text-white/70 text-sm transition-colors duration-200 flex items-center gap-1.5"
                >
                  <ArrowLeft size={14} strokeWidth={1.8} />
                  <span>Start over</span>
                </button>
              </div>
            </nav>

            {/* Category picker */}
            <div className="w-full anim-fade-1">
              <CategoryPicker selected={category} onChange={handleCategoryChange} />
            </div>

            {/* Quote card */}
            <QuoteCard
              key={cardKey}
              quote={quote}
              onNew={handleFix}
              onShare={handleShare}
              audioEnabled={audioEnabled}
            />
          </div>
        )}

        <Footer />
      </div>

      {/* History panel */}
      <HistoryPanel
        open={historyOpen}
        history={history}
        onClose={() => setHistoryOpen(false)}
        onSelect={handleSelectHistory}
        onClear={handleClearHistory}
      />

      {/* Toast */}
      <Toast message={toastMsg} visible={toastVisible} onHide={() => setToastVisible(false)} />
    </div>
  );
}
