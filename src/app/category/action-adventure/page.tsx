import { fetchMovies } from "@/services/movieService";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

type Props = {
  params: Promise<{ id?: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ActionAdventurePage() {
  // Fetch action & adventure movies with multiple requests for different sections
  const [popularResponse, topRatedResponse, upcomingResponse, classicsResponse] = await Promise.all([
    fetchMovies('/discover/movie', {
      with_genres: '28,12', // 28 = Action, 12 = Adventure
      sort_by: 'popularity.desc',
      page: '1'
    }),
    fetchMovies('/discover/movie', {
      with_genres: '28,12',
      sort_by: 'vote_average.desc',
      vote_count_gte: '1000',
      page: '1'
    }),
    fetchMovies('/discover/movie', {
      with_genres: '28,12',
      sort_by: 'release_date.desc',
      primary_release_date_gte: new Date().toISOString().split('T')[0],
      page: '1'
    }),
    fetchMovies('/discover/movie', {
      with_genres: '28,12',
      sort_by: 'vote_average.desc',
      primary_release_date_lte: '2000-12-31',
      vote_count_gte: '500',
      page: '1'
    })
  ]);

  const popularMovies = popularResponse.results || [];
  const topRatedMovies = topRatedResponse.results || [];
  const upcomingMovies = upcomingResponse.results || [];
  const classicMovies = classicsResponse.results || [];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black text-white pb-16">
        {/* Hero Banner */}
        <div className="relative h-[60vh] w-full">
          {popularMovies[0]?.backdrop_path && (
            <Image
              src={`https://image.tmdb.org/t/p/original${popularMovies[0].backdrop_path}`}
              alt={popularMovies[0].title}
              fill
              className="object-cover opacity-50"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-start p-8 md:p-16">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">Action & Adventure</h1>
              <p className="text-gray-300 text-lg mb-6">
                Explosive thrills, epic battles, and heart-pounding adventures await in our collection of action-packed films.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Play Featured
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-md">
                  My List
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <section className="px-4 md:px-16 py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Popular Action & Adventure</h2>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-gray-800 rounded-full text-sm hover:bg-gray-700">
                Movies
              </button>
              <button className="px-3 py-1 bg-gray-800 rounded-full text-sm hover:bg-gray-700">
                TV Shows
              </button>
            </div>
          </div>

          {/* Movie Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {popularMovies.map((movie: { id: Key | null | undefined; poster_path: any; title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; vote_average: number; adult: any; release_date: string | number | Date; }) => (
              <Link key={movie.id} href={`/movie/${movie.id}`} className="group">
                <div className="relative aspect-[2/3] overflow-hidden rounded-md">
                  {movie.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                      <span className="text-gray-500">{movie.title}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="flex space-x-2">
                      <button className="bg-white rounded-full p-2">
                        <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 pointer-events-none">
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="text-green-500">{Math.round(movie.vote_average * 10)}% Match</span>
                      <span className="border border-gray-600 px-1 text-gray-400 text-xs">
                        {movie.adult ? '18+' : 'PG'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <h3 className="text-sm font-medium truncate">{movie.title}</h3>
                  <p className="text-xs text-gray-400">{new Date(movie.release_date).getFullYear()}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Top Rated Action */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Top Rated Action</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {topRatedMovies.map((movie) => (
                <Link key={`top-${movie.id}`} href={`/movie/${movie.id}`} className="group">
                  <div className="relative aspect-[2/3] overflow-hidden rounded-md">
                    {movie.poster_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                        <span className="text-gray-500">{movie.title}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-2">
                    <h3 className="text-sm font-medium truncate">{movie.title}</h3>
                    <div className="flex items-center text-xs text-gray-400">
                      <svg className="w-3 h-3 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                      <span>{movie.vote_average.toFixed(1)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Upcoming Action Movies */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Coming Soon</h2>
            <div className="grid grid-cols-1 gap-6">
              {upcomingMovies.slice(0, 3).map((movie) => (
                <div key={`upcoming-${movie.id}`} className="bg-gray-900/50 rounded-lg overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="relative w-full md:w-1/3 aspect-video md:aspect-auto">
                      {movie.backdrop_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w780${movie.backdrop_path}`}
                          alt={movie.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                          <span className="text-gray-500">{movie.title}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4 md:p-6 md:w-2/3">
                      <div className="flex items-center mb-2">
                        <span className="bg-red-600 text-white text-xs px-2 py-1 rounded mr-2">NEW</span>
                        <span className="text-gray-400 text-sm">Coming {new Date(movie.release_date).toLocaleDateString()}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{movie.title}</h3>
                      <p className="text-gray-300 mb-4 line-clamp-3">{movie.overview}</p>
                      <div className="flex items-center space-x-3">
                        <button className="bg-white text-black px-4 py-1 rounded flex items-center text-sm font-medium">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 22a1 1 0 0 1-1-1v-3H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-6l-3 3c-.3.3-.7.4-1 .3z"/>
                          </svg>
                          Remind Me
                        </button>
                        <button className="bg-gray-800 text-white px-4 py-1 rounded flex items-center text-sm">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                          </svg>
                          More Info
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Classic Action Movies */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Classic Action Films</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {classicMovies.map((movie) => (
                <Link key={`classic-${movie.id}`} href={`/movie/${movie.id}`} className="group">
                  <div className="relative aspect-[2/3] overflow-hidden rounded-md">
                    {movie.poster_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300 grayscale-[30%] group-hover:grayscale-0"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                        <span className="text-gray-500">{movie.title}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                      <div className="absolute bottom-3 left-3">
                        <span className="text-xs text-gray-400">{new Date(movie.release_date).getFullYear()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <h3 className="text-sm font-medium truncate">{movie.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );

