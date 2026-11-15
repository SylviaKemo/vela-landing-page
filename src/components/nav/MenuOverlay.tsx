"use client";

import { useEffect, useRef, type CSSProperties, type MouseEvent } from "react";
import { NavButton } from "@/components/ui/Button";
import { Dot, RollText } from "@/components/ui/RollText";
import { lockScroll } from "@/lib/scrollLock";
import { scrollToTarget } from "@/lib/smoothScroll";

/** Menu entries map to this page's own sections. */
export const MENU_LINKS = [
  { label: "Home", href: "#top" },
  { label: "About", href: "#about" },
  { label: "Process", href: "#process" },
  { label: "Gallery", href: "#gallery" },
  { label: "Commission", href: "#commission" },
] as const;

const NUMERALS = ["I.", "II.", "III.", "IV.", "V.", "VI.", "VII."];

type MenuOverlayProps = {
  open: boolean;
  onClose: () => void;
  /** Section currently in view; its link is underlined. */
  activeHref?: string;
};

export function MenuOverlay({ open, onClose, activeHref = "#top" }: MenuOverlayProps) {
  const closeRef = useRef<HTMLButtonElement | null>(null);

  // Lock page scroll, focus the close button and listen for Escape while open.
  useEffect(() => {
    if (!open) return;
    const unlock = lockScroll();
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      unlock();
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const go = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    onClose();
    // Scroll once the effect cleanup has released the scroll lock.
    requestAnimationFrame(() => {
      scrollToTarget(href);
      history.replaceState(null, "", href);
    });
  };

  return (
    <div
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      aria-hidden={!open}
      inert={!open}
      data-open={open}
      data-lenis-prevent
      className="menu-panel fixed inset-0 z-[80] overflow-y-auto bg-ivory text-ink"
    >
      {/* Soft warm glow, top-right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_8%,rgba(226,170,128,0.28),transparent_38%),radial-gradient(circle_at_0%_30%,rgba(226,170,128,0.12),transparent_30%)]"
      />

      <div className="relative box-border flex min-h-full flex-col px-4 pb-8 pt-5 sm:px-8 sm:pt-6">
        <div>
          <NavButton ref={closeRef} variant="solid" hoverDot={false} onClick={onClose} aria-label="Close menu">
            <Dot />
            Close
          </NavButton>
        </div>

        <div className="mt-10 flex flex-1 flex-col gap-12 md:mt-6 md:flex-row md:justify-between">
          <nav aria-label="Main">
            <ol className="m-0 list-none p-0 sm:pl-12">
              {MENU_LINKS.map((link, i) => {
                const active = link.href === activeHref;
                return (
                  <li key={link.href} className="menu-item flex items-baseline gap-3" style={{ "--i": i } as CSSProperties}>
                    <span aria-hidden="true" className="w-6 shrink-0 text-right font-serif text-[11px] text-stone sm:-ml-9">
                      {NUMERALS[i]}
                    </span>
                    <a
                      href={link.href}
                      onClick={(e) => go(e, link.href)}
                      aria-current={active ? "location" : undefined}
                      className="group relative inline-block font-serif text-[clamp(44px,6.2vw,124px)] font-medium uppercase leading-[1.04] text-ink no-underline"
                    >
                      <RollText>{link.label}</RollText>
                      <span
                        aria-hidden="true"
                        className={`absolute inset-x-0 bottom-[0.06em] h-[2px] origin-left bg-ink transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] ${
                          active ? "scale-x-100" : "scale-x-0"
                        }`}
                      />
                    </a>
                  </li>
                );
              })}
            </ol>
          </nav>

          <div className="menu-aside flex flex-col justify-between gap-10 font-serif text-[15px] leading-snug md:text-right">
            <div>
              <p className="m-0">Connect:</p>
              <ul className="m-0 list-none p-0">
                <li>
                  <a href="#" className="text-ink no-underline hover:underline">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#commission" onClick={(e) => go(e, "#commission")} className="text-ink no-underline hover:underline">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <ul className="m-0 list-none p-0 italic text-stone">
              <li>
                <a href="#process" onClick={(e) => go(e, "#process")} className="text-inherit no-underline hover:text-ink">
                  Our Process
                </a>
              </li>
              <li>
                <a href="#gallery" onClick={(e) => go(e, "#gallery")} className="text-inherit no-underline hover:text-ink">
                  Explore the Gallery
                </a>
              </li>
              <li>
                <a href="#" className="text-inherit no-underline hover:text-ink">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
