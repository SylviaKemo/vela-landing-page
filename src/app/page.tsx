import { SmoothScroll } from "@/components/SmoothScroll";
import { IntroProvider } from "@/components/intro/IntroContext";
import { Preloader } from "@/components/intro/Preloader";
import { Header } from "@/components/sections/Header";
import { DressStory } from "@/components/sections/DressStory";
import { Hero } from "@/components/sections/Hero";
import { HeroTitle } from "@/components/sections/HeroTitle";
import { Essence } from "@/components/sections/Essence";
import { ProcessStory } from "@/components/sections/Process";
import {
  ClosingCta,
  Footer,
  Gallery,
  Masterpiece,
  MedallionQuote,
} from "@/components/sections/Closing";

export default function Home() {
  return (
    <IntroProvider>
      <SmoothScroll />
      <div className="relative">
        <Preloader />
        <Header />
        <HeroTitle />
        <main>
          <Hero />
          <DressStory />
          <Essence />
          <ProcessStory />
          <Masterpiece />
          <Gallery />
          <MedallionQuote />
          <ClosingCta />
        </main>
        <Footer />
      </div>
    </IntroProvider>
  );
}
