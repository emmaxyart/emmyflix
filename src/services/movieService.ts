const BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

if (!BASE_URL || !API_KEY) {
  throw new Error('TMDB environment variables are not properly configured');
}


export async function fetchMovies(endpoint: string, params: Record<string, string> = {}) {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const baseUrl = process.env.NEXT_PUBLIC_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
  
  // Build query string from params
  const queryParams = new URLSearchParams({
    api_key: apiKey as string,
    language: 'en-US',
    ...params
  });
  
  const url = `${baseUrl}${endpoint}?${queryParams.toString()}`;
  
  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data from TMDB API: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
}

// Define common endpoints
export const movieEndpoints = {
  trending: '/trending/movie/week',
  popular: '/movie/popular',
  topRated: '/movie/top_rated',
  upcoming: '/movie/upcoming',
  nowPlaying: '/movie/now_playing',
  // Add genre-specific endpoints
  action: '/discover/movie?with_genres=28',
  adventure: '/discover/movie?with_genres=12',
  comedy: '/discover/movie?with_genres=35',
  drama: '/discover/movie?with_genres=18',
  horror: '/discover/movie?with_genres=27'
};

