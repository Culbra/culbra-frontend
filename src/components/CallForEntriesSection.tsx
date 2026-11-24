"use client";

import { useEffect, useRef } from "react";

// Drop the video file into public/videos/ with this name (MP4, H.264).
const VIDEO_SRC = "/videos/The-arena.mp4";

// Phones: how much bigger than the section the video is on each side, as a
// fraction of the section. It's also how far the video can drift, so it
// never runs out and shows a black edge.
const PHONE_OVERSCAN = 0.4;

// Muted + playsInline are required for autoplay on mobile browsers.
const videoProps = {
  src: VIDEO_SRC,
  autoPlay: true,
  muted: true,
  loop: true,
  playsInline: true,
  preload: "auto",
  "aria-hidden": true,
} as const;

export default function CallForEntriesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Phones often refuse to autoplay (React does not always write the `muted`
  // attribute, and data-saver / low-power modes block it). Force the video
  // muted and keep retrying to play it whenever it scrolls into view or the
  // visitor first touches the page.
  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    const play = () => {
      if (video.paused) video.play().catch(() => {});
    };
    play();
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) play();
        else video.pause();
      },
      { threshold: 0.1 },
    );
    io.observe(section);
    window.addEventListener("touchstart", play, { passive: true });
    video.addEventListener("loadeddata", play);
    return () => {
      io.disconnect();
      window.removeEventListener("touchstart", play);
      video.removeEventListener("loadeddata", play);
    };
  }, []);

  // Phones (portrait): the section is a short 16:9 strip, so a video pinned
  // to the screen would only line up with it mid-screen and leave black
  // edges either side. Instead the video is a little bigger than the strip
  // and drifts against the scroll, so it always fills the strip but still
  // moves more slowly than the page.
  useEffect(() => {
    const section = sectionRef.current;
    const layer = layerRef.current;
    if (!section || !layer) return;

    const portrait = window.matchMedia("(orientation: portrait)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const update = () => {
      frame = 0;
      // Landscape uses the pinned video, which a transform here would break.
      if (!portrait.matches || reduced.matches) {
        layer.style.transform = "";
        return;
      }
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      // -1 when the strip is just above the screen, 1 just below it.
      const progress = Math.max(
        -1,
        Math.min(
          1,
          (rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2),
        ),
      );
      const shift = -progress * PHONE_OVERSCAN * rect.height;
      layer.style.transform = `translate3d(0, ${shift}px, 0)`;
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    portrait.addEventListener("change", schedule);
    reduced.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      portrait.removeEventListener("change", schedule);
      reduced.removeEventListener("change", schedule);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="call-for-entries"
      // Landscape screens: a full-screen section. Portrait screens (phones):
      // cropping a wide video to a tall screen would cut the people off, so
      // the section shrinks to the video's own 16:9 shape instead.
      //
      // Landscape parallax: the video is pinned to the screen (`fixed`) and
      // the section clips it (`clip-path`), so the section moves like a
      // window over a video that stays still. No ancestor may have a
      // transform, or `fixed` would stop being relative to the screen.
      className="relative h-svh w-full overflow-hidden bg-black [clip-path:inset(0)] portrait:aspect-video portrait:h-auto"
    >
      {/* Landscape: a full-screen layer pinned to the screen. Portrait: a
          layer 40% taller than the strip above and below, moved by the
          effect above. */}
      <div
        ref={layerRef}
        className="pointer-events-none fixed inset-0 will-change-transform portrait:absolute portrait:-inset-x-[10%] portrait:-inset-y-[40%]"
      >
        <video
          ref={videoRef}
          {...videoProps}
          className="h-full w-full object-cover opacity-60"
        />
      </div>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
        <h2 className="text-center text-3xl font-extrabold leading-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)] sm:text-6xl lg:text-7xl">
          The Arena
        </h2>
      </div>
    </section>
  );
}
