"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PhoneInput from "@/components/PhoneInput";
import { canSpin, needsShare, getSpinState } from "@/lib/storage";

/* ── 派對貓頭鷹：戴三角派對帽 + 蝴蝶結 ── */
function PartyOwlSvg() {
  return (
    <svg
      className="animate-float"
      width="100"
      height="110"
      viewBox="0 0 100 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="LEAH 兒童節派對貓頭鷹"
    >
      {/* Party hat */}
      <polygon points="50,0 38,28 62,28" fill="#FF6B6B" />
      <polygon points="50,0 42,18 58,18" fill="#FFE66D" opacity="0.6" />
      {/* Hat stripes */}
      <line x1="44" y1="14" x2="56" y2="14" stroke="#4ECDC4" strokeWidth="2.5" />
      <line x1="46" y1="8" x2="54" y2="8" stroke="#FF6B6B" strokeWidth="2" />
      {/* Hat pom-pom */}
      <circle cx="50" cy="2" r="4" fill="#FFE66D" />
      {/* Body */}
      <ellipse cx="50" cy="62" rx="24" ry="26" fill="#4A7C59" />
      {/* Belly */}
      <ellipse cx="50" cy="68" rx="14" ry="15" fill="#FDF6E3" />
      {/* Head */}
      <circle cx="50" cy="40" r="20" fill="#2D5A3D" />
      {/* Ear tufts */}
      <polygon points="34,26 38,36 30,34" fill="#2D5A3D" />
      <polygon points="66,26 62,36 70,34" fill="#2D5A3D" />
      {/* Eye whites */}
      <circle cx="42" cy="40" r="8" fill="#FDF6E3" />
      <circle cx="58" cy="40" r="8" fill="#FDF6E3" />
      {/* Pupils — happy, slightly upward */}
      <circle cx="43" cy="39" r="4.5" fill="#333" />
      <circle cx="57" cy="39" r="4.5" fill="#333" />
      {/* Eye shine — bigger for cute look */}
      <circle cx="44.5" cy="37.5" r="2" fill="#fff" />
      <circle cx="58.5" cy="37.5" r="2" fill="#fff" />
      {/* Happy blush cheeks */}
      <ellipse cx="35" cy="45" rx="4" ry="2.5" fill="#FF9999" opacity="0.5" />
      <ellipse cx="65" cy="45" rx="4" ry="2.5" fill="#FF9999" opacity="0.5" />
      {/* Beak — smiling */}
      <path d="M47,47 Q50,51 53,47" fill="#D4A017" />
      {/* Bow tie */}
      <polygon points="43,55 50,58 50,52" fill="#FF6B6B" />
      <polygon points="57,55 50,58 50,52" fill="#E74C3C" />
      <circle cx="50" cy="55" r="2.5" fill="#FFE66D" />
      {/* Feet */}
      <ellipse cx="42" cy="88" rx="7" ry="3" fill="#D4A017" />
      <ellipse cx="58" cy="88" rx="7" ry="3" fill="#D4A017" />
      {/* Belly pattern */}
      <path d="M44,63 L46,67 L48,63" stroke="#4A7C59" strokeWidth="1" fill="none" opacity="0.3" />
      <path d="M52,63 L54,67 L56,63" stroke="#4A7C59" strokeWidth="1" fill="none" opacity="0.3" />
      <path d="M48,69 L50,73 L52,69" stroke="#4A7C59" strokeWidth="1" fill="none" opacity="0.3" />
      {/* Wing wave (left) — raised like waving */}
      <path d="M26,55 Q18,48 22,38" stroke="#4A7C59" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M22,38 L18,36 M22,38 L20,42" stroke="#4A7C59" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* ── 氣球 SVG ── */
function BalloonSvg({ color, x, delay, size = 36 }: { color: string; x: string; delay: string; size?: number }) {
  return (
    <svg
      className="absolute animate-balloon-float pointer-events-none"
      style={{ left: x, top: "-10px", animationDelay: delay, opacity: 0.55 }}
      width={size}
      height={size * 1.6}
      viewBox="0 0 36 58"
      fill="none"
      aria-hidden="true"
    >
      <ellipse cx="18" cy="20" rx="14" ry="18" fill={color} />
      {/* Highlight */}
      <ellipse cx="12" cy="14" rx="4" ry="6" fill="#fff" opacity="0.3" />
      {/* Knot */}
      <polygon points="16,38 18,42 20,38" fill={color} />
      {/* String */}
      <path d="M18,42 Q16,48 19,54 Q17,56 18,58" stroke={color} strokeWidth="1" fill="none" opacity="0.6" />
    </svg>
  );
}

/* ── 星星 ── */
function StarSvg({ className, size = 16, color = "#FFE66D" }: { className?: string; size?: number; color?: string }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      aria-hidden="true"
    >
      <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.4 5.6 21.2 8 14 2 9.2h7.6z" />
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
    <main className="min-h-dvh flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* ── 背景裝飾氣球 ── */}
      <BalloonSvg color="#FF6B6B" x="5%" delay="0s" size={32} />
      <BalloonSvg color="#4ECDC4" x="85%" delay="0.8s" size={28} />
      <BalloonSvg color="#FFE66D" x="15%" delay="1.6s" size={24} />
      <BalloonSvg color="#96CEB4" x="75%" delay="0.4s" size={30} />
      <BalloonSvg color="#DDA0DD" x="50%" delay="1.2s" size={26} />

      {/* ── 散落的星星 ── */}
      <StarSvg className="absolute top-[12%] left-[8%] animate-sparkle" size={14} color="#FFE66D" />
      <StarSvg className="absolute top-[8%] right-[12%] animate-sparkle delay-500" size={18} color="#FF6B6B" />
      <StarSvg className="absolute top-[22%] right-[6%] animate-sparkle delay-300" size={12} color="#4ECDC4" />
      <StarSvg className="absolute bottom-[15%] left-[10%] animate-sparkle delay-200" size={10} color="#DDA0DD" />
      <StarSvg className="absolute bottom-[20%] right-[15%] animate-sparkle delay-400" size={14} color="#96CEB4" />

      {/* ── 兒童節活動標章 ── */}
      <div className="animate-pop-in mb-2">
        <div
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold
                     bg-gradient-to-r from-[#FF6B6B] via-[#FFE66D] to-[#4ECDC4]
                     text-white shadow-md animate-wiggle"
          style={{ animationDelay: "0.6s" }}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.4 5.6 21.2 8 14 2 9.2h7.6z" />
          </svg>
          兒童節限定
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.4 5.6 21.2 8 14 2 9.2h7.6z" />
          </svg>
        </div>
      </div>

      {/* ── Brand header + 派對貓頭鷹 ── */}
      <div className="text-center mb-6 animate-fade-in-up">
        <div className="mb-3 flex justify-center">
          <PartyOwlSvg />
        </div>
        <h1 className="text-3xl font-black text-leah-green-dark tracking-wide">
          LEAH 力芽
        </h1>
        <p className="text-leah-green text-sm mt-1">健康餐廳</p>
      </div>

      {/* ── Title — glass card with festive border ── */}
      <div
        className="relative w-full max-w-sm mb-8 animate-fade-in-up delay-100"
      >
        {/* Rainbow top border */}
        <div className="absolute top-0 left-4 right-4 h-1 rounded-full bg-gradient-to-r from-[#FF6B6B] via-[#FFE66D] to-[#4ECDC4]" />
        <div className="glass-card px-8 py-6 pt-7 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            🎉 兒童節快樂！
          </h2>
          <p className="text-lg font-bold text-leah-green-dark">
            轉轉好運抽好禮
          </p>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            4/4 兒童節限定活動<br />
            大小朋友一起來玩！
          </p>
          <p className="text-xs text-gray-400 mt-2">
            每人每天最多 2 次機會
          </p>
        </div>
      </div>

      {/* ── Phone input ── */}
      {mounted && (
        <div className="animate-fade-in-up delay-200 w-full flex justify-center">
          <PhoneInput
            onSubmit={handleSubmit}
            disabled={disabled}
            message={message}
          />
        </div>
      )}

      {/* ── Footer ── */}
      <p className="mt-12 text-xs text-gray-300 animate-fade-in-up delay-300">
        © LEAH 力芽餐廳
      </p>
    </main>
  );
}
