"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";

const SPOTLIGHT_RADIUS = 240;

// Calibrated empirically against rendered pixel output (not computed from
// theory) so the peak brightness increase matches ~57% in practice.
const GLOW_PEAK_ALPHA = 0.055;

// Placeholder duration — swap for a real target date once it's set. The
// countdown loops back to the full duration each time it reaches zero.
const COUNTDOWN_PERIOD_MS = 20 * 24 * 60 * 60 * 1000;

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
  };
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
          More details coming soon...!
        </h2>
        {countdown && (
          <div className="mt-8 flex items-center justify-center gap-6 sm:gap-8">
            {[
              { label: "Days", value: countdown.days },
              { label: "Hours", value: countdown.hours },
              { label: "Minutes", value: countdown.minutes },
              { label: "Seconds", value: countdown.seconds },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col items-center">
                <span className="text-4xl font-bold tabular-nums text-white sm:text-5xl">
                  {String(value).padStart(2, "0")}
                </span>
                <span className="mt-1 text-xs uppercase tracking-widest text-white/50 sm:text-sm">
                  {label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
