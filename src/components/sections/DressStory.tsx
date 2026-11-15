"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { useIntro } from "@/components/intro/IntroContext";
import { INITIAL_POSE, TURN_START, type DressPose } from "@/components/three/dressPose";
import { NavButton } from "@/components/ui/Button";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const DressCanvas = dynamic(() => import("@/components/three/DressCanvas"), { ssr: false });

/**
 * The 3D dress, full screen height. While the section is pinned the dress makes
 * one full 360° turn with the scroll (scrolling back up reverses it); once the
 * turn is done the section scrolls away and the studio intro follows.
 */
export function DressStory() {
  const root = useRef<HTMLElement>(null);
  const pose = useRef<DressPose>({ ...INITIAL_POSE });
  const { stage } = useIntro();

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
      <div data-headline className="flex min-h-[55vh] items-center justify-center px-4 pb-[4vh] pt-[10vh] text-center">
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
                className="mr-[0.16em] inline-block size-[0.11em] rotate-45 bg-current align-[0.62em]"
              />
              <em>important</em> dress
            </span>
          </span>
        </h2>
      </div>

      <div data-pin className="relative h-screen min-h-[560px] overflow-hidden">
        <div role="img" aria-label="3D model of a wedding dress sculpture, turning as you scroll" className="absolute inset-0">
          <DressCanvas pose={pose} />
        </div>
      </div>

      {/* Studio intro. Sizes and gaps measured from the reference (1898px-wide window). */}
      <div className="px-5 pb-[130px] pt-16 text-center">
        <h2
          id="dress-story-intro"
          className="mx-auto my-0 max-w-[390px] font-sans text-[21px] font-medium leading-[1.12] tracking-[-0.01em]"
        >
          Vero is a luxury fine-art studio that transforms your wedding dress into a timeless sculpture.
        </h2>
        <p className="mx-auto mb-0 mt-[22px] max-w-[445px] font-serif text-[13.5px] leading-[1.52] text-prose">
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
