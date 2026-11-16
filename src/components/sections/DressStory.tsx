"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useIntro } from "@/components/intro/IntroContext";
import { INITIAL_POSE, TURN_START, type DressPose } from "@/components/three/dressPose";
import { WebGLBoundary } from "@/components/three/WebGLBoundary";
import { NavButton } from "@/components/ui/Button";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const DressCanvas = dynamic(() => import("@/components/three/DressCanvas"), { ssr: false });

const DRESS_FALLBACK = {
  src: "/images/5.avif",
  alt: "White resin sculpture of the gown on a stone plinth against a grey backdrop",
};

/** Dress models the visitor can switch between. */
const DRESS_MODELS = [
  { url: "/models/ivory-cascade.glb", name: "Cascade" },
  { url: "/models/mermaid.glb", name: "Mermaid" },];
const MODEL_URLS = DRESS_MODELS.map((m) => m.url);

/** Colours the visitor can switch the dress between. */
const DRESS_COLORS = [
  { hex: "#FFFFFF", name: "White" },
  { hex: "#B5A693", name: "Taupe" },
  { hex: "#D8B8AD", name: "Blush" },
  { hex: "#C5A875", name: "Gold" },
  { hex: "#E5DED0", name: "Ivory" },
  { hex: "#DCC8A9", name: "Champagne" },
];

/**
 * The 3D dress, full screen height. While the section is pinned the dress makes
 * one full 360° turn with the scroll (scrolling back up reverses it); once the
 * turn is done the section scrolls away and the studio intro follows.
 */
