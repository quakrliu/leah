"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SpinWheel from "@/components/SpinWheel";
import PrizeModal from "@/components/PrizeModal";
import { drawPrize } from "@/lib/utils";
import { canSpin, recordSpin, markShared, needsShare } from "@/lib/storage";
import { prizes } from "@/config/prizes";

function GiftSvg() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="animate-bounce-in"
    >
      {/* Ribbon vertical */}
      <rect x="28" y="8" width="8" height="48" rx="1" fill="#E74C3C" />
      {/* Ribbon horizontal */}
      <rect x="8" y="28" width="48" height="8" rx="1" fill="#E74C3C" />
      {/* Box bottom */}
      <rect x="8" y="32" width="48" height="24" rx="4" fill="#4A7C59" />
      {/* Box lid */}
      <rect x="4" y="24" width="56" height="12" rx="3" fill="#2D5A3D" />
      {/* Bow left */}
      <ellipse cx="26" cy="20" rx="10" ry="8" fill="#E74C3C" opacity="0.9" />
      {/* Bow right */}
      <ellipse cx="38" cy="20" rx="10" ry="8" fill="#C0392B" opacity="0.9" />
      {/* Bow center */}
      <circle cx="32" cy="20" r="4" fill="#F1C40F" />
      {/* Ribbon on box */}
      <rect x="30" y="32" width="4" height="24" fill="#C0392B" />
    </svg>
  );
}

function SpinContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const phone = searchParams.get("phone") || "";
  const mode = searchParams.get("mode");

  const [spinning, setSpinning] = useState(false);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPrize, setCurrentPrize] = useState<{
    name: string;
    emoji: string;
  } | null>(null);
  const [showSharePrompt, setShowSharePrompt] = useState(mode === "share");
  const [hasShared, setHasShared] = useState(false);
  const [canSpinAgain, setCanSpinAgain] = useState(false);

  // Redirect if no phone
  useEffect(() => {
    if (!phone) {
      router.replace("/");
    }
  }, [phone, router]);

  // Check if arriving in share mode (already spun once, needs to share)
  useEffect(() => {
    if (mode === "share" && needsShare(phone)) {
      setShowSharePrompt(true);
    }
  }, [mode, phone]);

  function handleSpin() {
    if (spinning || !canSpin(phone)) return;

    const prize = drawPrize();
    const prizeIndex = prizes.findIndex((p) => p.id === prize.id);

    setCurrentPrize({ name: prize.name, emoji: prize.emoji });
    setTargetIndex(prizeIndex);
    setSpinning(true);
  }

  const handleSpinEnd = useCallback(
    (prizeIndex: number) => {
      setSpinning(false);
      if (!currentPrize) return;

      // Record this spin
      recordSpin(phone, prizes[prizeIndex].name);

      // Check if this was the first spin (show share option)
      if (needsShare(phone)) {
        setShowModal(true);
        setCanSpinAgain(false);
      } else {
        // Second spin done, or maxed out
        setShowModal(true);
        setCanSpinAgain(false);
      }
    },
    [phone, currentPrize]
  );

  function handleShared() {
    markShared(phone);
    setHasShared(true);
    setShowSharePrompt(false);
    setCanSpinAgain(true);
  }

  function handleSpinAgain() {
    setShowModal(false);
    setCurrentPrize(null);
    setTargetIndex(null);
    setCanSpinAgain(false);
    // Small delay before allowing next spin
    setTimeout(() => {}, 100);
  }

  function handleCloseModal() {
    setShowModal(false);
    if (!canSpin(phone)) {
      router.replace("/");
    }
  }

  // If in share-prompt mode, show share UI first
  if (showSharePrompt && !hasShared) {
    return (
      <main className="min-h-dvh flex flex-col items-center justify-center px-4 py-8">
        <div className="glass-card p-8 text-center mb-6 w-full max-w-sm animate-fade-in-up">
          <div className="mb-3 flex justify-center">
            <GiftSvg />
          </div>
          <h2 className="text-2xl font-bold text-leah-green-dark mb-2">
            分享可再抽一次！
          </h2>
          <p className="text-gray-600">
            分享你的好運到社群，即可獲得第二次抽獎機會
          </p>
        </div>
        <div className="w-full max-w-sm animate-fade-in-up delay-100">
          <ShareButtonsForPrompt onShared={handleShared} />
        </div>
        <button
          onClick={() => router.replace("/")}
          className="mt-6 text-gray-400 text-sm hover:text-gray-600 transition-colors animate-fade-in-up delay-200"
        >
          不了，回首頁
        </button>
      </main>
    );
  }

  const eligible = canSpin(phone);

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-4 py-6">
      {/* Header */}
      <div className="text-center mb-4 animate-fade-in-up">
        <h1 className="text-xl font-bold text-leah-green-dark flex items-center justify-center gap-2">
          <svg className="w-6 h-6 animate-float" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="10" r="6" fill="#2D5A3D" />
            <circle cx="10" cy="9.5" r="2" fill="#FDF6E3" />
            <circle cx="14" cy="9.5" r="2" fill="#FDF6E3" />
            <circle cx="10.3" cy="9.5" r="1" fill="#333" />
            <circle cx="13.7" cy="9.5" r="1" fill="#333" />
            <polygon points="12,12 11,13.5 13,13.5" fill="#D4A017" />
          </svg>
          LEAH 幸運轉盤
        </h1>
      </div>

      {/* Wheel */}
      <div className="animate-fade-in-up delay-100">
        <SpinWheel
          onSpinEnd={handleSpinEnd}
          targetPrizeIndex={targetIndex}
          spinning={spinning}
        />
      </div>

      {/* Spin button */}
      <div className="relative mt-6 animate-fade-in-up delay-200">
        {/* Pulse aura when eligible and not spinning */}
        {eligible && !spinning && (
          <div className="absolute inset-0 rounded-full animate-pulse-glow" />
        )}
        <button
          onClick={handleSpin}
          disabled={spinning || !eligible}
          className="relative w-48 h-48 max-w-[45vw] max-h-[45vw] rounded-full
                     bg-gradient-to-b from-leah-green to-leah-green-dark
                     text-white text-3xl font-black
                     shadow-lg shadow-leah-green/40
                     hover:shadow-xl hover:scale-105
                     active:scale-95 active:shadow-md
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                     transition-all duration-200
                     flex items-center justify-center"
        >
          {spinning ? (
            <span className="flex flex-col items-center gap-2">
              <span className="css-spinner" />
              <span className="text-lg">轉動中</span>
            </span>
          ) : eligible ? (
            "轉！"
          ) : (
            "已抽完"
          )}
        </button>
      </div>

      {!eligible && !showModal && (
        <p className="mt-4 text-amber-600 text-sm font-medium animate-fade-in-up">
          今天的機會已用完，明天再來！
        </p>
      )}

      {/* Prize Modal */}
      {showModal && currentPrize && (
        <PrizeModal
          prizeName={currentPrize.name}
          prizeEmoji={currentPrize.emoji}
          showShare={needsShare(phone) || (!hasShared && canSpin(phone))}
          onShared={handleShared}
          onClose={handleCloseModal}
          onSpinAgain={handleSpinAgain}
          canSpinAgain={canSpinAgain}
        />
      )}
    </main>
  );
}

