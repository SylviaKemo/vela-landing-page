import Link from "next/link";
import type { ReactNode, Ref } from "react";
import { Dot, RollText } from "./RollText";

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
  /** Renders a link when set, otherwise a <button>. */
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  /** "frosted" sits over the hero video; "solid" is the paper button used inside the menu. */
  variant?: "frosted" | "solid";
  className?: string;
  "aria-label"?: string;
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
  ref?: Ref<HTMLButtonElement>;
  /** Prefix the rolled-in copy with a bullet (off when the label already has one, e.g. "• CLOSE"). */
  hoverDot?: boolean;
};

const navVariants = {
  frosted: "bg-white/20 text-paper backdrop-blur-sm hover:bg-white/30",
  solid: "bg-paper text-ink shadow-soft hover:bg-white",
};

/**
 * Header button: small uppercase serif label that rolls to "• LABEL" on hover.
 * Italic <em> runs inside the label stay lower-case.
 */
export function NavButton({ href, onClick, children, variant = "frosted", className = "", ref, hoverDot = true, ...rest }: NavButtonProps) {
  const classes = `group inline-flex min-h-11 cursor-pointer items-center justify-center border-0 px-5 font-serif text-[13px] uppercase leading-none tracking-[0.06em] no-underline transition-colors duration-300 sm:px-8 [&_em]:mr-1 [&_em]:normal-case [&_em]:tracking-normal ${navVariants[variant]} ${className}`;
  const label = (
    <RollText
      hover={
        <span className="inline-flex items-center">
          {hoverDot && <Dot />}
          {children}
        </span>
      }
    >
      <span className="inline-flex items-center">{children}</span>
    </RollText>
  );

  if (href) {
    return (
      <Link href={href} {...rest} className={classes}>
        {label}
      </Link>
    );
  }
  return (
    <button ref={ref} type="button" onClick={onClick} {...rest} className={classes}>
      {label}
    </button>
  );
}
