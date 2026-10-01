"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import FeatureRow, { type FeatureLabel } from "./FeatureRow";
import HeroSlide from "./HeroSlide";

const SLIDES: Array<{
  id: string;
  accent: FeatureLabel | "all";
  heading: React.ReactNode;
  body: React.ReactNode;
  tagline: React.ReactNode;
  imageSrc: string;
  imageAlt: string;
  imageObjectPosition?: string;
  imageFit?: "cover" | "contain";
  imageWrapperClassName?: string;
  imageMaxHeightClassName?: string;
  headingSizeClassName?: string;
  bodySizeClassName?: string;
  textColumnWidthClassName?: string;
  imageMobileHeightClassName?: string;
  imageScaleClassName?: string;
  showEdgeFade?: boolean;
  subline?: React.ReactNode;
  ctaLabel?: string;
  ctaHref?: string;
}> = [
  {
    id: "matters",
    accent: "Culture",
    heading: (
      <>
        Where you
        <br />
        come from
        <br />
        <span className="text-culbra-green">matters.</span>
      </>
    ),
    body: (
      <>
        Your culture shapes how you see the world.{" "}
        <span className="font-semibold text-white">CULBRA</span> gives you a
        stage to express it, explore it and make it part of the experience.
      </>
    ),
    tagline: <>Bring what makes you, you, with you.</>,
    imageSrc: "/images/hero-portrait-nobg.png",
    imageAlt:
      "Portrait of a woman wearing traditional African headwrap and jewelry",
    imageObjectPosition: "object-top",
  },
  {
    id: "think",
    accent: "Brains",
    heading: (
      <>
        How you
        <br />
        <span className="text-culbra-green">think</span> sets
        <br />
        you apart.
      </>
    ),
    body: (
      <>
        Challenge what you know. Question what you see. Connect the dots.{" "}
        <span className="font-semibold text-white">CULBRA</span> puts your
        knowledge, logic and thinking to the test.
      </>
    ),
    tagline: <>Thinking gives you possibilities.</>,
    imageSrc: "/images/hero-portrait-think.jpg",
    imageAlt:
      "Portrait of a woman with white face paint wearing a traditional headwrap and a black blazer",
    imageObjectPosition: "object-top",
    imageFit: "contain",
    imageWrapperClassName: "lg:self-center",
    imageMaxHeightClassName:
      "min-[1024px]:h-[62vh] min-[1024px]:max-h-none min-[1280px]:h-[68vh] min-[1600px]:h-[74vh]",
  },
  {
    id: "seen",
    accent: "Creativity",
    heading: (
      <>
        There&apos;s more
        <br />
        than one way
        <br />
        to <span className="text-culbra-green">be seen.</span>
      </>
    ),
    body: (
      <>
        Create it. Shape it. Express it.{" "}
        <span className="font-semibold text-white">CULBRA</span> gives your
        imagination a stage and challenges you to turn ideas into
        experiences. Make your idea impossible to ignore, remember and share.
      </>
    ),
    tagline: <>Your imagination is part of the game.</>,
    imageSrc: "/images/hero-portrait-creativity.jpg",
    imageAlt:
      "Portrait of a man with tribal-pattern face and neck paint and a red beaded necklace",
    imageObjectPosition: "object-top",
    imageFit: "contain",
    imageWrapperClassName: "lg:self-center",
    imageMaxHeightClassName:
      "min-[1024px]:h-[62vh] min-[1024px]:max-h-none min-[1280px]:h-[68vh] min-[1600px]:h-[74vh]",
    headingSizeClassName: "text-4xl sm:text-5xl lg:text-5xl xl:text-7xl",
    bodySizeClassName:
      "max-w-md text-sm sm:text-base lg:max-w-xl lg:text-lg xl:max-w-2xl xl:text-xl",
    textColumnWidthClassName:
      "md:w-[min(40vw,340px)] lg:w-[min(54vw,42rem)] xl:w-[min(56vw,48rem)]",
  },
  {
    id: "move",
    accent: "Impact",
    heading: (
      <>
        What you
        <br />
        do can <span className="text-culbra-green">move</span>
        <br />
        the world.
      </>
    ),
    body: (
      <>
        Great ideas should move beyond imagination.{" "}
        <span className="font-semibold text-white">CULBRA</span> challenges
        you to solve, create and turn your ideas into meaningful impact.
        Create something that moves.
      </>
    ),
    tagline: <>Show what you can change.</>,
    imageSrc: "/images/hero-portrait-impact.jpg",
    imageAlt:
      "Portrait of a woman with a red headband, face paint, and red beaded earrings",
    imageObjectPosition: "object-top",
    imageFit: "contain",
    imageWrapperClassName: "lg:self-center",
    imageMaxHeightClassName:
      "min-[1024px]:h-[62vh] min-[1024px]:max-h-none min-[1280px]:h-[68vh] min-[1600px]:h-[75vh]",
    headingSizeClassName: "text-4xl sm:text-5xl lg:text-5xl xl:text-7xl",
    bodySizeClassName:
      "max-w-md text-xs sm:text-sm md:text-base lg:max-w-lg lg:text-lg xl:max-w-xl xl:text-lg",
    textColumnWidthClassName:
      "md:w-[min(52vw,480px)] lg:w-[min(46vw,36rem)] xl:w-[min(48vw,42rem)]",
  },
  {
    id: "culbra",
    accent: "all",
    heading: (
      <>
        This is <span className="text-culbra-green">CULBRA.</span>
      </>
    ),
    body: (
      <>
        Your culture meets your intelligence, your ideas become challenges,
        your creativity becomes your expression, your actions create impact.
      </>
    ),
    tagline: <>A new kind of competition is here.</>,
    subline: <>Are you ready to enter the arena?</>,
    ctaLabel: "Explore Culbra",
    ctaHref: "#programs",
    imageSrc: "/images/hero-group-v2.jpg",
    imageAlt:
      "Group of four people wearing black and tribal-print streetwear with Culbra branding",
    imageObjectPosition: "object-bottom",
    imageFit: "contain",
    imageWrapperClassName: "lg:self-center",
    imageMaxHeightClassName:
      "min-[1024px]:h-[68vh] min-[1024px]:max-h-none min-[1280px]:h-[68vh] min-[1600px]:h-[74.5vh]",
    headingSizeClassName: "text-5xl sm:text-6xl lg:text-6xl xl:text-8xl",
    imageMobileHeightClassName: "h-[300px]",
    imageScaleClassName: "scale-[1.3] md:scale-100",
    showEdgeFade: false,
  },
];