function ShareButtonsForPrompt({ onShared }: { onShared: () => void }) {
  const [copied, setCopied] = useState(false);
  const shareText = "我在 LEAH 力芽餐廳抽到好禮了！快來試試你的手氣 🎯";
  const shareUrl = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={() => {
          window.open(
            `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
            "_blank"
          );
          onShared();
        }}
        className="w-full py-3 px-4 bg-[#06C755] text-white font-bold rounded-xl
                   hover:brightness-90 active:scale-95 transition-all flex items-center justify-center gap-2
                   shadow-md shadow-[#06C755]/25"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.271.173-.508.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
        </svg>
        分享到 LINE
      </button>
      <button
        onClick={() => {
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
            "_blank"
          );
          onShared();
        }}
        className="w-full py-3 px-4 bg-[#1877F2] text-white font-bold rounded-xl
                   hover:brightness-90 active:scale-95 transition-all flex items-center justify-center gap-2
                   shadow-md shadow-[#1877F2]/25"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        分享到 Facebook
      </button>
      <button
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
          } catch {
            /* ignore */
          }
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          onShared();
        }}
        className="w-full py-3 px-4 bg-gray-600 text-white font-bold rounded-xl
                   hover:brightness-90 active:scale-95 transition-all flex items-center justify-center gap-2
                   shadow-md shadow-gray-600/25"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" strokeLinecap="round" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" strokeLinecap="round" />
        </svg>
        {copied ? "已複製！" : "複製連結"}
      </button>
    </div>
  );
}

export default function SpinPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-dvh flex flex-col items-center justify-center gap-4">
          <div className="css-spinner !w-10 !h-10 !border-4 !border-leah-green/30 !border-t-leah-green" />
          <p className="text-leah-green text-lg">載入中...</p>
        </main>
      }
    >
      <SpinContent />
    </Suspense>
  );
}
