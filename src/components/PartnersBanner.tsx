import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";

// The banner is the same deep green as the portrait's studio backdrop, so
// the photo's faded edges melt into it with no visible join.
const GREEN_LIGHT = "#03452b";
const GREEN_DARK = "#011a0f";

export default function PartnersBanner() {
  return (
    <section
      id="partners"
      className="relative overflow-hidden text-white"
      style={{
        background: `radial-gradient(ellipse 70% 120% at 75% 40%, ${GREEN_LIGHT} 0%, ${GREEN_DARK} 75%)`,
      }}
    >
      {/* Angular light shards across the background, like the design. */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1200 400"
        preserveAspectRatio="none"
      >
        <g fill="#ffffff">
          <polygon points="0,0 260,0 90,400 0,400" opacity="0.035" />
          <polygon points="330,0 520,0 300,400 140,400" opacity="0.05" />
          <polygon points="610,0 700,0 560,400 470,400" opacity="0.03" />
          <polygon points="880,0 1080,0 1200,180 1200,400 980,400" opacity="0.04" />
          <polygon points="1120,0 1200,0 1200,90" opacity="0.06" />
        </g>
      </svg>

      {/* Fine dot texture, strongest on the left and fading out. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1.2px)",
          backgroundSize: "7px 7px",
          maskImage: "linear-gradient(to right, #000 0%, transparent 55%)",
          WebkitMaskImage: "linear-gradient(to right, #000 0%, transparent 55%)",
        }}
      />

      {/* Phones: heading, photo, then sub-text and button. Tablet and up:
          heading and text stacked in the left column, centred vertically,
          with the photo pinned to the right. */}
      <div className="relative mx-auto grid max-w-6xl px-6 md:min-h-[26rem] md:grid-cols-2 md:content-center md:py-16 lg:px-16">
        <div className="pt-14 pb-6 text-left md:col-start-1 md:pt-0 md:pb-0">
          <Reveal>
            <h2 className="text-4xl font-extrabold leading-[1.05] sm:text-6xl">
              Partner
              <br />
              With Culbra
            </h2>
          </Reveal>
        </div>

        {/* Phones: between the heading and the text. Tablet and up: pinned
            to the right, filling the banner's height from the top edge. */}
        <div className="relative -mx-6 h-[26rem] sm:h-[30rem] md:absolute md:inset-y-0 md:right-0 md:mx-0 md:h-auto md:w-1/2 lg:w-[46%]">
          <Image
            src="/images/partner-portrait.png"
            alt="A young woman in a green CULBRA T-shirt and patterned wrapper, with white face paint and braids, holding a talking drum"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            // Edge fades that melt the photo into the banner; see
            // .partner-photo-fade in globals.css.
            className="partner-photo-fade object-cover object-top"
          />
        </div>

        <div className="relative -mt-14 pb-14 text-left md:col-start-1 md:mt-0 md:pb-0">
          <Reveal delay={150}>
            <p className="max-w-md text-sm font-medium md:mt-4 leading-relaxed text-white/80 sm:text-base">
              Put your brand at the heart of Nigeria’s boldest youth impact
              competition and reach millions.
            </p>
          </Reveal>
          <Reveal delay={250}>
            <Link
              href="/partner#partner-form"
              className="mt-8 inline-block rounded-2xl bg-white px-8 py-3.5 text-sm font-bold text-black shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] transition-transform hover:scale-105 sm:text-base"
            >
              Get Involved
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
