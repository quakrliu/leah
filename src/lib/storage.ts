export interface SpinState {
  count: number;
  shared: boolean;
  prizes: string[];
}

function getKey(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  return `leah_spins_${digits}_${today}`;
}

export function getSpinState(phone: string): SpinState {
  if (typeof window === "undefined") {
    return { count: 0, shared: false, prizes: [] };
  }
  const raw = localStorage.getItem(getKey(phone));
  if (!raw) return { count: 0, shared: false, prizes: [] };
  try {
    return JSON.parse(raw);
  } catch {
    return { count: 0, shared: false, prizes: [] };
  }
}

/** Check if user can spin: count<1, or count===1 && shared===true */
export function canSpin(phone: string): boolean {
  const state = getSpinState(phone);
  if (state.count < 1) return true;
  if (state.count === 1 && state.shared) return true;
  return false;
}

/** Check if user needs to share before next spin */
export function needsShare(phone: string): boolean {
  const state = getSpinState(phone);
  return state.count === 1 && !state.shared;
}

/** Record a spin result */
export function recordSpin(phone: string, prizeName: string): void {
  const state = getSpinState(phone);
  state.count += 1;
  state.prizes.push(prizeName);
  localStorage.setItem(getKey(phone), JSON.stringify(state));
}

/** Mark that the user has shared */
export function markShared(phone: string): void {
  const state = getSpinState(phone);
  state.shared = true;
  localStorage.setItem(getKey(phone), JSON.stringify(state));
}
