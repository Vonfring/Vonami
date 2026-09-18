import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vonami",
  description: "A Netflix-style anime discovery demo powered by the AniList API.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="px-6 py-10 text-center text-xs text-muted md:px-12">
          Vonami is a portfolio demo. Data and images come from the public AniList API. Trailers are official
          YouTube uploads. No episodes are hosted or streamed.
        </footer>
      </body>
    </html>
  );
}
