"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import DatePicker from "./DatePicker";
import Select from "./Select";
import { ArrowLeft, Check, ImagePlus } from "lucide-react";
import { COUNTRIES } from "@/data/countries";
import { NIGERIA_STATES, NIGERIA_STATES_LGAS } from "@/data/nigeria";
import {
  isNigerianPhone,
  submitRegistration,
  type Registration,
} from "@/lib/register";
import {
  ACCEPTED_MIME,
  ID_TYPES,
  getIdType,
  validateIdentityFile,
} from "@/lib/identity";

const EMPTY: Registration = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  country: "Nigeria",
  state: "",
  lga: "",
  address: "",
};

type Errors = Partial<
  Record<
    keyof Registration | "identityType" | "identityFront" | "identityBack",
    string
  >
>;

const inputClass =
  "w-full rounded-full bg-[#f1f4f8] px-5 py-2.5 text-sm text-black outline-none ring-2 ring-transparent transition placeholder:text-black/35 focus:ring-[#fc8a0d]/60 dark:bg-white/10 dark:text-white dark:placeholder:text-white/35";

function validate(v: Registration): Errors {
  const e: Errors = {};
  if (!v.firstName.trim()) e.firstName = "Enter your first name.";
  if (!v.lastName.trim()) e.lastName = "Enter your last name.";
  if (!v.email.trim()) e.email = "Enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim()))
    e.email = "Enter a valid email address.";
  if (v.phone.trim() && !isNigerianPhone(v.phone))
    e.phone = "Enter a Nigerian number starting with +234 or 0.";
  if (!v.country) e.country = "Choose your country.";
  if (v.country === "Nigeria") {
    if (!v.state) e.state = "Choose your state.";
    if (v.state && !v.lga) e.lga = "Choose your local government area.";
  }
  return e;
}

function Field({
  label,
  htmlFor,
  required,
  error,
  className = "",
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 ml-1 block text-xs font-semibold text-black/80 dark:text-white/80"
      >
        {label}
        {required && <span className="text-[#ee2e29]"> *</span>}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1 ml-3 text-xs text-[#ee2e29]">
          {error}
        </p>
      )}
    </div>
  );
}

function UploadBox({
  id,
  label,
  file,
  error,
  required,
  onPick,
  onRemove,
}: {
  id: string;
  label: string;
  file: File | null;
  error?: string;
  required?: boolean;
  onPick: (file: File) => void;
  onRemove: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  // A local, in-browser preview only. It is never uploaded or stored, and
  // is released again as soon as the file changes or the box goes away.
  const previewUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file],
  );
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const open = () => inputRef.current?.click();
  const take = (list: FileList | null) => {
    const picked = list?.[0];
    if (picked) onPick(picked);
    // Let the same file be chosen again after a removal.
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <span className="mb-1.5 ml-1 block text-xs font-semibold text-black/80 dark:text-white/80">
        {label}
        {required && <span className="text-[#ee2e29]"> *</span>}
      </span>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_MIME.join(",")}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) => take(e.target.files)}
      />

      {file && previewUrl ? (
        <div className="rounded-2xl bg-[#f1f4f8] p-3 dark:bg-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt={`Preview of ${label}`}
            className="h-32 w-full rounded-xl bg-white object-contain"
          />
          <p className="mt-2 truncate text-xs font-semibold" title={file.name}>
            {file.name}
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-[#12a066]">
            <Check size={14} /> Uploaded
          </p>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={open}
              className="rounded-full border border-black/15 bg-white px-4 dark:border-white/20 dark:bg-white/10 py-1.5 text-xs font-bold transition hover:border-[#fc8a0d]"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="rounded-full border border-black/15 bg-white px-4 dark:border-white/20 dark:bg-white/10 py-1.5 text-xs font-bold text-[#ee2e29] transition hover:border-[#ee2e29]"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          id={id}
          role="button"
          tabIndex={0}
          aria-label={`Upload ${label}`}
          onClick={open}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              open();
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setOver(true);
          }}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setOver(false);
            take(e.dataTransfer.files);
          }}
          className={`flex min-h-40 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed px-4 py-6 text-center outline-none transition focus-visible:ring-2 focus-visible:ring-[#fc8a0d]/60 ${
            over
              ? "border-[#fc8a0d] bg-[#fc8a0d]/10"
              : error
                ? "border-[#ee2e29]/60 bg-[#f1f4f8] dark:bg-white/10"
                : "border-black/20 bg-[#f1f4f8] hover:border-[#fc8a0d] dark:border-white/25 dark:bg-white/10"
          }`}
        >
          <ImagePlus size={28} className="text-[#fc8a0d]" />
          <span className="text-sm font-bold">Upload {label}</span>
          <span className="text-xs text-black/55 dark:text-white/55">
            Drag and drop or tap to select
          </span>
          <span className="text-[11px] text-black/40 dark:text-white/40">
            JPG, PNG or WEBP · up to 5 MB
          </span>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-1 ml-3 text-xs text-[#ee2e29]">
          {error}
        </p>
      )}
    </div>
  );
}

