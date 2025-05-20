import MoviePageClient from '../../../components/MoviePageClient';
import { fetchMovies } from '@/services/movieService';
import Header from '@/components/Header';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function MoviePage({ params }: PageProps) {
  try {
    const resolvedParams = await params;
    const movieId = resolvedParams.id;

    const [movieData, videoData] = await Promise.all([
      fetchMovies(`/movie/${movieId}`),
      fetchMovies(`/movie/${movieId}/videos`)
    ]);

    const trailerVideo = videoData.results?.find((video: any) => 
      video.type === "Trailer" && video.site === "YouTube"
    );

    if (!movieData) {
      return (
        <>
          <Header />
          <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
            <div className="max-w-6xl mx-auto p-4">
              <div className="text-red-500">Movie not found</div>
            </div>
          </main>
        </>
      );
    }

    return <MoviePageClient initialMovie={movieData} initialTrailer={trailerVideo} />;
  } catch (error) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
          <div className="max-w-6xl mx-auto p-4">
            <div className="text-red-500">
              Error loading movie: {error instanceof Error ? error.message : 'Unknown error'}
            </div>
          </div>
        </main>
      </>
    );
  }
}








