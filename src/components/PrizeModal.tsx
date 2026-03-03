"use client";

import { useEffect, useState } from "react";
import ShareButtons from "./ShareButtons";

interface PrizeModalProps {
  prizeName: string;
  prizeEmoji: string;
  showShare: boolean;
  onShared: () => void;
  onClose: () => void;
  onSpinAgain: () => void;
  canSpinAgain: boolean;
  addedLine: boolean;
  sharedFB: boolean;
  onAddedLine: () => void;
  onSharedFB: () => void;
}

const CONFETTI_COLORS = [
  "#FF6B6B", "#FFE66D", "#4ECDC4", "#45B7D1", "#96CEB4",
  "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE",
  "#F1948A", "#82E0AA", "#85C1E9", "#F8C471", "#D2B4DE",
  "#AED6F1", "#A3E4D7", "#FAD7A0", "#F5B7B1", "#ABEBC6",
];

function Confetti() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
      {CONFETTI_COLORS.map((color, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            width: `${6 + (i % 4) * 2}px`,
            height: `${6 + (i % 3) * 2}px`,
            backgroundColor: color,
            left: `${5 + (i * 4.7) % 90}%`,
            top: "-10px",
            borderRadius: i % 3 === 0 ? "50%" : i % 3 === 1 ? "2px" : "0",
            animation: `confettiFall ${2 + (i % 10) * 0.3}s ease-in ${i * 0.1}s both`,
            transform: `rotate(${i * 37}deg)`,
          }}
        />
      ))}
    </div>
  );
}

export default function PrizeModal({
  prizeName,
  prizeEmoji,
  showShare,
  onShared,
  onClose,
  onSpinAgain,
  canSpinAgain,
  addedLine,
  sharedFB,
  onAddedLine,
  onSharedFB,
}: PrizeModalProps) {
  const [vh, setVh] = useState<number | null>(null);

  useEffect(() => {
    function update() {
      setVh(window.innerHeight);
    }
    update();
    window.addEventListener("resize", update);
    // Also update when page becomes visible again (returning from LINE/FB)
    document.addEventListener("visibilitychange", update);
    return () => {
      window.removeEventListener("resize", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/60 backdrop-blur-sm overflow-hidden">
      <div
        className="bg-white rounded-2xl w-full max-w-sm shadow-2xl
                    animate-bounce-in relative overflow-hidden"
        style={vh ? { maxHeight: vh - 16 } : undefined}
      >
        {/* Top gradient decoration bar */}
        <div className="h-1 shrink-0 bg-gradient-to-r from-leah-green-light via-leah-green to-leah-green-dark" />

        {/* Confetti celebration */}
        <Confetti />

        <div className="px-4 pt-3 pb-3 relative">
          {/* Prize display */}
          <div className="text-center mb-1.5">
            <div className="text-3xl">{prizeEmoji}</div>
            <h2 className="text-base font-black text-leah-green-dark">恭喜中獎！</h2>
            <p className="text-sm font-bold text-gray-800">{prizeName}</p>
          </div>

          {/* Instruction */}
          <div className="glass-card px-2 py-1.5 mb-2 text-center">
            <p className="text-xs text-gray-600 flex items-center justify-center gap-1">
              <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="#4A7C59" strokeWidth="2" aria-hidden="true">
                <rect x="2" y="4" width="20" height="16" rx="3" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="18" cy="7" r="1.5" fill="#4A7C59" stroke="none" />
              </svg>
              出示此畫面給店員即可兌換
            </p>
          </div>

          {/* Share section or spin again */}
          {showShare && !canSpinAgain && (
            <ShareButtons
              onShared={onShared}
              prizeName={prizeName}
              addedLine={addedLine}
              sharedFB={sharedFB}
              onAddedLine={onAddedLine}
              onSharedFB={onSharedFB}
            />
          )}

          {canSpinAgain && (
            <button
              onClick={onSpinAgain}
              className="w-full py-2 px-4
                         bg-gradient-to-r from-leah-green to-leah-green-dark
                         text-white text-sm font-bold rounded-xl
                         hover:brightness-110 active:scale-95 transition-all
                         shadow-lg shadow-leah-green/30 mb-1.5
                         flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M1 4v6h6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              再抽一次！
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full py-1 text-gray-400 text-xs hover:text-gray-600 transition-colors"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
}
