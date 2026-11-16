"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { INTRO_EXPAND_MS, useIntro } from "@/components/intro/IntroContext";

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/** Full-bleed hero video. The VELA title lives in <HeroTitle> so it can become the sticky logo. */
export function Hero() {
  const { stage, clipPath, videoRef } = useIntro();
  const revealed = stage === "done";
  const running = stage !== "done";
  const frame = useRef<HTMLDivElement>(null);

  // After the intro: the video pulls in from the sides as the page scrolls away.
  useEffect(() => {
    if (!revealed) return;
    const el = frame.current;
    const hero = el?.parentElement;
    if (!el || !hero) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const p = clamp01(window.scrollY / hero.offsetHeight);
      const x = p * Math.min(48, window.innerWidth * 0.035);
      el.style.clipPath = `inset(0px ${x}px 0px ${x}px)`;
    };
    const onScroll = () => (raf ||= requestAnimationFrame(update));
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [revealed]);

  const videoStyle: CSSProperties = running
    ? {
        clipPath: clipPath ?? undefined,
        transition:
          stage === "expand"
            ? `clip-path ${INTRO_EXPAND_MS}ms cubic-bezier(0.76, 0, 0.24, 1)`
            : "clip-path 450ms cubic-bezier(0.65, 0, 0.35, 1)",
      }
    : {};

  return (
    // While the intro runs the hero sits above the preloader so its video shows through the slot.
    <section id="top" className={`relative h-screen min-h-[560px] overflow-hidden ${running ? "z-[60]" : "z-0"}`}>
      <div ref={frame} className="absolute inset-0 bg-ph-warm" style={videoStyle}>
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          src="/videos/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />
      </div>

      <a
        href="#about"
        aria-label="Scroll to content"
        className="fade-in absolute bottom-5 left-1/2 flex h-11 w-11 -translate-x-1/2 items-center justify-center text-paper/80 hover:text-paper"
        data-on={revealed}
        style={{ "--fade-delay": "1400ms" } as CSSProperties}
      >
        <svg width="14" height="8" viewBox="0 0 14 8" fill="none" aria-hidden="true">
          <path d="M1 1l6 6 6-6" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </a>
    </section>
  );
}