export function DressStory() {
  const root = useRef<HTMLElement>(null);
  const pose = useRef<DressPose>({ ...INITIAL_POSE });
  const frame = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(false);
  const [threeFailed, setThreeFailed] = useState(false);
  const [color, setColor] = useState(DRESS_COLORS[0]);
  const [model, setModel] = useState(DRESS_MODELS[0]);
  const { stage } = useIntro();

  // Only render 3D frames while the dress frame is on (or about to come on) screen.
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { rootMargin: "50% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Turn the dress by hand: drag (mouse), swipe sideways (touch) or scroll sideways
  // (trackpad / tilt wheel). Vertical scrolling still moves the page as usual.
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    // One full turn per ~1.2 frame widths of drag.
    const perPx = () => (Math.PI * 2) / (el.clientWidth * 1.2);
    let lastX: number | null = null;

    const onDown = (e: PointerEvent) => {
      if ((e.target as Element).closest("button, a")) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      lastX = e.clientX;
      el.dataset.dragging = "true";
      if (e.pointerType === "mouse") el.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (lastX === null) return;
      pose.current.userY += (e.clientX - lastX) * perPx();
      lastX = e.clientX;
    };
    const onUp = () => {
      lastX = null;
      delete el.dataset.dragging;
    };
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return; // mostly vertical: let the page scroll
      e.preventDefault(); // also stops the browser's swipe-to-go-back
      e.stopPropagation(); // keep Lenis from scrolling the page on the gesture's small vertical part
      pose.current.userY -= e.deltaX * perPx();
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("wheel", onWheel);
    };
  }, []);

  // Still image shown if 3D is unavailable or the GPU drops the WebGL context.
  const fallback = (
    <Image src={DRESS_FALLBACK.src} alt={DRESS_FALLBACK.alt} fill sizes="100vw" unoptimized className="object-cover" />
  );

  // Pins are measured while the intro holds the scroll lock (no scrollbar); re-measure once it lifts.
  useEffect(() => {
    if (stage === "done") ScrollTrigger.refresh();
  }, [stage]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root);
        const pin = q("[data-pin]")[0];

        // Headline lines rise out of their masks as the block scrolls into view.
        gsap.fromTo(
          q("[data-headline-line]"),
          { yPercent: 105 },
          {
            yPercent: 0,
            ease: "power3.out",
            stagger: 0.25,
            scrollTrigger: { trigger: q("[data-headline]")[0], start: "top 90%", end: "top 35%", scrub: 0.6 },
          },
        );

        // As the section scrolls in: turn from the side to face the viewer.
        gsap.to(pose.current, {
          rotY: TURN_START,
          ease: "none",
          scrollTrigger: { trigger: pin, start: "top bottom", end: "top top", scrub: 0.6 },
        });

        // Pinned: one full turn, tied to scroll position.
        gsap.to(pose.current, {
          rotY: TURN_START + Math.PI * 2,
          ease: "none",
          scrollTrigger: { trigger: pin, start: "top top", end: "+=250%", pin: true, scrub: 0.6 },
        });
      });

      // Reduced motion: no pin, dress simply faces front.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        pose.current.rotY = 0;
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="about" aria-labelledby="dress-story-headline" className="relative bg-ivory">
      {/* Section headline: sized from the reference (~112px at a 1349px-wide window), with room to breathe. */}
      <div data-headline className="flex items-center justify-center px-4 pb-2 pt-16 text-center md:min-h-[55vh] md:pb-[4vh] md:pt-[10vh]">
        <h2
          id="dress-story-headline"
          className="m-0 font-serif text-[clamp(44px,8.3vw,168px)] font-medium uppercase leading-[1.04] [&_em]:normal-case"
        >
          <span className="block overflow-hidden pb-[0.06em]">
            <span data-headline-line className="inline-block">
              Your most
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.18em]">
            <span data-headline-line className="inline-block">
              <span
                aria-hidden="true"
                className="mr-[0.3em] inline-block size-[0.13em] rotate-45 bg-current align-[0.26em]"
              />
              <em>important</em> dress
            </span>
          </span>
        </h2>
      </div>

      <div
        ref={frame}
        data-pin
        className="relative h-screen min-h-[560px] cursor-grab touch-pan-y select-none overflow-hidden overscroll-x-none data-[dragging=true]:cursor-grabbing"
      >
        <div
          role="img"
          aria-label="3D model of a wedding dress sculpture. It turns as you scroll; drag or swipe sideways to turn it yourself."
          className="absolute inset-0"
        >
          {threeFailed ? (
            fallback
          ) : (
            <WebGLBoundary fallback={fallback}>
              <DressCanvas
                pose={pose}
                url={model.url}
                urls={MODEL_URLS}
                color={color.hex} active={onScreen} onContextLost={() => setThreeFailed(true)} />
            </WebGLBoundary>
          )}
        </div>

        {!threeFailed && (
          <div className="absolute inset-x-0 bottom-[3vh] flex flex-col items-center gap-3 md:inset-x-auto md:bottom-auto md:right-[5vw] md:top-1/2 md:-translate-y-1/2 md:items-end">

            <p aria-hidden="true" className="m-0 font-serif text-[12px] italic text-ink/60 md:mb-2">
              <span className="md:hidden">Swipe sideways to turn</span>
              <span className="hidden md:inline">Drag to turn</span>
            </p>
            <div role="radiogroup" aria-label="Dress style" className="mb-1 flex gap-2 md:mb-4">
              {DRESS_MODELS.map((m) => {
                const selected = m.url === model.url;
                return (
                  <button
                    key={m.url}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setModel(m)}
                    className={`min-h-[32px] cursor-pointer rounded-full border px-4 font-serif text-[12px] uppercase tracking-[0.04em] transition-colors duration-300 ${
                      selected ? "border-ink bg-ink text-ivory" : "border-ink/20 bg-ivory/70 text-ink hover:border-ink/60"
                    }`}
                  >
                    {m.name}
                  </button>
                );
              })}
            </div>
            <p className="m-0 font-serif text-[12px] uppercase tracking-[0.04em] text-ink" aria-live="polite">
              <em className="normal-case">Colour</em> · {color.name}
            </p>
            <div role="radiogroup" aria-label="Dress colour" className="flex gap-3 md:flex-col md:gap-[14px]">
              {DRESS_COLORS.map((c) => {
                const selected = c.hex === color.hex;
                return (
                  <button
                    key={c.hex}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    aria-label={c.name}
                    onClick={() => setColor(c)}
                    className={`size-[26px] cursor-pointer rounded-full border border-ink/15 outline-offset-4 transition-[box-shadow,transform] duration-300 hover:scale-110 ${
                      selected ? "shadow-[0_0_0_2px_var(--color-ivory),0_0_0_3px_var(--color-ink)]" : ""
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Studio intro. Sizes and gaps measured from the reference (1898px-wide window). */}
      <div className="px-5 pb-14 pt-16 text-center md:pb-[130px]">
        <h2
          id="dress-story-intro"
          className="mx-auto my-0 max-w-[390px] font-sans text-[21px] font-medium leading-[1.12] tracking-[-0.01em]"
        >
          Vero is a luxury fine-art studio that transforms your wedding dress into a timeless sculpture.
        </h2>
        <p className="mx-auto mb-0 mt-[22px] max-w-[445px] font-sans text-[14px] font-normal leading-[1.65] text-prose">
          Each Vero sculpture stands approximately 15 inches tall and weighs 5–10 pounds. Our sculptures are made of
          ceramic-based resin and are crafted with exceptional precision and detail, exactly as it was worn on your
          wedding day.
        </p>
        <div className="mt-14">
          <NavButton href="#commission" variant="solid" className="min-h-[45px] !px-[48px] !text-[12px]">
            <em>Start your</em> Commission
          </NavButton>
        </div>
      </div>
    </section>
  );
}
