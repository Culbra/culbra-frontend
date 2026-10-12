"use client";

import Image from "next/image";
import { smoothScrollTo } from "@/lib/smoothScroll";

export default function Logo() {
  return (
    <a
      href="#top"
      aria-label="Culbra home"
      onClick={(e) => {
        // Glide back to the hero instead of the browser's instant jump.
        e.preventDefault();
        smoothScrollTo(0, 2000);
      }}
    >
      <Image
        src="/images/logo-v2.png"
        alt="Culbra"
        width={1054}
        height={268}
        priority
        className="h-6 w-auto sm:h-11"
      />
    </a>
  );
}
