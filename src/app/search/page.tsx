'use client';

import { useState } from 'react';
import Header from "@/components/Header";
import MovieSection from "@/components/MovieSection";
import { Movie } from '@/types/movie';
import { useDebounce } from '@/hooks/useDebounce';

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const debouncedSearch = useDebounce(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_TMDB_BASE_URL}/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${encodeURIComponent(searchQuery)}&language=en-US&page=1&include_adult=false`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();
      
      if (!data.results || !Array.isArray(data.results)) {
        throw new Error('Invalid response format');
      }

      setSearchResults(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search movies');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, 500); // 500ms delay

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    debouncedSearch(searchQuery);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 px-4 space-y-8 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-2xl mx-auto">
          <input
            type="search"
            placeholder="Search movies..."
            className="w-full p-4 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-red-600 outline-none"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        
        {isLoading ? (
          <MovieSection 
            title="Searching..." 
            movies={[]} 
            isLoading={true}
          />
        ) : error ? (
          <div className="max-w-2xl mx-auto p-4 bg-red-900/50 rounded-lg">
            <p className="text-red-200">{error}</p>
          </div>
        ) : searchResults.length > 0 ? (
          <MovieSection 
            title="Search Results" 
            movies={searchResults} 
            showVideo={true}
          />
        ) : query && (
          <div className="max-w-2xl mx-auto text-center text-gray-400">
            No movies found for "{query}"
          </div>
        )}
      </main>
    </>
  );
}
