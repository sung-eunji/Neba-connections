/**
 * @description This file defines the Products page with interactive filtering sidebar and product grid layout.
 * It displays the product catalog with filtering options for category, fabric, color, size, and length.
 * Each product card includes an RFQ button that opens the quote request modal with pre-filled product information.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '../components/common/Button';
import { RfqModal } from '../components/RfqModal';
import { ProductImageModal } from '../components/ProductImageModal';
import { Filter, Grid, List, MessageCircle, Eye } from 'lucide-react';
import { supabase, supabaseDiagnostics } from '../libs/supabase';

export const ProductsPage = () => {
  const [isRfqModalOpen, setIsRfqModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedProductForImages, setSelectedProductForImages] =
    useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Canonicalize feature tags to a unified key set
  const canonicalizeFeature = (raw) => {
    if (!raw) return null;
    const key = String(raw)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '');

    // Synonym map -> canonical key
    const map = {
      ykk: 'authentic_ykk',
      ykk_zipper: 'authentic_ykk',
      authentic_ykk: 'authentic_ykk',

      korean_design: 'korean_design_craftsmanship',
      korean_craftsmanship: 'korean_design_craftsmanship',
      korean_design_craftsmanship: 'korean_design_craftsmanship',

      eco_friendly_fabric: 'eco_friendly_fabric',
      excellent_drying: 'excellent_drying',
      elastic_waistband: 'elastic_waistband',
      moisture_absorption: 'moisture_absorption',
      heritage_design: 'heritage_design',
      urban_style: 'urban_style',
      premium_quality: 'premium_quality',

      // Keep existing unique ones as-is by default below
    };

    return map[key] || key;
  };

  const canonicalizeFeatureList = (list) => {
    const arr = Array.isArray(list) ? list : [];
    const set = new Set();
    for (const item of arr) {
      const c = canonicalizeFeature(item);
      if (c) set.add(c);
    }
    return Array.from(set);
  };
  const localProducts = [
    {
      id: 1,
      productNo: 'FJ-4075',
      name: 'Dark Blue Denim Jeans',
      image:
        'https://heyboss.heeyo.ai/1757502077-89c6e053-m.media-amazon.com-images-I-91qtVGJ0t2L.-UF350350-QL80-.jpg',
      photos: [
        'https://heyboss.heeyo.ai/1757502077-89c6e053-m.media-amazon.com-images-I-91qtVGJ0t2L.-UF350350-QL80-.jpg',
        'https://images.unsplash.com/photo-1555689502-c4b22d76c56f?ixid=M3w2MjE1MDB8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwZGVuaW0lMjBwYW50cyUyQyUyMGRhcmslMjBibHVlJTIwZGVuaW0lMkMlMjBzdHlsaXNoJTIwamVhbnN8ZW58MHx8fHwxNzU3NTAyMjE0fDA&ixlib=rb-4.1.0?w=1024&h=1024-v-1734719523-width-2000',
        'https://images.unsplash.com/photo-1724155593807-c697e78bfc83?ixid=M3w2MjE1MDB8MHwxfHNlYXJjaHwxfHxiYWJ5JTIwamVhbnMlMkMlMjBuZXV0cmFsJTIwYmx1ZSUyQyUyMGluZmFudCUyMGNsb3RoaW5nfGVufDB8fHx8MTc1NzUwMjIyNHww&ixlib=rb-4.1.0?w=1024&h=1024-v-1721762942-width-1920',
      ],
      colors: ['Dark Blue Denim', 'Black Denim'],
      sizes: ['S', 'M', 'L', 'XL', '2XL'],
      fabric: 'Cotton 83%, Polyester 17%',
      features: ['eco_friendly_fabric', 'inner_banding'],
      priceUnit: 'RFQ',
      brand: 'Neba Connections',
    },
    {
      id: 2,
      productNo: 'FJ-4076',
      name: 'Premium Denim Pants',
      image:
        'https://images.unsplash.com/photo-1555689502-c4b22d76c56f?ixid=M3w2MjE1MDB8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwZGVuaW0lMjBwYW50cyUyQyUyMGRhcmslMjBibHVlJTIwZGVuaW0lMkMlMjBzdHlsaXNoJTIwamVhbnN8ZW58MHx8fHwxNzU3NTAyMjE0fDA&ixlib=rb-4.1.0?w=1024&h=1024-v-1734719523-width-2000',
      photos: [
        'https://images.unsplash.com/photo-1555689502-c4b22d76c56f?ixid=M3w2MjE1MDB8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwZGVuaW0lMjBwYW50cyUyQyUyMGRhcmslMjBibHVlJTIwZGVuaW0lMkMlMjBzdHlsaXNoJTIwamVhbnN8ZW58MHx8fHwxNzU3NTAyMjE0fDA&ixlib=rb-4.1.0?w=1024&h=1024-v-1734719523-width-2000',
        'https://heyboss.heeyo.ai/1757502076-0e947d91-media.voguearabia.com-photos-677779e6f53e11c914eba5ed-2-3-w-2560-2Cc-limit-GettyImages-2173411123.jpg',
        'https://heyboss.heeyo.ai/1757502077-061fb015-m.media-amazon.com-images-I-81ztXtcRLkL.-UF8941000-QL80-.jpg',
      ],
      colors: ['Dark Blue D', 'Black D'],
      sizes: ['S', 'M', 'L', 'XL', '2XL'],
      fabric: 'Cotton 83%, Polyester 17%',
      features: ['eco_friendly_fabric', 'excellent_drying', 'ykk_zipper'],
      priceUnit: 'Upon Request',
      brand: 'Neba Connections',
    },
    {
      id: 3,
      productNo: 'FJ-4079',
      name: 'Cotton Comfort Jeans',
      image:
        'https://images.unsplash.com/photo-1724155593807-c697e78bfc83?ixid=M3w2MjE1MDB8MHwxfHNlYXJjaHwxfHxjb3R0b24lMjBjb21mb3J0JTIwamVhbnMlMkMlMjBiYWJ5JTIwamVhbnMlMkMlMjBuZXV0cmFsJTIwYmx1ZSUyMGplYW5zfGVufDB8fHx8MTc1NzUwMjIxNXww&ixlib=rb-4.1.0?w=1024&h=1024-v-1721762942-width-1920',
      photos: [
        'https://images.unsplash.com/photo-1724155593807-c697e78bfc83?ixid=M3w2MjE1MDB8MHwxfHNlYXJjaHwxfHxjb3R0b24lMjBjb21mb3J0JTIwamVhbnMlMkMlMjBiYWJ5JTIwamVhbnMlMkMlMjBuZXV0cmFsJTIwYmx1ZSUyMGplYW5zfGVufDB8fHx8MTc1NzUwMjIxNXww&ixlib=rb-4.1.0?w=1024&h=1024-v-1721762942-width-1920',
        'https://heyboss.heeyo.ai/1757502077-89c6e053-m.media-amazon.com-images-I-91qtVGJ0t2L.-UF350350-QL80-.jpg',
        'https://images.unsplash.com/photo-1555689502-c4b22d76c56f?ixid=M3w2MjE1MDB8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwZGVuaW0lMjBwYW50cyUyQyUyMGRhcmslMjBibHVlJTIwZGVuaW0lMkMlMjBzdHlsaXNoJTIwamVhbnN8ZW58MHx8fHwxNzU3NTAyMjE0fDA&ixlib=rb-4.1.0?w=1024&h=1024-v-1734719523-width-2000',
      ],
      colors: ['Black D', 'Medium D', 'Light D', 'Gray'],
      sizes: ['S', 'M', 'L', '2XL', '3XL'],
      fabric: 'Cotton 100%',
      features: ['non_stretch_fabric', 'elastic_waistband', 'authentic_ykk'],
      priceUnit: 'RFQ',
      brand: 'Neba Connections',
    },
    {
      id: 4,
      productNo: 'FJ-4080',
      name: 'Breathable Denim',
      image:
        'https://heyboss.heeyo.ai/1757502076-0e947d91-media.voguearabia.com-photos-677779e6f53e11c914eba5ed-2-3-w-2560-2Cc-limit-GettyImages-2173411123.jpg',
      photos: [
        'https://heyboss.heeyo.ai/1757502076-0e947d91-media.voguearabia.com-photos-677779e6f53e11c914eba5ed-2-3-w-2560-2Cc-limit-GettyImages-2173411123.jpg',
        'https://heyboss.heeyo.ai/1757502077-061fb015-m.media-amazon.com-images-I-81ztXtcRLkL.-UF8941000-QL80-.jpg',
        'https://images.unsplash.com/photo-1724155593807-c697e78bfc83?ixid=M3w2MjE1MDB8MHwxfHNlYXJjaHwxfHxiYWJ5JTIwamVhbnMlMkMlMjBuZXV0cmFsJTIwYmx1ZSUyQyUyMGluZmFudCUyMGNsb3RoaW5nfGVufDB8fHx8MTc1NzUwMjIyNHww&ixlib=rb-4.1.0?w=1024&h=1024-v-1721762942-width-1920',
      ],
      colors: ['Black D', 'Medium D', 'Gray'],
      sizes: ['S', 'M', 'L', 'XL', '2XL'],
      fabric: 'Lyocell 70%, Polyester 28%, Spandex 2%',
      features: ['tencel_excellent_breathability', 'moisture_absorption'],
      priceUnit: 'RFQ',
      brand: 'Neba Connections',
    },
    {
      id: 5,
      productNo: 'FJ-4081',
      name: 'Low Waist Boot Cut',
      image:
        'https://heyboss.heeyo.ai/1757502077-061fb015-m.media-amazon.com-images-I-81ztXtcRLkL.-UF8941000-QL80-.jpg',
      colors: ['Black D', 'Light D', 'Medium D'],
      sizes: ['S', 'M', 'L', 'XL', '2XL'],
      fabric: 'Cotton 75%, Polyester 23%, Spandex 2%',
      features: ['low_waist', 'boot_cut', 'authentic_ykk'],
      priceUnit: 'RFQ',
      brand: 'Neba Connections',
    },
    {
      id: 6,
      productNo: 'FJ-4082',
      name: 'Moisture Wicking Jeans',
      image:
        'https://images.unsplash.com/photo-1724155593807-c697e78bfc83?ixid=M3w2MjE1MDB8MHwxfHNlYXJjaHwxfHxtb2lzdHVyZSUyMHdpY2tpbmclMjBqZWFucyUyQyUyMGJyZWF0aGFibGUlMjBkZW5pbSUyQyUyMGNvbWZvcnRhYmxlJTIwamVhbnN8ZW58MHx8fHwxNzU3NTAyMjE0fDA&ixlib=rb-4.1.0?w=1024&h=1024-v-1728562060-width-400-height-515-crop-center',
      colors: ['Black D', 'Medium D', 'Light D', 'Gray'],
      sizes: ['S', 'M', 'L', 'XL', '2XL'],
      fabric: 'Lyocell 70%, Polyester 28%, Spandex 2%',
      features: ['excellent_breathability', 'moisture_absorption', 'back_slit'],
      priceUnit: 'RFQ',
      brand: 'Neba Connections',
    },
    {
      id: 7,
      productNo: 'FJ-4083',
      name: 'Premium Blue Denim Classic',
      image:
        'https://heyboss.heeyo.ai/1757502077-89c6e053-m.media-amazon.com-images-I-91qtVGJ0t2L.-UF350350-QL80-.jpg',
      colors: ['Blue Denim', 'Dark Blue D'],
      sizes: ['S', 'M', 'L', 'XL', '2XL'],
      fabric: 'Cotton 85%, Polyester 13%, Spandex 2%',
      features: ['premium_quality', 'comfort_fit', 'authentic_ykk'],
      priceUnit: 'RFQ',
      brand: 'Neba Connections',
    },
    {
      id: 8,
      productNo: 'FJ-4084',
      name: 'Stylish Fashion Forward Denim',
      image:
        'https://heyboss.heeyo.ai/1757502076-0e947d91-media.voguearabia.com-photos-677779e6f53e11c914eba5ed-2-3-w-2560-2Cc-limit-GettyImages-2173411123.jpg',
      colors: ['Dark Blue D', 'Black D'],
      sizes: ['S', 'M', 'L', 'XL'],
      fabric: 'Cotton 80%, Polyester 18%, Spandex 2%',
      features: ['fashion_forward', 'trendy_design', 'comfort_stretch'],
      priceUnit: 'RFQ',
      brand: 'Neba Connections',
    },
  ];
  const normalizedLocalProducts = useMemo(
    () =>
      (localProducts || []).map((p) => ({
        ...p,
        features: canonicalizeFeatureList(p.features),
      })),
    []
  );
  const [products, setProducts] = useState(normalizedLocalProducts);
  const [isUsingFallback, setIsUsingFallback] = useState(true);

  // Filter states
  const [filters, setFilters] = useState({
    brands: [],
    colors: [],
    sizes: [],
    fabrics: [],
    lengths: [],
    features: [],
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError('');
        if (import.meta.env && import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.info('[Products] Supabase diagnostics:', supabaseDiagnostics);
        }
        const { data, error: fetchError } = await supabase
          .from('products')
          .select(
            'id, product_number, color, size, origin, fabrics, tags, main_photo, photos'
          )
          .order('product_number', { ascending: true });

        if (fetchError) throw fetchError;

        const mapped = (data || []).map((row) => {
          const tags = Array.isArray(row.tags) ? row.tags : [];
          const fabrics = Array.isArray(row.fabrics) ? row.fabrics : [];
          const colors = Array.isArray(row.color) ? row.color : [];
          const sizes = Array.isArray(row.size) ? row.size : [];
          const photos = Array.isArray(row.photos) ? row.photos : [];

          const brand = 'Neba Connections';
          const nonBrandFeatures = canonicalizeFeatureList(tags);

          return {
            id: row.id,
            productNo: row.product_number,
            name:
              brand === 'Neba Connections'
                ? `Neba Connections ${row.product_number}`
                : `Denim ${row.product_number}`,
            image: row.main_photo || photos[0] || null,
            photos: photos, // Include all photos from the database
            colors,
            sizes,
            fabric: fabrics.join(', '),
            features: nonBrandFeatures,
            brand,
            priceUnit: 'RFQ',
          };
        });

        if (mapped.length > 0) {
          setProducts(mapped);
          setIsUsingFallback(false);
        }
      } catch (err) {
        console.error('Failed to load products from Supabase:', err);
        setError(err.message || 'Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filterCategories = {
    brands: ['Neba Connections'],
    colors: [
      'Dark Blue Denim',
      'Black Denim',
      'Dark Blue D',
      'Black D',
      'Medium D',
      'Light D',
      'Gray',
      'Deep Indigo',
      'Midnight Black',
      'Stone Wash',
      'Charcoal Grey',
      'Navy Blue',
      'Rich Black',
      'Vintage Blue',
      'Washed Grey',
      'Classic Indigo',
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    fabrics: [
      'Cotton 100%',
      'Cotton 83%, Polyester 17%',
      'Cotton 75%, Polyester 23%, Spandex 2%',
      'Lyocell 70%, Polyester 28%, Spandex 2%',
      'Cotton 92%, Polyester 6%, Spandex 2%',
      'Cotton 88%, Polyester 10%, Spandex 2%',
      'Cotton 95%, Spandex 5%',
    ],
    lengths: ['Basic', 'Long(LO)', 'Short(SH)'],
    // features now computed dynamically below
    features: [],
  };

  // Compute dynamic feature list based on current products and exclude universal tags
  const availableFeatures = useMemo(() => {
    const counts = new Map();
    for (const p of products) {
      const feats = Array.isArray(p.features) ? p.features : [];
      for (const f of feats) counts.set(f, (counts.get(f) || 0) + 1);
    }
    const total = products.length || 0;
    const result = [];
    for (const [f, cnt] of counts.entries()) {
      // Exclude features present on all items (universal) from filter UI
      if (total > 0 && cnt === total) continue;
      result.push(f);
    }
    // Prefer stable, readable order
    return result.sort((a, b) => a.localeCompare(b));
  }, [products]);

  const handleRequestQuote = (product) => {
    setSelectedProduct(`${product.productNo} - ${product.name}`);
    setIsRfqModalOpen(true);
  };

  const handleViewImages = (product) => {
    console.log('Opening image modal for product:', product);
    console.log('Product photos:', product.photos);
    setSelectedProductForImages(product);
    setIsImageModalOpen(true);
  };

  const formatFeature = (feature) => {
    return feature.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  };

  // Filter handling functions
  const handleFilterChange = (category, value, checked) => {
    setFilters((prev) => ({
      ...prev,
      [category]: checked
        ? [...prev[category], value]
        : prev[category].filter((item) => item !== value),
    }));
  };

  const clearFilters = () => {
    setFilters({
      brands: [],
      colors: [],
      sizes: [],
      fabrics: [],
      lengths: [],
      features: [],
    });
  };

  // Filter products based on selected filters
  const filteredProducts = products.filter((product) => {
    return Object.entries(filters).every(([category, selectedValues]) => {
      if (selectedValues.length === 0) return true;

      switch (category) {
        case 'brands':
          return selectedValues.includes(product.brand || 'Neba');
        case 'colors':
          return selectedValues.some((color) => product.colors.includes(color));
        case 'sizes':
          return selectedValues.some((size) => product.sizes.includes(size));
        case 'fabrics':
          return selectedValues.includes(product.fabric);
        case 'features':
          return selectedValues.some((feature) =>
            product.features.includes(feature)
          );
        default:
          return true;
      }
    });
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0">
            <div>
              <h1 className="text-5xl font-heading font-bold text-primary mb-4">
                Products & Collections
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl leading-relaxed">
                Discover our premium denim and fashion-forward products crafted
                for global markets with innovation and quality at the forefront.
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white shadow-sm text-secondary'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white shadow-sm text-secondary'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              <Button
                variant="outline"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="lg:hidden"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside
            className={`lg:w-64 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}
          >
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-heading font-semibold text-primary mb-6">
                Filter Products
              </h3>

              <div className="space-y-6">
                {/* Brands */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    Brands
                  </h4>
                  <div className="space-y-2">
                    {filterCategories.brands.map((brand) => (
                      <label key={brand} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.brands.includes(brand)}
                          onChange={(e) =>
                            handleFilterChange(
                              'brands',
                              brand,
                              e.target.checked
                            )
                          }
                          className="rounded border-gray-300 text-secondary focus:ring-secondary"
                        />
                        <span className="ml-2 text-sm text-gray-600 font-medium">
                          {brand}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    Colors
                  </h4>
                  <div className="space-y-2">
                    {filterCategories.colors.map((color) => (
                      <label key={color} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.colors.includes(color)}
                          onChange={(e) =>
                            handleFilterChange(
                              'colors',
                              color,
                              e.target.checked
                            )
                          }
                          className="rounded border-gray-300 text-secondary focus:ring-secondary"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          {color}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    Sizes
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {filterCategories.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => {
                          const isSelected = filters.sizes.includes(size);
                          handleFilterChange('sizes', size, !isSelected);
                        }}
                        className={`px-3 py-1 text-sm border rounded-md transition-colors ${
                          filters.sizes.includes(size)
                            ? 'border-secondary bg-secondary text-white'
                            : 'border-gray-300 hover:border-secondary hover:text-secondary'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fabric */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    Fabric Composition
                  </h4>
                  <div className="space-y-2">
                    {filterCategories.fabrics.map((fabric) => (
                      <label key={fabric} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.fabrics.includes(fabric)}
                          onChange={(e) =>
                            handleFilterChange(
                              'fabrics',
                              fabric,
                              e.target.checked
                            )
                          }
                          className="rounded border-gray-300 text-secondary focus:ring-secondary"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          {fabric}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Length */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    Length
                  </h4>
                  <div className="space-y-2">
                    {filterCategories.lengths.map((length) => (
                      <label key={length} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.lengths.includes(length)}
                          onChange={(e) =>
                            handleFilterChange(
                              'lengths',
                              length,
                              e.target.checked
                            )
                          }
                          className="rounded border-gray-300 text-secondary focus:ring-secondary"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          {length}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Features (dynamic, canonicalized, non-universal) */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    Features
                  </h4>
                  <div className="space-y-2">
                    {availableFeatures.map((feature) => (
                      <label key={feature} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.features.includes(feature)}
                          onChange={(e) =>
                            handleFilterChange(
                              'features',
                              feature,
                              e.target.checked
                            )
                          }
                          className="rounded border-gray-300 text-secondary focus:ring-secondary"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          {formatFeature(feature)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      /* Filters are applied automatically */
                    }}
                  >
                    Apply Filters
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={clearFilters}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            {error && (
              <div className="mb-4 bg-red-50 text-red-700 border border-red-200 rounded-lg p-3 text-sm">
                {error}
              </div>
            )}
            {isLoading && (
              <div className="mb-4 text-sm text-slate-600">
                Loading products…
              </div>
            )}
            {!isLoading && !error && isUsingFallback && (
              <div className="mb-4 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg p-3 text-xs">
                Showing local sample products. Connect Supabase to see live
                data.
              </div>
            )}
            <div className="mb-6 text-sm text-gray-600">
              Showing {filteredProducts.length} of {products.length} products
            </div>

            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-6'
              }
            >
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 ${
                    product.brand === 'Neba Connections'
                      ? 'border-2 border-fuchsia-100'
                      : 'border border-slate-100'
                  } overflow-hidden ${
                    viewMode === 'list'
                      ? 'flex space-x-6 p-6'
                      : 'hover:-translate-y-2'
                  }`}
                >
                  <div
                    className={`relative overflow-hidden ${
                      viewMode === 'list'
                        ? 'w-48 h-48 flex-shrink-0 rounded-xl'
                        : 'aspect-square'
                    }`}
                  >
                    <img
                      src={
                        product.image ||
                        (product.brand === 'Neba Connections'
                          ? 'https://heyboss.heeyo.ai/1757842800-69f00b0e.webp'
                          : product.image)
                      }
                      alt={`${product.name} - ${
                        product.brand === 'Neba Connections'
                          ? 'Empowering and stylish'
                          : 'Premium'
                      } ${product.productNo} fashion product with ${
                        product.fabric
                      } fabric composition from ${product.brand || 'Neba'}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                      onError={(e) => {
                        // Fallback to appropriate image based on product type
                        const fallbackImages = {
                          dark: 'https://heyboss.heeyo.ai/1757502077-061fb015-m.media-amazon.com-images-I-81ztXtcRLkL.-UF8941000-QL80-.jpg',
                          blue: 'https://heyboss.heeyo.ai/1757502077-89c6e053-m.media-amazon.com-images-I-91qtVGJ0t2L.-UF350350-QL80-.jpg',
                          light:
                            'https://images.unsplash.com/photo-1724155593807-c697e78bfc83?ixid=M3w2MjE1MDB8MHwxfHNlYXJjaHwxfHxiYWJ5JTIwamVhbnMlMkMlMjBuZXV0cmFsJTIwYmx1ZSUyQyUyMGluZmFudCUyMGNsb3RoaW5nfGVufDB8fHx8MTc1NzUwMjIyNHww&ixlib=rb-4.1.0?w=1024&h=1024-v-1721762942-width-1920',
                          vintage:
                            'https://heyboss.heeyo.ai/1757502077-406e9284-denimhunters.com-wp-content-uploads-Heavy-Faded-Selvedge-33-oz-Old-Blue-Chuck-Stockstrom-Indigo-Invitational-Y3.jpg',
                          modern:
                            'https://images.unsplash.com/photo-1619470148547-0adbfc64b595?ixid=M3w2MjE1MDB8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwZGVuaW0lMkMlMjBtb2Rlcm4lMjBwYW50cyUyQyUyMHN0eWxpc2glMjB0cm91c2Vyc3xlbnwwfHx8fDE3NTc1MDIyMjR8MA&ixlib=rb-4.1.0?w=1024&h=1024-v-1734719523-width-2000',
                          seoulline:
                            'https://heyboss.heeyo.ai/1757842800-dc098da5.webp',
                          'seoulline-alt':
                            'https://heyboss.heeyo.ai/1757842800-68f99e17.webp',
                        };

                        const name = product.name.toLowerCase();
                        if (product.brand === 'Neba Connections') {
                          // Rotate between Neba Connections images
                          const seoullineImages = [
                            fallbackImages.seoulline,
                            fallbackImages['seoulline-alt'],
                          ];
                          const randomIndex = Math.floor(
                            Math.random() * seoullineImages.length
                          );
                          e.target.src = seoullineImages[randomIndex];
                        } else if (
                          name.includes('dark') ||
                          name.includes('black')
                        ) {
                          e.target.src = fallbackImages.dark;
                        } else if (name.includes('blue')) {
                          e.target.src = fallbackImages.blue;
                        } else if (name.includes('light')) {
                          e.target.src = fallbackImages.light;
                        } else if (
                          name.includes('vintage') ||
                          name.includes('faded')
                        ) {
                          e.target.src = fallbackImages.vintage;
                        } else if (
                          name.includes('modern') ||
                          name.includes('premium')
                        ) {
                          e.target.src = fallbackImages.modern;
                        } else {
                          e.target.src = fallbackImages.blue; // Default fallback
                        }
                      }}
                    />

                    {/* Brand Logo - Top Left for Seoulienne */}
                    {/* {product.logo && product.brand === 'Seoulienne' && (
                      <div className="absolute top-4 left-4">
                        <img
                          src={product.logo}
                          alt={`${product.brand} Logo`}
                          className="h-8 w-auto bg-white/95 rounded-lg p-1 shadow-lg"
                          loading="lazy"
                        />
                      </div>
                    )} */}

                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      {/* <span className="bg-secondary text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        {product.priceUnit}
                      </span> */}
                      {product.photos && product.photos.length > 0 && (
                        <button
                          onClick={() => handleViewImages(product)}
                          className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium shadow-lg transition-all duration-200 hover:scale-105 flex items-center gap-1"
                          aria-label="View all images"
                        >
                          <Eye className="w-3 h-3" />
                          View Images
                        </button>
                      )}
                    </div>
                  </div>

                  <div className={viewMode === 'list' ? 'flex-1' : 'p-6'}>
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3
                          className={`text-xl font-heading font-bold ${
                            product.brand === 'Neba Connections'
                              ? 'text-fuchsia-800'
                              : 'text-primary'
                          }`}
                        >
                          {product.productNo}
                        </h3>
                      </div>
                      {/* <p
                        className={`font-medium ${
                          product.brand === 'Neba Connections'
                            ? 'text-fuchsia-700'
                            : 'text-slate-600'
                        }`}
                      >
                        {product.name}
                      </p> */}
                    </div>

                    <div className="space-y-4 mb-6">
                      <div>
                        <span className="text-sm font-bold text-slate-900 block mb-1">
                          Available Colors:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {product.colors.slice(0, 3).map((color) => (
                            <span
                              key={color}
                              className="bg-slate-100 text-slate-700 px-2 py-1 rounded-lg text-xs font-medium"
                            >
                              {color}
                            </span>
                          ))}
                          {product.colors.length > 3 && (
                            <span className="text-xs text-slate-500 px-2 py-1">
                              +{product.colors.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <span className="text-sm font-bold text-slate-900 block mb-1">
                          Sizes:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {product.sizes.map((size) => (
                            <span
                              key={size}
                              className="w-8 h-8 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg flex items-center justify-center"
                            >
                              {size}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-sm font-bold text-slate-900 block mb-1">
                          Fabric:
                        </span>
                        <span className="text-sm text-slate-600 bg-slate-50 px-2 py-1 rounded-lg inline-block">
                          {product.fabric}
                        </span>
                      </div>

                      <div>
                        <span className="text-sm font-bold text-slate-900 block mb-2">
                          Features:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {product.features.slice(0, 2).map((feature) => (
                            <span
                              key={feature}
                              className={`${
                                product.brand === 'Neba Connections'
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                  : 'bg-blue-50 text-blue-700 border border-blue-200'
                              } px-3 py-1 rounded-full text-xs font-medium`}
                            >
                              {formatFeature(feature)}
                            </span>
                          ))}
                          {product.features.length > 2 && (
                            <span
                              className={`text-xs ${
                                product.brand === 'Neba Connections'
                                  ? 'text-fuchsia-500'
                                  : 'text-slate-500'
                              } px-2 py-1`}
                            >
                              +{product.features.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRequestQuote(product)}
                      className={`w-full ${
                        product.brand === 'Neba Connections'
                          ? 'bg-gradient-to-r from-rose-500 to-fuchsia-600 hover:from-rose-600 hover:to-fuchsia-700'
                          : 'bg-secondary hover:bg-blue-600'
                      } text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 ${
                        product.brand === 'Neba Connections'
                          ? 'focus:ring-fuchsia-500'
                          : 'focus:ring-blue-500'
                      } focus:ring-opacity-50 active:scale-95 group/btn`}
                      aria-label={`Request quote for ${product.name}`}
                    >
                      <span className="flex items-center justify-center">
                        <MessageCircle className="w-4 h-4 mr-2 group-hover/btn:scale-125 group-hover/btn:rotate-12 transition-all duration-200" />
                        Request a Quote
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>

      {/* User Guide Banner */}
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg
              className="w-5 h-5 text-blue-600 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-blue-900 mb-1">
              How to use this page
            </h3>
            <p className="text-sm text-blue-700">
              Use the filters on the left to narrow down products by color,
              size, fabric, and features. Click "Request a Quote" on any product
              card to get pricing and availability information.
            </p>
          </div>
        </div>
      </div>

      {/* RFQ Modal */}
      <RfqModal
        isOpen={isRfqModalOpen}
        onClose={() => setIsRfqModalOpen(false)}
        productOfInterest={selectedProduct}
      />

      {/* Product Image Modal */}
      <ProductImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        product={selectedProductForImages}
      />
    </div>
  );
};
