export interface SpinState {
  count: number;
  addedLine: boolean;
  sharedFB: boolean;
  prizes: string[];
}

function getKey(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  return `leah_spins_${digits}_${today}`;
}

const DEFAULT_STATE: SpinState = { count: 0, addedLine: false, sharedFB: false, prizes: [] };

export function getSpinState(phone: string): SpinState {
  if (typeof window === "undefined") {
    return { ...DEFAULT_STATE };
  }
  const raw = localStorage.getItem(getKey(phone));
  if (!raw) return { ...DEFAULT_STATE };
  try {
    return JSON.parse(raw);
  } catch {
    return { ...DEFAULT_STATE };
  }
}

/** Check if user can spin: count<1, or count===1 && both tasks done */
export function canSpin(phone: string): boolean {
  const state = getSpinState(phone);
  if (state.count < 1) return true;
  if (state.count === 1 && state.addedLine && state.sharedFB) return true;
  return false;
}

/** Check if user needs to complete tasks before next spin */
export function needsShare(phone: string): boolean {
  const state = getSpinState(phone);
  return state.count === 1 && (!state.addedLine || !state.sharedFB);
}

/** Record a spin result */
export function recordSpin(phone: string, prizeName: string): void {
  const state = getSpinState(phone);
  state.count += 1;
  state.prizes.push(prizeName);
  localStorage.setItem(getKey(phone), JSON.stringify(state));
}

/** Mark that the user has added LINE official account */
export function markAddedLine(phone: string): void {
  const state = getSpinState(phone);
  state.addedLine = true;
  localStorage.setItem(getKey(phone), JSON.stringify(state));
}

/** Mark that the user has shared to Facebook */
export function markSharedFB(phone: string): void {
  const state = getSpinState(phone);
  state.sharedFB = true;
  localStorage.setItem(getKey(phone), JSON.stringify(state));
}
