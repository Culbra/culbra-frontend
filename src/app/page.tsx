import HeroCarousel from "@/components/HeroCarousel";
import StatsStrip from "@/components/StatsStrip";
import AboutSection from "@/components/AboutSection";
import ExpectSection from "@/components/ExpectSection";
import JourneySection from "@/components/JourneySection";
import EnterArenaBanner from "@/components/EnterArenaBanner";
import PrizeSection from "@/components/PrizeSection";
import CallForEntriesSection from "@/components/CallForEntriesSection";
import FaqSection from "@/components/FaqSection";
import PartnersBanner from "@/components/PartnersBanner";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <main id="top" className="flex flex-1 flex-col">
        <HeroCarousel />
        <StatsStrip />
        <AboutSection />
        <ExpectSection />
        <JourneySection />
        <EnterArenaBanner />
        <PrizeSection />
        <CallForEntriesSection />
        <PartnersBanner />
        <FaqSection />
      </main>
      <Footer />
    </>
  );
}
