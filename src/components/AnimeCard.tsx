import Image from "next/image";
import Link from "next/link";
import { type Anime, displayTitle, landscapeImage } from "@/lib/anilist";

export default function AnimeCard({ anime, rank }: { anime: Anime; rank?: number }) {
  return (
    <Link href={`/anime/${anime.id}`} className="card group relative block w-[220px] shrink-0 md:w-[280px]">
      <div className="relative aspect-video overflow-hidden rounded-md bg-neutral-800">
        <Image
          src={landscapeImage(anime)}
          alt={displayTitle(anime)}
          fill
          sizes="280px"
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute inset-x-0 bottom-0 translate-y-2 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <p className="truncate text-sm font-semibold">{displayTitle(anime)}</p>
          <p className="mt-0.5 text-xs text-muted">
            {anime.averageScore ? <span className="text-green-400">{anime.averageScore}% </span> : null}
            {anime.episodes ? `${anime.episodes} eps` : anime.format}
          </p>
        </div>
        {rank !== undefined && (
          <span className="outline-number absolute -left-1 bottom-0 text-7xl md:text-8xl">{rank}</span>
        )}
      </div>
    </Link>
  );
}
