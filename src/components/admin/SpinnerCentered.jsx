/**
 * @description This component renders a centered loading spinner with enhanced accessibility.
 * It provides proper ARIA attributes and screen reader support for loading states.
 * The spinner uses high-contrast colors and responsive sizing for optimal visibility.
 */
import React from 'react';
import { Loader2 } from 'lucide-react';

export const SpinnerCentered = ({ message = 'Loading...', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-full w-full min-h-[200px] p-4"
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <Loader2
        className={`${sizeClasses[size]} animate-spin text-gray-800 mb-3`}
        aria-hidden="true"
      />
      <p className="text-sm font-medium text-gray-700 text-center">{message}</p>
      <span className="sr-only">Loading content, please wait...</span>
    </div>
  );
};
