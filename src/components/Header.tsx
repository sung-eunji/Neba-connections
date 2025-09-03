'use client';

import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              <span className="font-['Anton']">Neba</span>
              <span className="font-['Arial']">.</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <div className="text-gray-600">Menu 1</div>
            <div className="text-gray-600">Menu 2</div>
            <div className="text-gray-600">Menu 3</div>
            <div className="text-gray-600">Menu 4</div>
            <div className="text-gray-600">Menu 5</div>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              <div className="text-gray-600 px-3 py-2">Menu 1</div>
              <div className="text-gray-600 px-3 py-2">Menu 2</div>
              <div className="text-gray-600 px-3 py-2">Menu 3</div>
              <div className="text-gray-600 px-3 py-2">Menu 4</div>
              <div className="text-gray-600 px-3 py-2">Menu 5</div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
