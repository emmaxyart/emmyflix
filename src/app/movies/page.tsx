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
      <div className="noise" />
      <Header />
      <main className="min-h-screen bg-gradient-custom">
        <MovieSection title="All Movies" movies={[...popular.results, ...topRated.results]} />
      </main>
    </>
  );
}

