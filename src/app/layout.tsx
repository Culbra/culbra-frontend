import type { Metadata } from "next";
import { Geist_Mono, Montserrat } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Official secondary brand font.
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Culbra — Where You Come From Matters",
  description:
    "Culbra gives you a stage to express your culture, explore it and make it part of the experience.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistMono.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
