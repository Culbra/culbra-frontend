"use client";

import Link from "next/link";
import { smoothScrollTo } from "@/lib/smoothScroll";

// A link to a section ("/#faq") that glides there instead of jumping. If the
// section isn't on the current page (e.g. from /register), it navigates
// normally.
export default function ScrollLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const hash = href.split("#")[1];
    const target = hash ? document.getElementById(hash) : null;
    if (!target) return;

    e.preventDefault();
    // Stop short of the fixed navbar so it doesn't cover the section's top.
    const navHeight = document.querySelector("header")?.offsetHeight ?? 0;
    const targetY =
      target.getBoundingClientRect().top + window.scrollY - navHeight;
    // Longer trips take longer, within limits, so short hops don't drag.
    const duration = Math.min(
      2000,
      Math.max(700, Math.abs(targetY - window.scrollY) / 3),
    );
    smoothScrollTo(Math.max(0, targetY), duration);
  };

  return (
    <Link href={href} onClick={onClick} className={className}>
      {children}
    </Link>
  );
}
