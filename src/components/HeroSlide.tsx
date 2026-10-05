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
  imageDesktopFit?: "cover" | "contain";
  imageDesktopFitBreakpoint?: "lg" | "xl";
  imageWrapperClassName?: string;
  imageMarginClassName?: string;
  imageMobileWidthClassName?: string;
  imageMaxHeightClassName?: string;
  headingSizeClassName?: string;
  bodySizeClassName?: string;
  textColumnWidthClassName?: string;
  imageMobileHeightClassName?: string;
  imageScaleClassName?: string;
  imageMobileBottomFade?: boolean;
  imageWrapperMaskClassName?: string;
  showEdgeFade?: boolean;
  edgeFadeBackgroundImage?: string;
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
  imageDesktopFit,
  imageDesktopFitBreakpoint = "lg",
  imageWrapperClassName = "",
  imageMarginClassName = "xl:mr-24",
  imageMobileWidthClassName = "w-full",
  imageMaxHeightClassName = "min-[1024px]:max-h-[640px] min-[1280px]:max-h-[760px]",
  headingSizeClassName = "text-[clamp(1.375rem,6dvh,2rem)] sm:text-5xl lg:text-6xl xl:text-8xl",
  bodySizeClassName = "max-w-md text-sm sm:text-base lg:max-w-lg lg:text-lg xl:max-w-xl xl:text-xl",
  textColumnWidthClassName = "lg:w-[min(46vw,36rem)] xl:w-[min(48vw,42rem)]",
  imageMobileHeightClassName = "h-[43dvh] min-h-[230px]",
  imageScaleClassName = "",
  imageMobileBottomFade = false,
  imageWrapperMaskClassName = "",
  showEdgeFade = true,
  edgeFadeBackgroundImage = "linear-gradient(to top, black, transparent 14%, transparent 86%, black), linear-gradient(to right, black, transparent 10%, transparent 90%, black)",
  subline,
  ctaLabel,
  ctaHref = "#",
  onCtaClick,
}: Omit<HeroSlideContent, "id">) {
  return (
    <div className="relative flex min-h-0 w-full flex-1 flex-col-reverse items-stretch gap-0 pt-8 sm:pt-10 lg:flex-row lg:gap-4 lg:px-16 lg:pt-28">
      <div
        className={`relative z-10 flex min-h-0 flex-1 flex-col items-start justify-start overflow-hidden px-6 text-left sm:px-10 lg:mt-0 lg:flex-none lg:shrink-0 lg:justify-center lg:overflow-visible lg:px-0 lg:py-0 ${textColumnWidthClassName}`}
      >
        <h1
          className={`animate-fade-up font-extrabold uppercase leading-[1.08] tracking-normal sm:tracking-tight text-white ${headingSizeClassName}`}
          style={{ animationDelay: "150ms" }}
        >
          {heading}
        </h1>

        <p
          className={`animate-fade-up mt-5 leading-snug sm:mt-6 sm:leading-relaxed text-white/80 ${bodySizeClassName}`}
          style={{ animationDelay: "500ms" }}
        >
          {body}
        </p>

        <p
          className="animate-fade-up mt-4 flex items-center gap-2 text-sm font-semibold text-culbra-green sm:mt-8 sm:text-lg xl:text-2xl"
          style={{ animationDelay: "850ms" }}
        >
          {tagline}
        </p>

        {subline && (
          <p
            className="animate-fade-up mt-3 text-base font-bold text-white sm:mt-4 sm:text-xl xl:text-2xl"
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
              className="animate-fade-up group mt-3 inline-flex items-center gap-3 rounded-full border border-culbra-green px-5 py-2 text-sm font-bold tracking-wide text-white uppercase transition-colors hover:bg-culbra-green hover:text-black sm:mt-8 sm:px-6 sm:py-3 sm:text-base"
              style={{ animationDelay: "1150ms" }}
            >
              {ctaLabel}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          ) : (
            <a
              href={ctaHref}
              className="animate-fade-up group mt-3 inline-flex items-center gap-3 rounded-full border border-culbra-green px-5 py-2 text-sm font-bold tracking-wide text-white uppercase transition-colors hover:bg-culbra-green hover:text-black sm:mt-8 sm:px-6 sm:py-3 sm:text-base"
              style={{ animationDelay: "1150ms" }}
            >
              {ctaLabel}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          ))}
      </div>

      <div
        className={`relative min-w-0 flex-none overflow-hidden lg:flex-1 lg:mt-0 ${imageMarginClassName} ${imageMobileWidthClassName} ${imageMobileHeightClassName} ${imageMaxHeightClassName} ${imageWrapperClassName} ${imageWrapperMaskClassName}`}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          className={`animate-fade-scale ${imageFit === "contain" ? "object-contain" : "object-cover"} ${
            imageDesktopFit === "contain"
              ? imageDesktopFitBreakpoint === "xl"
                ? "xl:object-contain"
                : "lg:object-contain"
              : imageDesktopFit === "cover"
                ? imageDesktopFitBreakpoint === "xl"
                  ? "xl:object-cover"
                  : "lg:object-cover"
                : ""
          } ${imageObjectPosition} ${imageScaleClassName} ${imageMobileBottomFade ? "max-md:[mask-image:linear-gradient(to_bottom,black_70%,transparent_94%)] max-md:[-webkit-mask-image:linear-gradient(to_bottom,black_70%,transparent_94%)]" : ""}`}
          style={{ animationDelay: "250ms" }}
        />
        {showEdgeFade && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 lg:hidden"
            style={{
              backgroundImage: edgeFadeBackgroundImage,
            }}
          />
        )}
      </div>
    </div>
  );
}
