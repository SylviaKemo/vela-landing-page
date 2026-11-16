"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { Fragment, useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const PANELS = [
  { src: "/images/essence-dress.webp", alt: "Bride in a strapless satin gown with a sculpted bow, standing on a plinth against a warm amber backdrop" },
  { src: "/images/5.avif", alt: "White resin sculpture of the gown on a stone plinth against a grey backdrop" },
  { src: "/images/essence-sculpture.webp", alt: "Bride seen from behind in a satin gown with a sculpted bow, beside the miniature sculpture of her dress on a plinth" },
];

const PHRASES = [
  { lead: "From", word: "Dress," },
  { lead: "to", word: "Data," },
  { lead: "to", word: "Sculpture." },
];

/**
 * "The essence of VELA". The section pins; the small image under the heading
 * grows to fill the screen, then three full-screen images slide sideways while
 * "From DRESS, to DATA, to SCULPTURE." drifts along and lights up phrase by
 * phrase. Sizes measured from the reference: ~12px label, ~83px (4.37vw)
 * heading, ~60px (4.4vw) caption at a 1376px-wide window.
 */
export function Essence() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const pin = q("[data-essence-pin]")[0] as HTMLElement;
        const slot = q("[data-essence-slot]")[0] as HTMLElement;
        const grow = q("[data-essence-grow]")[0] as HTMLElement;
        const phrases = q("[data-phrase]");
        const dots = q("[data-dot]");

        // Starting box = the slot under the heading, in the pinned frame's coordinates.
        const from = () => {
          const p = pin.getBoundingClientRect();
          const s = slot.getBoundingClientRect();
          return { left: s.left - p.left, top: s.top - p.top, width: s.width, height: s.height };
        };
        gsap.set(grow, { ...from() });
        gsap.set(q("[data-caption]"), { yPercent: 120 });
        gsap.set(phrases.slice(1), { opacity: 0.42 });
        gsap.set(dots.slice(1), { opacity: 0.4 });

        // Heading: label fades up, then each line rises out of its mask as the section scrolls in.
        gsap
          .timeline({
            scrollTrigger: { trigger: pin, start: "top 85%", end: "top 15%", scrub: 0.6 },
          })
          .fromTo(q("[data-essence-label]"), { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, ease: "power2.out", duration: 0.5 }, 0)
          .fromTo(
            q("[data-essence-line]"),
            { yPercent: 110 },
            { yPercent: 0, ease: "power3.out", stagger: 0.18, duration: 0.7 },
            0.1,
          );

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: "+=600%",
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });

        // 1. The small image grows to fill the screen.
        tl.fromTo(
          grow,
          { left: () => from().left, top: () => from().top, width: () => from().width, height: () => from().height },
          { left: 0, top: 0, width: () => pin.clientWidth, height: () => pin.clientHeight, ease: "power2.inOut", duration: 1 },
        )
          .to(q("[data-caption]"), { yPercent: 0, ease: "power2.out", duration: 0.35 }, 0.75)
          .to(q("[data-dots]"), { autoAlpha: 1, duration: 0.2 }, 0.8);

        // 2. Slide panel by panel, resting on each image before moving on.
        //    Timeline: grow 0–1 · hold 1–1.8 · slide 1.8–3 · hold 3–3.8 · slide 3.8–5 · hold 5–5.8
        const HOLD = 0.8;
        const SLIDE = 1.2;
        const captionX = [0.37, 0.16, -0.05]; // caption drift (share of viewport width) per panel
        gsap.set(q("[data-caption-line]"), { x: () => window.innerWidth * captionX[0] });

        [1, 2].forEach((i) => {
          const start = 1 + HOLD + (i - 1) * (SLIDE + HOLD);
          tl.to(q("[data-track]"), { xPercent: -100 * i, ease: "power2.inOut", duration: SLIDE }, start)
            .to(
              q("[data-caption-line]"),
              { x: () => window.innerWidth * captionX[i], ease: "power2.inOut", duration: SLIDE },
              start,
            )
            // Hand the highlight over halfway through the slide: the old phrase dims,
            // the new one lifts into place and brightens.
            .to(phrases[i - 1], { opacity: 0.42, y: 0, ease: "power1.out", duration: 0.35 }, start + SLIDE * 0.35)
            .fromTo(
              phrases[i],
              { opacity: 0.42, y: "0.18em" },
              { opacity: 1, y: 0, ease: "power2.out", duration: 0.45 },
              start + SLIDE * 0.4,
            )
            .to(dots[i - 1], { opacity: 0.4, duration: 0.3 }, start + SLIDE * 0.4)
            .to(dots[i], { opacity: 1, duration: 0.3 }, start + SLIDE * 0.4);
        });
        tl.to({}, { duration: HOLD }); // rest on the last image before the section scrolls on
      });

      // Reduced motion: no pin; images stack as full-width figures.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        root.current?.setAttribute("data-static", "true");
        return () => root.current?.removeAttribute("data-static");
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="process" aria-labelledby="essence-title" className="group/essence relative bg-ivory">
      <div
        data-essence-pin
        className="relative h-screen min-h-[560px] overflow-hidden group-data-[static=true]/essence:h-auto group-data-[static=true]/essence:overflow-visible"
      >
        {/* Heading */}
        <div className="flex h-full flex-col items-center justify-start px-4 pt-[11vh] text-center md:justify-center md:pb-[6vh] md:pt-0 group-data-[static=true]/essence:h-auto group-data-[static=true]/essence:py-24">
          <p
            data-essence-label
            className="mb-[18px] mt-0 font-serif text-[12px] uppercase tracking-[0.02em] text-ink [&_em]:normal-case"
          >
            <em>the</em> Essence <em>of</em> VELA
          </p>
          <h2
            id="essence-title"
            className="m-0 font-serif text-[clamp(34px,4.37vw,104px)] font-medium uppercase leading-[1.08] [&_em]:normal-case"
          >
            <span className="block overflow-hidden pb-[0.06em]">
              <span data-essence-line className="inline-block">
                <em>where</em> innovation
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.06em]">
              <span data-essence-line className="inline-block">
                <em>meets</em> craftsmanship
              </span>
            </span>
          </h2>
          {/* Where the first image starts before it grows */}
          <div data-essence-slot aria-hidden="true" className="mt-3 h-[clamp(96px,10vw,150px)] w-[clamp(104px,10.6vw,160px)] group-data-[static=true]/essence:hidden" />
        </div>

        {/* Sliding track: panel 1 grows from the slot, panels 2 and 3 wait off to the right */}
        <div
          data-track
          className="pointer-events-none absolute inset-0 group-data-[static=true]/essence:pointer-events-auto group-data-[static=true]/essence:relative group-data-[static=true]/essence:flex group-data-[static=true]/essence:flex-col group-data-[static=true]/essence:gap-4"
        >
          <figure
            data-essence-grow
            className="absolute m-0 overflow-hidden group-data-[static=true]/essence:relative group-data-[static=true]/essence:aspect-[16/10] group-data-[static=true]/essence:w-full"
          >
            <Image src={PANELS[0].src} alt={PANELS[0].alt} fill sizes="100vw" unoptimized className="object-cover" />
          </figure>
          {PANELS.slice(1).map((panel, i) => (
            <figure
              key={panel.src}
              className="absolute top-0 m-0 h-full w-full overflow-hidden group-data-[static=true]/essence:relative group-data-[static=true]/essence:left-0 group-data-[static=true]/essence:aspect-[16/10]"
              style={{ left: `${(i + 1) * 100}%` }}
            >
              <Image src={panel.src} alt={panel.alt} fill sizes="100vw" unoptimized className="object-cover" />
            </figure>
          ))}
        </div>

        {/* Progress dots */}
        <div
          data-dots
          aria-hidden="true"
          className="invisible absolute left-[42px] top-[56%] flex flex-col gap-[9px] opacity-0 group-data-[static=true]/essence:hidden"
        >
          {PANELS.map((p) => (
            <span key={p.src} data-dot className="block size-[5px] rounded-full bg-paper" />
          ))}
        </div>

        {/* Caption */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[34px] overflow-hidden pb-[0.12em] group-data-[static=true]/essence:hidden">
          <p data-caption className="m-0">
            <span
              data-caption-line
              className="inline-block whitespace-nowrap font-serif text-[clamp(28px,4.4vw,84px)] font-normal uppercase leading-none text-paper [&_em]:normal-case"
            >
              {PHRASES.map((phrase, i) => (
                <Fragment key={i}>
                  <span data-phrase className="inline-block">
                    <em>{phrase.lead}</em> {phrase.word}
                  </span>
                  {i < PHRASES.length - 1 ? " " : ""}
                </Fragment>
              ))}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
