/**
 * @description This file defines the About Us page with a placeholder message for future development.
 * It includes a centered card layout with the company mission and indicates the page is under construction.
 * The page maintains consistent styling with the rest of the application while serving as a temporary placeholder.
 */
import React from 'react';
import { Button } from '../components/common/Button';
import { Link } from 'react-router-dom';
import { ArrowRight, Building, Users, Globe } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mb-8">
            <img
              src="https://heyboss.heeyo.ai/user-assets/Brand initial Simple Logo_sWHBd-vU.png"
              alt="Neba Connections Logo"
              className="h-16 w-auto mx-auto mb-6"
            />
            <h1 className="text-3xl font-heading font-bold text-primary mb-4">
              About Us
            </h1>
          </div>

          <div className="space-y-6 mb-8">
            <p className="text-lg text-gray-600 leading-relaxed">
              This page is currently in development. Learn more about Neba's
              story, mission, and values soon.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
              <div className="text-center">
                <Building className="w-8 h-8 text-secondary mx-auto mb-3" />
                <h3 className="font-heading font-semibold text-primary mb-2">
                  Our Story
                </h3>
                <p className="text-sm text-gray-600">
                  Company history and founding principles
                </p>
              </div>
              <div className="text-center">
                <Users className="w-8 h-8 text-secondary mx-auto mb-3" />
                <h3 className="font-heading font-semibold text-primary mb-2">
                  Our Team
                </h3>
                <p className="text-sm text-gray-600">
                  Leadership and operational philosophy
                </p>
              </div>
              <div className="text-center">
                <Globe className="w-8 h-8 text-secondary mx-auto mb-3" />
                <h3 className="font-heading font-semibold text-primary mb-2">
                  Our Vision
                </h3>
                <p className="text-sm text-gray-600">
                  Global mission and future goals
                </p>
              </div>
            </div>

            <p className="text-gray-600">
              In the meantime, explore our product collections or learn about
              partnership opportunities.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-secondary hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 active:scale-95 group">
                <span className="flex items-center justify-center">
                  View Products
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </span>
              </button>
            </Link>
            <Link to="/contact" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-transparent hover:bg-slate-100 text-primary border-2 border-primary hover:bg-primary hover:text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 active:scale-95">
                Contact Us
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
