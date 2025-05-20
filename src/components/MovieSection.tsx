'use client';  // Add this at the top since we're using client-side animations

import { Movie } from '@/types/movie';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';  // Add AnimatePresence

interface MovieSectionProps {
  title: string;
  movies: Movie[];
  isLoading?: boolean;
  error?: string | null;
  showVideo?: boolean;
  isTrending?: boolean;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  show: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const MovieSection: React.FC<MovieSectionProps> = ({ 
  title, 
  movies, 
  isLoading, 
  error,
  showVideo = true,
  isTrending = false
}) => {
  if (isLoading) {
    return (
      <section className="space-y-4 px-4">
        <h2 className="text-center text-3xl font-extrabold text-white">{title}</h2>
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
      <section className="space-y-4 px-4">
        <h2 className="text-center text-3xl font-extrabold text-white">{title}</h2>
        <div className="p-4 bg-red-900/50 rounded-lg">
          <p className="text-red-200">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className={`space-y-8 px-4 ${isTrending ? 'trending-section' : ''}`}>
      <AnimatePresence>
        {isTrending ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-4"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-white">
              {title}
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Discover the hottest movies taking the world by storm right now
            </p>
          </motion.div>
        ) : (
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-extrabold text-white"
          >
            {title}
          </motion.h2>
        )}
      </AnimatePresence>
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className={`grid gap-4 ${
          isTrending 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5' 
            : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
        }`}
      >
        {movies?.map((movie) => (
          <motion.div
            key={movie.id}
            variants={item}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              href={`/movie/${movie.id}`}
              className={`block relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-800 
                ${isTrending ? 'shadow-xl' : ''}`}
            >
              {movie.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={`${movie.title} movie poster`}
                  fill
                  className="object-cover"
                  sizes={isTrending 
                    ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    : "(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                  }
                />
              ) : null}
              
              <motion.div 
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent"
              >
                <div className="absolute bottom-0 p-4 text-white">
                  <h3 className={`font-bold ${isTrending ? 'text-lg' : ''}`}>
                    {movie.title}
                  </h3>
                  <p className="text-sm text-gray-300">
                    {new Date(movie.release_date).getFullYear()}
                  </p>
                  <div className="flex items-center text-sm text-gray-300">
                    <span className="text-yellow-400 mr-1">★</span>
                    <span aria-label={`Rated ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'} out of 10`}>
                      {movie.vote_average 
                        ? `${Number(movie.vote_average).toFixed(1)}/10`
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default MovieSection;


