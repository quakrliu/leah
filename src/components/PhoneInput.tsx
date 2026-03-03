"use client";

import { useState } from "react";
import { isValidPhone } from "@/lib/utils";

interface PhoneInputProps {
  onSubmit: (phone: string) => void;
  disabled?: boolean;
  message?: string;
}

export default function PhoneInput({ onSubmit, disabled, message }: PhoneInputProps) {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.replace(/[^\d-]/g, "");
    setPhone(value);
    setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidPhone(phone)) {
      setError("請輸入正確的手機號碼（09XX-XXX-XXX）");
      return;
    }
    onSubmit(phone.replace(/\D/g, ""));
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto">
      <label htmlFor="phone" className="block text-lg font-medium text-leah-green-dark mb-2">
        輸入手機號碼
      </label>
      <input
        id="phone"
        type="tel"
        inputMode="numeric"
        placeholder="0912-345-678"
        value={phone}
        onChange={handleChange}
        maxLength={13}
        disabled={disabled}
        className="w-full px-4 py-3 text-xl text-center rounded-xl
                   border-2 border-leah-green/30
                   bg-white/50 backdrop-blur-sm
                   focus:border-leah-green focus:outline-none
                   focus:ring-4 focus:ring-leah-green/15
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all duration-200"
      />
      {error && <p className="mt-2 text-red-500 text-sm text-center">{error}</p>}
      {message && <p className="mt-3 text-amber-600 text-sm text-center font-medium">{message}</p>}
      <button
        type="submit"
        disabled={disabled}
        className="mt-4 w-full py-3 px-6
                   bg-gradient-to-r from-leah-green to-leah-green-dark
                   text-white text-xl font-bold rounded-xl
                   hover:brightness-110 active:scale-95 transition-all
                   disabled:opacity-50 disabled:cursor-not-allowed
                   shadow-lg shadow-leah-green/30
                   flex items-center justify-center gap-2"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <circle cx="12" cy="12" r="2.5" fill="currentColor" />
        </svg>
        開始抽獎
      </button>
    </form>
  );
}
