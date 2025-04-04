'use client';

import { useState, useEffect } from 'react';
import { Movie } from '@/types/movie';

export default function TestApiConnection() {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/test-connection')
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setMovie(data.movie);
        }
      })
      .catch(err => setError(err.message));
  }, []);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">API Connection Test</h2>
      <p>Successfully fetched: {movie.title}</p>
    </div>
  );
}