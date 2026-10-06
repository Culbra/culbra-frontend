"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-black/80 backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <nav className="flex w-full items-center justify-between px-6 py-6 lg:px-16">
        <Logo />

        <a
          href="#after-hero"
          className="rounded-full bg-culbra-green px-4 py-1.5 text-xs font-bold tracking-wide text-black uppercase transition-opacity hover:opacity-90 sm:px-6 sm:py-3 sm:text-base lg:mr-8 xl:mr-64"
        >
          Register
        </a>
      </nav>
    </header>
  );
}
