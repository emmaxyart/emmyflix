'use client';

import { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';

interface MoviePageClientProps {
  initialMovie: any;
  initialTrailer: any;
}

export default function MoviePageClient({ initialMovie, initialTrailer }: MoviePageClientProps) {
  const { data: session } = useSession();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!session) {
      toast.error('Please sign in to download');
      return;
    }

    setIsDownloading(true);

    try {
      const response = await fetch(`/api/download/${initialMovie.id}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      window.open(data.downloadUrl, '_blank');
      toast.success('Download started');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to start download');
    } finally {
      setIsDownloading(false);
    }
  };

  if (!initialMovie) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
          <div className="max-w-6xl mx-auto p-4 text-red-500">Movie not found</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-6xl mx-auto p-4">
          {/* Movie details */}
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3">
              {initialMovie.poster_path && (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${initialMovie.poster_path}`}
                  alt={initialMovie.title}
                  width={500}
                  height={750}
                  className="rounded-lg w-full"
                />
              )}
            </div>
            <div className="w-full md:w-2/3">
              <h1 className="text-4xl font-bold mb-4">{initialMovie.title}</h1>
              <p className="text-gray-400 mb-4">{initialMovie.overview}</p>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
                  >
                    {isDownloading ? 'Starting Download...' : 'Download'}
                  </button>
                </div>

                {initialTrailer && (
                  <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-4">Trailer</h2>
                    <iframe
                      width="100%"
                      height="315"
                      src={`https://www.youtube.com/embed/${initialTrailer.key}`}
                      title="Movie Trailer"
                      allowFullScreen
                      className="rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}