'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { useTheme } from 'next-themes';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen bg-gradient-custom">
      <div className="noise" />
      <Header />
      <main className="pt-8 px-4 sm:px-6"> {/* Adjusted top padding */}
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">Settings</h1>
          
          {/* Account Section */}
          <div className="bg-gray-800/50 rounded-lg p-4 sm:p-6 backdrop-blur-sm mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-white">Account</h2>
                <p className="text-sm sm:text-base text-gray-400 mt-1">Manage your account settings</p>
              </div>
              
              {session ? (
                <button
                  onClick={handleSignOut}
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 transition-colors"
                >
                  Sign Out
                </button>
              ) : (
                <Link
                  href="/auth/signin"
                  className="w-full sm:w-auto text-center bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>

          {/* Appearance Section */}
          <div className="bg-gray-800/50 rounded-lg p-4 sm:p-6 backdrop-blur-sm mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-white">Appearance</h2>
                <p className="text-sm sm:text-base text-gray-400 mt-1">Customize how Emmflix looks on your device</p>
              </div>
              
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg px-4 py-2 transition-colors"
              >
                {theme === 'dark' ? (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                    </svg>
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* About Us Section */}
          <div className="bg-gray-800/50 rounded-lg p-4 sm:p-6 backdrop-blur-sm">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-white">About Us</h2>
              <p className="text-sm sm:text-base text-gray-400 mt-1">Learn more about Emmflix</p>
              
              <div className="mt-4 space-y-4 text-gray-300 text-sm sm:text-base">
                <p>
                  Emmflix is your premier destination for streaming movies and TV shows. 
                  We're dedicated to bringing you the best entertainment experience possible.
                </p>
                <div className="space-y-2">
                  <h3 className="text-white font-semibold">Contact Information:</h3>
                  <p>Phone: 09037441641</p>
                  <p>Email: emmanueledobor34@gmail.com</p>
                  <p>Version: 1.0.0</p>
                </div>
                <div className="pt-4 flex flex-wrap gap-2">
                  <Link 
                    href="/terms" 
                    className="text-red-500 hover:text-red-400 transition-colors"
                  >
                    Terms of Service
                  </Link>
                  <span className="text-gray-600 hidden sm:inline">•</span>
                  <Link 
                    href="/privacy" 
                    className="text-red-500 hover:text-red-400 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}





