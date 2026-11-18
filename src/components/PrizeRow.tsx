"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronsRight } from "lucide-react";

// The prize podium as a row. On phones it's wider than the screen, so it
// swipes sideways, starts centred on the featured (gold) card, and shows
// swipe cues: edge fades, a "swipe" hint and dots for each card.
export default function PrizeRow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLOListElement>(null);
  // Cards in on-screen order (CSS `order` differs from DOM order).
  const [cards, setCards] = useState<{ label: string; color: string }[]>([]);
  const [active, setActive] = useState(0);
  const [swiped, setSwiped] = useState(false);

  const visualItems = () => {
    const row = ref.current;
    if (!row) return [];
    return Array.from(row.children as HTMLCollectionOf<HTMLElement>).sort(
      (a, b) => a.offsetLeft - b.offsetLeft,
    );
  };

  const centre = (el: HTMLElement, smooth: boolean) => {
    const row = ref.current;
    if (!row) return;
    row.scrollTo({
      left: el.offsetLeft - (row.clientWidth - el.offsetWidth) / 2,
      behavior: smooth ? "smooth" : "auto",
    });
  };

  useEffect(() => {
    const row = ref.current;
    if (!row) return;
    const items = visualItems();

    const onScroll = () => {
      const mid = row.scrollLeft + row.clientWidth / 2;
      let best = 0;
      items.forEach((el, i) => {
        const d = Math.abs(el.offsetLeft + el.offsetWidth / 2 - mid);
        const bestEl = items[best];
        if (d < Math.abs(bestEl.offsetLeft + bestEl.offsetWidth / 2 - mid)) {
          best = i;
        }
      });
      setActive(best);
    };

    // Start on gold. Wait a frame so the first state update isn't
    // synchronous inside the effect.
    const raf = requestAnimationFrame(() => {
      setCards(
        items.map((el) => ({
          label: el.dataset.label ?? "",
          color: el.dataset.color ?? "#fff",
        })),
      );
      const featured = items.find((el) => "featured" in el.dataset);
      if (featured && row.scrollWidth > row.clientWidth) centre(featured, false);
      onScroll();
    });

    const markSwiped = () => setSwiped(true);
    row.addEventListener("scroll", onScroll, { passive: true });
    row.addEventListener("touchstart", markSwiped, { passive: true, once: true });
    row.addEventListener("pointerdown", markSwiped, { once: true });
    return () => {
      cancelAnimationFrame(raf);
      row.removeEventListener("scroll", onScroll);
      row.removeEventListener("touchstart", markSwiped);
      row.removeEventListener("pointerdown", markSwiped);
    };
  }, []);

  return (
    <div className="relative">
      <ol ref={ref} aria-label="Prizes" className={className}>
        {children}
      </ol>

      {/* Edge fades: the side cards look cut off, so there's more to see. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -left-6 w-10 bg-gradient-to-r from-[#0b0b0b] to-transparent md:hidden"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -right-6 w-10 bg-gradient-to-l from-[#0b0b0b] to-transparent md:hidden"
      />

      {/* Phones only: dots for each card and a swipe hint. */}
      <div className="flex flex-col items-center gap-3 md:hidden">
        <div className="flex items-center gap-2">
          {cards.map((card, i) => (
            <button
              key={card.label}
              type="button"
              aria-label={`Show ${card.label} prize`}
              aria-current={i === active}
              onClick={() => {
                setSwiped(true);
                const el = visualItems()[i];
                if (el) centre(el, true);
              }}
              className="flex h-6 items-center justify-center px-0.5"
            >
              <span
                className={`block h-2 rounded-full transition-all duration-300 ${
                  i === active ? "w-6" : "w-2 opacity-40"
                }`}
                style={{ background: card.color }}
              />
            </button>
          ))}
        </div>
        <p
          aria-hidden="true"
          className={`flex items-center gap-1.5 text-xs font-semibold tracking-wide text-white/60 uppercase transition-opacity duration-500 ${
            swiped ? "opacity-0" : "opacity-100"
          }`}
        >
          Swipe to see all prizes
          <ChevronsRight className="h-4 w-4 animate-[swipe-nudge_1.4s_ease-in-out_infinite]" />
        </p>
      </div>
    </div>
  );
}
