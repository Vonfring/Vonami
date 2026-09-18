import Hero from "@/components/Hero";
import Row from "@/components/Row";
import { getByGenre, getPopular, getThisSeason, getTopRated, getTrending } from "@/lib/anilist";

export default async function HomePage() {
  const [trending, thisSeason, topRated, popular, action, romance] = await Promise.all([
    getTrending(20),
    getThisSeason(20),
    getTopRated(10),
    getPopular(20),
    getByGenre("Action", 20),
    getByGenre("Romance", 20),
  ]);

  return (
    <>
      <Hero items={trending.slice(0, 5)} />
      <div className="relative z-10 -mt-24 space-y-2">
        <Row title="Trending Now" items={trending} />
        <Row title="Top 10 Highest Rated" items={topRated} ranked />
        <Row title="New This Season" items={thisSeason} />
        <Row title="All-Time Popular" items={popular} />
        <Row title="Action" items={action} />
        <Row title="Romance" items={romance} />
      </div>
    </>
  );
}
