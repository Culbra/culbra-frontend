"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";

const NAV_LINKS = ["Home", "About", "Programs", "Community", "Contact"];

export default function Navbar() {
  const [open, setOpen] = useState(false);
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

        <ul className="hidden items-center gap-6 md:flex md:gap-8 lg:mr-8 lg:gap-10 xl:mr-64">
          {NAV_LINKS.map((link) => (
            <li key={link}>
              <a
                href={link === "Home" ? "#top" : "#after-hero"}
                className="text-lg font-bold text-white/90 transition-colors hover:text-culbra-green"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="text-white md:hidden"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {open && (
        <ul className="flex flex-col items-center gap-6 bg-black px-6 pb-8 pt-2 md:hidden">
          {NAV_LINKS.map((link) => (
            <li key={link}>
              <a
                href={link === "Home" ? "#top" : "#after-hero"}
                onClick={() => setOpen(false)}
                className="text-lg font-bold text-white/90 transition-colors hover:text-culbra-green"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
