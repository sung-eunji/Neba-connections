/**
 * @description This file defines a comprehensive Input component supporting various input types with validation.
 * It includes label, error message, and helper text functionality with proper accessibility attributes.
 * The component supports text, email, number, textarea, and select input types with consistent styling.
 */
import React from 'react';
import { AlertCircle } from 'lucide-react';

export const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  options = [],
  rows = 4,
  ...props
}) => {
  const inputId = React.useId();
  const errorId = React.useId();
  const helperId = React.useId();

  const baseInputClasses =
    'w-full px-3 py-2.5 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';
  const inputClasses = error
    ? `${baseInputClasses} border-red-300 focus:border-red-500 focus:ring-red-500`
    : `${baseInputClasses} border-gray-300 focus:border-secondary focus:ring-secondary`;

  const renderInput = () => {
    const commonProps = {
      id: inputId,
      value,
      onChange,
      placeholder,
      required,
      disabled,
      className: `${inputClasses} ${className}`,
      'aria-describedby':
        `${error ? errorId : ''} ${helperText ? helperId : ''}`.trim() ||
        undefined,
      'aria-invalid': error ? 'true' : 'false',
      ...props,
    };

    switch (type) {
      case 'textarea':
        return <textarea rows={rows} {...commonProps} />;
      case 'select':
        return (
          <select {...commonProps}>
            <option value="">{placeholder || 'Select an option'}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      default:
        return <input type={type} {...commonProps} />;
    }
  };

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {renderInput()}
      {error && (
        <div
          id={errorId}
          className="flex items-center space-x-1 text-red-600 text-sm"
        >
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
      {helperText && !error && (
        <p id={helperId} className="text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
};
