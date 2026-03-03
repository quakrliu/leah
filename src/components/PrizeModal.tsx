"use client";

import ShareButtons from "./ShareButtons";

interface PrizeModalProps {
  prizeName: string;
  prizeEmoji: string;
  showShare: boolean;
  onShared: () => void;
  onClose: () => void;
  onSpinAgain: () => void;
  canSpinAgain: boolean;
}

export default function PrizeModal({
  prizeName,
  prizeEmoji,
  showShare,
  onShared,
  onClose,
  onSpinAgain,
  canSpinAgain,
}: PrizeModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl
                    animate-[bounceIn_0.5s_ease-out]"
      >
        {/* Prize display */}
        <div className="text-center mb-4">
          <div className="text-6xl mb-3">{prizeEmoji}</div>
          <h2 className="text-2xl font-black text-leah-green-dark mb-1">恭喜中獎！</h2>
          <p className="text-xl font-bold text-gray-800">{prizeName}</p>
        </div>

        {/* Instruction */}
        <div className="bg-leah-cream rounded-xl p-4 mb-4 text-center">
          <p className="text-sm text-gray-600">📸 出示此畫面給店員即可兌換</p>
        </div>

        {/* Share section or spin again */}
        {showShare && !canSpinAgain && (
          <ShareButtons onShared={onShared} prizeName={prizeName} />
        )}

        {canSpinAgain && (
          <button
            onClick={onSpinAgain}
            className="w-full py-3 px-6 bg-leah-green text-white text-lg font-bold rounded-xl
                       hover:bg-leah-green-dark active:scale-95 transition-all
                       shadow-lg shadow-leah-green/30 mb-3"
          >
            🎰 再抽一次！
          </button>
        )}

        <button
          onClick={onClose}
          className="w-full py-2 text-gray-400 text-sm hover:text-gray-600 transition-colors"
        >
          關閉
        </button>
      </div>
    </div>
  );
}
