"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { LAUNCH_DATE } from "@/lib/launch";

const UNITS = [
  { key: "days", label: "Days", color: "#12a066" },
  { key: "hours", label: "Hours", color: "#fc8a0d" },
  { key: "minutes", label: "Minutes", color: "#ee2e29" },
  { key: "seconds", label: "Seconds", color: "#ffffff" },
] as const;

type Parts = Record<(typeof UNITS)[number]["key"], number>;

function partsUntil(target: number): Parts {
  const total = Math.max(0, Math.floor((target - Date.now()) / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

function useCountdown(target: number) {
  // Null until mounted, so the server and first client render match.
  const [parts, setParts] = useState<Parts | null>(null);

  useEffect(() => {
    const tick = () => setParts(partsUntil(target));
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [target]);

  return parts;
}

export default function ComingSoon({
  eyebrow,
  title,
  accent,
  body,
  countdown = true,
  registerButton = false,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  body: string;
  // false: no clock or date, for when the opening date is not yet set.
  countdown?: boolean;
  // Shows a Register button that stays disabled until the countdown ends.
  registerButton?: boolean;
}) {
  const target = new Date(LAUNCH_DATE).getTime();
  const parts = useCountdown(target);
  const live =
    parts !== null && Object.values(parts).every((value) => value === 0);

  return (
    <main className="relative flex min-h-svh flex-col overflow-hidden bg-[#0b0b0b] px-6 pt-6 pb-16 text-white sm:pb-24 lg:px-16">
      {/* Brand glows, as on the partner and prize sections. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 0% 0%, rgba(252,138,13,0.22) 0%, transparent 70%), radial-gradient(ellipse 45% 45% at 100% 90%, rgba(18,160,102,0.22) 0%, transparent 70%), radial-gradient(ellipse 40% 35% at 100% 0%, rgba(238,46,41,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto flex w-full max-w-6xl items-center justify-between">
        <Link href="/" aria-label="CULBRA home">
          <Image
            src="/images/logo-v2.png"
            alt="CULBRA"
            width={1054}
            height={268}
            priority
            className="h-6 w-auto sm:h-9"
          />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-white/70 transition-colors hover:text-white sm:text-sm"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>
      </div>

      <div className="relative mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center py-16 text-center">
        <p className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-culbra-green/40 bg-culbra-green/10 px-4 py-1.5 text-[11px] font-bold tracking-[0.18em] text-culbra-green uppercase sm:text-xs">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-culbra-green opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-culbra-green" />
          </span>
          {eyebrow}
        </p>

        <h1
          className="animate-fade-up mt-6 text-2xl font-extrabold leading-[1.15] uppercase sm:text-4xl lg:text-5xl"
          style={{ animationDelay: "150ms" }}
        >
          {title}
          <br />
          <span className="text-[#fc8a0d]">{accent}</span>
        </h1>

        <p
          className="animate-fade-up mt-6 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base"
          style={{ animationDelay: "300ms" }}
        >
          {body}
        </p>

        {countdown && (
          <>
            <div
              role="timer"
              aria-live="off"
              aria-label="Time until opening"
              className="animate-fade-up mt-12 grid w-full max-w-2xl grid-cols-4 gap-2 sm:gap-5"
              style={{ animationDelay: "450ms" }}
            >
              {UNITS.map(({ key, label, color }) => (
                <div
                  key={key}
                  className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] px-1 py-4 shadow-2xl shadow-black/40 backdrop-blur-sm sm:rounded-3xl sm:py-7"
                >
                  {/* Brand-colour bar along the top of each tile. */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-1"
                    style={{ background: color }}
                  />
                  <p className="text-3xl font-extrabold tabular-nums sm:text-6xl">
                    {parts ? String(parts[key]).padStart(2, "0") : "--"}
                  </p>
                  <p className="mt-1 text-[9px] font-bold tracking-[0.14em] text-white/55 uppercase sm:mt-2 sm:text-xs">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            {live && (
              <p className="mt-8 text-sm font-semibold text-culbra-green sm:text-base">
                Opening any moment now. Check back shortly.
              </p>
            )}
          </>
        )}

        {registerButton ? (
          <button
            type="button"
            disabled={!live}
            title={live ? undefined : "Registration opens on 5 December 2026"}
            onClick={() => (window.location.href = "/register")}
            className="animate-fade-up mt-10 inline-flex items-center justify-center rounded-full border border-culbra-green bg-culbra-green px-10 py-3 text-sm font-extrabold tracking-wide text-black uppercase shadow-[0_8px_28px_-6px_rgba(18,160,102,0.65)] transition-[scale,background-color] enabled:hover:scale-105 enabled:hover:bg-[#16b674] disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
            style={{ animationDelay: "750ms" }}
          >
            Register
          </button>
        ) : (
          <Link
            href="/"
            className="animate-fade-up group mt-10 inline-flex items-center gap-3 rounded-full border border-culbra-green bg-culbra-green px-6 py-3 text-sm font-extrabold tracking-wide text-black uppercase shadow-[0_8px_28px_-6px_rgba(18,160,102,0.65)] transition-[scale,background-color] hover:scale-105 hover:bg-[#16b674] sm:text-base"
            style={{ animationDelay: "750ms" }}
          >
            Explore Culbra
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>
    </main>
  );
}
