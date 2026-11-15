"use client";

import type { CSSProperties } from "react";
import { INTRO_EXPAND_MS, useIntro } from "@/components/intro/IntroContext";

const TITLE = "VERO".split("");

export function Hero() {
  const { stage, clipPath, videoRef } = useIntro();
  const revealed = stage === "done";
  const running = stage !== "done";

  const videoStyle: CSSProperties = {
    clipPath: clipPath ?? undefined,
    transition:
      stage === "expand"
        ? `clip-path ${INTRO_EXPAND_MS}ms cubic-bezier(0.76, 0, 0.24, 1)`
        : "clip-path 450ms cubic-bezier(0.65, 0, 0.35, 1)",
  };

  return (
    // While the intro runs the hero sits above the preloader so its video shows through the slot.
    <section id="top" className={`relative h-screen min-h-[560px] overflow-hidden ${running ? "z-[60]" : "z-0"}`}>
      <div className="absolute inset-0 bg-ph-warm" style={videoStyle}>
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

      <div className="absolute inset-0 flex flex-col items-center justify-center pt-[6vh] text-center text-paper">
        <h1
          aria-label="VERO"
          className="m-0 flex font-serif text-[clamp(64px,7.6vw,120px)] font-medium leading-none tracking-[0.02em]"
        >
          {TITLE.map((letter, i) => (
            <span
              key={i}
              aria-hidden="true"
              className="wipe"
              data-on={revealed}
              style={{ "--wipe-delay": `${150 + i * 130}ms`, "--wipe-duration": "650ms" } as CSSProperties}
            >
              {letter}
            </span>
          ))}
        </h1>
        <p
          className="wipe mb-0 mt-3 px-4 font-serif text-base tracking-[0.01em]"
          data-on={revealed}
          style={{ "--wipe-delay": "1050ms", "--wipe-duration": "750ms" } as CSSProperties}
        >
          <em>Custom</em> SCULPTURE <em>of your</em> WEDDING DRESS.
        </p>
      </div>

      <a
        href="#manifesto"
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
