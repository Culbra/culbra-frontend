"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import Select from "./Select";

const PARTNERSHIP_TYPES = [
  "Headline sponsor",
  "Challenge sponsor",
  "Technology partner",
  "Media partner",
  "Venue or logistics partner",
  "Prize or product partner",
  "Other",
];

const PILLARS = ["Culture", "Brains", "Creativity", "Impact"];

const MESSAGE_MAX = 1000;

type Values = {
  organisation: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  // Filled in only when the partnership type is "Other".
  otherType: string;
  pillars: string[];
  message: string;
};

type Errors = Partial<Record<keyof Values, string>>;

const EMPTY: Values = {
  organisation: "",
  name: "",
  email: "",
  phone: "",
  type: "",
  otherType: "",
  pillars: [],
  message: "",
};

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 hover:border-white/20 focus:border-[#fc8a0d] focus:ring-2 focus:ring-[#fc8a0d]/25 aria-[invalid=true]:border-[#ee2e29]/70";

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.organisation.trim())
    e.organisation = "Enter your organisation’s name.";
  if (!v.name.trim()) e.name = "Enter your name.";
  if (!v.email.trim()) e.email = "Enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim()))
    e.email = "Enter a valid email address.";
  if (!v.type) e.type = "Choose a partnership type.";
  else if (v.type === "Other" && !v.otherType.trim())
    e.otherType = "Tell us the kind of partnership you have in mind.";
  if (!v.message.trim()) e.message = "Tell us a little about the partnership.";
  return e;
}

function Field({
  label,
  htmlFor,
  optional,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  optional?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-[11px] font-bold tracking-[0.12em] text-white/70 uppercase"
      >
        {label}
        {optional && (
          <span className="font-medium tracking-normal text-white/40 normal-case">
            {" "}
            (optional)
          </span>
        )}
      </label>
      {children}
      {error && (
        <p
          id={`${htmlFor}-error`}
          role="alert"
          className="mt-1.5 text-xs text-[#ee2e29]"
        >
          {error}
        </p>
      )}
    </div>
  );
}

function Chip({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <label
      className={`inline-flex cursor-pointer items-center gap-2.5 rounded-full border px-4 py-2 text-xs font-bold tracking-wide uppercase transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#fc8a0d]/50 ${
        checked
          ? "border-[#fc8a0d] bg-[#fc8a0d]/15 text-white"
          : "border-dashed border-white/20 text-white/70 hover:border-white/40 hover:text-white"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="sr-only"
      />
      <span
        aria-hidden="true"
        className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
          checked
            ? "border-[#fc8a0d] bg-[#fc8a0d] text-black"
            : "border-white/40"
        }`}
      >
        {checked && <Check size={12} strokeWidth={3} />}
      </span>
      {label}
    </label>
  );
}

