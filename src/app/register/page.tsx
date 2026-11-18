import type { Metadata } from "next";
import RegisterForm from "@/components/RegisterForm";
import ComingSoon from "@/components/ComingSoon";
import Footer from "@/components/Footer";
import { REGISTRATION_OPEN } from "@/lib/launch";

export const metadata: Metadata = {
  title: "Register — Culbra",
  description: "Register to take part in CULBRA.",
};

export default function RegisterPage() {
  return (
    <>
      {REGISTRATION_OPEN ? (
        <RegisterForm />
      ) : (
        <ComingSoon
          eyebrow="Registration opens soon"
          title="Registration"
          accent="To Be Announced"
          body="We’re putting the final touches on registration. The opening date will be announced soon. Follow CULBRA on our socials so you’re first to know when you can sign up to compete across Culture, Brains, Creativity and Impact."
          countdown={false}
        />
      )}
      <Footer />
    </>
  );
}
