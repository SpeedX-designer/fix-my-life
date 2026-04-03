import { Volume2, VolumeX } from "lucide-react";

interface Props {
  isEnabled: boolean;
  onChange: (enabled: boolean) => void;
}

export default function AudioToggle({ isEnabled, onChange }: Props) {
  return (
    <button
      onClick={() => onChange(!isEnabled)}
      className="relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300"
      style={{
        background: isEnabled ? "rgba(239, 68, 68, 0.2)" : "rgba(255, 255, 255, 0.03)",
        border: isEnabled ? "1px solid rgba(239, 68, 68, 0.5)" : "1px solid rgba(255, 255, 255, 0.08)",
        color: isEnabled ? "#ef4444" : "rgba(255, 255, 255, 0.6)",
      }}
      onMouseEnter={(e) => {
        if (!isEnabled) {
          e.currentTarget.style.borderColor = "rgba(255, 0, 0, 0.35)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isEnabled) {
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
        }
      }}
    >
      {isEnabled ? (
        <>
          <Volume2 size={16} strokeWidth={2} />
          <span className="text-sm font-semibold">Auto Audio On</span>
        </>
      ) : (
        <>
          <VolumeX size={16} strokeWidth={2} />
          <span className="text-sm font-semibold">Audio Off</span>
        </>
      )}
    </button>
  );
}
