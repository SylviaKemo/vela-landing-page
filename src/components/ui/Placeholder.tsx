import type { CSSProperties } from "react";

export type PlaceholderTone = "light" | "warm" | "dark" | "sand";

const toneClasses: Record<PlaceholderTone, string> = {
  light: "bg-ph-light border-ph-light-border text-ph-light-text",
  warm: "bg-ph-warm border-ph-warm-border text-ph-warm-text",
  dark: "bg-ph-dark border-ph-dark-border text-ph-dark-text",
  sand: "bg-ph-sand border-ph-sand-border text-ph-light-text",
};

type PlaceholderProps = {
  label: string;
  tone?: PlaceholderTone;
  className?: string;
  style?: CSSProperties;
};

/** Labelled stand-in for imagery until real photography is supplied. */
export function Placeholder({ label, tone = "light", className = "", style }: PlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={label}
      style={style}
      className={`box-border flex items-center justify-center overflow-hidden border border-dashed text-center ${toneClasses[tone]} ${className}`}
    >
      <span className="max-w-[82%] p-4 font-sans text-xs font-semibold uppercase leading-normal tracking-[0.08em]">
        {label}
      </span>
    </div>
  );
}
