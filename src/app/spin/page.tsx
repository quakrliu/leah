"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SpinWheel from "@/components/SpinWheel";
import PrizeModal from "@/components/PrizeModal";
import { drawPrize, generateRedemptionCode } from "@/lib/utils";
import { canSpin, recordSpin, markShared, needsShare } from "@/lib/storage";
import { prizes } from "@/config/prizes";

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
    code: string;
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
    const code = generateRedemptionCode();

    setCurrentPrize({ name: prize.name, emoji: prize.emoji, code });
    setTargetIndex(prizeIndex);
    setSpinning(true);
  }

  const handleSpinEnd = useCallback(
    (prizeIndex: number) => {
      setSpinning(false);
      if (!currentPrize) return;

      // Record this spin
      recordSpin(phone, prizes[prizeIndex].name, currentPrize.code);

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
        <div className="text-center mb-6">
          <div className="text-6xl mb-3">🎁</div>
          <h2 className="text-2xl font-bold text-leah-green-dark mb-2">
            分享可再抽一次！
          </h2>
          <p className="text-gray-600">
            分享你的好運到社群，即可獲得第二次抽獎機會
          </p>
        </div>
        <div className="w-full max-w-sm">
          <ShareButtonsForPrompt onShared={handleShared} />
        </div>
        <button
          onClick={() => router.replace("/")}
          className="mt-6 text-gray-400 text-sm hover:text-gray-600"
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
      <div className="text-center mb-4">
        <h1 className="text-xl font-bold text-leah-green-dark">
          🦉 LEAH 幸運轉盤
        </h1>
      </div>

      {/* Wheel */}
      <SpinWheel
        onSpinEnd={handleSpinEnd}
        targetPrizeIndex={targetIndex}
        spinning={spinning}
      />

      {/* Spin button */}
      <button
        onClick={handleSpin}
        disabled={spinning || !eligible}
        className="mt-6 w-48 h-48 max-w-[45vw] max-h-[45vw] rounded-full
                   bg-gradient-to-b from-leah-green to-leah-green-dark
                   text-white text-3xl font-black
                   shadow-lg shadow-leah-green/40
                   hover:shadow-xl hover:scale-105
                   active:scale-95 active:shadow-md
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                   transition-all duration-200
                   flex items-center justify-center"
      >
        {spinning ? "轉動中..." : eligible ? "轉！" : "已抽完"}
      </button>

      {!eligible && !showModal && (
        <p className="mt-4 text-amber-600 text-sm font-medium">
          今天的機會已用完，明天再來！
        </p>
      )}

      {/* Prize Modal */}
      {showModal && currentPrize && (
        <PrizeModal
          prizeName={currentPrize.name}
          prizeEmoji={currentPrize.emoji}
          code={currentPrize.code}
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
                   hover:brightness-90 active:scale-95 transition-all flex items-center justify-center gap-2"
      >
        💬 分享到 LINE
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
                   hover:brightness-90 active:scale-95 transition-all flex items-center justify-center gap-2"
      >
        📘 分享到 Facebook
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
                   hover:brightness-90 active:scale-95 transition-all flex items-center justify-center gap-2"
      >
        🔗 {copied ? "已複製！" : "複製連結"}
      </button>
    </div>
  );
}

export default function SpinPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-dvh flex items-center justify-center">
          <p className="text-leah-green text-xl">載入中...</p>
        </main>
      }
    >
      <SpinContent />
    </Suspense>
  );
}
