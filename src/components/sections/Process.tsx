import { CtaButton } from "@/components/ui/Button";
import { Placeholder } from "@/components/ui/Placeholder";
import { BodyText, Container, DisplayHeading, Eyebrow } from "@/components/ui/Typography";

export function ProcessGrid() {
  return (
    <section className="py-24 md:py-[140px]">
      <Container>
        <div className="text-center">
          <Eyebrow>a process built for perfection</Eyebrow>
          <DisplayHeading>
            <em>so</em> that you
            <br />
            become art.
          </DisplayHeading>
        </div>
        <div className="mt-20 grid grid-cols-1 items-start gap-5 md:grid-cols-[1.1fr_1fr_1fr]">
          <Placeholder
            tone="dark"
            className="h-[620px]"
            label="Image · Close detail: lace-embossed bodice in sculpted resin, raking light, 3:4."
          />
          <Placeholder
            tone="warm"
            className="h-[560px]"
            label="Image · Back view: lace bodice with sculpted bow beside its miniature."
          />
          <Placeholder tone="dark" className="h-[560px]" label="Image · Close detail: draped fabric and bow, 3:4." />
        </div>
      </Container>
    </section>
  );
}

export function WornOnce() {
  return (
    <section className="pb-24 pt-10 md:pb-[140px]">
      <Container className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-20">
        <Placeholder tone="dark" className="h-[480px] md:h-[640px]" label="Image · Sculpture close-up, 4:5, process story." />
        <div>
          <h3 className="m-0 font-sans text-[34px] font-semibold leading-[1.1] md:text-[44px]">
            Worn once. Never meant to disappear.
          </h3>
          <p className="mb-0 mt-8 font-serif text-[22px] italic leading-[1.6]">
            You wear your gown once, then it&apos;s tucked away for years. It deserves to be appreciated forever.
          </p>
          <BodyText className="mb-0 mt-5">
            Vero transforms your dress into a lasting sculpture, created through a balance of advanced technology and
            hand craftsmanship so that we can preserve every detail. Every commission begins with a private
            consultation. Together, we&apos;ll discuss your commission, coordinate the collection of your gown, and
            personally guide you through every step of the Vero experience.
          </BodyText>
          <div className="mt-10 flex items-end gap-8">
            <CtaButton href="#process" lead="Discover" label="our process" />
            <Placeholder tone="sand" className="h-32 w-24 shrink-0" label="Thumb" />
          </div>
        </div>
      </Container>
    </section>
  );
}
