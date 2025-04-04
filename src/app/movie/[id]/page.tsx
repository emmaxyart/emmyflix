import Image from 'next/image';
import Header from '@/components/Header';
import { fetchMovies } from '@/services/movieService';

export default async function MoviePage({ params }: { params: { id: string } }) {
  const movie = await fetchMovies(`/movie/${params.id}`);
  const videoData = await fetchMovies(`/movie/${params.id}/videos`);
  
  const trailer = videoData.results?.find((video: any) => 
    video.type === "Trailer" && video.site === "YouTube"
  );

  return (
    <>
      <Header />
      <div className="min-h-screen p-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="relative h-[50vh] w-full">
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        </div>

        <div className="max-w-4xl mx-auto -mt-32 relative z-10 p-6 bg-black/80 rounded-lg">
          <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
          <p className="text-gray-300 mb-4">{movie.overview}</p>
          <div className="flex gap-4 text-sm mb-6">
            <p>Rating: {movie.vote_average.toFixed(1)}/10</p>
            <p>Release Date: {new Date(movie.release_date).toLocaleDateString()}</p>
          </div>
          
          {trailer && (
            <div className="aspect-video w-full">
              <iframe
                className="w-full h-full rounded-lg"
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title={`${movie.title} Trailer`}
                allowFullScreen
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

