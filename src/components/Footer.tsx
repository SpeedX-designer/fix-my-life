export default function Footer() {
  return (
    <footer className="mt-20 mb-8 text-center flex flex-col items-center gap-3">
      <div className="flex items-center gap-4">
        <span className="w-12 h-px bg-gradient-to-r from-transparent to-red-600/40" />
        <span className="font-playfair italic text-white/20 text-sm tracking-widest">Fix My Life</span>
        <span className="w-12 h-px bg-gradient-to-l from-transparent to-red-600/40" />
      </div>
      <p className="text-white/15 text-xs font-inter tracking-wide">
        Made for the moments when you needed to read something real.
      </p>
      <p className="text-white/10 text-xs font-inter">
        © {new Date().getFullYear()} · Share freely · No data collected
      </p>
    </footer>
  );
}
