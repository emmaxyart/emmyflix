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
        <div className="noise" />
        <Header />
        <main className="min-h-screen bg-gradient-custom">
          {/* Trending Section with Jumbotron styling */}
          <div className="bg-gradient-to-b from-black/80 to-transparent py-16">
            <div className="max-w-[1400px] mx-auto">
              <MovieSection 
                title="Trending Now" 
                movies={trending.results} 
                showVideo={true}
                isTrending={true}
              />
            </div>
          </div>

          {/* Other Sections */}
          <div className="max-w-[1400px] mx-auto space-y-16 pb-12 pt-12">
            <MovieSection title="Popular Movies" movies={popular.results} showVideo={true} />
            <MovieSection title="Top Rated" movies={topRated.results} showVideo={true} />
            <MovieSection title="Upcoming" movies={upcoming.results} showVideo={false} />
          </div>
        </main>
      </>
    );
  } catch (error) {
    return <div>Error: {error instanceof Error ? error.message : 'Unknown error'}</div>;
  }
}