export default function RegisterForm() {
  const [values, setValues] = useState<Registration>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [failMessage, setFailMessage] = useState("");
  const [identityType, setIdentityType] = useState("");
  const [front, setFront] = useState<File | null>(null);
  const [back, setBack] = useState<File | null>(null);

  const set = <K extends keyof Registration>(key: K, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const isNigeria = values.country === "Nigeria";
  const lgas = values.state ? (NIGERIA_STATES_LGAS[values.state] ?? []) : [];

  const idConfig = getIdType(identityType);

  const chooseType = (id: string) => {
    setIdentityType(id);
    setErrors((er) => ({
      ...er,
      identityType: undefined,
      identityFront: undefined,
      identityBack: undefined,
    }));
    // A document with no back side drops any back image already chosen.
    if (getIdType(id)?.back === "none") setBack(null);
  };

  const pickFile = (slot: "front" | "back", file: File) => {
    const key = slot === "front" ? "identityFront" : "identityBack";
    const problem = validateIdentityFile(file);
    if (problem) {
      setErrors((er) => ({ ...er, [key]: problem }));
      return;
    }
    (slot === "front" ? setFront : setBack)(file);
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const removeFile = (slot: "front" | "back") => {
    (slot === "front" ? setFront : setBack)(null);
    setErrors((er) => ({
      ...er,
      [slot === "front" ? "identityFront" : "identityBack"]: undefined,
    }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const found: Errors = validate(values);
    if (!idConfig) {
      found.identityType = "Select an identification type.";
    } else {
      if (!front)
        found.identityFront = `Upload the ${idConfig.frontLabel.toLowerCase()}.`;
      if (idConfig.back === "required" && !back)
        found.identityBack = `Upload the ${idConfig.backLabel.toLowerCase()}.`;
    }
    setErrors(found);
    if (Object.keys(found).length || !idConfig || !front) {
      const first = Object.keys(found)[0];
      if (first) document.getElementById(first)?.focus();
      return;
    }
    setSubmitting(true);
    setFailMessage("");
    try {
      await submitRegistration(values, {
        type: idConfig.id,
        front,
        back: idConfig.back === "none" ? null : back,
      });
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setFailMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(to_bottom,#ffe5cf_0%,#ffe5cf_46%,#fc8a0d_46%)] px-4 py-6 dark:bg-black dark:bg-none">
      {/* Soft decorative circles, as in the design. */}
      {[
        "left-[-4rem] top-72 h-40 w-40",
        "right-[-3rem] top-80 h-48 w-48",
        "left-[8%] bottom-[-3rem] h-72 w-72",
        "right-[6%] bottom-10 h-24 w-24",
        "left-[38%] top-[-6rem] h-72 w-72",
      ].map((pos) => (
        <div
          key={pos}
          aria-hidden="true"
          className={`pointer-events-none absolute rounded-full bg-[radial-gradient(circle_at_30%_30%,#ffffff_0%,rgba(255,255,255,0.65)_35%,rgba(252,138,13,0.2)_100%)] opacity-70 dark:bg-[radial-gradient(circle_at_30%_30%,#ffb566_0%,#fc8a0d_50%,rgba(252,138,13,0.15)_100%)] dark:opacity-45 ${pos}`}
        />
      ))}

      <div className="relative mx-auto w-full max-w-2xl lg:max-w-4xl">
        <Link
          href="/"
          className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-black/70 transition-colors hover:text-black dark:text-white/70 dark:hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>

        <div className="rounded-3xl bg-white px-6 py-6 text-black shadow-2xl shadow-black/10 [color-scheme:light] sm:px-10 dark:bg-[#141414] dark:text-white dark:ring-1 dark:ring-white/10 dark:[color-scheme:dark]">
          {done ? (
            <div className="py-10 text-center">
              <h1 className="text-2xl font-extrabold sm:text-3xl">
                Thank you, {values.firstName.trim()}!
              </h1>
              <p className="mx-auto mt-3 max-w-md text-sm text-black/70 sm:text-base dark:text-white/70">
                Your registration details have been received. We’ll be in touch
                at {values.email.trim()}.
              </p>
              <Link
                href="/"
                className="mt-8 inline-block rounded-full bg-[#fc8a0d] px-8 py-3 text-sm font-bold text-white shadow-lg shadow-[#fc8a0d]/40 transition-transform hover:scale-105"
              >
                Back to home
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-center text-xl font-extrabold sm:text-2xl">
                Register
              </h1>
              <h2 className="mt-4 text-sm font-extrabold">Basic Details</h2>

              <form
                onSubmit={onSubmit}
                noValidate
                className="mt-3 grid gap-x-5 gap-y-3.5 sm:grid-cols-2 lg:grid-cols-3"
              >
                <Field
                  label="First Name"
                  htmlFor="firstName"
                  required
                  error={errors.firstName}
                >
                  <input
                    id="firstName"
                    name="firstName"
                    autoComplete="given-name"
                    placeholder="Enter first name"
                    value={values.firstName}
                    onChange={(e) => set("firstName", e.target.value)}
                    className={inputClass}
                  />
                </Field>

                <Field
                  label="Last Name"
                  htmlFor="lastName"
                  required
                  error={errors.lastName}
                >
                  <input
                    id="lastName"
                    name="lastName"
                    autoComplete="family-name"
                    placeholder="Enter last name"
                    value={values.lastName}
                    onChange={(e) => set("lastName", e.target.value)}
                    className={inputClass}
                  />
                </Field>

                <Field
                  label="Email Address"
                  htmlFor="email"
                  required
                  error={errors.email}
                >
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={values.email}
                    onChange={(e) => set("email", e.target.value)}
                    className={inputClass}
                  />
                </Field>

                <Field
                  label="Phone Number"
                  htmlFor="phone"
                  error={errors.phone}
                >
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+234 800 000 0000"
                    value={values.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    className={inputClass}
                  />
                </Field>

                <Field label="Date of Birth" htmlFor="dateOfBirth">
                  <DatePicker
                    id="dateOfBirth"
                    className={inputClass}
                    openClassName="ring-[#fc8a0d]/60"
                    max={new Date().toISOString().slice(0, 10)}
                    value={values.dateOfBirth}
                    onChange={(v) => set("dateOfBirth", v)}
                  />
                </Field>

                <fieldset>
                  <legend className="mb-1.5 ml-1 block text-xs font-semibold text-black/80 dark:text-white/80">
                    Gender
                  </legend>
                  <div className="flex h-[42px] items-center gap-6 pl-1">
                    {["Male", "Female"].map((g) => (
                      <label
                        key={g}
                        className="flex cursor-pointer items-center gap-2 text-sm"
                      >
                        <input
                          type="radio"
                          name="gender"
                          value={g}
                          checked={values.gender === g}
                          onChange={() => set("gender", g)}
                          className="h-4 w-4 accent-[#fc8a0d]"
                        />
                        {g}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <Field
                  label="Country"
                  htmlFor="country"
                  required
                  error={errors.country}
                >
                  <Select
                    className={inputClass}
                    openClassName="ring-[#fc8a0d]/60"
                    id="country"
                    value={values.country}
                    placeholder="Select country"
                    options={COUNTRIES}
                    onChange={(v) => {
                      setValues((s) => ({
                        ...s,
                        country: v,
                        state: "",
                        lga: "",
                      }));
                      setErrors((er) => ({
                        ...er,
                        country: undefined,
                        state: undefined,
                        lga: undefined,
                      }));
                    }}
                  />
                </Field>

                {isNigeria ? (
                  <>
                    <Field
                      label="State"
                      htmlFor="state"
                      required
                      error={errors.state}
                    >
                      <Select
                        className={inputClass}
                        openClassName="ring-[#fc8a0d]/60"
                        id="state"
                        value={values.state}
                        placeholder="Select state"
                        options={NIGERIA_STATES}
                        onChange={(v) => {
                          setValues((s) => ({ ...s, state: v, lga: "" }));
                          setErrors((er) => ({
                            ...er,
                            state: undefined,
                            lga: undefined,
                          }));
                        }}
                      />
                    </Field>

                    <Field
                      label="Local Government Area (LGA)"
                      htmlFor="lga"
                      required
                      error={errors.lga}
                      className="sm:col-span-2 lg:col-span-1"
                    >
                      <Select
                        className={inputClass}
                        openClassName="ring-[#fc8a0d]/60"
                        id="lga"
                        value={values.lga}
                        placeholder={
                          values.state ? "Select LGA" : "Select a state first"
                        }
                        options={lgas}
                        disabled={!values.state}
                        onChange={(v) => set("lga", v)}
                      />
                    </Field>
                  </>
                ) : (
                  <Field label="State / Region" htmlFor="state">
                    <input
                      id="state"
                      name="state"
                      placeholder="Enter state or region"
                      value={values.state}
                      onChange={(e) => set("state", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                )}

                <Field
                  label="Address"
                  htmlFor="address"
                  className="sm:col-span-2 lg:col-span-3"
                >
                  <textarea
                    id="address"
                    name="address"
                    rows={2}
                    autoComplete="street-address"
                    placeholder="Street address (optional)"
                    value={values.address}
                    onChange={(e) => set("address", e.target.value)}
                    className={`${inputClass} resize-none rounded-3xl`}
                  />
                </Field>

                <section className="sm:col-span-2 lg:col-span-3">
                  <h2 className="mt-1 text-sm font-extrabold">
                    Nigerian Identity Verification
                  </h2>
                  <p className="mt-1 text-xs text-black/60 dark:text-white/60">
                    Select an accepted Nigerian identity document and upload
                    clear images of both the front and back.
                  </p>

                  <div className="mt-3 grid gap-x-5 gap-y-3.5 sm:grid-cols-2 lg:grid-cols-3">
                    <Field
                      label="Identification Type"
                      htmlFor="identityType"
                      required
                      error={errors.identityType}
                    >
                      <Select
                        className={inputClass}
                        openClassName="ring-[#fc8a0d]/60"
                        id="identityType"
                        value={idConfig?.label ?? ""}
                        placeholder="Select identification type"
                        options={ID_TYPES.map((t) => t.label)}
                        onChange={(label) =>
                          chooseType(
                            ID_TYPES.find((t) => t.label === label)?.id ?? "",
                          )
                        }
                      />
                    </Field>
                  </div>

                  {idConfig && (
                    <div className="mt-4 grid gap-x-5 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                      <UploadBox
                        id="identityFront"
                        label={idConfig.frontLabel}
                        required
                        file={front}
                        error={errors.identityFront}
                        onPick={(f) => pickFile("front", f)}
                        onRemove={() => removeFile("front")}
                      />
                      {idConfig.back !== "none" && (
                        <UploadBox
                          id="identityBack"
                          label={idConfig.backLabel}
                          required={idConfig.back === "required"}
                          file={back}
                          error={errors.identityBack}
                          onPick={(f) => pickFile("back", f)}
                          onRemove={() => removeFile("back")}
                        />
                      )}
                    </div>
                  )}
                </section>

                <div className="mt-1 text-center sm:col-span-2 lg:col-span-3">
                  {failMessage && (
                    <p role="alert" className="mb-3 text-sm text-[#ee2e29]">
                      {failMessage}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-full bg-[#fc8a0d] px-10 py-3 text-sm font-bold text-white shadow-lg shadow-[#fc8a0d]/40 transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
                  >
                    {submitting ? "Submitting…" : "Register"}
                  </button>
                  <p className="mt-2 text-xs text-black/45 dark:text-white/45">
                    Fields marked * are required.
                  </p>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
