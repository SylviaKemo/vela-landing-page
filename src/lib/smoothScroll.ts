import type Lenis from "lenis";

/** The page's single Lenis instance, set by <SmoothScroll> while it is mounted. */
let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenis() {
  return instance;
}

/** Smooth-scroll to a selector (e.g. "#about"), falling back to native scrolling. */
export function scrollToTarget(target: string) {
  if (instance) {
    instance.scrollTo(target);
    return;
  }
  document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
}
