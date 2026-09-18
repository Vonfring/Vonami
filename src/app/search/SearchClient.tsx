"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import AnimeCard from "@/components/AnimeCard";
import type { Anime } from "@/lib/anilist";

gsap.registerPlugin(useGSAP);

const GENRES = ["Action", "Adventure", "Comedy", "Drama", "Fantasy", "Romance", "Sci-Fi", "Slice of Life", "Sports", "Thriller"];

export default function SearchClient() {
  const router = useRouter();
  const params = useSearchParams();
  const initialQ = params.get("q") ?? "";
  const initialGenre = params.get("genre") ?? "";

  const [q, setQ] = useState(initialQ);
  const [genre, setGenre] = useState(initialGenre);
  const [results, setResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = window.setTimeout(async () => {
      const sp = new URLSearchParams();
      if (q) sp.set("q", q);
      if (genre) sp.set("genre", genre);
      router.replace(`/search${sp.toString() ? `?${sp}` : ""}`, { scroll: false });

      setLoading(true);
      try {
        const res = await fetch(`/api/search?${sp.toString()}`);
        setResults(res.ok ? await res.json() : []);
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => window.clearTimeout(t);
  }, [q, genre, router]);

  useGSAP(
    () => {
      if (!results.length) return;
      gsap.from(".card", { opacity: 0, y: 20, duration: 0.5, stagger: 0.03, ease: "power2.out" });
    },
    { scope: gridRef, dependencies: [results] }
  );

  return (
    <div className="mx-auto max-w-[1800px] px-6 pb-16 pt-24 md:px-12">
      <h1 className="text-3xl font-black">Browse</h1>

      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search titles"
            autoFocus
            className="w-full rounded-md border border-white/20 bg-white/10 py-2.5 pl-10 pr-4 outline-none placeholder:text-muted focus:border-white/60"
          />
        </div>
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {GENRES.map((g) => {
            const active = genre === g;
            return (
              <button
                key={g}
                onClick={() => setGenre(active ? "" : g)}
                className={`shrink-0 rounded-full border px-3 py-1 text-sm transition ${
                  active ? "border-white bg-white text-black" : "border-white/30 text-white/80 hover:border-white"
                }`}
              >
                {g}
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-6 text-sm text-muted">
        {loading ? "Searching…" : results.length ? `${results.length} results` : q || genre ? "No results" : "Popular right now"}
      </p>

      <div ref={gridRef} className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3">
        {results.map((a) => (
          <div key={a.id} className="[&>a]:w-full">
            <AnimeCard anime={a} />
          </div>
        ))}
      </div>
    </div>
  );
}
