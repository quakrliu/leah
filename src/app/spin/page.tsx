"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SpinWheel from "@/components/SpinWheel";
import PrizeModal from "@/components/PrizeModal";
import ShareButtons from "@/components/ShareButtons";
import { drawPrize } from "@/lib/utils";
import { canSpin, recordSpin, markAddedLine, markSharedFB, needsShare, getSpinState } from "@/lib/storage";
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
  const [canSpinAgain, setCanSpinAgain] = useState(false);

  // Track task completion states
  const [addedLine, setAddedLine] = useState(() => getSpinState(phone).addedLine);
  const [sharedFB, setSharedFB] = useState(() => getSpinState(phone).sharedFB);

  // Redirect if no phone
  useEffect(() => {
    if (!phone) {
      router.replace("/");
    }
  }, [phone, router]);

  // Check if arriving in share mode (already spun once, needs to complete tasks)
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

      setShowModal(true);
      setCanSpinAgain(false);
    },
    [phone, currentPrize]
  );

  function handleAddedLine() {
    markAddedLine(phone);
    setAddedLine(true);
  }

  function handleSharedFB() {
    markSharedFB(phone);
    setSharedFB(true);
  }

  function handleShared() {
    // Both tasks are done
    setShowSharePrompt(false);
    setCanSpinAgain(true);
  }

  function handleSpinAgain() {
    setShowModal(false);
    setCurrentPrize(null);
    setTargetIndex(null);
    setCanSpinAgain(false);
  }

  function handleCloseModal() {
    setShowModal(false);
    if (!canSpin(phone)) {
      router.replace("/");
    }
  }

  // Get last prize name for share prompt page
  const lastPrizeName = getSpinState(phone).prizes.at(-1) || "好禮";

  // If in share-prompt mode, show task checklist first
  if (showSharePrompt && needsShare(phone) && !canSpinAgain) {
    return (
      <main className="min-h-dvh flex flex-col items-center justify-center px-4 py-8">
        <div className="glass-card p-8 text-center mb-6 w-full max-w-sm animate-fade-in-up">
          <div className="mb-3 flex justify-center">
            <GiftSvg />
          </div>
          <h2 className="text-2xl font-bold text-leah-green-dark mb-2">
            完成任務再抽一次！
          </h2>
          <p className="text-gray-600">
            完成以下兩個步驟，即可獲得第二次抽獎機會
          </p>
        </div>
        <div className="w-full max-w-sm animate-fade-in-up delay-100">
          <ShareButtons
            onShared={handleShared}
            prizeName={lastPrizeName}
            addedLine={addedLine}
            sharedFB={sharedFB}
            onAddedLine={handleAddedLine}
            onSharedFB={handleSharedFB}
          />
        </div>
        {canSpinAgain && (
          <button
            onClick={() => {
              setShowSharePrompt(false);
            }}
            className="mt-4 w-full max-w-sm py-3 px-6
                       bg-gradient-to-r from-leah-green to-leah-green-dark
                       text-white text-lg font-bold rounded-xl
                       hover:brightness-110 active:scale-95 transition-all
                       shadow-lg shadow-leah-green/30
                       flex items-center justify-center gap-2 animate-fade-in-up delay-200"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M1 4v6h6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            再抽一次！
          </button>
        )}
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
          showShare={needsShare(phone)}
          onShared={handleShared}
          onClose={handleCloseModal}
          onSpinAgain={handleSpinAgain}
          canSpinAgain={canSpinAgain}
          addedLine={addedLine}
          sharedFB={sharedFB}
          onAddedLine={handleAddedLine}
          onSharedFB={handleSharedFB}
        />
      )}
    </main>
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
