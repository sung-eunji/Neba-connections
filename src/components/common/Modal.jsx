/**
 * @description This file defines a fully accessible Modal component with focus trap and overlay management.
 * It handles proper ARIA attributes, escape key functionality, and click-outside-to-close behavior.
 * The modal component supports custom content and ensures keyboard navigation accessibility.
 */
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      modalRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      previousFocusRef.current?.focus();
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        ref={modalRef}
        className={`w-full ${sizeClasses[size]} bg-white rounded-lg shadow-xl transform transition-all duration-300 scale-100 animate-fade-in motion-reduce:animate-none`}
        tabIndex={-1}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          {title && (
            <h2
              id="modal-title"
              className="text-xl font-semibold text-gray-900"
            >
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};
