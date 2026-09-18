const ENDPOINT = "https://graphql.anilist.co";

export type Anime = {
  id: number;
  title: { romaji: string; english: string | null };
  coverImage: { extraLarge: string; large: string; color: string | null };
  bannerImage: string | null;
  description: string | null;
  genres: string[];
  averageScore: number | null;
  episodes: number | null;
  duration: number | null;
  season: string | null;
  seasonYear: number | null;
  format: string | null;
  status: string | null;
  trailer: { id: string; site: string; thumbnail: string | null } | null;
  studios?: { nodes: { name: string }[] };
  streamingEpisodes?: { title: string; thumbnail: string; url: string; site: string }[];
  characters?: { nodes: { id: number; name: { full: string }; image: { large: string } }[] };
  recommendations?: { nodes: { mediaRecommendation: Anime | null }[] };
};

const MEDIA_FIELDS = `
  id
  title { romaji english }
  coverImage { extraLarge large color }
  bannerImage
  description(asHtml: false)
  genres
  averageScore
  episodes
  duration
  season
  seasonYear
  format
  status
  trailer { id site thumbnail }
`;

async function gql<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`AniList request failed: ${res.status}`);
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0]?.message ?? "AniList error");
  return json.data as T;
}

type PageResult = { Page: { media: Anime[] } };

const PAGE_QUERY = `
  query ($page: Int, $perPage: Int, $sort: [MediaSort], $season: MediaSeason, $seasonYear: Int, $search: String, $genre: String) {
    Page(page: $page, perPage: $perPage) {
      media(type: ANIME, sort: $sort, season: $season, seasonYear: $seasonYear, search: $search, genre: $genre, isAdult: false) {
        ${MEDIA_FIELDS}
      }
    }
  }
`;

export async function getTrending(perPage = 20) {
  const data = await gql<PageResult>(PAGE_QUERY, { perPage, sort: ["TRENDING_DESC"] });
  return data.Page.media;
}

export async function getTopRated(perPage = 10) {
  const data = await gql<PageResult>(PAGE_QUERY, { perPage, sort: ["SCORE_DESC"] });
  return data.Page.media;
}

export async function getPopular(perPage = 20) {
  const data = await gql<PageResult>(PAGE_QUERY, { perPage, sort: ["POPULARITY_DESC"] });
  return data.Page.media;
}

export function currentSeason(date = new Date()) {
  const m = date.getMonth();
  const season = m < 3 ? "WINTER" : m < 6 ? "SPRING" : m < 9 ? "SUMMER" : "FALL";
  return { season, seasonYear: date.getFullYear() };
}

export async function getThisSeason(perPage = 20) {
  const { season, seasonYear } = currentSeason();
  const data = await gql<PageResult>(PAGE_QUERY, { perPage, sort: ["POPULARITY_DESC"], season, seasonYear });
  return data.Page.media;
}

export async function getByGenre(genre: string, perPage = 20) {
  const data = await gql<PageResult>(PAGE_QUERY, { perPage, sort: ["POPULARITY_DESC"], genre });
  return data.Page.media;
}

export async function searchAnime(search: string, perPage = 30) {
  if (!search.trim()) return [];
  const data = await gql<PageResult>(PAGE_QUERY, { perPage, sort: ["SEARCH_MATCH"], search });
  return data.Page.media;
}

const DETAIL_QUERY = `
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      ${MEDIA_FIELDS}
      studios(isMain: true) { nodes { name } }
      streamingEpisodes { title thumbnail url site }
      characters(sort: ROLE, perPage: 8) { nodes { id name { full } image { large } } }
      recommendations(sort: RATING_DESC, perPage: 12) {
        nodes { mediaRecommendation { ${MEDIA_FIELDS} } }
      }
    }
  }
`;

export async function getAnime(id: number) {
  const data = await gql<{ Media: Anime }>(DETAIL_QUERY, { id });
  return data.Media;
}

export function displayTitle(a: Anime) {
  return a.title.english ?? a.title.romaji;
}

export function stripHtml(s: string | null) {
  if (!s) return "";
  return s.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

export function landscapeImage(a: Anime) {
  return a.bannerImage ?? a.coverImage.extraLarge;
}
