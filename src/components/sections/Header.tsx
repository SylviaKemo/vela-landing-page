import Link from "next/link";
import { NavButton } from "@/components/ui/Button";

/** Transparent header that overlays the hero. */
export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-10 box-border flex items-center justify-between gap-3 px-4 py-5 sm:px-10 sm:py-7">
      <NavButton href="#menu" aria-label="Open menu">
        Menu
      </NavButton>
      <Link href="#top" className="font-serif text-[28px] tracking-[0.05em] text-inherit no-underline sm:text-[38px]">
        VERO
      </Link>
      <NavButton href="#commission">
        <em>Start your</em> Commission
      </NavButton>
    </header>
  );
}
