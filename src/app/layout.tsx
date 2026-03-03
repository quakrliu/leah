import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LEAH 力芽 | 幸運轉盤抽獎",
  description: "轉轉好運！LEAH 力芽餐廳幸運轉盤，掃碼抽獎贏好禮！",
  openGraph: {
    title: "LEAH 力芽 | 幸運轉盤抽獎",
    description: "我在 LEAH 力芽餐廳抽到好禮了！快來試試你的手氣 🎯",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#4A7C59",
};

function DecoLeaf({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M60 10 C80 30, 100 60, 60 110 C20 60, 40 30, 60 10Z"
        fill="#4A7C59"
        opacity="0.07"
      />
      <path
        d="M60 10 C60 50, 60 80, 60 110"
        stroke="#4A7C59"
        strokeWidth="1.5"
        opacity="0.05"
      />
      <path
        d="M60 40 C45 35, 35 45, 30 55"
        stroke="#4A7C59"
        strokeWidth="1"
        opacity="0.04"
        fill="none"
      />
      <path
        d="M60 60 C75 55, 85 45, 90 35"
        stroke="#4A7C59"
        strokeWidth="1"
        opacity="0.04"
        fill="none"
      />
    </svg>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="antialiased relative overflow-x-hidden">
        {/* Decorative corner leaves */}
        <DecoLeaf className="fixed top-0 left-0 -translate-x-4 -translate-y-4 rotate-0 pointer-events-none" />
        <DecoLeaf className="fixed top-0 right-0 translate-x-4 -translate-y-4 rotate-90 pointer-events-none" />
        <DecoLeaf className="fixed bottom-0 left-0 -translate-x-4 translate-y-4 -rotate-90 pointer-events-none" />
        <DecoLeaf className="fixed bottom-0 right-0 translate-x-4 translate-y-4 rotate-180 pointer-events-none" />
        {children}
      </body>
    </html>
  );
}
