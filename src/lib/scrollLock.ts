/**
 * Reference-counted page scroll lock, so the intro and the menu can each hold
 * a lock without releasing the other's.
 */
let holders = 0;

export function lockScroll(): () => void {
  holders += 1;
  document.documentElement.style.overflow = "hidden";
  let released = false;
  return () => {
    if (released) return;
    released = true;
    holders = Math.max(0, holders - 1);
    if (holders === 0) document.documentElement.style.overflow = "";
  };
}
