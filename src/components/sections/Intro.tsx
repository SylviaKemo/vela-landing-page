import { Placeholder } from "@/components/ui/Placeholder";

/**
 * "The essence of VERO". Type sizes and gaps measured from the reference
 * (1898px-wide window): ~12px label, ~83px (4.37vw) heading on 90px lines.
 */
export function Essence() {
  return (
    <section className="px-4 pb-24 pt-[134px] text-center md:pb-[140px]">
      <p className="mb-[18px] mt-0 font-serif text-[12px] uppercase tracking-[0.02em] text-ink [&_em]:normal-case">
        <em>the</em> Essence <em>of</em> VERO
      </p>
      <h2 className="m-0 font-serif text-[clamp(34px,4.37vw,104px)] font-medium uppercase leading-[1.08] [&_em]:normal-case">
        <em>where</em> innovation
        <br />
        <em>meets</em> craftsmanship
      </h2>
      <Placeholder
        tone="sand"
        className="mx-auto mt-16 h-[180px] w-[160px]"
        label="Image · Detail: gown skirt on plinth, terracotta backdrop."
      />
    </section>
  );
}
