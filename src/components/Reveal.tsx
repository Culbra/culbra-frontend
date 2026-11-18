"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Fades and slides its children up into place as they scroll into view, and
// fades them back out when the user scrolls back up past them. `delay` (ms)
// staggers siblings.
export default function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        // `isIntersecting` stays true for any overlap at all, so judge by the
        // visible fraction instead to catch the element sliding out.
        if (entry.intersectionRatio >= 0.2) {
          setVisible(true);
        } else if (entry.boundingClientRect.top > 0) {
          // Left through the bottom edge (the user scrolled back up): fade
          // out so it can play again on the way down. Leaving through the
          // top (scrolling down) keeps it showing.
          setVisible(false);
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
      className={`transition-all duration-1000 ease-out motion-reduce:transition-none ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-10 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100"
      } ${className}`}
    >
      {children}
    </div>
  );
}
