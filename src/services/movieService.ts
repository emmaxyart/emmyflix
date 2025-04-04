const BASE_URL = process.env.TMDB_BASE_URL;
const API_KEY = process.env.TMDB_API_KEY;

if (!BASE_URL || !API_KEY) {
  throw new Error('TMDB environment variables are not properly configured');
}

import { MovieResponse } from '@/types/movie';

export async function fetchMovies(endpoint: string): Promise<MovieResponse> {
  try {
    const response = await fetch(
      `${BASE_URL}${endpoint}?api_key=${API_KEY}&language=en-US`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
}

export const movieEndpoints = {
  trending: '/trending/movie/week',
  popular: '/movie/popular',
  topRated: '/movie/top_rated',
  upcoming: '/movie/upcoming',
} as const;

