/**
 * @description Product image modal component that displays a gallery of product photos
 * with navigation arrows to switch between images.
 */
import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export const ProductImageModal = ({ isOpen, onClose, product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Reset current image index when modal opens or product changes
  useEffect(() => {
    if (isOpen && product) {
      setCurrentImageIndex(0);
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  // Get all available images (main photo + additional photos)
  const allImages = [];
  if (product.image) {
    allImages.push(product.image);
  }
  if (product.photos && Array.isArray(product.photos)) {
    product.photos.forEach((photo) => {
      if (photo && !allImages.includes(photo)) {
        allImages.push(photo);
      }
    });
  }

  console.log('ProductImageModal - Product:', product);
  console.log('ProductImageModal - All images:', allImages);

  // If no images available, don't show modal
  if (allImages.length === 0) return null;

  const currentImage = allImages[currentImageIndex];

  const goToPrevious = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) =>
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'Escape') onClose();
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, currentImageIndex]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-500 bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl max-h-[90vh] w-full mx-4 overflow-hidden z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {product.productNo}
            </h2>
            <p className="text-gray-600 mt-1">{product.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Image Gallery */}
        <div className="relative">
          {/* Main Image */}
          <div className="relative aspect-square bg-gray-100">
            <img
              src={currentImage}
              alt={`${product.name} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-contain"
              onError={(e) => {
                // Fallback to a default image if current image fails
                e.target.src =
                  'https://via.placeholder.com/600x600?text=Image+Not+Available';
              }}
            />

            {/* Navigation Arrows */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-700" />
                </button>

                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6 text-gray-700" />
                </button>
              </>
            )}

            {/* Image Counter */}
            {allImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {allImages.length}
              </div>
            )}
          </div>

          {/* Thumbnail Navigation */}
          {allImages.length > 1 && (
            <div className="p-4 bg-gray-50">
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      index === currentImageIndex
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src =
                          'https://via.placeholder.com/64x64?text=Error';
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Product Details
              </h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Brand:</span>{' '}
                  {product.brand || 'Neba'}
                </p>
                <p>
                  <span className="font-medium">Fabric:</span> {product.fabric}
                </p>
                <p>
                  <span className="font-medium">Colors:</span>{' '}
                  {product.colors?.join(', ')}
                </p>
                <p>
                  <span className="font-medium">Sizes:</span>{' '}
                  {product.sizes?.join(', ')}
                </p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Features</h3>
              <div className="flex flex-wrap gap-1">
                {product.features?.slice(0, 4).map((feature, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                  >
                    {feature
                      .replace(/_/g, ' ')
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  </span>
                ))}
                {product.features?.length > 4 && (
                  <span className="text-xs text-gray-500 px-2 py-1">
                    +{product.features.length - 4} more
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
