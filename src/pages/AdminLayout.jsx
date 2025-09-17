/**
 * @description This component defines the main layout for the admin dashboard with enhanced accessibility.
 * It includes a responsive header with proper navigation landmarks, logout functionality, and high-contrast design.
 * The layout ensures optimal user experience across all screen sizes with clear visual hierarchy.
 */

import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../libs/supabase';
import { Footer } from '../components/Footer';
import { Button } from '../components/common/Button';
import { LogOut, Settings, Database, Home } from 'lucide-react';

export const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Admin Header */}
      <header
        className="bg-white shadow-lg border-b border-slate-200"
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <Link
                to="/admin"
                className="flex items-center space-x-3 hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg p-2 -m-2"
                aria-label="Admin Dashboard Home"
              >
                <Database
                  className="w-8 h-8 text-slate-800"
                  aria-hidden="true"
                />
                <div>
                  <h1 className="text-xl font-bold text-slate-900">
                    Admin Dashboard
                  </h1>
                  <p className="text-sm text-slate-600">Neba Connections</p>
                </div>
              </Link>
            </div>

            {/* Navigation */}
            <nav
              className="flex items-center space-x-4"
              role="navigation"
              aria-label="Admin navigation"
            >
              <Link
                to="/"
                className="flex items-center space-x-2 px-4 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Return to main website"
              >
                <Home className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">Back to Site</span>
              </Link>

              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 text-slate-700 hover:text-red-600 hover:bg-red-50"
                aria-label="Sign out of admin dashboard"
              >
                <LogOut className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8" role="main">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
