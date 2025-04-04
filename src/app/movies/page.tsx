import { fetchMovies, movieEndpoints } from "@/services/movieService";
import MovieSection from "@/components/MovieSection";
import Header from "@/components/Header";

export default async function MoviesPage() {
  const [popular, topRated] = await Promise.all([
    fetchMovies(movieEndpoints.popular),
    fetchMovies(movieEndpoints.topRated),
  ]);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 px-4 space-y-12 bg-gradient-to-b from-gray-900 to-black">
        <MovieSection title="All Movies" movies={[...popular.results, ...topRated.results]} />
      </main>
    </>
  );
}