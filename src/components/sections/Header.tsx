"use client";

import Link from "next/link";
import { useCallback, useRef, useState, type CSSProperties } from "react";
import { useIntro } from "@/components/intro/IntroContext";
import { MenuOverlay } from "@/components/nav/MenuOverlay";
import { NavButton } from "@/components/ui/Button";

/**
 * Header over the hero. Desktop: frosted "Menu" and "Start your Commission"
 * buttons. Mobile: a single hamburger. Both open the full-screen menu.
 */
export function Header() {
  const { stage } = useIntro();
  const revealed = stage === "done";
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement | null>(null);
  const hamburger = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    // Return focus to whichever trigger is visible.
    const target = hamburger.current?.offsetParent ? hamburger.current : menuButton.current;
    target?.focus({ preventScroll: true });
  }, []);

  return (
    <>
      <header
        className="fade-in absolute inset-x-0 top-0 z-[70] box-border flex items-center justify-between gap-3 px-4 py-5 sm:px-8 sm:py-6"
        data-on={revealed}
        style={{ "--fade-delay": "1300ms" } as CSSProperties}
      >
        {/* Desktop menu button */}
        <NavButton
          ref={menuButton}
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="site-menu"
          className="max-sm:hidden"
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
          className="group flex size-11 cursor-pointer items-center justify-center border-0 bg-white/20 text-paper backdrop-blur-sm transition-colors duration-300 hover:bg-white/30 sm:hidden"
        >
          <span aria-hidden="true" className="relative block h-[11px] w-[18px]">
            <span className="absolute inset-x-0 top-0 h-[1.2px] bg-current" />
            <span className="absolute left-0 right-[5px] top-[5px] h-[1.2px] bg-current transition-[right] duration-300 group-hover:right-0" />
            <span className="absolute inset-x-0 bottom-0 h-[1.2px] bg-current" />
          </span>
        </button>

        <Link href="#top" className="sr-only">
          VERO home
        </Link>

        <NavButton href="#commission" className="max-sm:hidden">
          <em>Start your</em> Commission
        </NavButton>
      </header>

      <MenuOverlay open={open} onClose={close} />
    </>
  );
}
