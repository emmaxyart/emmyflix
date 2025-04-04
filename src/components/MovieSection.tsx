import { Movie } from '@/types/movie';
import Image from 'next/image';
import Link from 'next/link';

interface MovieSectionProps {
  title: string;
  movies: Movie[];
  isLoading?: boolean;
  error?: string | null;
  showVideo?: boolean;
}

export default function MovieSection({ 
  title, 
  movies, 
  isLoading, 
  error,
  showVideo = true 
}: MovieSectionProps) {
  if (isLoading) {
    return (
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="animate-pulse grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-gray-800 rounded-lg" />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="p-4 bg-red-900/50 rounded-lg">
          <p className="text-red-200">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {movies?.map((movie) => (
          <Link 
            key={movie.id} 
            href={`/movie/${movie.id}`}
            className="group relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-800 transition-transform hover:scale-105"
          >
            {movie.poster_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <span className="text-gray-400">No Image</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 p-4 text-white">
                <h3 className="font-bold">{movie.title}</h3>
                <p className="text-sm text-gray-300">
                  {new Date(movie.release_date).getFullYear()}
                </p>
                <p className="text-sm text-gray-300">
                  Rating: {movie.vote_average?.toFixed(1) || 'N/A'}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

