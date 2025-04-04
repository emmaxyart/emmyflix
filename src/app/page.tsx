import { fetchMovies, movieEndpoints } from "@/services/movieService";
import MovieSection from "@/components/MovieSection";
import Header from "@/components/Header";

export default async function Home() {
  try {
    const [trending, popular, topRated, upcoming] = await Promise.all([
      fetchMovies(movieEndpoints.trending),
      fetchMovies(movieEndpoints.popular),
      fetchMovies(movieEndpoints.topRated),
      fetchMovies(movieEndpoints.upcoming),
    ]);

    return (
      <>
        <Header />
        <main className="min-h-screen pt-20 px-4 space-y-12 bg-gradient-to-b from-gray-900 to-black">
          <MovieSection title="Trending Now" movies={trending.results} showVideo={true} />
          <MovieSection title="Popular Movies" movies={popular.results} showVideo={true} />
          <MovieSection title="Top Rated" movies={topRated.results} showVideo={true} />
          <MovieSection title="Upcoming" movies={upcoming.results} showVideo={false} />
        </main>
      </>
    );
  } catch (error) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-20 px-4">
          <div className="max-w-4xl mx-auto p-4 bg-red-900/50 rounded-lg">
            <h2 className="text-xl font-bold text-red-200">Error Loading Movies</h2>
            <p className="text-red-200 mt-2">
              {error instanceof Error ? error.message : 'An unexpected error occurred'}
            </p>
          </div>
        </main>
      </>
    );
  }
}


