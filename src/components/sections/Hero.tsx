import { Placeholder } from "@/components/ui/Placeholder";

export function Hero() {
  return (
    <section id="top" className="relative h-screen min-h-[640px]">
      <Placeholder
        tone="warm"
        className="absolute inset-0"
        label="Image · Hero: bride-length gown in motion against a warm amber backdrop. Full-bleed, 16:9 or muted video loop."
      />
      <div className="absolute inset-0 box-border flex flex-col items-center justify-end pb-[14vh] text-center text-paper">
        <h1 className="m-0 font-serif text-[clamp(72px,11vw,150px)] font-normal leading-none tracking-[0.06em]">
          VERO
        </h1>
        <p className="mb-0 mt-3.5 px-4 font-serif text-2xl">
          <em>Custom</em> SCULPTURE <em>of your</em> WEDDING DRESS.
        </p>
      </div>
    </section>
  );
}
