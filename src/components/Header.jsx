/**
 * @description This file defines the main Header component with responsive navigation and mobile menu.
 * It includes the Neba logo, navigation links for all pages, and proper routing functionality.
 * The header is sticky and adapts to different screen sizes with a hamburger menu for mobile devices.
 */
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    {
      name: 'Products & Collections',
      href: '/products',
    },
    { name: 'Partnership', href: '/partnership' },
    { name: 'Contact Us', href: '/contact' },
  ];

  const isActiveLink = (href) => {
    if (href === '/' && location.pathname === '/') return true;
    if (href !== '/' && location.pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <header
      className="sticky top-0 z-50 bg-white shadow-lg border-b border-slate-200"
      role="banner"
    >
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center hover:opacity-90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg p-2 -m-2"
            aria-label="Neba Connections - Home"
          >
            <img
              src="https://heyboss.heeyo.ai/user-assets/Brand initial Simple Logo_sWHBd-vU.png"
              alt="Neba Connections Logo - Connecting Fashion Possibilities Worldwide"
              className="h-12 md:h-16 lg:h-20 w-auto"
              loading="eager"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105 motion-reduce:transform-none motion-reduce:hover:scale-100 ${
                  isActiveLink(item.href)
                    ? 'text-white bg-secondary shadow-md'
                    : 'text-primary hover:text-secondary hover:bg-blue-50 active:bg-blue-100 hover:shadow-sm'
                }`}
                aria-current={isActiveLink(item.href) ? 'page' : undefined}
              >
                <span className="flex items-center">
                  {item.name}
                  {item.highlight}
                </span>
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-3 rounded-lg text-primary hover:text-secondary hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:bg-blue-100 transition-all duration-200"
              aria-label={
                isMobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'
              }
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div
            id="mobile-menu"
            className="lg:hidden py-6 border-t border-slate-200 bg-white animate-fade-in"
          >
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-base font-semibold px-4 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isActiveLink(item.href)
                      ? 'text-white bg-secondary shadow-md'
                      : 'text-primary hover:text-secondary hover:bg-blue-50 active:bg-blue-100'
                  }`}
                  aria-current={isActiveLink(item.href) ? 'page' : undefined}
                >
                  <div className="flex items-center">
                    {item.name}
                    {item.highlight}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
