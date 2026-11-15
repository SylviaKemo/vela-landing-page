import { CtaButton } from "@/components/ui/Button";
import { Placeholder } from "@/components/ui/Placeholder";
import { BodyText, Caption, Container, DisplayHeading, Eyebrow } from "@/components/ui/Typography";

const specs = [
  { value: "15 in", label: "Approx. height" },
  { value: "5–10 lb", label: "Weight" },
  { value: "Resin", label: "Ceramic-based" },
];

export function Manifesto() {
  return (
    <section className="py-24 text-center md:py-[140px]">
      <Container>
        <DisplayHeading>
          Your most <em>important</em> dress
          <br />
          deserves to last <em>forever.</em>
        </DisplayHeading>
        <Placeholder
          className="mx-auto mt-20 h-[440px] w-full max-w-[360px]"
          label="Image · Bust form: matte white resin bodice, studio light, 4:5 portrait."
        />
      </Container>
    </section>
  );
}

export function Intro() {
  return (
    <section className="pb-24 pt-10 text-center md:pb-[140px]">
      <Container className="max-w-[780px]">
        <h3 className="m-0 font-sans text-[clamp(28px,3.4vw,44px)] font-semibold leading-[1.15] tracking-[-0.01em]">
          Vero is a luxury fine-art studio that transforms your wedding dress into a timeless sculpture.
        </h3>
        <BodyText className="mx-auto mb-0 mt-8 max-w-[640px]">
          Each Vero sculpture stands approximately 15 inches tall and weighs 5–10 pounds. Our sculptures are made of
          ceramic-based resin and are crafted with exceptional precision and detail, exactly as it was worn on your
          wedding day.
        </BodyText>
        <dl className="mt-14 flex flex-wrap justify-center gap-x-16 gap-y-8">
          {specs.map((spec) => (
            <div key={spec.label} className="flex flex-col-reverse">
              <dt>
                <Caption className="mb-0 mt-1.5 text-stone">{spec.label}</Caption>
              </dt>
              <dd className="m-0 font-serif text-[44px]">{spec.value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-14">
          <CtaButton href="#commission" lead="Start your" label="Commission" />
        </div>
      </Container>
    </section>
  );
}

export function Essence() {
  return (
    <section className="pb-24 pt-10 text-center md:pb-[140px]">
      <Eyebrow>the essence of VERO</Eyebrow>
      <DisplayHeading>
        <em>where</em> innovation
        <br />
        <em>meets</em> craftsmanship
      </DisplayHeading>
      <Placeholder
        tone="sand"
        className="mx-auto mt-16 h-[180px] w-[160px]"
        label="Image · Detail: gown skirt on plinth, terracotta backdrop."
      />
    </section>
  );
}
