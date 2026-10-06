"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";

export default function Navbar({ onNavigate }: { onNavigate?: () => void }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    if (!onNavigate) return;
    e.preventDefault();
    onNavigate();
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-black/80 backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <nav className="flex w-full items-center justify-between px-6 py-6 lg:px-16">
        <Logo />

        <div className="flex items-center gap-3 sm:gap-5 lg:mr-8 xl:mr-64">
          <a
            href="#after-hero"
            onClick={handleClick}
            className="text-[9px] font-bold tracking-wide text-white uppercase transition-colors hover:text-culbra-green sm:text-sm"
          >
            Partner with us
          </a>
          <a
            href="#after-hero"
            onClick={handleClick}
            className="rounded-full bg-culbra-green px-2.5 py-1 text-[9px] font-bold tracking-wide text-black uppercase transition-opacity hover:opacity-90 sm:px-5 sm:py-2 sm:text-sm"
          >
            Register
          </a>
        </div>
      </nav>
    </header>
  );
}