export default function PartnerForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState(false);
  const otherRef = useRef<HTMLInputElement>(null);

  // Choosing "Other" reveals a text box; move the cursor into it. This runs
  // after the dropdown hands focus back to itself, so it wins.
  useEffect(() => {
    if (values.type === "Other") otherRef.current?.focus();
  }, [values.type]);

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const allPillars = values.pillars.length === PILLARS.length;
  const togglePillar = (pillar: string) =>
    set(
      "pillars",
      values.pillars.includes(pillar)
        ? values.pillars.filter((p) => p !== pillar)
        : PILLARS.filter((p) => p === pillar || values.pillars.includes(p)),
    );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(first)?.focus();
      return;
    }
    // TODO: send `values` to the backend once a partnerships endpoint exists.
    setDone(true);
    // Keep the thank-you message in view (on phones the intro sits above it).
    document
      .getElementById("partner-form")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Shared props that link each field to its error message.
  const describe = (key: keyof Values) => ({
    "aria-invalid": Boolean(errors[key]),
    "aria-describedby": errors[key] ? `${key}-error` : undefined,
  });

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0b0b0b] px-6 pt-6 pb-16 text-white [color-scheme:dark] sm:pb-24 lg:px-16">
      {/* Warm brand glows at the edges, like the prize section. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 0% 0%, rgba(252,138,13,0.22) 0%, transparent 70%), radial-gradient(ellipse 45% 45% at 100% 85%, rgba(238,46,41,0.16) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
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

        <div className="mt-12 grid gap-10 sm:mt-16 lg:grid-cols-[1fr_minmax(0,36rem)] lg:gap-16">
          <div className="lg:sticky lg:top-12 lg:self-start">
            <h1 className="text-4xl font-extrabold leading-[1.05] sm:text-6xl">
              BECOME A
              <br />
              <span className="text-[#fc8a0d]">PARTNER</span>
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/75 sm:text-base">
              CULBRA partners with sponsors, technology providers, media and
              logistics organisations to deliver an eight-week youth impact
              competition across Nigeria. Tell us a bit about your organisation
              and how you’d like to work together, and the partnerships team
              will follow up.
            </p>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-white/55">
              Reach an audience of 100,000 participants and align your brand
              with culture, brains, integrity and responsible citizenship.
            </p>
          </div>

          <div
            id="partner-form"
            className="scroll-mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/40 backdrop-blur-sm sm:p-8"
          >
            {done ? (
              <div className="py-10 text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fc8a0d] text-black">
                  <Check size={28} strokeWidth={3} />
                </span>
                <h2 className="mt-6 text-2xl font-extrabold">
                  Thank you, {values.name.trim()}!
                </h2>
                <p className="mx-auto mt-3 max-w-sm text-sm text-white/70">
                  We’ve received {values.organisation.trim()}’s enquiry. The
                  partnerships team will be in touch at {values.email.trim()}.
                </p>
                <Link
                  href="/"
                  className="mt-8 inline-block rounded-full bg-[#fc8a0d] px-8 py-3 text-sm font-bold text-black transition-transform hover:scale-105"
                >
                  Back to home
                </Link>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="space-y-6">
                <Field
                  label="Organisation name"
                  htmlFor="organisation"
                  error={errors.organisation}
                >
                  <input
                    id="organisation"
                    autoComplete="organization"
                    value={values.organisation}
                    onChange={(e) => set("organisation", e.target.value)}
                    className={inputClass}
                    {...describe("organisation")}
                  />
                </Field>

                <div className="grid gap-6 sm:grid-cols-2">
                  <Field label="Your name" htmlFor="name" error={errors.name}>
                    <input
                      id="name"
                      autoComplete="name"
                      value={values.name}
                      onChange={(e) => set("name", e.target.value)}
                      className={inputClass}
                      {...describe("name")}
                    />
                  </Field>
                  <Field label="Phone" htmlFor="phone" optional>
                    <input
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      value={values.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                </div>

                <Field label="Email" htmlFor="email" error={errors.email}>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={values.email}
                    onChange={(e) => set("email", e.target.value)}
                    className={inputClass}
                    {...describe("email")}
                  />
                </Field>

                <Field
                  label="Partnership type"
                  htmlFor="type"
                  error={errors.type}
                >
                  <Select
                    id="type"
                    tone="dark"
                    placeholder="Choose one"
                    options={PARTNERSHIP_TYPES}
                    value={values.type}
                    onChange={(v) => set("type", v)}
                    className={`${inputClass} ${errors.type ? "border-[#ee2e29]/70" : ""}`}
                    openClassName="border-[#fc8a0d] ring-2 ring-[#fc8a0d]/25"
                    describedBy={errors.type ? "type-error" : undefined}
                  />
                </Field>

                {values.type === "Other" && (
                  <Field
                    label="What kind of partnership?"
                    htmlFor="otherType"
                    error={errors.otherType}
                  >
                    <input
                      ref={otherRef}
                      id="otherType"
                      placeholder="e.g. Education partner, community partner"
                      value={values.otherType}
                      onChange={(e) => set("otherType", e.target.value)}
                      className={inputClass}
                      {...describe("otherType")}
                    />
                  </Field>
                )}

                <fieldset>
                  <legend className="mb-3 block text-[11px] font-bold tracking-[0.12em] text-white/70 uppercase">
                    Which pillar(s) would you like to support?{" "}
                    <span className="font-medium tracking-normal text-white/40 normal-case">
                      (optional)
                    </span>
                  </legend>
                  <div className="flex flex-wrap gap-2.5">
                    <Chip
                      label="All pillars"
                      checked={allPillars}
                      onToggle={() => set("pillars", allPillars ? [] : PILLARS)}
                    />
                    {PILLARS.map((p) => (
                      <Chip
                        key={p}
                        label={p}
                        checked={values.pillars.includes(p)}
                        onToggle={() => togglePillar(p)}
                      />
                    ))}
                  </div>
                </fieldset>

                <Field
                  label="Tell us about the partnership"
                  htmlFor="message"
                  error={errors.message}
                >
                  {/* The box is drawn by the wrapper so the counter can sit
                      inside it; the textarea itself is borderless. */}
                  <div
                    className={`rounded-2xl border bg-white/[0.04] transition hover:border-white/20 focus-within:border-[#fc8a0d] focus-within:ring-2 focus-within:ring-[#fc8a0d]/25 ${
                      errors.message
                        ? "border-[#ee2e29]/70"
                        : "border-white/10"
                    }`}
                  >
                    <textarea
                      id="message"
                      rows={5}
                      maxLength={MESSAGE_MAX}
                      placeholder="What would you like to achieve together? Share your goals, the kind of support you can offer, and any timelines."
                      value={values.message}
                      onChange={(e) => set("message", e.target.value)}
                      className="block min-h-36 w-full resize-none bg-transparent px-4 pt-3.5 pb-2 text-sm leading-relaxed text-white outline-none [scrollbar-width:none] placeholder:text-white/30 [&::-webkit-scrollbar]:hidden"
                      {...describe("message")}
                    />
                    <div className="flex items-center justify-between gap-3 border-t border-white/5 px-4 py-2 text-[11px] text-white/40">
                      <span>Be as detailed as you like.</span>
                      <span
                        className={`tabular-nums ${
                          values.message.length >= MESSAGE_MAX
                            ? "text-[#ffa94d]"
                            : ""
                        }`}
                      >
                        {values.message.length} / {MESSAGE_MAX}
                      </span>
                    </div>
                  </div>
                </Field>

                <button
                  type="submit"
                  className="w-full rounded-full bg-[#fc8a0d] px-8 py-3.5 text-sm font-bold tracking-wide text-black uppercase shadow-lg shadow-[#fc8a0d]/25 transition-transform hover:scale-[1.02]"
                >
                  Send enquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
