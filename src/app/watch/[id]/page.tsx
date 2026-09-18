import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import { displayTitle, getAnime, landscapeImage, stripHtml } from "@/lib/anilist";

export default async function WatchPage({ params }: PageProps<"/watch/[id]">) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) notFound();

  const anime = await getAnime(numericId).catch(() => null);
  if (!anime) notFound();

  const youtubeId = anime.trailer?.site === "youtube" ? anime.trailer.id : null;
  const episodes = anime.streamingEpisodes?.length
    ? anime.streamingEpisodes.map((e, i) => ({ n: i + 1, title: e.title, thumb: e.thumbnail }))
    : Array.from({ length: Math.min(anime.episodes ?? 12, 24) }, (_, i) => ({
        n: i + 1,
        title: `Episode ${i + 1}`,
        thumb: landscapeImage(anime),
      }));

  return (
    <Reveal className="mx-auto max-w-[1600px] px-6 pb-16 pt-24 md:px-12">
      <Link href={`/anime/${anime.id}`} className="reveal mb-4 inline-flex items-center gap-2 text-sm text-muted hover:text-white">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m15 6-6 6 6 6" />
        </svg>
        Back to details
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="reveal relative aspect-video w-full overflow-hidden rounded-lg bg-black shadow-2xl">
            {youtubeId ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
                title={`${displayTitle(anime)} trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            ) : (
              <>
                <Image src={landscapeImage(anime)} alt="" fill sizes="100vw" className="object-cover opacity-50" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
                  <p className="text-lg font-semibold">No trailer available</p>
                  <p className="max-w-sm text-sm text-muted">
                    This demo only plays official trailers from AniList. Episodes are never hosted here.
                  </p>
                </div>
              </>
            )}
          </div>

          <h1 className="reveal mt-6 text-3xl font-black">{displayTitle(anime)}</h1>
          <div className="reveal mt-2 flex flex-wrap gap-3 text-sm text-muted">
            {anime.averageScore && <span className="font-semibold text-green-400">{anime.averageScore}% match</span>}
            {anime.seasonYear && <span>{anime.seasonYear}</span>}
            {anime.episodes && <span>{anime.episodes} episodes</span>}
            <span>{anime.genres.slice(0, 3).join(" · ")}</span>
          </div>
          <p className="reveal mt-4 max-w-3xl text-white/85">{stripHtml(anime.description)}</p>
        </div>

        <aside className="reveal">
          <h2 className="mb-3 text-lg font-semibold">Episodes</h2>
          <ul className="no-scrollbar max-h-[70vh] space-y-2 overflow-y-auto pr-1">
            {episodes.map((ep) => (
              <li
                key={ep.n}
                className={`flex gap-3 rounded-md p-2 transition hover:bg-white/10 ${ep.n === 1 ? "bg-white/10" : ""}`}
              >
                <div className="relative aspect-video w-32 shrink-0 overflow-hidden rounded bg-neutral-800">
                  <Image src={ep.thumb} alt="" fill sizes="128px" className="object-cover" />
                  <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1 text-[10px]">
                    {anime.duration ?? 24}m
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted">Episode {ep.n}</p>
                  <p className="line-clamp-2 text-sm font-medium">{ep.title}</p>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </Reveal>
  );
}
