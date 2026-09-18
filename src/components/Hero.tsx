"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { type Anime, displayTitle, stripHtml, landscapeImage } from "@/lib/anilist";

gsap.registerPlugin(useGSAP);

const INTERVAL = 8000;

export default function Hero({ items }: { items: Anime[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const anime = items[index];

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(".hero-bg", { scale: 1.08, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.4 }).from(
        ".hero-el",
        { y: 30, opacity: 0, duration: 0.7, stagger: 0.12 },
        "-=0.9"
      );

      const timer = window.setTimeout(() => setIndex((i) => (i + 1) % items.length), INTERVAL);
      return () => window.clearTimeout(timer);
    },
    { scope: ref, dependencies: [index], revertOnUpdate: true }
  );

  if (!anime) return null;

  return (
    <section ref={ref} className="relative h-[85vh] min-h-[520px] w-full overflow-hidden">
      <div
        className="hero-bg absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${landscapeImage(anime)})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/30" />

      <div className="relative z-10 flex h-full max-w-[1800px] flex-col justify-center px-6 pt-16 md:px-12">
        <div className="max-w-xl">
          <p className="hero-el mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand">
            #{index + 1} Trending now
          </p>
          <h1 className="hero-el text-4xl font-black leading-tight md:text-6xl">{displayTitle(anime)}</h1>
          <div className="hero-el mt-4 flex flex-wrap items-center gap-3 text-sm text-muted">
            {anime.averageScore && <span className="font-semibold text-green-400">{anime.averageScore}% match</span>}
            {anime.seasonYear && <span>{anime.seasonYear}</span>}
            {anime.episodes && <span>{anime.episodes} episodes</span>}
            {anime.format && <span className="rounded border border-white/40 px-1.5 text-xs">{anime.format}</span>}
          </div>
          <p className="hero-el line-clamp-3 mt-4 text-base text-white/85 md:text-lg">
            {stripHtml(anime.description)}
          </p>
          <div className="hero-el mt-6 flex gap-3">
            <Link
              href={`/watch/${anime.id}`}
              className="flex items-center gap-2 rounded bg-white px-7 py-2.5 font-semibold text-black transition hover:bg-white/80"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              Play
            </Link>
            <Link
              href={`/anime/${anime.id}`}
              className="flex items-center gap-2 rounded bg-white/25 px-7 py-2.5 font-semibold backdrop-blur transition hover:bg-white/35"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 11v5M12 8h.01" />
              </svg>
              More Info
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 right-6 z-10 flex gap-1.5 md:right-12">
        {items.map((_, i) => (
          <button
            key={i}
            aria-label={`Show slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1 rounded-full transition-all ${i === index ? "w-6 bg-white" : "w-3 bg-white/40"}`}
          />
        ))}
      </div>
    </section>
  );
}
