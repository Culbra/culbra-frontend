import HeroCarousel from "@/components/HeroCarousel";
import PatternRevealSection from "@/components/PatternRevealSection";

export default function Home() {
  return (
    <main id="top" className="flex flex-1 flex-col">
      <HeroCarousel />
      <PatternRevealSection />
    </main>
  );
}
