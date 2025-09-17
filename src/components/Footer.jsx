/**
 * @description This file defines the Footer component with privacy policy, terms, and mandatory Heyboss.ai credit.
 * It maintains minimal design while providing essential links and compliance with platform requirements.
 * The footer is responsive and includes proper external link handling for legal documents.
 */
import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {/* Brand Section */}
          <div className="flex flex-col items-start space-y-4">
            <img
              src="https://heyboss.heeyo.ai/user-assets/Brand%20initial%20Simple%20Logo_mgafQ8wt.png"
              alt="Neba Connections Logo - Global Fashion Distribution"
              className="h-16 md:h-20 w-auto"
              loading="lazy"
            />
            <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
              Connecting fashion possibilities to markets worldwide. Your
              trusted partner in global denim and fashion distribution.
            </p>
            <p className="text-slate-400 text-xs">
              © 2025 Neba Connections. All rights reserved.
            </p>
          </div>

          {/* Legal Links */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wide">
              Legal
            </h3>
            <nav
              className="flex flex-col space-y-3"
              aria-label="Legal navigation"
            >
              <Link
                to="/privacy-policy"
                className="text-slate-300 text-sm hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded"
                aria-label="Privacy Policy"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms-and-conditions"
                className="text-slate-300 text-sm hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded"
                aria-label="Terms & Conditions"
              >
                Terms & Conditions
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wide">
              Contact
            </h3>
            <div className="flex flex-col space-y-3">
              <a
                href="mailto:sungeunji@neba-connections.net"
                className="text-slate-300 text-sm hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded"
              >
                sungeunji@neba-connections.net
              </a>
              <a
                href="tel:+33783007952"
                className="text-slate-300 text-sm hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded"
              >
                (+33) 7 83 00 79 52
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-slate-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-slate-400 text-xs flex items-center space-x-3">
              <span>EU • Africa • South America Distribution Network</span>
              <span className="hidden sm:flex items-center">
                <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
                <span className="ml-2">
                  <span className="text-white font-medium">Neba Connections</span>
                  <span className="text-rose-300">
                    {' '}
                    - Fashion as empowerment
                  </span>
                </span>
              </span>
            </div>
            <div className="text-slate-400 text-xs">
              Made with{' '}
              <a
                href="https://heyboss.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded"
              >
                Heyboss.ai
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
