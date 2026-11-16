"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { useIntro } from "@/components/intro/IntroContext";
import { MenuOverlay } from "@/components/nav/MenuOverlay";
import { NavButton } from "@/components/ui/Button";

/** How far (fraction of the viewport) to scroll before the buttons turn solid. */
const SOLID_AFTER = 0.35;

/**
 * Fixed header. Desktop: "Menu" and "Start your Commission" buttons, frosted
 * over the hero and solid paper once the page scrolls. Mobile: a single
 * hamburger. Both open the full-screen menu. The logo is <HeroTitle>, which
 * docks itself in the middle of this bar.
 */
export function Header() {
  const { stage } = useIntro();
  const revealed = stage === "done";
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const menuButton = useRef<HTMLButtonElement | null>(null);
  const hamburger = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * SOLID_AFTER);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    // Return focus to whichever trigger is visible.
    const target = hamburger.current?.offsetParent ? hamburger.current : menuButton.current;
    target?.focus({ preventScroll: true });
  }, []);

  const variant = solid ? "solid" : "frosted";
  const live = revealed ? "pointer-events-auto" : "";

  return (
    <>
      <header
        className="fade-in fixed inset-x-0 top-0 z-[70] box-border flex items-center justify-between gap-3 px-4 py-5 ![pointer-events:none] sm:px-8 sm:py-6"
        data-on={revealed}
        style={{ "--fade-delay": "1300ms" } as CSSProperties}
      >
        {/* Desktop menu button */}
        <NavButton
          ref={menuButton}
          variant={variant}
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="site-menu"
          className={`max-sm:hidden ${live}`}
        >
          Menu
        </NavButton>

        {/* Mobile hamburger */}
        <button
          ref={hamburger}
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="site-menu"
          className={`group flex size-11 cursor-pointer items-center justify-center border-0 backdrop-blur-sm transition-colors duration-300 sm:hidden ${live} ${
            solid ? "bg-paper text-ink shadow-soft hover:bg-white" : "bg-white/20 text-paper hover:bg-white/30"
          }`}
        >
          <span aria-hidden="true" className="relative block h-[11px] w-[18px]">
            <span className="absolute inset-x-0 top-0 h-[1.2px] bg-current" />
            <span className="absolute left-0 right-[5px] top-[5px] h-[1.2px] bg-current transition-[right] duration-300 group-hover:right-0" />
            <span className="absolute inset-x-0 bottom-0 h-[1.2px] bg-current" />
          </span>
        </button>

        <Link href="#top" className={`sr-only ${live}`}>
          VELA home
        </Link>

        <NavButton href="#commission" variant={variant} className={`max-sm:hidden ${live}`}>
          <em>Start your</em> Commission
        </NavButton>
      </header>

      <MenuOverlay open={open} onClose={close} />
    </>
  );
}
