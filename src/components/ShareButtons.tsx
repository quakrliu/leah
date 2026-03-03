"use client";

import { useState } from "react";

interface ShareButtonsProps {
  onShared: () => void;
  prizeName: string;
}

export default function ShareButtons({ onShared, prizeName }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareText = `我在 LEAH 力芽餐廳抽到「${prizeName}」🎉 快來試試你的手氣！`;
  const shareUrl = typeof window !== "undefined" ? window.location.origin : "";

  function handleLineShare() {
    const url = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank");
    onShared();
  }

  function handleFBShare() {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank");
    onShared();
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onShared();
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = `${shareText}\n${shareUrl}`;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onShared();
    }
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      <p className="text-center text-sm text-gray-600 mb-1">
        分享到社群，再抽一次！
      </p>
      <button
        onClick={handleLineShare}
        className="w-full py-3 px-4 bg-[#06C755] text-white font-bold rounded-xl
                   hover:brightness-90 active:scale-95 transition-all flex items-center justify-center gap-2"
      >
        <span className="text-lg">💬</span> 分享到 LINE
      </button>
      <button
        onClick={handleFBShare}
        className="w-full py-3 px-4 bg-[#1877F2] text-white font-bold rounded-xl
                   hover:brightness-90 active:scale-95 transition-all flex items-center justify-center gap-2"
      >
        <span className="text-lg">📘</span> 分享到 Facebook
      </button>
      <button
        onClick={handleCopyLink}
        className="w-full py-3 px-4 bg-gray-600 text-white font-bold rounded-xl
                   hover:brightness-90 active:scale-95 transition-all flex items-center justify-center gap-2"
      >
        <span className="text-lg">🔗</span> {copied ? "已複製！" : "複製連結"}
      </button>
    </div>
  );
}
