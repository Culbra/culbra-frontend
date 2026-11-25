"use client";

import { useEffect, useRef, useState } from "react";
import Select from "./Select";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const pad = (n: number) => String(n).padStart(2, "0");
const iso = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;

function parse(value: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return m ? { y: +m[1], m: +m[2] - 1, d: +m[3] } : null;
}

// A styled date picker. The browser's own calendar can't be restyled, so this
// draws a card under the field. Value is "YYYY-MM-DD", like <input type=date>.
export default function DatePicker({
  id,
  value,
  onChange,
  max,
  placeholder = "dd/mm/yyyy",
  className = "",
  openClassName = "",
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  /** Latest selectable date, "YYYY-MM-DD". */
  max?: string;
  placeholder?: string;
  className?: string;
  openClassName?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const today = new Date();
  const selected = parse(value);
  const [view, setView] = useState({
    y: selected?.y ?? today.getFullYear(),
    m: selected?.m ?? today.getMonth(),
  });
  const [picking, setPicking] = useState<"days" | "months">("days");

  const maxDate = max ? parse(max) : null;
  const maxKey = maxDate ? iso(maxDate.y, maxDate.m, maxDate.d) : "9999-12-31";

  const openCard = () => {
    const rect = rootRef.current?.getBoundingClientRect();
    setOpenUp(
      !!rect &&
        rect.bottom + 380 > window.innerHeight &&
        rect.top > window.innerHeight - rect.bottom,
    );
    setView({
      y: selected?.y ?? today.getFullYear(),
      m: selected?.m ?? today.getMonth(),
    });
    setPicking("days");
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        rootRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const shift = (delta: number) =>
    setView((v) => {
      const t = v.y * 12 + v.m + delta;
      return { y: Math.floor(t / 12), m: t % 12 };
    });

  const first = new Date(view.y, view.m, 1).getDay();
  const count = new Date(view.y, view.m + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(first).fill(null),
    ...Array.from({ length: count }, (_, i) => i + 1),
  ];

  const nextDisabled = iso(view.y, view.m + 1, 1) > maxKey;
  const maxYear = maxDate?.y ?? today.getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => maxYear - i);

  const choose = (v: string) => {
    onChange(v);
    setOpen(false);
    rootRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
  };

  const label = selected
    ? `${pad(selected.d)}/${pad(selected.m + 1)}/${selected.y}`
    : "";

  const nav =
    "flex h-8 w-8 items-center justify-center rounded-full text-black/60 transition-colors hover:bg-[#fc8a0d]/15 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent dark:text-white/70";

  return (
    <div ref={rootRef} className="relative">
      <button
        id={id}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => (open ? setOpen(false) : openCard())}
        className={`${className} flex cursor-pointer items-center pr-11 text-left ${
          open ? openClassName : ""
        }`}
      >
        <span
          className={`truncate ${label ? "" : "text-black/35 dark:text-white/35"}`}
        >
          {label || placeholder}
        </span>
      </button>
      <Calendar
        size={16}
        className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-black/45 dark:text-white/50"
      />

      {open && (
        <div
          role="dialog"
          aria-label="Choose date of birth"
          className={`absolute left-0 z-50 w-72 max-w-[calc(100vw-3rem)] rounded-2xl border border-black/5 bg-white p-3 text-black shadow-2xl shadow-black/20 dark:border-white/10 dark:bg-[#1b1b1b] dark:text-white ${
            openUp ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setPicking(picking === "days" ? "months" : "days")}
              className="rounded-full px-3 py-1.5 text-sm font-bold transition-colors hover:bg-[#fc8a0d]/15"
            >
              {MONTHS[view.m]} {view.y}
            </button>
            {picking === "days" && (
              <div className="flex gap-1">
                <button
                  type="button"
                  aria-label="Previous month"
                  onClick={() => shift(-1)}
                  className={nav}
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  aria-label="Next month"
                  disabled={nextDisabled}
                  onClick={() => shift(1)}
                  className={nav}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>

          {picking === "months" ? (
            <div className="grid grid-cols-2 gap-2">
              <Select
                id={`${id}-month`}
                className="w-full rounded-xl bg-[#f1f4f8] px-3 py-2 text-sm outline-none ring-2 ring-transparent dark:bg-white/10"
                openClassName="ring-[#fc8a0d]/60"
                value={MONTHS[view.m]}
                placeholder="Month"
                options={MONTHS}
                onChange={(v) =>
                  setView((s) => ({ ...s, m: MONTHS.indexOf(v) }))
                }
              />
              <Select
                id={`${id}-year`}
                className="w-full rounded-xl bg-[#f1f4f8] px-3 py-2 text-sm outline-none ring-2 ring-transparent dark:bg-white/10"
                openClassName="ring-[#fc8a0d]/60"
                value={String(view.y)}
                placeholder="Year"
                options={years.map(String)}
                onChange={(v) => setView((s) => ({ ...s, y: +v }))}
              />
              <button
                type="button"
                onClick={() => setPicking("days")}
                className="col-span-2 rounded-full bg-[#fc8a0d] py-2 text-xs font-bold text-black uppercase"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-7 text-center text-[11px] font-bold text-black/45 dark:text-white/45">
                {DAYS.map((d) => (
                  <span key={d} className="py-1">
                    {d}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-y-0.5">
                {cells.map((d, i) => {
                  if (d === null) return <span key={`b${i}`} />;
                  const key = iso(view.y, view.m, d);
                  const disabled = key > maxKey;
                  const isSelected = key === value;
                  const isToday =
                    key === iso(today.getFullYear(), today.getMonth(), today.getDate());
                  return (
                    <button
                      key={key}
                      type="button"
                      disabled={disabled}
                      aria-pressed={isSelected}
                      onClick={() => choose(key)}
                      className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-25 ${
                        isSelected
                          ? "bg-[#fc8a0d] font-bold text-black"
                          : `hover:bg-[#fc8a0d]/15 ${
                              isToday
                                ? "font-bold text-[#c96a00] dark:text-[#ffa94d]"
                                : ""
                            }`
                      }`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
              <div className="mt-2 flex justify-between border-t border-black/5 pt-2 text-xs font-bold dark:border-white/10">
                <button
                  type="button"
                  onClick={() => choose("")}
                  className="rounded-full px-3 py-1.5 text-[#c96a00] hover:bg-[#fc8a0d]/15 dark:text-[#ffa94d]"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => choose(iso(today.getFullYear(), today.getMonth(), today.getDate()) > maxKey ? maxKey : iso(today.getFullYear(), today.getMonth(), today.getDate()))}
                  className="rounded-full px-3 py-1.5 text-[#c96a00] hover:bg-[#fc8a0d]/15 dark:text-[#ffa94d]"
                >
                  Today
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
