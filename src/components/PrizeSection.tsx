import type { CSSProperties } from "react";
import Link from "next/link";
import { Barlow_Condensed } from "next/font/google";
import { Trophy } from "lucide-react";
import Reveal from "./Reveal";
import PrizeRow from "./PrizeRow";

const REGISTER_HREF = process.env.NEXT_PUBLIC_REGISTER_HREF ?? "/register";

// Tall, condensed lettering for the metal plates.
const barlow = Barlow_Condensed({
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700", "800"],
});

// Plate colours from darkest to lightest band, plus the dark outline and ink.
const METALS = {
  bronze: {
    dark: "#8C4E23",
    mid: "#D08648",
    light: "#FFD7A0",
    deep: "#A65F30",
    outline: "#4a250c",
    ink: "#3a1a06",
  },
  gold: {
    dark: "#806019",
    mid: "#C69C38",
    light: "#FFE6A0",
    deep: "#AD7925",
    outline: "#463208",
    ink: "#352304",
  },
  silver: {
    dark: "#606769",
    mid: "#B4BABC",
    light: "#FAFAF8",
    deep: "#868D90",
    outline: "#2c3133",
    ink: "#16191a",
  },
};

type Metal = keyof typeof METALS;

// Listed in rank order, which is also the order screen readers and stacked
// phones get. `order` places each card on the desktop podium.
const PRIZES: {
  metal: Metal;
  amount: string;
  place: string;
  order: string;
  perks: [string, string][];
}[] = [
  {
    metal: "gold",
    amount: "₦5 Million",
    place: "1st place",
    order: "order-2",
    perks: [
      ["4 Million Naira", " in cash."],
      ["1 Million Naira", " in Content Studio setup."],
      ["Recognition", " and visibility as CULBRA’s first place winner."],
      ["Opportunities", " that follow you long after the challenge."],
    ],
  },
  {
    metal: "silver",
    amount: "₦2 Million",
    place: "2nd place",
    order: "order-3",
    perks: [
      ["1.5 Million Naira", " in cash."],
      ["500 Thousand Naira", " in Content Studio setup."],
      ["Recognition", " and visibility as CULBRA’s second place winner."],
      ["Opportunities", " that follow you long after the challenge."],
    ],
  },
  {
    metal: "bronze",
    amount: "₦1 Million",
    place: "3rd place",
    order: "order-1",
    perks: [
      ["1 Million Naira", " in cash."],
      ["Recognition", " and visibility as CULBRA’s third place winner."],
      ["Opportunities", " that follow you long after the challenge."],
    ],
  },
];

// Card sizes in px at the desktop scale (1em = 16px). Every size inside a
// card is in em, so the whole podium scales by changing one font size.
const SIZES = {
  side: { w: 230, h: 440, plateH: 100, plateInset: 16, name: 32, amount: 19, place: 11 },
  gold: { w: 260, h: 490, plateH: 115, plateInset: 17, name: 38, amount: 23, place: 12 },
};

const em = (px: number) => `${px / 16}em`;

// The outer shield: rounded top corners, straight sides, a taper from 83% of
// the height and a wide, softly rounded point.
function shieldPath(w: number, h: number) {
  const r = 24;
  const y0 = h * 0.83;
  const dx = w / 2;
  const dy = h - y0;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const s = 12; // shoulder rounding
  const d = 24; // tip rounding
  const n = (v: number) => v.toFixed(2);
  return [
    `M${r} 0H${w - r}Q${w} 0 ${w} ${r}`,
    `V${n(y0 - s)}Q${w} ${n(y0)} ${n(w - ux * s)} ${n(y0 + uy * s)}`,
    `L${n(w / 2 + ux * d)} ${n(h - uy * d)}Q${n(w / 2)} ${h} ${n(w / 2 - ux * d)} ${n(h - uy * d)}`,
    `L${n(ux * s)} ${n(y0 + uy * s)}Q0 ${n(y0)} 0 ${n(y0 - s)}`,
    `V${r}Q0 0 ${r} 0Z`,
  ].join("");
}

