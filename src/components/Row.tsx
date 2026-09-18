"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Anime } from "@/lib/anilist";
import AnimeCard from "./AnimeCard";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Row({ title, items, ranked = false }: { title: string; items: Anime[]; ranked?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP(
    () => {
      gsap.from(".card", {
        opacity: 0,
        y: 24,
        duration: 0.6,
        stagger: 0.05,
        ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 90%", once: true },
      });
    },
    { scope: ref }
  );

  const scrollBy = contextSafe((dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    gsap.to(track, {
      scrollLeft: track.scrollLeft + dir * track.clientWidth * 0.8,
      duration: 0.6,
      ease: "power2.inOut",
    });
  });

  if (!items.length) return null;

  return (
    <section ref={ref} className="group/row relative mb-10">
      <h2 className="mb-3 px-6 text-lg font-semibold md:px-12 md:text-xl">{title}</h2>
      <div className="relative">
        <button
          aria-label="Scroll left"
          onClick={() => scrollBy(-1)}
          className="absolute left-0 top-0 z-20 hidden h-full w-12 items-center justify-center bg-black/50 opacity-0 transition group-hover/row:opacity-100 md:flex"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="m15 6-6 6 6 6" />
          </svg>
        </button>
        <div ref={trackRef} className="no-scrollbar flex gap-2 overflow-x-auto px-6 py-2 md:px-12">
          {items.map((a, i) => (
            <AnimeCard key={a.id} anime={a} rank={ranked ? i + 1 : undefined} />
          ))}
        </div>
        <button
          aria-label="Scroll right"
          onClick={() => scrollBy(1)}
          className="absolute right-0 top-0 z-20 hidden h-full w-12 items-center justify-center bg-black/50 opacity-0 transition group-hover/row:opacity-100 md:flex"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="m9 6 6 6-6 6" />
          </svg>
        </button>
      </div>
    </section>
  );
}
