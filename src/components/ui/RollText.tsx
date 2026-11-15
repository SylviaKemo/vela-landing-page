import type { ReactNode } from "react";

type RollTextProps = {
  children: ReactNode;
  /** What rolls in from below on hover; defaults to the same content. */
  hover?: ReactNode;
  className?: string;
};

/**
 * Vertical text roll: on hover/focus of the nearest `.group` ancestor the label
 * slides up and out while a copy slides in from below.
 */
export function RollText({ children, hover, className = "" }: RollTextProps) {
  const ease = "transition-transform duration-[450ms] ease-[cubic-bezier(0.7,0,0.2,1)]";
  return (
    <span className={`relative inline-flex overflow-hidden ${className}`}>
      <span className={`block ${ease} group-hover:-translate-y-full group-focus-visible:-translate-y-full`}>
        {children}
      </span>
      <span
        aria-hidden="true"
        className={`absolute inset-0 block translate-y-full ${ease} group-hover:translate-y-0 group-focus-visible:translate-y-0`}
      >
        {hover ?? children}
      </span>
    </span>
  );
}

/** Small round bullet used in front of rolled nav labels. */
export function Dot() {
  return <span aria-hidden="true" className="mr-1.5 inline-block size-[3px] shrink-0 self-center rounded-full bg-current" />;
}
