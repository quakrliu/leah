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
                   hover:brightness-90 active:scale-95 transition-all flex items-center justify-center gap-2
                   shadow-md shadow-[#06C755]/25"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.271.173-.508.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
        </svg>
        分享到 LINE
      </button>
      <button
        onClick={handleFBShare}
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
        onClick={handleCopyLink}
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
