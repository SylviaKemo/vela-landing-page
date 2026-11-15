import Link from "next/link";
import type { ReactNode } from "react";

type CtaButtonProps = {
  href: string;
  /** Italic serif lead-in, e.g. "Start your" */
  lead: ReactNode;
  /** Uppercase sans label, e.g. "Commission" */
  label: ReactNode;
  className?: string;
};

/** Paper-coloured call-to-action: italic serif lead + small-caps label. */
export function CtaButton({ href, lead, label, className = "" }: CtaButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-block bg-paper px-10 py-[18px] font-serif text-base leading-none text-ink no-underline shadow-soft transition-colors hover:bg-white ${className}`}
    >
      <em>{lead}</em>
      <b className="ml-1.5 font-sans text-xs font-medium uppercase tracking-[0.1em]">{label}</b>
    </Link>
  );
}

type NavButtonProps = {
  href: string;
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
};

/** Header pill: small uppercase sans, optional italic serif <em> inside. */
export function NavButton({ href, children, className = "", ...rest }: NavButtonProps) {
  return (
    <Link
      href={href}
      {...rest}
      className={`inline-block bg-paper px-5 py-4 font-sans text-xs font-medium uppercase leading-none tracking-[0.1em] text-ink no-underline shadow-soft transition-colors hover:bg-white sm:px-9 sm:py-[22px] [&_em]:font-serif [&_em]:text-[15px] [&_em]:normal-case [&_em]:tracking-normal ${className}`}
    >
      {children}
    </Link>
  );
}
