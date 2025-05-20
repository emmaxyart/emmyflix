'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Movie } from '@/types/movie';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';

interface MovieGridProps {
  movies: Movie[];
  showVideo?: boolean;
}

export default function MovieGrid({ movies, showVideo = true }: MovieGridProps) {
  const { data: session } = useSession();
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [errorStates, setErrorStates] = useState<Record<string, string>>({});

  const handleStream = async (e: React.MouseEvent, movieId: string) => {
    e.preventDefault();
    if (!session) {
      window.location.href = '/api/auth/signin';
      return;
    }

    setLoadingStates(prev => ({ ...prev, [`stream_${movieId}`]: true }));
    setErrorStates(prev => ({ ...prev, [`stream_${movieId}`]: '' }));

    try {
      const response = await fetch(`/api/stream/${movieId}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      window.open(data.streamUrl, '_blank');
    } catch (error: any) {
      setErrorStates(prev => ({ 
        ...prev, 
        [`stream_${movieId}`]: error.message || 'Failed to start stream'
      }));
    } finally {
      setLoadingStates(prev => ({ ...prev, [`stream_${movieId}`]: false }));
    }
  };

  const handleDownload = async (movieId: string) => {
    if (!session) {
      toast.error('Please sign in to download');
      return;
    }

    const loadingKey = `download_${movieId}`;
    setLoadingStates(prev => ({ ...prev, [loadingKey]: true }));

    try {
      const response = await fetch(`/api/download/${movieId}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      // Open download in new tab
      window.open(data.downloadUrl, '_blank');
      toast.success('Download started');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to start download');
    } finally {
      setLoadingStates(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {movies.map((movie) => (
        <Link 
          key={movie.id} 
          href={showVideo ? `/movie/${movie.id}` : '#'}
          className="relative group overflow-hidden rounded-lg transition-all duration-300 hover:scale-105 hover:z-10 hover:shadow-xl hover:shadow-black/50"
        >
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            width={500}
            height={750}
            className="object-cover w-full h-full"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx0eHh0dHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/2wBDAR"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-white text-lg font-semibold line-clamp-2">{movie.title}</h3>
              <p className="text-gray-300 text-sm">{new Date(movie.release_date).getFullYear()}</p>
              <div className="flex items-center mt-2">
                <span className="text-yellow-400">★</span>
                <span className="text-gray-300 ml-1">{movie.vote_average.toFixed(1)}</span>
              </div>
              {showVideo && (
                <div className="flex gap-2 mt-2">
                  <button 
                    onClick={(e) => handleStream(e, movie.id.toString())}
                    disabled={loadingStates[`stream_${movie.id}`]}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingStates[`stream_${movie.id}`] ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Loading...
                      </span>
                    ) : 'Stream'}
                  </button>
                  <button 
                    onClick={() => handleDownload(movie.id.toString())}
                    disabled={loadingStates[`download_${movie.id}`]}
                    className="bg-gray-700 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingStates[`download_${movie.id}`] ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Loading...
                      </span>
                    ) : 'Download'}
                  </button>
                </div>
              )}
              {(errorStates[`stream_${movie.id}`] || errorStates[`download_${movie.id}`]) && (
                <p className="text-red-500 text-sm mt-2">
                  {errorStates[`stream_${movie.id}`] || errorStates[`download_${movie.id}`]}
                </p>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}






