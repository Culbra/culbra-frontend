"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";

const CARDS = [
  {
    title: "CULTURE",
    body: "Your roots, identity, stories and perspective.",
    gradient: "linear-gradient(160deg, #1a1a1a 0%, #ee2e29 100%)",
  },
  {
    title: "BRAINS",
    body: "Knowledge, logic, strategy and problem-solving.",
    gradient: "linear-gradient(160deg, #1a1a1a 0%, #12a066 100%)",
  },
  {
    title: "CREATIVITY",
    body: "Ideas, expression, storytelling and imagination.",
    gradient: "linear-gradient(160deg, #1a1a1a 0%, #fc8a0d 100%)",
  },
  {
    title: "SOLVE",
    body: "Real problems. Smart thinking. Unexpected solutions.",
    gradient: "linear-gradient(160deg, #1a1a1a 0%, #ee2e29 100%)",
  },
  {
    title: "IMPACT",
    body: "Ideas that can move beyond the screen and make a difference.",
    gradient: "linear-gradient(160deg, #1a1a1a 0%, #12a066 100%)",
  },
  {
    title: "THE REAL WORLD",
    body: "Challenges inspired by the world around you, testing how you think, adapt and respond",
    gradient: "linear-gradient(160deg, #1a1a1a 0%, #fc8a0d 100%)",
  },
];

const AUTOPLAY_MS = 4000;

// Card height as a multiple of its width. Lower = shorter cards.
const CARD_RATIO = 1.25;

// ---- Tweak the motion here -------------------------------------------------
// x is in card widths (1 = one full card width from the centre).
const SLOT_TARGETS = {
  center: { x: 0, scale: 1, rotateY: 0, rotateZ: 0, zIndex: 3, opacity: 1 },
  // Sides sit behind the centre card, ~28% of their width tucked under it.
  left: {
    x: -0.67,
    scale: 0.78,
    rotateY: 8,
    rotateZ: -1.5,
    zIndex: 1,
    opacity: 0.9,
  },
  right: {
    x: 0.67,
    scale: 0.78,
    rotateY: -8,
    rotateZ: 1.5,
    zIndex: 1,
    opacity: 0.9,
  },
  // Every other card waits unseen behind the stack, so the loop is endless.
  hidden: { x: 0, scale: 0.7, rotateY: 0, rotateZ: 0, zIndex: 0, opacity: 0 },
};

const MOTION = {
  duration: 0.7, // whole move, seconds. Lower = faster.
  releaseAt: 0.36, // share of the move spent in the "let go" phase (~250ms)
  overshoot: 1.04, // incoming card grows past 1 then settles. 1 = no bounce
  releaseCentreScale: 0.82, // how far the centre card shrinks when released
  releaseSideScale: 0.92, // sides shrink to this fraction of their size
  releaseSpread: 1.08, // gaps open by this much while released
  releaseTilt: 1.5, // extra tilt multiplier while released
  incomingHeadStart: 0.04, // incoming card starts this many seconds early
  // Settle curve. Swap for a springier one to taste.
  settleEase: [0.22, 1, 0.36, 1] as [number, number, number, number],
  dragThreshold: 80, // px of drag that triggers a slide
  dragVelocity: 500, // px/s flick that also triggers a slide
};
// ----------------------------------------------------------------------------

type Target = {
  x: number;
  scale: number;
  rotateY: number;
  rotateZ: number;
  zIndex: number;
  opacity: number;
};

// Position of card `i` relative to the active one, wrapped so the deck
// loops: 0 is the centre card, -1 / +1 its neighbours.
function offsetOf(i: number, active: number) {
  const n = CARDS.length;
  const half = Math.floor(n / 2);
  return ((i - active + n + half) % n) - half;
}

function slotTarget(off: number, held: boolean): Target {
  if (off === 0) {
    return held
      ? { ...SLOT_TARGETS.center, scale: 0.97 }
      : SLOT_TARGETS.center;
  }
  if (off === -1 || off === 1) {
    const base = off < 0 ? SLOT_TARGETS.left : SLOT_TARGETS.right;
    // While the centre card is held the sides tuck in behind it.
    return held ? { ...base, x: 0, scale: 0.9, opacity: 0 } : base;
  }
  return SLOT_TARGETS.hidden;
}