// The plate: rounded top, short vertical edges, then a V to a rounded point.
function platePath(w: number, h: number) {
  const r = 10;
  const y0 = h * 0.5;
  const dx = w / 2;
  const dy = h - y0;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const s = 5;
  const d = 12;
  const n = (v: number) => v.toFixed(2);
  return [
    `M${r} 0H${w - r}Q${w} 0 ${w} ${r}`,
    `V${n(y0 - s)}Q${w} ${n(y0)} ${n(w - ux * s)} ${n(y0 + uy * s)}`,
    `L${n(w / 2 + ux * d)} ${n(h - uy * d)}Q${n(w / 2)} ${h} ${n(w / 2 - ux * d)} ${n(h - uy * d)}`,
    `L${n(ux * s)} ${n(y0 + uy * s)}Q0 ${n(y0)} 0 ${n(y0 - s)}`,
    `V${r}Q0 0 ${r} 0Z`,
  ].join("");
}

// A path as a CSS mask that stretches to fill its box, so each layer of a
// shield can be inset a few px and still keep the shape.
function maskStyle(path: string, w: number, h: number): CSSProperties {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><path d="${path}"/></svg>`;
  const url = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  return {
    maskImage: url,
    WebkitMaskImage: url,
    maskSize: "100% 100%",
    WebkitMaskSize: "100% 100%",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
  };
}

// Static starburst: bright core, two fine diagonal rays.
function Starburst({ bright }: { bright: boolean }) {
  return (
    <svg
      viewBox="0 0 60 60"
      aria-hidden="true"
      className="pointer-events-none absolute"
      style={{
        top: em(-22),
        right: em(-22),
        width: em(bright ? 56 : 48),
        height: em(bright ? 56 : 48),
        opacity: bright ? 1 : 0.85,
      }}
    >
      <defs>
        <radialGradient id="starburst-core">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="30%" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="30" cy="30" r="13" fill="url(#starburst-core)" />
      <path d="M30 29.2 L58 30 L30 30.8 L2 30 Z" fill="#fff" transform="rotate(-35 30 30)" />
      <path d="M30 29.4 L52 30 L30 30.6 L8 30 Z" fill="#fff" opacity="0.8" transform="rotate(35 30 30)" />
      <circle cx="30" cy="30" r="2.2" fill="#fff" />
    </svg>
  );
}

function PrizeCard({
  metal,
  amount,
  place,
  perks,
}: {
  metal: Metal;
  amount: string;
  place: string;
  perks: [string, string][];
}) {
  const m = METALS[metal];
  const isGold = metal === "gold";
  const z = isGold ? SIZES.gold : SIZES.side;
  const plateW = z.w - z.plateInset * 2;

  const shieldMask = maskStyle(shieldPath(z.w, z.h), z.w, z.h);
  const plateMask = maskStyle(platePath(plateW, z.plateH), plateW, z.plateH);

  // Alternating light and dark bands, like polished metal.
  const plateFace = `linear-gradient(180deg, ${m.light} 0%, ${m.mid} 20%, ${m.deep} 36%, ${m.dark} 46%, ${m.mid} 58%, ${m.light} 72%, ${m.mid} 86%, ${m.deep} 100%)`;
  const bevel = `linear-gradient(180deg, #ffffff 0%, ${m.light} 35%, ${m.deep} 75%, ${m.light} 100%)`;
  const emboss = "0 1px 0 rgba(255,255,255,0.45), 0 -1px 0 rgba(0,0,0,0.15)";

  return (
    <div
      className="relative"
      style={{ width: em(z.w), height: em(z.h) }}
    >
      {/* Cast shadow, strongest under the tip and a little to the right. */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 rounded-[50%] blur-md"
        style={{
          bottom: em(-14),
          width: "62%",
          height: em(26),
          transform: `translateX(calc(-50% + ${em(8)}))`,
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(20,24,26,0.55) 0%, rgba(20,24,26,0.2) 45%, transparent 75%)",
        }}
      />

      {/* Shield: a faint bevel rim, then the graphite body inside it. */}
      <div
        className="absolute inset-0"
        style={{
          ...shieldMask,
          background:
            "linear-gradient(160deg, #6a7275 0%, #2b3032 28%, #15191a 60%, #474e51 100%)",
        }}
      />
      <div
        className="absolute"
        style={{
          ...shieldMask,
          inset: em(2),
          background: [
            "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 30%, rgba(15,18,19,0) 55%, rgba(15,18,19,0.6) 100%)",
            "linear-gradient(90deg, #191D1E 0%, #2b3133 24%, #3A4042 50%, #2b3133 76%, #191D1E 100%)",
          ].join(", "),
        }}
      />

      {/* The metal plate, layered: dark outline, bright bevel, banded face. */}
      <div
        className="absolute"
        style={{
          top: em(z.plateInset + 2),
          left: em(z.plateInset),
          right: em(z.plateInset),
          height: em(z.plateH),
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            ...plateMask,
            background: m.outline,
            filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.5))",
          }}
        />
        <div
          className="absolute"
          style={{ ...plateMask, inset: em(1), background: bevel }}
        />
        <div
          className="absolute flex flex-col items-center text-center"
          style={{
            ...plateMask,
            inset: em(3),
            background: plateFace,
            boxShadow:
              "inset 0 0 0.3em rgba(0,0,0,0.35), inset 0 0.15em 0.2em rgba(255,255,255,0.6)",
            color: m.ink,
            paddingTop: em(6),
          }}
        >
          <p
            className={`${barlow.className} font-extrabold uppercase`}
            style={{
              fontSize: em(z.name),
              lineHeight: 0.95,
              letterSpacing: "0.02em",
              textShadow: emboss,
            }}
          >
            {amount}
          </p>
          <p
            className={`${barlow.className} font-bold uppercase`}
            style={{
              fontSize: em(z.amount),
              lineHeight: 1.1,
              marginTop: em(4),
              textShadow: emboss,
            }}
          >
            {place}
          </p>
        </div>

        {/* Reflected light along the top rim, running into the starburst. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0"
          style={{
            right: em(6),
            width: "38%",
            height: em(2),
            background:
              "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.95) 100%)",
          }}
        />
        <Starburst bright={isGold} />
      </div>

      {/* The details: perks, then a metal Register Now pill. Fills the
          space between the plate and the start of the taper. */}
      <div
        className="absolute flex flex-col items-center justify-start"
        style={{
          top: em(z.plateInset + 2 + z.plateH + 18),
          bottom: "12%",
          left: em(isGold ? 22 : 18),
          right: em(isGold ? 20 : 16),
          gap: em(isGold ? 18 : 14),
        }}
      >
        <ul className="w-full" style={{ fontSize: em(isGold ? 12 : 11.5) }}>
          {perks.map(([lead, rest]) => (
            <li
              key={lead}
              className="flex leading-snug text-white/80"
              style={{ gap: "0.6em", marginTop: lead === perks[0][0] ? 0 : "0.55em" }}
            >
              <span
                aria-hidden="true"
                className="shrink-0 rounded-full"
                style={{
                  width: "0.8em",
                  height: "0.8em",
                  marginTop: "0.25em",
                  background: `radial-gradient(circle at 35% 30%, #ffffff 0%, ${m.light} 30%, ${m.mid} 60%, ${m.dark} 100%)`,
                  boxShadow: "0 0 0.5em rgba(255,255,255,0.25)",
                }}
              />
              <span>
                <span className="font-semibold" style={{ color: m.light }}>
                  {lead}
                </span>
                {rest}
              </span>
            </li>
          ))}
        </ul>

        <Link
          href={REGISTER_HREF}
          className="shrink-0 rounded-full transition-transform hover:scale-105"
          style={{
            padding: em(1),
            background: m.outline,
            boxShadow: "0 0.2em 0.5em rgba(0,0,0,0.5)",
          }}
        >
          <span
            className="flex items-center rounded-full font-extrabold tracking-wide uppercase"
            style={{
              gap: "0.5em",
              padding: "0.25em 1.1em 0.25em 0.25em",
              fontSize: em(isGold ? 12 : 11),
              color: m.ink,
              background: `linear-gradient(180deg, ${m.light} 0%, ${m.mid} 45%, ${m.deep} 60%, ${m.light} 100%)`,
              boxShadow:
                "inset 0 1px 1px rgba(255,255,255,0.75), inset 0 -1px 2px rgba(0,0,0,0.3)",
            }}
          >
            <span
              className="flex items-center justify-center rounded-full bg-black/80 text-white"
              style={{ width: "2em", height: "2em" }}
            >
              <Trophy style={{ width: "1.1em", height: "1.1em" }} />
            </span>
            Register Now
          </span>
        </Link>
      </div>
    </div>
  );
}

