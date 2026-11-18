"use client";

import { useEffect, useRef, useState } from "react";

const STATS = [
  { target: 36, suffix: "", label: "States" },
  { target: 774, suffix: "", label: "Local Governments" },
  { target: 205, suffix: "+", label: "Ethnic/Cultural Groups" },
  { target: 100000, suffix: "+", label: "Brains" },
];

const COUNT_DURATION_MS = 2000;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

function CountUp({
  target,
  suffix,
  start,
}: {
  target: number;
  suffix: string;
  start: boolean;
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(id);
    }

    let frame = 0;
    const startTime = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / COUNT_DURATION_MS, 1);
      setValue(Math.round(target * easeOutCubic(progress)));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [start, target]);

  return (
    <span className="tabular-nums">
      {value.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}

export default function StatsStrip() {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  // Start counting the first time the strip scrolls into view.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      // Wait until the strip is (almost) fully on screen, i.e. once the
      // Explore Culbra scroll has arrived — otherwise the count runs during
      // the scroll and is mostly over by the time you see it.
      { threshold: 0.9 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id="after-hero"
      className="overflow-hidden bg-[#fc8a0d] py-4 text-black sm:px-6 sm:py-5 lg:px-16"
    >
      {/* On phones the stats run in one horizontal line that loops forever:
          the list is rendered twice and the track slides left by exactly one
          copy. From `sm` up there's room for a static row, so the second
          copy is hidden and the animation is off. */}
      <ul className="animate-marquee flex w-max items-start motion-reduce:animate-none sm:w-full sm:animate-none sm:justify-between">
        {[...STATS, ...STATS].map(({ target, suffix, label }, i) => {
          const isCopy = i >= STATS.length;
          return (
            <li
              key={`${label}-${i}`}
              aria-hidden={isCopy || undefined}
              className={`flex shrink-0 flex-col items-center px-6 text-center sm:px-0 ${isCopy ? "sm:hidden" : ""
                }`}
            >
              <span className="text-2xl font-extrabold leading-none sm:text-4xl">
                <CountUp target={target} suffix={suffix} start={inView} />
              </span>
              <span className="whitespace-nowrap text-xs font-normal uppercase leading-none tracking-wide sm:text-base">
                {label}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
