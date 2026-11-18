"use client";

import { useEffect, useRef, useState } from "react";
import { Compass, MapPin, Swords, TrendingUp, UserPlus } from "lucide-react";
import Reveal from "./Reveal";

const STEPS = [
  {
    title: "DISCOVER",
    body: "Discover the world of CULBRA, explore what it stands for and step in.",
    Icon: Compass,
  },
  {
    title: "ENTER",
    body: "Register, receive your CULBRA Participant Kit and enter the Arena with your unique identity in the experience.",
    Icon: UserPlus,
  },
  {
    title: "COMPETE",
    body: "Take on weekly challenges and Wildcards. Think differently, create boldly and keep pushing forward.",
    Icon: Swords,
  },
  {
    title: "RISE",
    body: "Progress through the experience, get discovered, build your audience and move closer to the ultimate stage.",
    Icon: TrendingUp,
  },
  {
    title: "THE PHYSICAL STAGE",
    body: "The journey leaves the screen and steps into the real world, bringing finalists, audiences, entertainment and culture on one stage.",
    Icon: MapPin,
  },
];

const ACCENT = "#fc8a0d";

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export default function JourneySection() {
  const sectionRef = useRef<HTMLElement>(null);
  // 0 → 1, driven only by how far the pinned section has been scrolled.
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      setProgress(scrollable > 0 ? clamp01(-rect.top / scrollable) : 0);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Desktop slides smoothly between steps. On phones the scroll is split
  // into one slice per step: in the first half of a slice the step stays
  // fully open, in the second half the logo runs down the line to the next
  // step, which then opens at the start of the next slice.
  const active = Math.round(progress * (STEPS.length - 1));
  const slice = Math.min(STEPS.length - 1, Math.floor(progress * STEPS.length));
  const sliceFrac = progress * STEPS.length - slice;
  const travel =
    slice < STEPS.length - 1 ? clamp01((sliceFrac - 0.5) / 0.5) : 0;
  const mobileActive = slice;

  const listRef = useRef<HTMLOListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  // Vertical centre of each step's icon, measured from the list's top.
  const [tops, setTops] = useState<number[]>([]);

  // The rows grow and shrink as the open step changes, so re-measure
  // whenever the list resizes.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      const next = itemRefs.current.map((li) => (li ? li.offsetTop + 20 : 0));
      setTops((prev) =>
        prev.length === next.length && prev.every((v, i) => v === next[i])
          ? prev
          : next,
      );
    };
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  const fromTop = tops[slice] ?? 20;
  const toTop = tops[Math.min(slice + 1, STEPS.length - 1)] ?? fromTop;
  const markerTop = fromTop + (toTop - fromTop) * travel;
  const lastTop = tops[STEPS.length - 1] ?? 20;

  return (
    // The section is several screens tall and its content is pinned in the
    // middle, so the page is effectively locked here while the timeline
    // plays out, then releases once it reaches the last step.
    <section
      ref={sectionRef}
      id="journey"
      className="relative h-[450vh] bg-white text-black [--j-fg:0_0_0] md:h-[280vh] dark:bg-black dark:text-white dark:[--j-fg:255_255_255]"
    >
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden px-6 pt-16 pb-4 lg:px-16">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal className="text-left">
          <h2 className="text-3xl font-extrabold sm:text-5xl">THE JOURNEY</h2>
          <p className="mt-1 text-sm font-semibold sm:text-base">
            FROM THE FIRST STEP TO THE MAIN STAGE.
          </p>
        </Reveal>

        <div className="mt-6 sm:mt-12">
          {/* Desktop: horizontal timeline with the brain marker riding the line. */}
          <Reveal delay={150} className="hidden md:block">
            <div className="relative h-16">
              <div className="absolute inset-x-[10%] top-1/2 h-0.5 -translate-y-1/2 bg-black/10 dark:bg-white/15" />
              <div
                className="absolute left-[10%] top-1/2 h-0.5 -translate-y-1/2"
                style={{
                  width: `${progress * 80}%`,
                  backgroundColor: ACCENT,
                }}
              />
              <div
                className="absolute top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white dark:bg-black"
                style={{ left: `${10 + progress * 80}%` }}
                aria-hidden="true"
              >
                <div
                  className="h-11 w-11 bg-no-repeat invert hue-rotate-180 dark:invert-0 dark:hue-rotate-0"
                  style={{
                    backgroundImage: "url(/images/logo-v2.png)",
                    backgroundSize: "auto 100%",
                    backgroundPosition: "left center",
                  }}
                />
              </div>
            </div>

            <ol className="mt-4 grid grid-cols-5">
              {STEPS.map(({ title, body, Icon }, i) => {
                const on = i === active;
                return (
                  <li
                    key={title}
                    aria-current={on ? "step" : undefined}
                    className="flex flex-col items-center px-3 text-center"
                  >
                    <span
                      className="flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-500"
                      style={{
                        borderColor: on ? ACCENT : "rgb(var(--j-fg) / 0.2)",
                        color: on ? ACCENT : "rgb(var(--j-fg) / 0.4)",
                        boxShadow: on ? `0 0 0 6px ${ACCENT}22` : "none",
                      }}
                    >
                      <Icon size={20} />
                    </span>
                    <span
                      className="mt-3 text-2xl font-extrabold transition-colors duration-500"
                      style={{ color: on ? ACCENT : "rgb(var(--j-fg) / 0.3)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`mt-1 text-sm font-extrabold tracking-wide transition-colors duration-500 ${
                        on ? "text-black dark:text-white" : "text-black/35 dark:text-white/35"
                      }`}
                    >
                      {title}
                    </span>
                    <span
                      className={`mt-2 text-xs leading-relaxed transition-colors duration-500 ${
                        on ? "text-black/80 dark:text-white/80" : "text-black/35 dark:text-white/35"
                      }`}
                    >
                      {body}
                    </span>
                  </li>
                );
              })}
            </ol>
          </Reveal>

          {/* Phones: vertical timeline. The active step stays fully open
              (description and all) with the brain marker on its icon until
              its share of the scroll is used up. */}
          <Reveal delay={150} className="md:hidden">
            <div className="relative ml-5">
              <div
                className="absolute left-0 top-5 w-0.5 bg-black/10 dark:bg-white/15"
                style={{ height: Math.max(0, lastTop - 20) }}
              />
              <div
                className="absolute left-0 top-5 w-0.5 "
                style={{
                  height: Math.max(0, markerTop - 20),
                  backgroundColor: ACCENT,
                }}
              />
              <div
                className="absolute left-0 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 bg-white transition-[top] dark:bg-black duration-150 ease-linear"
                style={{
                  top: markerTop,
                  opacity: tops.length ? 1 : 0,
                  borderColor: ACCENT,
                  boxShadow: `0 0 0 5px ${ACCENT}22`,
                }}
                aria-hidden="true"
              >
                <div
                  className="h-6 w-6 bg-no-repeat invert hue-rotate-180 dark:invert-0 dark:hue-rotate-0"
                  style={{
                    backgroundImage: "url(/images/logo-v2.png)",
                    backgroundSize: "auto 100%",
                    backgroundPosition: "left center",
                  }}
                />
              </div>

              <ol ref={listRef} className="space-y-8">
                {STEPS.map(({ title, body, Icon }, i) => {
                  const on = i === mobileActive;
                  return (
                    <li
                      key={title}
                      ref={(el) => {
                        itemRefs.current[i] = el;
                      }}
                      aria-current={on ? "step" : undefined}
                      className="relative min-h-10 pl-9"
                    >
                      <span
                        className="absolute -left-5 top-0 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-white transition-all dark:bg-black duration-500"
                        style={{
                          borderColor: on ? ACCENT : "rgb(var(--j-fg) / 0.2)",
                          color: on ? ACCENT : "rgb(var(--j-fg) / 0.4)",
                        }}
                      >
                        <Icon size={18} />
                      </span>
                      <span
                        className="block text-lg font-extrabold leading-none transition-colors duration-500"
                        style={{ color: on ? ACCENT : "rgb(var(--j-fg) / 0.3)" }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`mt-1 block text-sm font-extrabold leading-none tracking-wide transition-colors duration-500 ${
                          on ? "text-black dark:text-white" : "text-black/35 dark:text-white/35"
                        }`}
                      >
                        {title}
                      </span>
                      <span
                        className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${
                          on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                        }`}
                      >
                        <span className="overflow-hidden">
                          <span className="mt-2 block text-sm leading-relaxed text-black/80 dark:text-white/80">
                            {body}
                          </span>
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
          </Reveal>
        </div>
      </div>
      </div>
    </section>
  );
}
