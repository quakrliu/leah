import { prizes, type Prize } from "@/config/prizes";

/** Weighted random selection — picks a prize based on configured probabilities */
export function drawPrize(): Prize {
  const rand = Math.random();
  let cumulative = 0;
  for (const prize of prizes) {
    cumulative += prize.probability;
    if (rand <= cumulative) return prize;
  }
  // fallback (should not reach here if probabilities sum to 1)
  return prizes[prizes.length - 1];
}

/** Generate a random 6-character alphanumeric redemption code */
export function generateRedemptionCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // exclude confusing chars (0,O,1,I)
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

/** Format phone for display: 0912-345-678 */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `${digits.slice(0, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return phone;
}

/** Validate Taiwan mobile phone number (09XX-XXX-XXX) */
export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return /^09\d{8}$/.test(digits);
}
