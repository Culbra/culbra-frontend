import type { ReactNode } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export type HeroSlideContent = {
  id: string;
  heading: ReactNode;
  body: ReactNode;
  tagline: ReactNode;
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
  subline?: ReactNode;
  ctaLabel?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
};

export default function HeroSlide({
  heading,
  body,
  tagline,
  imageSrc,
  imageAlt,
  imageObjectPosition = "object-top",
  imageFit = "cover",
  imageWrapperClassName = "",
  imageMaxHeightClassName = "min-[1024px]:max-h-[640px] min-[1280px]:max-h-[760px]",
  headingSizeClassName = "text-4xl sm:text-5xl lg:text-6xl xl:text-8xl",
  bodySizeClassName = "max-w-md text-sm sm:text-base lg:max-w-lg lg:text-lg xl:max-w-xl xl:text-xl",
  textColumnWidthClassName = "md:w-[min(36vw,300px)] lg:w-[min(46vw,36rem)] xl:w-[min(48vw,42rem)]",
  imageMobileHeightClassName = "h-[420px]",
  imageScaleClassName = "",
  showEdgeFade = true,
  subline,
  ctaLabel,
  ctaHref = "#",
  onCtaClick,
}: Omit<HeroSlideContent, "id">) {
  return (
    <div className="relative flex w-full flex-1 flex-col-reverse items-stretch gap-0 pt-28 md:flex-row md:gap-4 md:px-16">
      <div
        className={`relative z-10 -mt-16 flex flex-col items-start justify-center px-6 pb-10 text-left md:mt-0 md:shrink-0 md:px-0 md:py-0 ${textColumnWidthClassName}`}
      >
        <h1
          className={`animate-fade-up font-extrabold uppercase leading-[1.05] tracking-tight text-white ${headingSizeClassName}`}
          style={{ animationDelay: "150ms" }}
        >
          {heading}
        </h1>

        <p
          className={`animate-fade-up mt-6 leading-relaxed text-white/80 ${bodySizeClassName}`}
          style={{ animationDelay: "500ms" }}
        >
          {body}
        </p>

        <p
          className="animate-fade-up mt-8 flex items-center gap-2 text-base font-semibold text-culbra-green sm:text-lg xl:text-2xl"
          style={{ animationDelay: "850ms" }}
        >
          {tagline}
        </p>

        {subline && (
          <p
            className="animate-fade-up mt-4 text-lg font-bold text-white sm:text-xl xl:text-2xl"
            style={{ animationDelay: "1000ms" }}
          >
            {subline}
          </p>
        )}

        {ctaLabel &&
          (onCtaClick ? (
            <button
              type="button"
              onClick={onCtaClick}
              className="animate-fade-up group mt-8 inline-flex items-center gap-3 rounded-full border border-culbra-green px-6 py-3 text-sm font-bold tracking-wide text-white uppercase transition-colors hover:bg-culbra-green hover:text-black sm:text-base"
              style={{ animationDelay: "1150ms" }}
            >
              {ctaLabel}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          ) : (
            <a
              href={ctaHref}
              className="animate-fade-up group mt-8 inline-flex items-center gap-3 rounded-full border border-culbra-green px-6 py-3 text-sm font-bold tracking-wide text-white uppercase transition-colors hover:bg-culbra-green hover:text-black sm:text-base"
              style={{ animationDelay: "1150ms" }}
            >
              {ctaLabel}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          ))}
      </div>

      <div
        className={`relative w-full min-w-0 flex-none overflow-hidden min-[768px]:mt-32 min-[768px]:h-auto min-[768px]:max-h-[420px] md:flex-1 min-[800px]:mt-64 min-[1024px]:mt-0 xl:mr-24 ${imageMobileHeightClassName} ${imageMaxHeightClassName} ${imageWrapperClassName}`}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          className={`animate-fade-scale ${imageFit === "contain" ? "object-contain" : "object-cover"} ${imageObjectPosition} ${imageScaleClassName}`}
          style={{ animationDelay: "250ms" }}
        />
        {showEdgeFade && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 lg:hidden"
            style={{
              backgroundImage:
                "linear-gradient(to top, black, transparent 14%, transparent 86%, black), linear-gradient(to right, black, transparent 10%, transparent 90%, black)",
            }}
          />
        )}
      </div>
    </div>
  );
}
