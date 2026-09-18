import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import Row from "@/components/Row";
import { displayTitle, getAnime, landscapeImage, stripHtml, type Anime } from "@/lib/anilist";

export default async function AnimeDetailPage({ params }: PageProps<"/anime/[id]">) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) notFound();

  const anime = await getAnime(numericId).catch(() => null);
  if (!anime) notFound();

  const similar = (anime.recommendations?.nodes ?? [])
    .map((n) => n.mediaRecommendation)
    .filter((m): m is Anime => Boolean(m));
  const studio = anime.studios?.nodes[0]?.name;
  const hasTrailer = anime.trailer?.site === "youtube";

  return (
    <>
      <section className="relative h-[70vh] min-h-[460px] w-full overflow-hidden">
        <Image src={landscapeImage(anime)} alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/40" />
      </section>

      <Reveal className="relative z-10 -mt-72 px-6 md:px-12">
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="reveal relative hidden aspect-[2/3] w-56 shrink-0 overflow-hidden rounded-lg shadow-2xl md:block">
            <Image src={anime.coverImage.extraLarge} alt={displayTitle(anime)} fill sizes="224px" className="object-cover" />
          </div>

          <div className="max-w-3xl">
            <h1 className="reveal text-4xl font-black md:text-5xl">{displayTitle(anime)}</h1>
            {anime.title.english && anime.title.romaji !== anime.title.english && (
              <p className="reveal mt-1 text-muted">{anime.title.romaji}</p>
            )}

            <div className="reveal mt-4 flex flex-wrap items-center gap-3 text-sm text-muted">
              {anime.averageScore && <span className="font-semibold text-green-400">{anime.averageScore}% match</span>}
              {anime.seasonYear && <span>{anime.seasonYear}</span>}
              {anime.episodes && <span>{anime.episodes} episodes</span>}
              {anime.duration && <span>{anime.duration} min</span>}
              {anime.format && <span className="rounded border border-white/40 px-1.5 text-xs">{anime.format}</span>}
              {anime.status && <span className="rounded border border-white/40 px-1.5 text-xs">{anime.status}</span>}
            </div>

            <div className="reveal mt-6 flex gap-3">
              <Link
                href={`/watch/${anime.id}`}
                className="flex items-center gap-2 rounded bg-white px-7 py-2.5 font-semibold text-black transition hover:bg-white/80"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                {hasTrailer ? "Play Trailer" : "Watch"}
              </Link>
              <button className="flex items-center gap-2 rounded bg-white/25 px-5 py-2.5 font-semibold backdrop-blur transition hover:bg-white/35">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                My List
              </button>
            </div>

            <p className="reveal mt-6 leading-relaxed text-white/85">{stripHtml(anime.description)}</p>

            <dl className="reveal mt-6 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              <dt className="text-muted">Genres</dt>
              <dd>{anime.genres.join(", ") || "Unknown"}</dd>
              {studio && (
                <>
                  <dt className="text-muted">Studio</dt>
                  <dd>{studio}</dd>
                </>
              )}
              {anime.season && (
                <>
                  <dt className="text-muted">Season</dt>
                  <dd className="capitalize">
                    {anime.season.toLowerCase()} {anime.seasonYear}
                  </dd>
                </>
              )}
            </dl>
          </div>
        </div>

        {anime.characters?.nodes.length ? (
          <div className="reveal mt-12">
            <h2 className="mb-3 text-lg font-semibold md:text-xl">Characters</h2>
            <div className="no-scrollbar flex gap-4 overflow-x-auto py-2">
              {anime.characters.nodes.map((c) => (
                <div key={c.id} className="w-28 shrink-0 text-center">
                  <div className="relative mx-auto aspect-[3/4] w-full overflow-hidden rounded-md bg-neutral-800">
                    <Image src={c.image.large} alt={c.name.full} fill sizes="112px" className="object-cover" />
                  </div>
                  <p className="mt-2 truncate text-xs">{c.name.full}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </Reveal>

      <div className="mt-12">
        <Row title="More Like This" items={similar} />
      </div>
    </>
  );
}
