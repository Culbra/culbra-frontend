"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { X } from "lucide-react";

const MESSAGE_MAX = 250;

const field =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 hover:border-white/20 focus:border-[#fc8a0d] focus:ring-2 focus:ring-[#fc8a0d]/25";

// A footer link that opens a "Contact us" card instead of navigating. The
// message is emailed to the team through /api/contact.
export default function ContactButton({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [values, setValues] = useState({
    name: "",
    email: "",
    message: "",
    website: "",
  });
  const nameRef = useRef<HTMLInputElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);

  const close = () => {
    setOpen(false);
    openerRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    nameRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const set = (k: keyof typeof values, v: string) => {
    setValues((s) => ({ ...s, [k]: v }));
    setError("");
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (sending) return;
    if (!values.name.trim() || !values.message.trim()) {
      setError("Please enter your name and a message.");
      return;
    }
    if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      setError("Enter a valid email address, or leave it blank.");
      return;
    }
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(
          typeof body?.error === "string" ? body.error : "Something went wrong.",
        );
      }
      setDone(true);
      setValues({ name: "", email: "", message: "", website: "" });
    } catch (err) {
      setError(
        err instanceof Error && err.message !== "Failed to fetch"
          ? err.message
          : "We couldn’t reach the server. Check your connection and try again.",
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <button
        ref={openerRef}
        type="button"
        onClick={() => {
          setDone(false);
          setError("");
          setOpen(true);
        }}
        className={className}
      >
        {children}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onPointerDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-title"
            className="relative max-h-[90dvh] w-full max-w-md overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rounded-3xl border border-white/10 bg-[#141414] p-6 text-white shadow-2xl [color-scheme:dark] sm:p-8"
          >
            <button
              type="button"
              aria-label="Close"
              onClick={close}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X size={18} />
            </button>

            {done ? (
              <div className="py-6 text-center">
                <h2 id="contact-title" className="text-xl font-extrabold">
                  Message sent
                </h2>
                <p className="mt-3 text-sm text-white/70">
                  Thank you for reaching out. We’ll get back to you soon.
                </p>
                <button
                  type="button"
                  onClick={close}
                  className="mt-6 rounded-full bg-[#fc8a0d] px-8 py-3 text-sm font-bold tracking-wide text-black uppercase"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="space-y-4">
                <div>
                  <h2 id="contact-title" className="text-xl font-extrabold">
                    Contact us
                  </h2>
                  <p className="mt-1 text-sm text-white/60">
                    Questions about Culbra? Send us a message.
                  </p>
                </div>

                <div>
                  <label htmlFor="contact-name" className="mb-1.5 block text-[11px] font-bold tracking-[0.12em] text-white/70 uppercase">
                    Name
                  </label>
                  <input
                    ref={nameRef}
                    id="contact-name"
                    autoComplete="name"
                    maxLength={200}
                    value={values.name}
                    onChange={(e) => set("name", e.target.value)}
                    className={field}
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="mb-1.5 block text-[11px] font-bold tracking-[0.12em] text-white/70 uppercase">
                    Email{" "}
                    <span className="font-medium tracking-normal text-white/40 normal-case">
                      (optional, so we can reply)
                    </span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    autoComplete="email"
                    maxLength={200}
                    value={values.email}
                    onChange={(e) => set("email", e.target.value)}
                    className={field}
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="mb-1.5 block text-[11px] font-bold tracking-[0.12em] text-white/70 uppercase">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    maxLength={MESSAGE_MAX}
                    value={values.message}
                    onChange={(e) => set("message", e.target.value)}
                    className={`${field} resize-none`}
                  />
                  <p
                    className={`mt-1.5 text-right text-[11px] tabular-nums ${
                      values.message.length >= MESSAGE_MAX
                        ? "text-[#ffa94d]"
                        : "text-white/40"
                    }`}
                  >
                    {values.message.length} / {MESSAGE_MAX}
                  </p>
                </div>

                {/* Honeypot: hidden from people, filled in by bots. */}
                <input
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={values.website}
                  onChange={(e) => set("website", e.target.value)}
                  className="absolute -left-[9999px] h-0 w-0 opacity-0"
                />

                {error && (
                  <p role="alert" className="text-sm text-[#ee2e29]">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full rounded-full bg-[#fc8a0d] px-8 py-3.5 text-sm font-bold tracking-wide text-black uppercase shadow-lg shadow-[#fc8a0d]/25 transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
                >
                  {sending ? "Sending…" : "Send message"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
