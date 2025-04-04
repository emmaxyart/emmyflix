import { NextResponse } from 'next/server';
import { fetchMovies } from '@/services/movieService';

export async function GET() {
  try {
    const data = await fetchMovies('/movie/popular');
    return NextResponse.json({ 
      success: true, 
      movie: data.results[0] 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to connect to TMDB API' 
    }, { status: 500 });
  }
}