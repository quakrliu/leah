"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PhoneInput from "@/components/PhoneInput";
import { canSpin, needsShare, getSpinState } from "@/lib/storage";

export default function Home() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleSubmit(phone: string) {
    const state = getSpinState(phone);

    if (state.count >= 2) {
      setMessage("你今天已經抽過 2 次囉！明天再來試試手氣 🍀");
      setDisabled(true);
      return;
    }

    if (needsShare(phone)) {
      router.push(`/spin?phone=${phone}&mode=share`);
      return;
    }

    if (canSpin(phone)) {
      router.push(`/spin?phone=${phone}`);
      return;
    }

    setMessage("你今天已經抽過 2 次囉！明天再來試試手氣 🍀");
    setDisabled(true);
  }

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-4 py-8">
      {/* Brand header */}
      <div className="text-center mb-8">
        <div className="text-7xl mb-4">🦉</div>
        <h1 className="text-3xl font-black text-leah-green-dark tracking-wide">
          LEAH 力芽
        </h1>
        <p className="text-leah-green text-sm mt-1">健康餐廳</p>
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          🎯 轉轉好運！
        </h2>
        <p className="text-lg text-gray-600">
          LEAH 幸運轉盤
        </p>
        <p className="text-sm text-gray-400 mt-1">
          每人每天最多 2 次機會
        </p>
      </div>

      {/* Phone input */}
      {mounted && (
        <PhoneInput
          onSubmit={handleSubmit}
          disabled={disabled}
          message={message}
        />
      )}

      {/* Footer */}
      <p className="mt-12 text-xs text-gray-300">
        © LEAH 力芽餐廳
      </p>
    </main>
  );
}
