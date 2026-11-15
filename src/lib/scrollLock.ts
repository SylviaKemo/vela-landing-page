import { getLenis } from "./smoothScroll";

/**
 * Reference-counted page scroll lock, so the intro and the menu can each hold
 * a lock without releasing the other's. Pauses Lenis as well as native scroll.
 */
let holders = 0;

export function lockScroll(): () => void {
  holders += 1;
  document.documentElement.style.overflow = "hidden";
  getLenis()?.stop();
  let released = false;
  return () => {
    if (released) return;
    released = true;
    holders = Math.max(0, holders - 1);
    if (holders === 0) {
      document.documentElement.style.overflow = "";
      getLenis()?.start();
    }
  };
}

/** True while something (intro, menu) holds the scroll lock. */
export function isScrollLocked() {
  return holders > 0;
}