export default function PrizeSection() {
  return (
    <section
      id="prizes"
      className="relative overflow-hidden bg-[#0b0b0b] px-6 py-14 text-white sm:py-20 lg:px-16"
    >
      {/* Warm glow at the top edge. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-64"
        style={{
          background:
            "radial-gradient(ellipse 60% 100% at 50% 0%, rgba(252,138,13,0.28) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        <Reveal className="text-left">
          <h2 className="text-3xl font-extrabold leading-tight sm:text-5xl">
            <span className="text-white/55">THERE’S MORE</span>
            <br />
            AT THE FINISH LINE.
          </h2>
          <p className="mt-5 max-w-3xl text-sm font-medium leading-relaxed text-white/75 sm:text-base">
            CULBRA puts ₦10 million in proposed prize value on the table
            rewarding the people who think boldly, create brilliantly and make
            their mark. But the prize is more than what you take home. It’s the
            recognition, visibility, opportunities and momentum that can follow
            you long after the Arena.
          </p>
        </Reveal>

        {/* Always a row: bronze, gold, silver, bottoms aligned so gold rises
            above (screen readers get rank order from the list). On phones
            the row swipes sideways, edge to edge, starting on gold.
            Everything inside a card is em, so this font size scales it. */}
        <div className="relative mt-10 sm:mt-14">
          {/* Soft glow behind the gold card. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 max-md:hidden"
            style={{
              background:
                "radial-gradient(ellipse 30% 55% at 50% 45%, rgba(242,199,92,0.16) 0%, rgba(242,199,92,0) 70%)",
            }}
          />
          <PrizeRow className="relative -mx-6 flex snap-x snap-mandatory items-end gap-[1.25em] overflow-x-auto px-6 pt-4 pb-8 text-[14px] [scrollbar-width:none] md:mx-0 md:justify-center md:gap-[2.5em] md:overflow-visible md:px-0 md:text-[13px] lg:gap-[4em] lg:text-[16px] [&::-webkit-scrollbar]:hidden">
            {PRIZES.map((prize, i) => (
              <li
                key={prize.metal}
                data-featured={prize.metal === "gold" ? "" : undefined}
                data-label={prize.metal}
                data-color={METALS[prize.metal].mid}
                className={`shrink-0 snap-center ${prize.order}`}
              >
                <Reveal delay={i * 120}>
                  <PrizeCard {...prize} />
                </Reveal>
              </li>
            ))}
          </PrizeRow>
        </div>

        <Reveal delay={100} className="mt-12 text-left">
          <p className="text-xl font-extrabold leading-snug sm:text-3xl">
            Come for the challenge.
            <br />
            Compete for the prize.
            <br />
            <span className="text-[#fc8a0d]">
              Leave with a story worth telling.
            </span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
