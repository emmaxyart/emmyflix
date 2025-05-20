'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState, useCallback } from 'react';

export default function Header() {
  const { data: session } = useSession();
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = useCallback(() => {
    setIsNavOpen(prev => !prev);
  }, []);

  const closeNav = useCallback(() => {
    setIsNavOpen(false);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/movies', label: 'Movies' },
    { href: '/search', label: 'Search' },
    { href: '/settings', label: 'Settings' },
  ];

  return (
    <header className="w-full bg-white/5 dark:bg-black/20 backdrop-blur-sm border-b border-gray-200/10 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between py-3 sm:py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 text-2xl sm:text-4xl font-bold text-red-600 font-sans">
            <svg 
              className="w-8 h-8 sm:w-10 sm:h-10" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M20 3H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4v2h8v-2h4c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H4V5h16v12z"/>
              <path d="M12 16c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"/>
            </svg>
            <span className="inline">Emmflix</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map(({ href, label }) => (
              <Link 
                key={href}
                href={href}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-400 hover:text-white"
            onClick={toggleNav}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isNavOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isNavOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={closeNav}
          />
          <nav className="absolute left-0 right-0 top-full mt-2 p-4 bg-gray-900 rounded-lg shadow-lg z-50 md:hidden">
            <div className="flex flex-col space-y-4">
              {navLinks.map(({ href, label }) => (
                <Link 
                  key={href}
                  href={href}
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={closeNav}
                >
                  {label}
                </Link>
              ))}
              {session && (
                <span className="text-gray-400">
                  {session.user?.name || session.user?.email}
                </span>
              )}
            </div>
          </nav>
        </>
      )}
    </header>
  );
}


