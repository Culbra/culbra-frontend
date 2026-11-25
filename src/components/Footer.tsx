import Image from "next/image";
import Link from "next/link";
import ScrollLink from "./ScrollLink";
import ContactButton from "./ContactButton";

const REGISTER_HREF = process.env.NEXT_PUBLIC_REGISTER_HREF ?? "/register";

// Links start with "/" so they also work from pages other than the home page.
// An item without an href is shown as plain text.
const COLUMNS: { title: string; links: { label: string; href?: string; contact?: boolean }[] }[] =
  [
    {
      title: "About",
      links: [
        { label: "What is CULBRA", href: "/#about" },
        { label: "What to Expect", href: "/#expect" },
        { label: "The Journey", href: "/#journey" },
        { label: "Prizes", href: "/#prizes" },
      ],
    },
    {
      title: "Get Involved",
      links: [
        { label: "Register", href: REGISTER_HREF },
        { label: "Contact us", contact: true },
        { label: "Partner with Us", href: "/partner#partner-form" },
        { label: "FAQ", href: "/#faq" },
      ],
    },
  ];

// CULBRA's official profiles (share-tracking parameters removed).
const SOCIALS: { label: string; href: string; path: React.ReactNode }[] = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/culbrafrica",
    path: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
      </>
    ),
  },
  {
    label: "X",
    href: "https://x.com/culbraafrica",
    path: (
      <>
        <path d="M4 4l11.733 16h4.267l-11.733-16z" />
        <path d="M4 20l6.768-6.768m2.46-2.46L20 4" />
      </>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/CulbraAfrica",
    path: (
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@culbraafrica",
    path: (
      <>
        <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
        <path d="M10 9.5v5l4.5-2.5z" fill="currentColor" />
      </>
    ),
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@culbraafrica",
    path: (
      <path d="M21 7.917v4.034a9.948 9.948 0 0 1-5-1.951v4.5a6.5 6.5 0 1 1-8-6.326v4.326a2.5 2.5 0 1 0 4 2V3h4.083A6.005 6.005 0 0 0 21 7.917z" />
    ),
  },
];

const LEGAL = [
  // TODO: point these at real pages once they exist.
  { label: "Terms & Conditions", href: "#" },
  { label: "Privacy Policy", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0b0b0b] px-6 pt-14 pb-8 text-white sm:pt-16 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
          <div className="max-w-sm">
            <Link href="/" aria-label="CULBRA home">
              <Image
                src="/images/logo-v2.png"
                alt="CULBRA"
                width={1054}
                height={268}
                className="h-9 w-auto sm:h-10"
              />
            </Link>
            <p className="mt-6 text-sm leading-relaxed text-white/75">
              An eight-week youth creativity competition where culture, brains,
              and creativity get seen, tested, celebrated, and converted into
              impact.
            </p>
            <ul className="mt-7 flex items-center gap-5">
              {SOCIALS.map(({ label, href, path }) => (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-white transition-colors hover:text-culbra-green"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      {path}
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-8 gap-y-10 sm:gap-x-16 lg:gap-x-24"
          >
            {COLUMNS.map(({ title, links }) => (
              <div key={title}>
                <h2 className="text-xs font-medium text-white/60">{title}</h2>
                <ul className="mt-5 space-y-4">
                  {links.map(({ label, href, contact }) => (
                    <li key={label}>
                      {contact ? (
                        <ContactButton className="text-sm font-medium transition-colors hover:text-culbra-green">
                          {label}
                        </ContactButton>
                      ) : href ? (
                        <ScrollLink
                          href={href}
                          className="text-sm font-medium transition-colors hover:text-culbra-green"
                        >
                          {label}
                        </ScrollLink>
                      ) : (
                        <span className="text-sm font-medium">{label}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-4 text-xs text-white/75 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Copyright © {new Date().getFullYear()} CULBRA.
            All rights reserved.
          </p>
          <ul className="flex gap-8">
            {LEGAL.map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="transition-colors hover:text-white"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
