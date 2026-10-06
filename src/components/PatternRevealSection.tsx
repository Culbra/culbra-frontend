"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";

const SPOTLIGHT_RADIUS = 240;

// Calibrated empirically against rendered pixel output (not computed from
// theory) so the peak brightness increase matches ~57% in practice.
const GLOW_PEAK_ALPHA = 0.055;

// Placeholder duration — swap for a real target date once it's set. The
// countdown loops back to the full duration each time it reaches zero.
const COUNTDOWN_PERIOD_MS = 7 * 24 * 60 * 60 * 1000;

function useCountdown(periodMs: number) {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setRemaining(periodMs - (Date.now() % periodMs));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [periodMs]);

  if (remaining == null) return null;

  const totalSeconds = Math.floor(remaining / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    // Fraction of each ring still to run, from the exact remaining time.
    daysProgress: remaining / periodMs,
    hoursProgress: (remaining % 86400000) / 86400000,
    minutesProgress: (remaining % 3600000) / 3600000,
    secondsProgress: (remaining % 60000) / 60000,
  };
}

const RING_SIZE = 120;
const RING_STROKE = 8;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function CountdownRing({
  label,
  value,
  progress,
  color,
}: {
  label: string;
  value: number;
  progress: number;
  color: string;
}) {
  // The ring drains as time runs out. When it refills (a unit rolls over)
  // skip the transition so it snaps full instead of sweeping backwards.
  const [prev, setPrev] = useState(progress);
  const refilled = progress > prev;
  if (prev !== progress) setPrev(progress);

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-20 w-20 sm:h-[120px] sm:w-[120px]">
        <svg
          viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
          className="h-full w-full -rotate-90"
          aria-hidden="true"
        >
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RING_RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth={RING_STROKE}
          />
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RING_RADIUS}
            fill="none"
            stroke={color}
            strokeWidth={RING_STROKE}
            strokeLinecap="round"
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={RING_CIRCUMFERENCE * (1 - progress)}
            style={{
              transition: refilled ? "none" : "stroke-dashoffset 1s linear",
            }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold tabular-nums text-white sm:text-4xl">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="mt-2 text-xs font-semibold uppercase tracking-widest text-white/60 sm:text-sm">
        {label}
      </span>
    </div>
  );
}

export default function PatternRevealSection() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const countdown = useCountdown(COUNTDOWN_PERIOD_MS);

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Overlay: hidden at the cursor (revealing the pattern), opaque at the edge.
    const overlayMask = `radial-gradient(circle ${SPOTLIGHT_RADIUS}px at ${x}px ${y}px, transparent 0%, black 75%)`;
    if (overlayRef.current) {
      overlayRef.current.style.maskImage = overlayMask;
      overlayRef.current.style.webkitMaskImage = overlayMask;
    }

    // Glow: a soft white highlight, strongest at the cursor, blended
    // normally (not `screen`, which distorts dark pixels non-linearly).
    if (glowRef.current) {
      glowRef.current.style.background = `radial-gradient(circle ${SPOTLIGHT_RADIUS}px at ${x}px ${y}px, rgba(255,255,255,${GLOW_PEAK_ALPHA}) 0%, transparent 75%)`;
    }
  };

  const handleMouseLeave = () => {
    if (overlayRef.current) {
      overlayRef.current.style.maskImage = "";
      overlayRef.current.style.webkitMaskImage = "";
    }
    if (glowRef.current) {
      glowRef.current.style.background = "";
    }
  };

  return (
    <section
      id="after-hero"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cover bg-center px-6 text-center"
      style={{ backgroundImage: "url(/images/section-pattern.jpg)" }}
    >
      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 bg-black/35"
      />
      <div ref={glowRef} className="pointer-events-none absolute inset-0" />
      <div className="relative">
        <h2 className="text-4xl font-bold text-white sm:text-5xl">
          More details in
        </h2>
        {countdown && (
          <div className="mt-8 flex items-start justify-center gap-3 sm:gap-8">
            <CountdownRing
              label="Days"
              value={countdown.days}
              progress={countdown.daysProgress}
              color="#1db980"
            />
            <CountdownRing
              label="Hrs"
              value={countdown.hours}
              progress={countdown.hoursProgress}
              color="#1db980"
            />
            <CountdownRing
              label="Mins"
              value={countdown.minutes}
              progress={countdown.minutesProgress}
              color="#4fcf9f"
            />
            <CountdownRing
              label="Secs"
              value={countdown.seconds}
              progress={countdown.secondsProgress}
              color="#7fe0bc"
            />
          </div>
        )}
      </div>
    </section>
  );
}
