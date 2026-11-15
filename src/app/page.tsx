import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { Essence, Intro, Manifesto } from "@/components/sections/Intro";
import { ProcessGrid, Stages, WornOnce } from "@/components/sections/Process";
import {
  ClosingCta,
  Footer,
  FounderQuote,
  Gallery,
  Masterpiece,
  MedallionQuote,
} from "@/components/sections/Closing";

export default function Home() {
  return (
    <div className="relative">
      <Header />
      <main>
        <Hero />
        <Manifesto />
        <Intro />
        <Essence />
        <Stages />
        <ProcessGrid />
        <WornOnce />
        <FounderQuote />
        <Masterpiece />
        <Gallery />
        <MedallionQuote />
        <ClosingCta />
      </main>
      <Footer />
    </div>
  );
}