const WHEEL_THRESHOLD = 15;
const TOUCH_THRESHOLD = 50;
const GESTURE_COOLDOWN_MS = 750;
const UNLOCK_SCROLL_DURATION_MS = 1400;

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

function smoothScrollTo(targetY: number, duration: number) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  const startTime = performance.now();

  function step(now: number) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + distance * easeInOutCubic(progress));
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

export default function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [locked, setLocked] = useState(true);

  const activeRef = useRef(active);
  activeRef.current = active;

  const throttledRef = useRef(false);
  const touchStartYRef = useRef<number | null>(null);

  const isLastSlide = active === SLIDES.length - 1;

  const goTo = useCallback((next: number) => {
    if (throttledRef.current) return;
    throttledRef.current = true;
    setActive(next);
    window.setTimeout(() => {
      throttledRef.current = false;
    }, GESTURE_COOLDOWN_MS);
  }, []);

  const step = useCallback(
    (direction: 1 | -1) => {
      const current = activeRef.current;
      goTo((current + direction + SLIDES.length) % SLIDES.length);
    },
    [goTo],
  );

  const unlock = useCallback(() => {
    setLocked(false);
    const target = document.getElementById("after-hero");
    if (target) {
      const targetY = target.getBoundingClientRect().top + window.scrollY;
      smoothScrollTo(targetY, UNLOCK_SCROLL_DURATION_MS);
    }
  }, []);

  // Once unlocked, watch for the user scrolling back up to the very top.
  // When they do, re-lock so the carousel (and its looping) takes over
  // again. Guarded by `leftHero` so this can't fire mid-unlock, while the
  // page is still near scrollY 0 during the Explore button's own scroll
  // animation — it only arms after the user has genuinely scrolled away.
  useEffect(() => {
    if (locked) return;

    let leftHero = false;
    const onScroll = () => {
      const y = window.scrollY;
      if (!leftHero) {
        if (y > 80) leftHero = true;
        return;
      }
      if (y <= 4) setLocked(true);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [locked]);

  // Auto-advance every 6s while locked. Restarts on every manual
  // navigation (scroll gesture or dot click) via the `active` dependency,
  // so autoplay never fires right on top of a just-made manual move.
  useEffect(() => {
    if (!locked) return;
    const id = window.setTimeout(() => {
      setActive((current) => (current + 1) % SLIDES.length);
    }, 6000);
    return () => window.clearTimeout(id);
  }, [locked, active]);

  // Intercept wheel, touch, and arrow-key gestures while locked so they
  // drive the slide carousel instead of scrolling the page. We deliberately
  // avoid `overflow: hidden` on the body because that would also block the
  // browser's native scroll-into-view when a keyboard user tabs to an
  // element below the hero.
  useEffect(() => {
    if (!locked) return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < WHEEL_THRESHOLD) return;
      e.preventDefault();
      step(e.deltaY > 0 ? 1 : -1);
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0]?.clientY ?? null;
    };

    const onTouchMove = (e: TouchEvent) => {
      // Stop rubber-band/native scroll while the gesture is in progress.
      e.preventDefault();
    };

    const onTouchEnd = (e: TouchEvent) => {
      const startY = touchStartYRef.current;
      touchStartYRef.current = null;
      if (startY == null) return;
      const endY = e.changedTouches[0]?.clientY ?? startY;
      const delta = startY - endY;
      if (Math.abs(delta) < TOUCH_THRESHOLD) return;
      step(delta > 0 ? 1 : -1);
    };

    // Besides the arrow keys, Space/Page Down/Page Up/Home/End all
    // natively scroll the page too — route them into the carousel the
    // same way, so no keyboard input can sneak past the lock.
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      switch (e.key) {
        case "ArrowDown":
        case "PageDown":
        case " ":
          e.preventDefault();
          step(1);
          break;
        case "ArrowUp":
        case "PageUp":
          e.preventDefault();
          step(-1);
          break;
        case "Home":
          e.preventDefault();
          goTo(0);
          break;
        case "End":
          e.preventDefault();
          goTo(SLIDES.length - 1);
          break;
        default:
          break;
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [locked, step, goTo]);

  // Keep the viewport pinned to the top while locked, in case anything
  // (e.g. browser scroll restoration) nudges it.
  useEffect(() => {
    if (locked) window.scrollTo(0, 0);
  }, [locked]);

  // Hide the native scrollbar while locked so it can't be dragged to skip
  // past the slide navigation — the page stays technically scrollable
  // (for keyboard-tab accessibility), just without a visible, draggable handle.
  useEffect(() => {
    document.documentElement.classList.toggle("scroll-locked", locked);
    return () => document.documentElement.classList.remove("scroll-locked");
  }, [locked]);

  const slide = SLIDES[active];

  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden bg-black">
      <Navbar />

      <HeroSlide
        key={slide.id}
        heading={slide.heading}
        body={slide.body}
        tagline={slide.tagline}
        imageSrc={slide.imageSrc}
        imageAlt={slide.imageAlt}
        imageObjectPosition={slide.imageObjectPosition}
        imageFit={slide.imageFit}
        imageWrapperClassName={slide.imageWrapperClassName}
        imageMaxHeightClassName={slide.imageMaxHeightClassName}
        headingSizeClassName={slide.headingSizeClassName}
        bodySizeClassName={slide.bodySizeClassName}
        textColumnWidthClassName={slide.textColumnWidthClassName}
        imageMobileHeightClassName={slide.imageMobileHeightClassName}
        imageScaleClassName={slide.imageScaleClassName}
        showEdgeFade={slide.showEdgeFade}
        subline={slide.subline}
        ctaLabel={slide.ctaLabel}
        ctaHref={slide.ctaHref}
        onCtaClick={isLastSlide ? unlock : undefined}
      />

      <FeatureRow accent={slide.accent} />

      {SLIDES.length > 1 && (
        <div className="absolute right-4 top-[calc(50%-1rem)] z-20 flex -translate-y-1/2 flex-col gap-3 sm:right-6 xl:right-16">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show slide ${i + 1}`}
              aria-current={i === active}
              className={`h-2 rounded-full transition-all ${
                i === active ? "h-6 bg-culbra-green" : "bg-white/40"
              } w-2`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
