import type { ReactNode } from "react";

type Props = { children: ReactNode; className?: string };

/** Small italic serif kicker above a display heading. */
export function Eyebrow({ children, className = "" }: Props) {
  return <p className={`mb-[18px] mt-0 font-serif text-base italic text-stone ${className}`}>{children}</p>;
}

/** Large uppercase serif display heading; <em> runs drop to italic lower-case. */
export function DisplayHeading({ children, className = "" }: Props) {
  return (
    <h2
      className={`m-0 font-serif text-[clamp(44px,6vw,88px)] font-normal uppercase leading-[1.02] tracking-[0.01em] [&_em]:normal-case ${className}`}
    >
      {children}
    </h2>
  );
}

/** Small uppercase sans caption. */
export function Caption({ children, className = "" }: Props) {
  return (
    <p className={`mb-2 mt-0 font-sans text-xs font-medium uppercase leading-[1.4] tracking-[0.1em] ${className}`}>
      {children}
    </p>
  );
}

/** Long-form serif body copy. */
export function BodyText({ children, className = "" }: Props) {
  return <p className={`font-serif text-xl leading-[1.7] text-prose ${className}`}>{children}</p>;
}

/** Centered max-width container. */
export function Container({ children, className = "" }: Props) {
  return <div className={`mx-auto box-border max-w-[1200px] px-5 sm:px-10 ${className}`}>{children}</div>;
}
