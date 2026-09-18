"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const links = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Browse" },
];

export default function Navbar() {
  const ref = useRef<HTMLElement>(null);
  const [solid, setSolid] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useGSAP(
    () => {
      gsap.from(".nav-item", { y: -12, opacity: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" });
    },
    { scope: ref }
  );

  return (
    <header
      ref={ref}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? "bg-background" : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-[1800px] items-center gap-8 px-6 md:px-12">
        <Link href="/" className="nav-item text-2xl font-black tracking-tight text-brand">
          VONAMI
        </Link>
        <ul className="hidden items-center gap-5 text-sm md:flex">
          {links.map((l) => (
            <li key={l.href} className="nav-item">
              <Link
                href={l.href}
                className={pathname === l.href ? "font-semibold text-white" : "text-muted hover:text-white"}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="nav-item ml-auto flex items-center gap-4">
          <Link href="/search" aria-label="Search" className="text-white/90 hover:text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </Link>
          <div className="h-8 w-8 rounded bg-gradient-to-br from-brand to-orange-500" aria-hidden />
        </div>
      </nav>
    </header>
  );
}
