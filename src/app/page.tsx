"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PhoneInput from "@/components/PhoneInput";
import { canSpin, needsShare, getSpinState } from "@/lib/storage";

function OwlSvg() {
  return (
    <svg
      className="animate-float"
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="LEAH 貓頭鷹"
    >
      {/* Body */}
      <ellipse cx="40" cy="48" rx="22" ry="24" fill="#4A7C59" />
      {/* Belly */}
      <ellipse cx="40" cy="54" rx="13" ry="14" fill="#FDF6E3" />
      {/* Head */}
      <circle cx="40" cy="28" r="18" fill="#2D5A3D" />
      {/* Ear tufts */}
      <polygon points="26,14 30,24 22,22" fill="#2D5A3D" />
      <polygon points="54,14 50,24 58,22" fill="#2D5A3D" />
      {/* Eye whites */}
      <circle cx="33" cy="28" r="7" fill="#FDF6E3" />
      <circle cx="47" cy="28" r="7" fill="#FDF6E3" />
      {/* Pupils */}
      <circle cx="34" cy="28" r="4" fill="#333" />
      <circle cx="46" cy="28" r="4" fill="#333" />
      {/* Eye shine */}
      <circle cx="35.5" cy="26.5" r="1.5" fill="#fff" />
      <circle cx="47.5" cy="26.5" r="1.5" fill="#fff" />
      {/* Beak */}
      <polygon points="40,32 37,36 43,36" fill="#D4A017" />
      {/* Feet */}
      <ellipse cx="34" cy="72" rx="6" ry="3" fill="#D4A017" />
      <ellipse cx="46" cy="72" rx="6" ry="3" fill="#D4A017" />
      {/* Belly pattern (V shapes) */}
      <path d="M35,48 L37,52 L39,48" stroke="#4A7C59" strokeWidth="1" fill="none" opacity="0.3" />
      <path d="M41,48 L43,52 L45,48" stroke="#4A7C59" strokeWidth="1" fill="none" opacity="0.3" />
      <path d="M38,53 L40,57 L42,53" stroke="#4A7C59" strokeWidth="1" fill="none" opacity="0.3" />
    </svg>
  );
}

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
      <div className="text-center mb-8 animate-fade-in-up">
        <div className="mb-4 flex justify-center">
          <OwlSvg />
        </div>
        <h1 className="text-3xl font-black text-leah-green-dark tracking-wide">
          LEAH 力芽
        </h1>
        <p className="text-leah-green text-sm mt-1">健康餐廳</p>
      </div>

      {/* Title — glass card */}
      <div className="glass-card px-8 py-6 text-center mb-8 w-full max-w-sm animate-fade-in-up delay-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          <svg className="inline-block w-6 h-6 mr-1 -mt-1" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" stroke="#4A7C59" strokeWidth="2" />
            <circle cx="12" cy="12" r="3" fill="#4A7C59" />
            <circle cx="12" cy="12" r="6" stroke="#4A7C59" strokeWidth="1.5" fill="none" />
          </svg>
          轉轉好運！
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
        <div className="animate-fade-in-up delay-200 w-full flex justify-center">
          <PhoneInput
            onSubmit={handleSubmit}
            disabled={disabled}
            message={message}
          />
        </div>
      )}

      {/* Footer */}
      <p className="mt-12 text-xs text-gray-300 animate-fade-in-up delay-300">
        © LEAH 力芽餐廳
      </p>
    </main>
  );
}