// The "let go" pose: cards shrink a little, gaps open, tilt grows.
function releaseTarget(t: Target, off: number): Target {
  if (off !== 0 && Math.abs(off) !== 1) return t;
  return {
    ...t,
    x: t.x * MOTION.releaseSpread,
    scale:
      t.scale *
      (off === 0 ? MOTION.releaseCentreScale : MOTION.releaseSideScale),
    rotateY: t.rotateY * MOTION.releaseTilt,
    rotateZ: t.rotateZ * MOTION.releaseTilt * (off === 0 ? 1 : 1.3),
  };
}

function useCardWidth() {
  // Card width in px: matches the sm breakpoint (14rem / 9.5rem).
  const [w, setW] = useState(224);
  useEffect(() => {
    const update = () => setW(window.innerWidth >= 640 ? 224 : 152);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return w;
}

export default function ChallengeCards() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const w = useCardWidth();
  const [nav, setNav] = useState({ active: 0, prev: 0 });
  const [inView, setInView] = useState(false);
  // True while the centre card is hovered or pressed: the side cards tuck
  // in behind it. The card keeps its colour.
  const [held, setHeld] = useState(false);
  const [dragging, setDragging] = useState(false);

  const dragX = useMotionValue(0);
  const busyRef = useRef(false);
  const pendingRef = useRef<number | null>(null);
  const movedRef = useRef(false);
  const activeRef = useRef(0);
  const goToRef = useRef<(target: number) => void>(() => {});

  const transitioning = nav.prev !== nav.active;
  const totalMs = (reduced ? 0.2 : MOTION.duration) * 1000;

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // One move at a time: requests that arrive mid-move are reduced to the
  // last one and run as soon as the current move finishes.
  const goTo = useCallback(
    (target: number) => {
      const next = ((target % CARDS.length) + CARDS.length) % CARDS.length;
      if (busyRef.current) {
        pendingRef.current = next;
        return;
      }
      if (next === activeRef.current) return;
      busyRef.current = true;
      const from = activeRef.current;
      activeRef.current = next;
      setNav({ active: next, prev: from });
      window.setTimeout(() => {
        busyRef.current = false;
        setNav((n) => ({ active: n.active, prev: n.active }));
        const queued = pendingRef.current;
        pendingRef.current = null;
        if (queued !== null && queued !== activeRef.current) {
          goToRef.current(queued);
        }
      }, totalMs + 60);
    },
    [totalMs],
  );
  useEffect(() => {
    goToRef.current = goTo;
  }, [goTo]);

  // Advance on a timer while visible and untouched.
  useEffect(() => {
    if (!inView || held || dragging || transitioning) return;
    if (reduced) return;
    const id = window.setTimeout(
      () => goTo(activeRef.current + 1),
      AUTOPLAY_MS,
    );
    return () => window.clearTimeout(id);
  }, [inView, held, dragging, transitioning, reduced, nav.active, goTo]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(activeRef.current + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(activeRef.current - 1);
    }
  };

  const spring = {
    type: "spring",
    stiffness: 220,
    damping: 24,
    mass: 1,
  } as const;

  return (
    <div ref={rootRef} className="w-full">
      <motion.div
        className="relative mx-auto h-56 w-full cursor-grab outline-none active:cursor-grabbing sm:h-[23rem]"
        style={{ perspective: 1200, touchAction: "pan-y" }}
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label="Challenge cards"
        onKeyDown={onKeyDown}
        onPanStart={() => {
          setDragging(true);
          movedRef.current = false;
        }}
        onPan={(_, info) => {
          if (Math.abs(info.offset.x) > 6) movedRef.current = true;
          // The whole stack follows the pointer 1:1.
          dragX.set(info.offset.x);
        }}
        onPanEnd={(_, info) => {
          setDragging(false);
          const passed =
            Math.abs(info.offset.x) > MOTION.dragThreshold ||
            Math.abs(info.velocity.x) > MOTION.dragVelocity;
          animate(dragX, 0, spring);
          if (passed) {
            goTo(activeRef.current + (info.offset.x < 0 ? 1 : -1));
          }
          // Let the click that follows a drag pass, then reset.
          window.setTimeout(() => {
            movedRef.current = false;
          }, 0);
        }}
      >
        <motion.div className="absolute inset-0" style={{ x: dragX }}>
          {CARDS.map(({ title, body, gradient }, i) => {
            const offNow = offsetOf(i, nav.active);
            const offPrev = offsetOf(i, nav.prev);
            const centre = offNow === 0;
            const near = Math.abs(offNow) === 1;
            const to = slotTarget(offNow, held && !transitioning);

            let animateTo: Record<string, number | number[]>;
            let transition: Record<string, unknown>;

            if (reduced || !transitioning) {
              animateTo = {
                x: to.x * w,
                scale: to.scale,
                rotateY: to.rotateY,
                rotateZ: to.rotateZ,
                opacity: to.opacity,
                zIndex: to.zIndex,
              };
              transition = reduced
                ? { duration: 0.2, ease: "easeOut" }
                : spring;
            } else {
              const from = slotTarget(offPrev, false);
              const rel = releaseTarget(from, offPrev);
              const incoming = offNow === 0 && offPrev !== 0;
              const seg = {
                duration: MOTION.duration,
                times: [0, MOTION.releaseAt, 1],
                ease: ["easeInOut", MOTION.settleEase],
                delay: incoming ? 0 : MOTION.incomingHeadStart,
              };
              animateTo = {
                x: [from.x * w, rel.x * w, to.x * w],
                rotateY: [from.rotateY, rel.rotateY, to.rotateY],
                rotateZ: [from.rotateZ, rel.rotateZ, to.rotateZ],
                opacity: [from.opacity, from.opacity, to.opacity],
                scale: incoming
                  ? [from.scale, rel.scale, MOTION.overshoot, 1]
                  : [from.scale, rel.scale, to.scale],
                // Stacking order swaps at the midpoint, never abruptly.
                zIndex: to.zIndex,
              };
              transition = {
                x: seg,
                rotateY: seg,
                rotateZ: seg,
                opacity: seg,
                scale: incoming
                  ? {
                      duration: MOTION.duration,
                      times: [0, MOTION.releaseAt, 0.8, 1],
                      ease: ["easeInOut", MOTION.settleEase, "easeOut"],
                    }
                  : seg,
                zIndex: {
                  duration: 0.001,
                  delay: MOTION.duration * 0.5,
                },
              };
            }

            return (
              <motion.button
                key={title}
                type="button"
                onClick={() => {
                  if (movedRef.current) return;
                  goTo(i);
                }}
                onPointerEnter={
                  centre
                    ? (e) => e.pointerType === "mouse" && setHeld(true)
                    : undefined
                }
                onPointerDown={centre ? () => setHeld(true) : undefined}
                onPointerLeave={centre ? () => setHeld(false) : undefined}
                onPointerUp={centre ? () => setHeld(false) : undefined}
                onPointerCancel={centre ? () => setHeld(false) : undefined}
                aria-label={`Show ${title}`}
                aria-current={centre ? "true" : undefined}
                tabIndex={-1}
                initial={false}
                animate={animateTo}
                transition={transition}
                className="absolute top-1/2 left-1/2 flex cursor-[inherit] flex-col items-center justify-center glass-card px-4 text-center text-white will-change-transform"
                style={{
                  width: w,
                  height: w * CARD_RATIO,
                  marginLeft: -w / 2,
                  marginTop: -(w * CARD_RATIO) / 2,
                  background: gradient,
                  pointerEvents: centre || near ? "auto" : "none",
                }}
              >
                <span className="text-base font-extrabold leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)] sm:text-2xl">
                  {title}
                </span>
                <span className="mt-2 text-[10px] leading-snug text-white/85 sm:mt-3 sm:text-sm">
                  {body}
                </span>
              </motion.button>
            );
          })}
        </motion.div>
      </motion.div>

      <div className="mt-2 flex justify-center gap-2">
        {CARDS.map(({ title }, i) => (
          <button
            key={title}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Show ${title}`}
            className={`h-2 rounded-full transition-all duration-500 ${
              i === nav.active ? "w-6 bg-black" : "w-2 bg-black/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
