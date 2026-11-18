"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

// Colours for the open list and placeholder. "auto" follows the visitor's
// light/dark setting (the registration page); "dark" is always dark (the
// partner page, which has no light mode).
const TONES = {
  auto: {
    placeholder: "text-black/35 dark:text-white/35",
    chevron: "text-black/45 dark:text-white/50",
    list: "border-black/5 bg-white shadow-black/20 dark:border-white/10 dark:bg-[#1b1b1b]",
    empty: "text-black/45 dark:text-white/45",
    selected: "font-bold text-[#c96a00] dark:text-[#ffa94d]",
    option: "text-black dark:text-white",
  },
  dark: {
    placeholder: "text-white/35",
    chevron: "text-white/50",
    list: "border-white/10 bg-[#1b1b1b] shadow-black/50",
    empty: "text-white/45",
    selected: "font-bold text-[#ffa94d]",
    option: "text-white",
  },
};

// A styled dropdown. The browser's own list can't be restyled, so this draws
// the options as a card under the field, with keyboard support.
export default function Select({
  id,
  value,
  onChange,
  disabled,
  placeholder,
  options,
  className = "",
  openClassName = "",
  tone = "auto",
  describedBy,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  placeholder: string;
  options: string[];
  /** Classes for the closed field, so it matches the form's other inputs. */
  className?: string;
  /** Extra classes for the field while the list is open. */
  openClassName?: string;
  tone?: keyof typeof TONES;
  /** The id of an error message to read out with the field. */
  describedBy?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typedRef = useRef({ text: "", at: 0 });
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const [active, setActive] = useState(0);
  const listId = `${id}-listbox`;
  const t = TONES[tone];

  const openMenu = () => {
    if (disabled) return;
    const rect = rootRef.current?.getBoundingClientRect();
    // Open upwards when there isn't room underneath.
    setOpenUp(
      !!rect &&
        rect.bottom + 270 > window.innerHeight &&
        rect.top > window.innerHeight - rect.bottom,
    );
    setActive(Math.max(0, options.indexOf(value)));
    setOpen(true);
  };

  const choose = (v: string) => {
    onChange(v);
    setOpen(false);
    rootRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
  };

  // Close when clicking or tapping anywhere else.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  // Keep the highlighted option in view.
  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        openMenu();
      }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActive((a) => Math.min(options.length - 1, a + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActive((a) => Math.max(0, a - 1));
        break;
      case "Home":
        e.preventDefault();
        setActive(0);
        break;
      case "End":
        e.preventDefault();
        setActive(options.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (options[active] !== undefined) choose(options[active]);
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
      case "Tab":
        setOpen(false);
        break;
      default:
        // Type a few letters to jump to a matching option.
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
          const now = Date.now();
          const typed = typedRef.current;
          typed.text = now - typed.at > 700 ? e.key : typed.text + e.key;
          typed.at = now;
          const hit = options.findIndex((o) =>
            o.toLowerCase().startsWith(typed.text.toLowerCase()),
          );
          if (hit >= 0) setActive(hit);
        }
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-describedby={describedBy}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onKeyDown}
        className={`${className} flex cursor-pointer items-center pr-11 text-left disabled:cursor-not-allowed disabled:opacity-50 ${
          open ? openClassName : ""
        }`}
      >
        <span className={`truncate ${value ? "" : t.placeholder}`}>
          {value || placeholder}
        </span>
      </button>
      <ChevronDown
        size={16}
        className={`pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 transition-transform ${t.chevron} ${
          open ? "rotate-180" : ""
        }`}
      />

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label={placeholder}
          className={`absolute left-0 z-50 max-h-60 w-full overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rounded-2xl border p-1.5 shadow-2xl ${t.list} ${
            openUp ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          {options.length === 0 && (
            <li className={`px-4 py-2.5 text-sm ${t.empty}`}>No options</li>
          )}
          {options.map((o, i) => {
            const selected = o === value;
            return (
              <li
                key={o}
                role="option"
                aria-selected={selected}
                data-index={i}
                onPointerEnter={() => setActive(i)}
                onClick={() => choose(o)}
                className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-sm transition-colors ${
                  i === active ? "bg-[#fc8a0d]/12" : ""
                } ${selected ? t.selected : t.option}`}
              >
                <span className="truncate">{o}</span>
                {selected && <Check size={15} className="shrink-0" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
