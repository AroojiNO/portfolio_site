import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Geist, Geist_Mono } from "next/font/google";
import  Navbar  from "./components/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const description =
  "Noah Arooji is a Computer Science and Applied Statistics student at the University of Virginia building full-stack software and machine learning systems, most recently as a Software Development Engineer Intern at AWS.";

export const metadata: Metadata = {
  // Makes the generated preview image URL absolute for link previews
  metadataBase: new URL("https://www.noaharooji.com"),
  title: "Noah Arooji · Software Engineer & ML Researcher",
  description,
  openGraph: {
    title: "Noah Arooji · Software Engineer & ML Researcher",
    description,
    url: "/",
    siteName: "Noah Arooji",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Noah Arooji · Software Engineer & ML Researcher",
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-dark text-white antialiased`}>
        <Navbar />
        {children}
        {/* Subtle static over every page so flat dark areas don't look empty */}
        <div aria-hidden="true" className="grain pointer-events-none fixed inset-0 z-30 print:hidden" />
        <Analytics />
      </body>
    </html>
  );
}
