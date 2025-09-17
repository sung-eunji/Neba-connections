/**
 * @description This file defines a reusable Button component with multiple variants and accessibility features.
 * It supports primary, secondary, and link button styles using the design system tokens.
 * The component handles loading states, disabled states, and proper ARIA attributes for screen readers.
 */
import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 motion-reduce:transform-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100';

  const variantClasses = {
    primary:
      'bg-primary text-white hover:bg-slate-800 focus:ring-slate-500 shadow-md hover:shadow-xl',
    secondary:
      'bg-secondary text-white hover:bg-blue-600 focus:ring-blue-500 shadow-md hover:shadow-xl',
    outline:
      'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-slate-500 hover:shadow-lg',
    ghost:
      'text-primary hover:bg-slate-100 focus:ring-slate-500 hover:shadow-sm',
    link: 'text-secondary hover:text-blue-600 underline-offset-4 hover:underline focus:ring-blue-500',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      aria-disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};
