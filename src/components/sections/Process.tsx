import { CtaButton } from "@/components/ui/Button";
import { Placeholder, type PlaceholderTone } from "@/components/ui/Placeholder";
import { BodyText, Caption, Container, DisplayHeading, Eyebrow } from "@/components/ui/Typography";

const stages: { step: string; tone: PlaceholderTone; image: string; text: string }[] = [
  {
    step: "01 — Dress",
    tone: "warm",
    image: "Image · Stage 01: your gown as worn, on warm backdrop.",
    text: "Your gown is recorded as it was worn.",
  },
  {
    step: "02 — Data",
    tone: "dark",
    image: "Image · Stage 02: grey-scale 3D capture of the gown, wireframe or render.",
    text: "Every fold and surface is translated into a model.",
  },
  {
    step: "03 — Sculpture",
    tone: "sand",
    image: "Image · Stage 03: finished sculpture on plinth.",
    text: "Hand-finished into a lasting piece of art.",
  },
];

export function Stages() {
  return (
    <section id="process" className="bg-ink py-24 text-ivory md:py-[140px]">
      <Container>
        <Eyebrow className="text-mist">the process, in three stages</Eyebrow>
        <DisplayHeading compact>
          From dress, <em>to</em> data, <em>to</em> sculpture.
        </DisplayHeading>
        <ol className="m-0 mt-20 grid list-none grid-cols-1 gap-12 p-0 md:grid-cols-3 md:gap-6">
          {stages.map((stage) => (
            <li key={stage.step}>
              <Placeholder tone={stage.tone} className="h-[460px]" label={stage.image} />
              <Caption className="mt-6 text-mist">{stage.step}</Caption>
              <p className="m-0 font-serif text-[22px]">{stage.text}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

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
