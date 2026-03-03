"use client";

import { useState } from "react";

interface ShareButtonsProps {
  onShared: () => void;
  prizeName: string;
  addedLine: boolean;
  sharedFB: boolean;
  onAddedLine: () => void;
  onSharedFB: () => void;
}

export default function ShareButtons({
  onShared,
  prizeName,
  addedLine: initAddedLine,
  sharedFB: initSharedFB,
  onAddedLine,
  onSharedFB,
}: ShareButtonsProps) {
  const [addedLine, setAddedLine] = useState(initAddedLine);
  const [sharedFB, setSharedFB] = useState(initSharedFB);

  const shareText = `我在 LEAH 力芽餐廳抽到「${prizeName}」🎉 快來試試你的手氣！`;
  const shareUrl = typeof window !== "undefined" ? window.location.origin : "";

  function handleAddLine() {
    window.open("https://line.me/R/ti/p/@leah", "_blank");
    setAddedLine(true);
    onAddedLine();
    if (sharedFB) onShared();
  }

  function handleShareFB() {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank");
    setSharedFB(true);
    onSharedFB();
    if (addedLine) onShared();
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      <p className="text-center text-sm font-semibold text-gray-700 mb-1">
        完成以下任務，再抽一次！
      </p>

      {/* Step 1: Add LINE */}
      <div className={`rounded-xl border-2 p-3 transition-colors ${addedLine ? "border-green-400 bg-green-50" : "border-gray-200 bg-white"}`}>
        <div className="flex items-center gap-2 mb-2">
          <span className={`flex items-center justify-center w-6 h-6 rounded-full text-sm font-bold ${addedLine ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}`}>
            {addedLine ? "\u2713" : "1"}
          </span>
          <span className={`font-semibold text-sm ${addedLine ? "text-green-700" : "text-gray-700"}`}>
            加入 LINE 官方帳號
          </span>
        </div>
        <button
          onClick={handleAddLine}
          disabled={addedLine}
          className="w-full py-2.5 px-4 bg-[#06C755] text-white font-bold rounded-lg
                     hover:brightness-90 active:scale-95 transition-all flex items-center justify-center gap-2
                     shadow-md shadow-[#06C755]/25
                     disabled:opacity-50 disabled:cursor-default disabled:active:scale-100"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.271.173-.508.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
          </svg>
          {addedLine ? "已加入 \u2713" : "加入 @leah"}
        </button>
      </div>

      {/* Step 2: Share to Facebook */}
      <div className={`rounded-xl border-2 p-3 transition-colors ${sharedFB ? "border-green-400 bg-green-50" : "border-gray-200 bg-white"}`}>
        <div className="flex items-center gap-2 mb-2">
          <span className={`flex items-center justify-center w-6 h-6 rounded-full text-sm font-bold ${sharedFB ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}`}>
            {sharedFB ? "\u2713" : "2"}
          </span>
          <span className={`font-semibold text-sm ${sharedFB ? "text-green-700" : "text-gray-700"}`}>
            分享到 Facebook
          </span>
        </div>
        <button
          onClick={handleShareFB}
          disabled={sharedFB}
          className="w-full py-2.5 px-4 bg-[#1877F2] text-white font-bold rounded-lg
                     hover:brightness-90 active:scale-95 transition-all flex items-center justify-center gap-2
                     shadow-md shadow-[#1877F2]/25
                     disabled:opacity-50 disabled:cursor-default disabled:active:scale-100"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          {sharedFB ? "已分享 \u2713" : "分享到 FB"}
        </button>
      </div>
    </div>
  );
}
