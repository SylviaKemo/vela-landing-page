import { CtaButton } from "@/components/ui/Button";
import { Placeholder, type PlaceholderTone } from "@/components/ui/Placeholder";
import { Caption, Container, DisplayHeading, Eyebrow } from "@/components/ui/Typography";

export function FounderQuote() {
  return (
    <section className="py-24 text-center md:py-[120px]">
      <Container className="max-w-[820px]">
        <figure className="m-0">
          <blockquote className="m-0 font-serif text-[clamp(32px,3.6vw,48px)] italic leading-[1.25]">
            “Technology often pulls us away from what&apos;s real. Vero does the opposite — we use it to bring memory
            back to physical form.”
          </blockquote>
          <figcaption>
            <Caption className="mb-0 mt-9 leading-[1.8]">
              Madilyn Ontiveros Plumlee
              <br />
              <span className="font-serif text-base normal-case italic tracking-normal">founder of</span> VERO
            </Caption>
          </figcaption>
        </figure>
      </Container>
    </section>
  );
}

export function Masterpiece() {
  return (
    <section className="py-24 text-center md:py-[140px]">
      <Eyebrow>your memory</Eyebrow>
      <DisplayHeading>
        <em>will</em> forever
        <br />
        <em>be a</em> masterpiece.
      </DisplayHeading>
      <Placeholder
        tone="dark"
        className="mx-auto mt-[72px] aspect-video w-[min(420px,calc(100%-32px))]"
        label="Video · Optional loop: dress being sculpted, 16:9, muted autoplay with poster frame."
      />
    </section>
  );
}

const galleryTones: PlaceholderTone[] = ["warm", "light", "dark", "sand", "light", "dark", "warm", "light", "sand", "dark"];

export function Gallery() {
  return (
    <section id="gallery" className="pb-24 pt-20 md:pb-[140px]">
      <Container>
        <Eyebrow className="text-center">explore the gallery</Eyebrow>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {galleryTones.map((tone, i) => (
            <Placeholder
              key={i}
              tone={tone}
              className="aspect-[3/4]"
              label={`Gallery ${String(i + 1).padStart(2, "0")}`}
            />
          ))}
        </div>
        <div className="mt-12 text-center">
          <CtaButton href="#gallery" lead="Explore the" label="Gallery" />
        </div>
      </Container>
    </section>
  );
}

export function MedallionQuote() {
  return (
    <section className="px-5 py-24 text-center md:py-[120px]">
      <Placeholder
        className="mx-auto h-[220px] w-[220px] rounded-full"
        label="Image · Pewter medallion, VERO relief, rotating"
      />
      <figure className="m-0">
        <blockquote className="mx-auto mb-0 mt-16 max-w-[960px] font-serif text-[clamp(36px,4.6vw,64px)] italic leading-[1.1]">
          …a star, fragile as a flower, a tiny spark of one hour.
        </blockquote>
        <figcaption>
          <Caption className="mt-7">Carl Sandburg</Caption>
        </figcaption>
      </figure>
    </section>
  );
}

export function ClosingCta() {
  return (
    <section id="commission" className="border-t border-line px-5 pb-40 pt-[140px] text-center">
      <h2 className="m-0 font-sans text-[clamp(36px,4vw,56px)] font-semibold leading-[1.1]">
        Your story deserves to be sculpted.
      </h2>
      <p className="mb-12 mt-6 font-serif text-[22px]">We&apos;d be honored to craft it with you.</p>
      <CtaButton href="#commission" lead="Start your" label="Commission" />
    </section>
  );
}

export function Footer() {
  return (
    <footer className="box-border flex flex-col items-center justify-between gap-4 border-t border-line p-10 sm:flex-row">
      <span className="font-serif text-[26px] tracking-[0.05em]">VERO</span>
      <nav aria-label="Footer">
        <ul className="m-0 flex list-none gap-2 p-0 font-sans text-xs font-medium uppercase tracking-[0.1em]">
          {["Instagram", "Contact", "Privacy"].map((item, i) => (
            <li key={item}>
              {i > 0 && <span aria-hidden="true">· </span>}
              <a href="#" className="text-inherit no-underline hover:underline">
                {item}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </footer>
  );
}
