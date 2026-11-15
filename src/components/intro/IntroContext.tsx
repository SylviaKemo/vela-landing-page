"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { lockScroll } from "@/lib/scrollLock";

/**
 * Intro timeline (matches the reference recording):
 *  blank → faint   headline fades in at low opacity, a sliver of video shows in the slot
 *  faint → open    headline darkens to ink, slot window opens; progress bar runs to 100%
 *  open → expand   after a hold, the slot window grows to fill the viewport
 *  expand → done   preloader is removed; hero title, subtitle and header reveal
 */
export type IntroStage = "blank" | "faint" | "open" | "expand" | "done";

const T_FAINT = 150;
const T_OPEN = 1400;
const PROGRESS_START = 1600;
const PROGRESS_DURATION = 2600;
const HOLD_AFTER_LOADED = 1300;
const EXPAND_DURATION = 650;

/** Sliver size shown before the slot opens (CSS px). */
const SLIVER = { w: 33, h: 12 };

type IntroValue = {
  stage: IntroStage;
  progress: number;
  /** clip-path applied to the hero video while the intro runs; null once done. */
  clipPath: string | null;
  slotRef: (el: HTMLElement | null) => void;
  videoRef: (el: HTMLVideoElement | null) => void;
};

const IntroContext = createContext<IntroValue | null>(null);

export function useIntro() {
  const ctx = useContext(IntroContext);
  if (!ctx) throw new Error("useIntro must be used inside <IntroProvider>");
  return ctx;
}

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

type Box = { top: number; left: number; width: number; height: number };
type Rect = Box & { vw: number; vh: number };

function insetFor({ vw, vh }: Rect, box: Box) {
  const right = vw - box.left - box.width;
  const bottom = vh - box.top - box.height;
  return `inset(${box.top}px ${right}px ${bottom}px ${box.left}px)`;
}

export function IntroProvider({ children }: { children: ReactNode }) {
  const [stage, setStage] = useState<IntroStage>("blank");
  const [progress, setProgress] = useState(0);
  const [slotRect, setSlotRect] = useState<Rect | null>(null);
  const slotEl = useRef<HTMLElement | null>(null);
  const videoEl = useRef<HTMLVideoElement | null>(null);

  const measure = useCallback(() => {
    const el = slotEl.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setSlotRect({ left: r.left, top: r.top, width: r.width, height: r.height, vw: window.innerWidth, vh: window.innerHeight });
  }, []);

  const slotRef = useCallback(
    (el: HTMLElement | null) => {
      slotEl.current = el;
      measure();
    },
    [measure],
  );
  const videoRef = useCallback((el: HTMLVideoElement | null) => {
    videoEl.current = el;
  }, []);

  // Timeline
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      const id = requestAnimationFrame(() => {
        setProgress(100);
        setStage("done");
      });
      return () => cancelAnimationFrame(id);
    }

    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    const timers: number[] = [];
    let raf = 0;
    const later = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));

    later(T_FAINT, () => setStage("faint"));
    later(T_OPEN, () => setStage("open"));

    const videoReady = () => (videoEl.current?.readyState ?? 0) >= 3;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / PROGRESS_DURATION);
      // Hold at 90% until the hero video can actually play.
      const value = Math.round(easeInOutCubic(t) * (videoReady() ? 100 : 90));
      setProgress(value);
      if (value >= 100) {
        later(HOLD_AFTER_LOADED, () => {
          setStage("expand");
          later(EXPAND_DURATION + 100, () => setStage("done"));
        });
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    later(PROGRESS_START, () => (raf = requestAnimationFrame(tick)));

    return () => {
      timers.forEach(clearTimeout);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Hold the page at the top while the intro runs.
  const introDone = stage === "done";
  useEffect(() => (introDone ? undefined : lockScroll()), [introDone]);

  // Re-measure the slot on resize (and once fonts settle) while the intro is running.
  useEffect(() => {
    if (stage === "done") return;
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener("resize", measure);
  }, [stage, measure]);

  let clipPath: string | null = null;
  if (stage === "expand") {
    clipPath = "inset(0px 0px 0px 0px)";
  } else if (stage !== "done") {
    if (slotRect) {
      const cx = slotRect.left + slotRect.width / 2;
      const cy = slotRect.top + slotRect.height / 2;
      const size =
        stage === "open" ? { w: slotRect.width, h: slotRect.height } : stage === "faint" ? SLIVER : { w: 0, h: 0 };
      clipPath = insetFor(slotRect, { left: cx - size.w / 2, top: cy - size.h / 2, width: size.w, height: size.h });
    } else {
      clipPath = "inset(50% 50% 50% 50%)";
    }
  }

  return (
    <IntroContext.Provider value={{ stage, progress, clipPath, slotRef, videoRef }}>{children}</IntroContext.Provider>
  );
}

export const INTRO_EXPAND_MS = EXPAND_DURATION;
