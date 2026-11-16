"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Image from "next/image";
import { useRef } from "react";
import { NavButton } from "@/components/ui/Button";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

type Img = { src: string; alt: string };

const IMG = {
  bodice: { src: "/images/a.avif", alt: "Close-up of a sculpted resin bodice with embossed lace and cap sleeves" },
  back: { src: "/images/b.avif", alt: "Bride seen from behind in a lace gown with a bow, beside her miniature sculpture" },
  drape: { src: "/images/c.avif", alt: "Close-up of draped fabric gathered at the hip of a white sculpture" },
  plinth: { src: "/images/d.avif", alt: "White gown sculpture with a large bow standing on a dark plinth" },
  bride: { src: "/images/e.avif", alt: "Bride in a full white gown standing on a plinth against a warm amber backdrop" },
  strapless: { src: "/images/f.avif", alt: "Strapless gown sculpture with a lace bodice, shown at an angle" },
} satisfies Record<string, Img>;

/** One quarter-width image tile (8:11, as in the reference). */
function Tile({ img, lag = 0 }: { img: Img; lag?: number }) {
  return (
    <figure data-clip data-clip-lag={lag} className="relative m-0 aspect-[8/11] overflow-hidden">
      <Image
        src={img.src}
        alt={img.alt}
        fill
        sizes="(min-width: 768px) 25vw, 50vw"
        unoptimized
        data-clip-img
        className="object-cover"
      />
    </figure>
  );
}

/**
 * "A process built for perfection / so that you become art."
 * A four-column grid: the bodice close-up spans two columns and stays pinned
 * (sticky) on the left while the right half scrolls past image pairs, the
 * "Worn once" story, a process link and the founder's quote. Sizes measured
 * from the reference at a 1376px-wide window.
 */
export function ProcessStory() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Heading lines rise out of their masks.
        gsap.fromTo(
          q("[data-process-line]"),
          { yPercent: 105 },
          {
            yPercent: 0,
            ease: "power3.out",
            stagger: 0.2,
            scrollTrigger: { trigger: q("[data-process-heading]")[0], start: "top 85%", end: "top 40%", scrub: 0.6 },
          },
        );
        // Text: each line rises out of its own mask, one after another, as the block scrolls in.
        q("[data-split]").forEach((el) => {
          SplitText.create(el, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 110,
                ease: "power3.out",
                stagger: 0.12,
                scrollTrigger: { trigger: el, start: "top 88%", end: "bottom 62%", scrub: 0.6 },
              }),
          });
        });

        // Images: open out from a smaller box to fill their slot while the photo settles from a slight zoom.
        // The second image of a pair (lag) starts a beat later.
        q("[data-clip]").forEach((el) => {
          const lag = Number(el.getAttribute("data-clip-lag") ?? 0);
          const st = { trigger: el, start: `top ${96 - lag}%`, end: `top ${58 - lag}%`, scrub: 0.6 };
          gsap.fromTo(
            el,
            { clipPath: "inset(14% 16% 0% 16%)" },
            { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.out", scrollTrigger: st },
          );
          gsap.fromTo(el.querySelector("[data-clip-img]"), { scale: 1.18 }, { scale: 1, ease: "power2.out", scrollTrigger: st });
        });

        // The process button eases up after its image.
        gsap.fromTo(
          q("[data-fade-up]"),
          { y: 24, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            ease: "power2.out",
            scrollTrigger: { trigger: q("[data-fade-up]")[0], start: "top 92%", end: "top 75%", scrub: 0.6 },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="worn-once" aria-labelledby="process-title" className="bg-ivory px-[29px] pb-[18vh] pt-24">
      {/* Heading */}
      <div data-process-heading className="text-center">
        <p className="mb-[18px] mt-0 font-serif text-[12px] uppercase tracking-[0.02em] [&_em]:normal-case">
          <em>a</em> Process built <em>for</em> perfection
        </p>
        <h2
          id="process-title"
          className="m-0 font-serif text-[clamp(40px,6.1vw,120px)] font-medium uppercase leading-[1.05] [&_em]:normal-case"
        >
          <span className="block overflow-hidden pb-[0.04em]">
            <span data-process-line className="inline-block">
              <em>so</em> that you
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.04em]">
            <span data-process-line className="inline-block">
              become art.
            </span>
          </span>
        </h2>
      </div>

      {/* Grid: sticky bodice on the left, scrolling story on the right */}
      <div className="mt-[70px] grid grid-cols-1 gap-2 md:grid-cols-4">
        <div className="md:col-span-2">
          <figure
            data-clip
            data-clip-lag={0}
            className="relative m-0 aspect-[4/5] overflow-hidden md:sticky md:top-[10px] md:aspect-auto md:h-[calc(100vh-60px)]"
          >
            <Image
              src={IMG.bodice.src}
              alt={IMG.bodice.alt}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              unoptimized
              data-clip-img
              className="object-cover"
            />
          </figure>
        </div>

        <div className="md:col-span-2">
          {/* Reveal order across the first row: bodice, then these two, each a beat later */}
          <div className="grid grid-cols-2 gap-2">
            <Tile img={IMG.back} lag={4} />
            <Tile img={IMG.drape} lag={8} />
          </div>

          <div className="mx-auto max-w-[440px] px-4 py-[22vh] text-center">
            <h3 data-split className="m-0 font-sans text-[21px] font-medium leading-[1.12] tracking-[-0.01em]">
              Worn once.
              <br />
              Never meant to disappear.
            </h3>
            <p data-split className="mb-0 mt-[22px] font-sans text-[14px] italic leading-[1.65] text-prose">
              You wear your gown once, then it&apos;s tucked away
              <br />
              for years. It deserves to be appreciated forever.
            </p>
            <p data-split className="mb-0 mt-[2px] font-sans text-[14px] font-normal leading-[1.65] text-prose">
              Vero transforms your dress into a lasting sculpture, created through a balance of advanced technology and
              hand craftsmanship so that we can preserve every detail. Every commission begins with a private
              consultation. Together, we&apos;ll discuss your commission, coordinate the collection of your gown, and
              personally guide you through every step of the Vero experience.
            </p>
          </div>

          <div className="flex flex-col items-center gap-6 pb-[22vh]">
            <figure data-clip data-clip-lag={0} className="relative m-0 aspect-[8/11] w-[clamp(96px,9.6vw,150px)] overflow-hidden">
              <Image
                src={IMG.plinth.src}
                alt={IMG.plinth.alt}
                fill
                sizes="150px"
                unoptimized
                data-clip-img
                className="object-cover"
              />
            </figure>
            <div data-fade-up>
              <NavButton href="#process" variant="solid" className="min-h-[45px] !px-[40px] !text-[12px]">
                <em>Discover</em> our process
              </NavButton>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Tile img={IMG.bride} />
            <Tile img={IMG.strapless} lag={6} />
          </div>

          <figure className="mx-auto my-0 max-w-[460px] px-4 pb-[16vh] pt-[24vh] text-center">
            <blockquote data-split className="m-0 font-serif text-[clamp(20px,1.6vw,26px)] italic leading-[1.3]">
              “Technology often pulls us away from what&apos;s real. Vero does the opposite — we use it to bring memory
              back to physical form.”
            </blockquote>
            <figcaption
              data-split
              className="mt-6 font-serif text-[12px] uppercase leading-[1.6] tracking-[0.02em] [&_em]:normal-case"
            >
              Madilyn Ontiveros Plumlee
              <br />
              <em>founder of</em> VERO
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
