"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { useIntro } from "@/components/intro/IntroContext";

const LETTERS = "VERO".split("");
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** Logo size (px) and centre line (px from top) once docked in the header. */
const LOGO = { desktop: { font: 30, y: 46 }, mobile: { font: 26, y: 42 } };

function Letters({ revealed }: { revealed: boolean }) {
  return LETTERS.map((letter, i) => (
    <span
      key={i}
      aria-hidden="true"
      className="wipe"
      data-on={revealed}
      style={{ "--wipe-delay": `${150 + i * 130}ms`, "--wipe-duration": "650ms" } as CSSProperties}
    >
      {letter}
    </span>
  ));
}

/**
 * The hero's "VERO" title. Fixed to the viewport: as the hero scrolls away it
 * shrinks into the header logo. It is drawn twice (white and ink) and each copy
 * is clipped at the hero's bottom edge, so the half over the video stays white
 * and the half over the ivory page turns ink.
 */
export function HeroTitle() {
  const { stage } = useIntro();
  const revealed = stage === "done";
  const mover = useRef<HTMLDivElement>(null);
  const white = useRef<HTMLHeadingElement>(null);
  const ink = useRef<HTMLDivElement>(null);
  const sub = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const hero = document.getElementById("top");
      const m = mover.current;
      const w = white.current;
      const k = ink.current;
      if (!hero || !m || !w || !k) return;

      const logo = window.innerWidth < 640 ? LOGO.mobile : LOGO.desktop;
      const p = clamp(window.scrollY / Math.max(1, hero.offsetHeight - 90), 0, 1);
      const fontPx = parseFloat(getComputedStyle(w).fontSize) || logo.font;
      const scale = 1 + (logo.font / fontPx - 1) * p;
      const startCenter = m.offsetTop + m.offsetHeight / 2;
      const dy = (logo.y - startCenter) * p;
      m.style.transform = `translate3d(0, ${dy}px, 0) scale(${scale})`;

      const heroBottom = hero.getBoundingClientRect().bottom;
      const r = m.getBoundingClientRect();
      const h = m.offsetHeight;
      w.style.clipPath = `inset(0px 0px ${clamp((r.bottom - heroBottom) / scale, 0, h)}px 0px)`;
      k.style.clipPath = `inset(${clamp((heroBottom - r.top) / scale, 0, h)}px 0px 0px 0px)`;

      if (sub.current) {
        sub.current.style.opacity = String(clamp(1 - p * 4, 0, 1));
        sub.current.style.transform = `translate3d(0, ${-window.scrollY * 0.5}px, 0)`;
      }
    };
    const onScroll = () => (raf ||= requestAnimationFrame(update));
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    document.fonts?.ready.then(onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const titleClass = "m-0 flex font-serif text-[clamp(64px,7.6vw,120px)] font-medium leading-none tracking-[0.02em]";

  return (
    <div
      data-hero-title
      className="pointer-events-none fixed inset-x-0 top-0 z-[65] flex h-screen min-h-[560px] flex-col items-center justify-center pt-[6vh] text-center"
    >
      <div ref={mover} className="relative origin-center will-change-transform">
        <h1 ref={white} aria-label="VERO" className={`${titleClass} text-paper`}>
          <Letters revealed={revealed} />
        </h1>
        <div ref={ink} aria-hidden="true" className={`${titleClass} absolute inset-0 text-ink`} style={{ clipPath: "inset(100% 0 0 0)" }}>
          <Letters revealed={revealed} />
        </div>
      </div>
      <p
        ref={sub}
        className="wipe mb-0 mt-3 px-4 font-serif text-base tracking-[0.01em] text-paper"
        data-on={revealed}
        style={{ "--wipe-delay": "1050ms", "--wipe-duration": "750ms" } as CSSProperties}
      >
        <em>Custom</em> SCULPTURE <em>of your</em> WEDDING DRESS.
      </p>
    </div>
  );
}
