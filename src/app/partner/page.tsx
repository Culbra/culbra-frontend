import type { Metadata } from "next";
import PartnerForm from "@/components/PartnerForm";
import ComingSoon from "@/components/ComingSoon";
import Footer from "@/components/Footer";
import { PARTNERSHIPS_OPEN } from "@/lib/launch";

export const metadata: Metadata = {
  title: "Become a Partner",
  description:
    "Partner with CULBRA as a sponsor, technology, media or logistics partner and reach 300,000 participants.",
};

export default function PartnerPage() {
  return (
    <>
      {PARTNERSHIPS_OPEN ? (
        <PartnerForm />
      ) : (
        <ComingSoon
          eyebrow="Partnerships open soon"
          title="Partner"
          accent="With Culbra"
          body="When the clock hits zero, technology, media, logistics companies and other companies can tell us how they’d like to work with CULBRA through sponsorship or partnership and reach 300,000 young Nigerians."
        />
      )}
      <Footer />
    </>
  );
}
