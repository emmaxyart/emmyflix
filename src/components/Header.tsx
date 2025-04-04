import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Title */}
        <div className="flex justify-center py-4">
          <Link href="/" className="flex items-center space-x-2 text-4xl font-bold text-red-600 font-sans">
            <svg 
              className="w-10 h-10" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M20 3H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4v2h8v-2h4c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H4V5h16v12z"/>
              <path d="M12 16c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"/>
            </svg>
            <span>Emmflix</span>
          </Link>
        </div>
        
        {/* Navigation */}
        <nav className="flex justify-center border-t border-gray-800 py-3">
          <div className="flex space-x-8">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/movies" className="text-gray-300 hover:text-white transition-colors">
              Movies
            </Link>
            <Link href="/search" className="text-gray-300 hover:text-white transition-colors">
              Search
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}


