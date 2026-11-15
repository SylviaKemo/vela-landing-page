"use client";

import { useIntro } from "./IntroContext";

/**
 * Full-screen ivory loader. The hero video (rendered by <Hero>, stacked above
 * this layer) is clipped to the empty slot between the headline lines.
 */
export function Preloader() {
  const { stage, progress, slotRef } = useIntro();
  if (stage === "done") return null;

  const headlineOpacity = stage === "blank" ? 0 : stage === "faint" ? 0.12 : 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ivory text-ink" aria-live="polite">
      <h2
        className="m-0 text-center font-serif text-[clamp(48px,7vw,104px)] font-medium uppercase leading-[0.95] tracking-[0.005em] transition-opacity ease-out [&_em]:normal-case"
        style={{ opacity: headlineOpacity, transitionDuration: stage === "faint" ? "900ms" : "450ms" }}
      >
        <span className="block">Where</span>
        <span className="block">
          <em>your</em> Wedding
        </span>
        <span
          ref={slotRef}
          aria-hidden="true"
          className="mx-auto my-[0.12em] block aspect-[2.23/1] w-[clamp(120px,15.7vw,232px)]"
        />
        <span className="block">Dress</span>
        <span className="block">
          Becomes <em>art.</em>
        </span>
      </h2>

      {/* Progress */}
      <div className="absolute inset-x-8 bottom-3.5" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} aria-label="Loading">
        <div className="relative h-px bg-line">
          <div className="absolute inset-y-0 left-0 h-[1.5px] bg-ink/75" style={{ width: `${progress}%` }} />
          <span
            className="absolute bottom-2.5 -translate-x-full whitespace-nowrap font-serif text-[13px] text-stone transition-opacity duration-300"
            style={{ left: `${progress}%`, opacity: progress > 0 ? 1 : 0 }}
          >
            {progress}%
          </span>
        </div>
      </div>
    </div>
  );
}
