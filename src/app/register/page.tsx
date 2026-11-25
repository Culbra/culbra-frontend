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
          title="Registration opens on"
          accent="the 5th of December, 2026"
          body="Be amongst the first to get into the Arena"
          registerButton
        />
      )}
      <Footer />
    </>
  );
}
