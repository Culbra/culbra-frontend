import HeroCarousel from "@/components/HeroCarousel";
import PatternRevealSection from "@/components/PatternRevealSection";

export default function Home() {
  return (
    <main id="top" className="flex flex-1 flex-col">
      <HeroCarousel />

      {/* Placeholder — replace with real content. Marks where the page
          unlocks and scrolls to once "Explore Culbra" is clicked. */}
      <PatternRevealSection />
    </main>
  );
}
