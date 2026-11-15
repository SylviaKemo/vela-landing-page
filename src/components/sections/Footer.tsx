"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

const LETTERS = "VERO".split("");

/**
 * Footer: a giant "VERO" spanning the width whose letters wipe in one after
 * another when it comes into view (same wipe as the hero title), with the
 * developer credit underneath.
 */
export function Footer() {
  const wordmark = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  // Reveal the wordmark once it is mostly on screen.
  useEffect(() => {
    const el = wordmark.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    // id="commission": the header's "Start your Commission" buttons scroll here.
    <footer id="commission" className="bg-ivory px-8 pb-6 pt-[16vh] text-ink">
      <div ref={wordmark} aria-hidden="true" className="select-none overflow-hidden">
        <div className="flex justify-center font-serif text-[calc((100vw-64px)/2.606)] font-medium leading-[0.82]">
          {LETTERS.map((letter, i) => (
            <span
              key={i}
              className="wipe"
              data-on={shown}
              style={{ "--wipe-delay": `${i * 140}ms`, "--wipe-duration": "900ms" } as CSSProperties}
            >
              {letter}
            </span>
          ))}
        </div>
      </div>
      <p className="sr-only">VERO</p>

      <p className="mb-0 mt-6 text-center font-sans text-[11px] tracking-[0.04em] text-stone">
        Developed by devKey
      </p>
    </footer>
  );
}
