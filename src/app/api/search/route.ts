import { NextResponse, type NextRequest } from "next/server";
import { getByGenre, getPopular, searchAnime } from "@/lib/anilist";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  const genre = req.nextUrl.searchParams.get("genre")?.trim() ?? "";

  try {
    let results;
    if (q) {
      results = await searchAnime(q, 30);
      if (genre) results = results.filter((a) => a.genres.includes(genre));
    } else if (genre) {
      results = await getByGenre(genre, 30);
    } else {
      results = await getPopular(30);
    }
    return NextResponse.json(results);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 502 });
  }
}
