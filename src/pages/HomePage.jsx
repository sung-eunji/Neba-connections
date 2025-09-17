/**
 * @description This file defines the homepage with stunning hero section, engaging content sections, and perfect call-to-action buttons.
 * It showcases Neba's mission, differentiators, global reach, and core values with world-class design and accessibility.
 * All interactive elements provide clear feedback and smooth navigation throughout the user journey.
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { RfqModal } from '../components/RfqModal';
import { supabase } from '../libs/supabase';
import {
  Globe,
  Users,
  Zap,
  Shield,
  Heart,
  Award,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Target,
  Star,
  MessageCircle,
  Truck,
  Clock,
} from 'lucide-react';

export const HomePage = () => {
  const [isRfqModalOpen, setIsRfqModalOpen] = useState(false);

  const differentiators = [
    {
      icon: <Zap className="w-12 h-12 text-secondary" />,
      title: 'Innovation',
      description:
        "Cutting-edge designs and sustainable fabrics that set trends in the global fashion market, delivering tomorrow's styles today.",
    },
    {
      icon: <Users className="w-12 h-12 text-secondary" />,
      title: 'Trusted Partnerships',
      description:
        'Long-term relationships built on reliability, quality, and mutual growth with retailers worldwide across three continents.',
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-secondary" />,
      title: 'Global Growth',
      description:
        'Expanding reach across EU, Africa, and South America with strategic distribution networks and local market expertise.',
    },
  ];

  const marketRegions = [
    {
      name: 'European Union',
      image:
        'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=600&fit=crop&crop=center',
      description:
        'Strong foothold in European markets with established distribution channels and premium retail partnerships',
      growth: 'Leading Market',
      icon: <Star className="w-5 h-5" />,
    },
    {
      name: 'Africa',
      image:
        'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600&fit=crop&crop=center',
      description:
        'Expanding presence across African fashion markets with focus on sustainable and accessible fashion',
      growth: '+45% Growth',
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      name: 'South America',
      image:
        'https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=800&h=600&fit=crop&crop=center',
      description:
        'Growing partnerships in South American retail networks with emphasis on quality and innovation',
      growth: 'Emerging Market',
      icon: <Target className="w-5 h-5" />,
    },
  ];

  const coreValues = [
    {
      icon: <Shield className="w-8 h-8 text-secondary" />,
      title: 'Quality',
      description:
        'Uncompromising commitment to superior craftsmanship and materials in every piece we distribute',
    },
    {
      icon: <Heart className="w-8 h-8 text-secondary" />,
      title: 'Integrity',
      description:
        'Transparent business practices and ethical sourcing standards that build lasting trust',
    },
    {
      icon: <Award className="w-8 h-8 text-secondary" />,
      title: 'Excellence',
      description:
        'Continuous innovation and pursuit of industry-leading solutions for our global partners',
    },
    {
      icon: <Target className="w-8 h-8 text-secondary" />,
      title: 'Vision',
      description:
        'Forward-thinking approach to fashion distribution and sustainable global partnerships',
    },
  ];

  const features = [
    {
      icon: <Clock className="w-6 h-6 text-secondary" />,
      title: '24/7 Support',
      description: 'AI-powered assistance',
    },
    {
      icon: <Truck className="w-6 h-6 text-secondary" />,
      title: 'Global Delivery',
      description: 'Worldwide distribution',
    },
    {
      icon: <Shield className="w-6 h-6 text-secondary" />,
      title: 'Quality Assured',
      description: 'Premium standards',
    },
  ];

  // Featured products pulled from Products page data source
  const featuredNumbers = ['FJ-4066', 'FJ-5049', 'FJ-4080', 'FJ-4070'];
  const [featuredProducts, setFeaturedProducts] = useState(
    featuredNumbers.map((num) => ({
      productNo: num,
      name: `Neba Connections ${num}`,
      image: null,
      description: '',
      brand: 'Neba Connections',
    }))
  );

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(
            'id, product_number, color, size, fabrics, tags, main_photo, photos'
          )
          .in('product_number', featuredNumbers);

        if (error) throw error;

        const orderMap = featuredNumbers.reduce((acc, val, idx) => {
          acc[val] = idx;
          return acc;
        }, {});

        const mapped = (data || []).map((row) => {
          const tags = Array.isArray(row.tags) ? row.tags : [];
          const fabrics = Array.isArray(row.fabrics) ? row.fabrics : [];
          const photos = Array.isArray(row.photos) ? row.photos : [];
          return {
            productNo: row.product_number,
            name: `Neba Connections ${row.product_number}`,
            image: row.main_photo || photos[0] || null,
            description: tags.join(', '),
            brand: 'Neba Connections',
          };
        });

        if (mapped.length > 0) {
          mapped.sort((a, b) => orderMap[a.productNo] - orderMap[b.productNo]);
          setFeaturedProducts(mapped);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch featured products:', err);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1542728143-d9b537db6433?w=1920&h=1080&fit=crop&crop=center"
            alt="Premium denim fabric background"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          {/* Headlines */}
          <div className="mb-12 animate-slide-up">
            <h1 className="text-responsive-3xl md:text-responsive-5xl font-heading font-bold text-white mb-8 leading-tight">
              Connecting Fashion
              <span className="block text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text">
                Possibilities
              </span>
              <span className="block">to Markets Worldwide</span>
            </h1>

            <p className="text-xl md:text-2xl lg:text-3xl text-slate-200 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              Your trusted partner in global denim and fashion distribution,
              building bridges between innovation and opportunity across three
              continents.
            </p>
          </div>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-slide-up">
            <Link to="/products" className="w-full sm:w-auto group">
              <button className="w-full sm:w-auto bg-secondary hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 active:scale-95 group motion-safe:animate-pulse">
                <span className="flex items-center justify-center">
                  Explore Our Collections
                  <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-200" />
                </span>
              </button>
            </Link>
            <Link to="/partnership" className="w-full sm:w-auto group">
              <button className="w-full sm:w-auto bg-white hover:bg-slate-100 text-primary px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50 active:scale-95 group">
                <span className="flex items-center justify-center">
                  <Users className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-200" />
                  Become a Partner
                </span>
              </button>
            </Link>
            <button
              onClick={() => setIsRfqModalOpen(true)}
              className="w-full sm:w-auto bg-transparent hover:bg-white/10 text-white border-2 border-white hover:border-blue-400 px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50 active:scale-95 group"
            >
              <span className="flex items-center justify-center">
                <MessageCircle className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-200" />
                Request a Quote
              </span>
            </button>
          </div>

          {/* Features Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white/80 animate-fade-in">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center justify-center space-x-3 p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20"
              >
                {feature.icon}
                <div className="text-left">
                  <div className="font-semibold text-white">
                    {feature.title}
                  </div>
                  <div className="text-sm text-white/70">
                    {feature.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-8">
            Leading the Future of Fashion Distribution
          </h2>
          <div className="space-y-8 text-lg text-slate-600 leading-relaxed">
            <p className="text-xl">
              Neba Connections is a dynamic company dedicated to distributing
              denim and fashion-forward products. In a market crowded with
              low-cost, mass production, Neba stands apart building on
              innovation and trusted distribution networks, with a strong
              foothold in EU markets and a growing global reach.
            </p>
            <p>
              We specialize in denim and fashion-forward products, crafted with
              precision, originality, and global trends in mind. Through our
              close partnership with experienced manufacturers, we bring to
              market a wide range of innovative styles, giving retailers access
              to collections that balance creativity, quality, and
              affordability.
            </p>
          </div>
        </div>
      </section>

      {/* Key Differentiators */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-6">
              Why Choose <span className="font-extrabold">Neba</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Our commitment to excellence, innovation, and partnership sets us
              apart in the global fashion distribution landscape.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {differentiators.map((item, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-2xl p-10 shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100 text-center h-full group-hover:-translate-y-2">
                  <div className="mb-8 flex justify-center">
                    <div className="p-4 bg-blue-50 rounded-2xl group-hover:bg-blue-100 transition-colors duration-300">
                      {item.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-primary mb-6">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-lg">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Market Reach */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-6">
              Global Market Reach
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Connecting fashion possibilities across three continents with
              strategic distribution networks and local partnerships.
            </p>
          </div>

          <div className="mb-16">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1741942078465-d57db8d88240?w=1400&h=600&fit=crop&crop=center"
                alt="Global fashion distribution network spanning continents"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <h3 className="text-3xl font-heading font-bold mb-3">
                  Worldwide Distribution Network
                </h3>
                <p className="text-xl text-white/90">
                  Serving retailers across multiple continents with excellence
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {marketRegions.map((region, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={region.image}
                      alt={`${region.name} fashion market`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-heading font-extrabold text-white">
                        {region.name}
                      </h3>
                      <span className="flex items-center space-x-1 bg-secondary text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {region.icon}
                        <span>{region.growth}</span>
                      </span>
                    </div>
                    <p className="text-white/90 text-sm leading-relaxed">
                      {region.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      {/* Featured Products Showcase */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-6">
              Featured Collections
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Discover our premium products crafted with innovation, quality,
              and style. <br /> From classic denim to empowering fashion
              statements that celebrate your authentic self.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {featuredProducts.map((product, index) => (
              <div
                key={index}
                className="group cursor-pointer"
                onClick={() => setIsRfqModalOpen(true)}
              >
                <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={
                        product.image ||
                        'https://heyboss.heeyo.ai/1757842800-69f00b0e.webp'
                      }
                      alt={`${product.name} - ${product.description} from ${product.brand} Collection`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                  {/* Brand Logo - Top Left */}
                  {product.logo && product.brand === 'Neba Connections' && (
                    <div className="absolute top-4 left-4">
                      <img
                        src={product.logo}
                        alt={`${product.brand} Logo - Fashion as empowerment brand`}
                        className="h-8 w-auto bg-white/95 rounded-lg p-1 shadow-md"
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-heading font-bold">
                        {product.productNo}
                      </h3>
                      {product.brand === 'Neba Connections' && (
                        <span className="bg-gradient-to-r from-rose-500 to-fuchsia-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                          {product.badge || 'Neba Connections'}
                        </span>
                      )}

                      {product.brand === 'Neba' && (
                        <span className="bg-secondary text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                          Premium
                        </span>
                      )}
                    </div>
                    <p className="text-white/90 text-sm font-medium mb-1">
                      {product.name}
                    </p>
                    <p className="text-white/70 text-xs">
                      {product.description}
                    </p>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-secondary text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      RFQ
                    </span>
                  </div>

                  {/* Animated overlay for Neba Connections products */}
                  {product.brand === 'Neba Connections' && (
                    <div className="absolute inset-0 bg-gradient-to-t from-fuchsia-900/80 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/products" className="group">
              <button className="bg-secondary hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 active:scale-95 group">
                <span className="flex items-center justify-center">
                  Explore Full Collection
                  <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-200" />
                </span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Lines Showcase */}
      <section className="py-24 bg-gradient-to-br from-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
              Our Premium Brand Lines
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Discover our curated collection of premium denim brands, each with
              its unique heritage and craftsmanship excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Neba Collection */}
            <div className="group">
              <div className="bg-white rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 group-hover:-translate-y-2">
                <div className="text-center mb-6">
                  <img
                    src="/logo/NC-logo.png"
                    alt="Neba Brand Logo"
                    className="h-24 w-auto mx-auto mb-4"
                  />
                  <h3 className="text-2xl font-heading font-bold text-primary mb-3">
                    Neba Collection
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Our flagship denim line featuring innovative designs,
                    premium fabrics, and sustainable manufacturing processes.
                    Trusted across EU, Africa, and South America.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    Premium Quality
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Eco-Friendly
                  </span>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    Global Distribution
                  </span>
                </div>
              </div>
            </div>

            {/* Neba Connections Collection */}
            <div className="group">
              <div className="bg-gradient-to-br from-rose-50 to-fuchsia-50 rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 group-hover:-translate-y-2 border-2 border-rose-200">
                <div className="text-center mb-6">
                  <img
                    src="/logo/NC-logo.png"
                    alt="Seoulline Brand Logo - Fashion Empowerment Brand"
                    className="h-24 w-auto mx-auto mb-4 bg-white rounded-lg p-2 shadow-md"
                  />
                  <h3 className="text-2xl font-heading font-bold text-fuchsia-800 mb-3">
                    Neba Connections Collection
                  </h3>
                  <p className="text-slate-700 leading-relaxed">
                    Experience fashion as empowerment with our bold, trendy, and
                    authentically stylish designs that evolve with you. Clothing
                    that inspires confidence and celebrates your unique soul.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  <span className="bg-rose-100 text-rose-800 px-3 py-1 rounded-full text-sm font-medium">
                    Trendy Chic
                  </span>
                  <span className="bg-fuchsia-100 text-fuchsia-800 px-3 py-1 rounded-full text-sm font-medium">
                    Bold Expression
                  </span>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    Empowering Style
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Neba Connections Brand Feature */}
      <section className="py-24 bg-gradient-to-r from-fuchsia-900 via-purple-900 to-indigo-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Brand Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md">
                <img
                  src="/products/tenceljean.gif"
                  alt="Neba Connections fashion model - Confident traveler with soul and style"
                  className="w-full h-auto rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute -bottom-6 -right-6 bg-fuchsia-600 text-white px-6 py-3 rounded-lg shadow-xl transform rotate-3 z-10">
                  <span className="font-bold tracking-wider">
                    TRAVEL IN STYLE
                  </span>
                </div>
              </div>
              <div className="absolute top-1/4 -left-16 w-32 h-32 bg-rose-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute bottom-1/3 -right-16 w-32 h-32 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            </div>

            {/* Brand Content */}
            <div className="lg:col-span-7 text-white space-y-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 bg-gradient-to-r from-rose-300 via-fuchsia-200 to-indigo-200 text-transparent bg-clip-text">
                  Fashion as Empowerment
                </h2>
                <p className="text-xl text-purple-100 leading-relaxed mb-8 max-w-2xl">
                  Bold, evolving, and stylishly authentic, inspiring individuals
                  to travel through life with confidence and soul.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl hover:bg-white/20 transition-colors duration-300">
                  <h3 className="font-heading font-bold text-xl mb-3 text-rose-200">
                    The Explorer's Mindset
                  </h3>
                  <p className="text-purple-100">
                    Embrace the spirit of exploration with designs that inspire
                    curiosity and confidence. Clothing for the worldly traveler
                    in all of us.
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl hover:bg-white/20 transition-colors duration-300">
                  <h3 className="font-heading font-bold text-xl mb-3 text-rose-200">
                    Authentic Expression
                  </h3>
                  <p className="text-purple-100">
                    Our pieces empower you to express your true self with soul
                    and uniqueness, transforming fashion into a statement of
                    personal identity.
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl hover:bg-white/20 transition-colors duration-300">
                  <h3 className="font-heading font-bold text-xl mb-3 text-rose-200">
                    Evolution & Growth
                  </h3>
                  <p className="text-purple-100">
                    Smart and evolving designs that reflect personal growth,
                    adapting to your journey while maintaining timeless style.
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl hover:bg-white/20 transition-colors duration-300">
                  <h3 className="font-heading font-bold text-xl mb-3 text-rose-200">
                    Confident Style
                  </h3>
                  <p className="text-purple-100">
                    Polished, sharp designs that build confidence from the
                    outside in, helping you navigate life's adventures with
                    poise.
                  </p>
                </div>
              </div>

              <div className="pt-8">
                <Link to="/products" className="group">
                  <button className="bg-gradient-to-r from-rose-500 to-fuchsia-600 hover:from-rose-600 hover:to-fuchsia-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-fuchsia-500 focus:ring-opacity-50 active:scale-95">
                    <span className="flex items-center justify-center">
                      Explore Neba Connections Collection
                      <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
                    </span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Floating elements for visual interest */}
        <div className="absolute top-16 right-16 w-20 h-20 border-4 border-fuchsia-300 rounded-full opacity-20"></div>
        <div className="absolute bottom-16 left-16 w-32 h-32 border-2 border-indigo-300 rounded-full opacity-20"></div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
              Our Core Values
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              The principles that guide everything we do, from product selection
              to partner relationships.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => (
              <div key={index} className="group">
                <div className="bg-slate-800 hover:bg-slate-700 rounded-2xl p-8 transition-all duration-300 border border-slate-700 text-center h-full group-hover:-translate-y-1">
                  <div className="mb-6 flex justify-center">
                    <div className="p-3 bg-slate-700 group-hover:bg-slate-600 rounded-xl transition-colors duration-300">
                      {value.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-heading font-bold text-white mb-4">
                    {value.title}
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-r from-secondary to-blue-600">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-8">
            Ready to Partner with Neba?
          </h2>
          <p className="text-xl text-blue-500 mb-12 leading-relaxed max-w-3xl mx-auto">
            Join our network of successful retailers and discover how Neba can
            help grow your fashion business with premium denim and
            fashion-forward products.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link to="/products" className="w-full sm:w-auto group">
              <button className="w-full sm:w-auto bg-white hover:bg-slate-100 text-secondary px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50 active:scale-95 group">
                <span className="flex items-center justify-center">
                  View Our Collections
                  <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-200" />
                </span>
              </button>
            </Link>
            <Link to="/contact" className="w-full sm:w-auto group">
              <button className="w-full sm:w-auto bg-transparent hover:bg-white/10  border-2 border-white hover:border-blue-200 px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50 active:scale-95 group">
                <span className="flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-200" />
                  Get in Touch
                </span>
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-blue-500">
            <div className="flex items-center justify-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
              <span className="font-semibold">Established EU Network</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
              <span className="font-semibold">Premium Quality Products</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
              <span className="font-semibold">24/7 AI Chat Support</span>
            </div>
          </div>

          <div className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
            <p className="text-blue-500 text-lg">
              💬 <strong className="text-blue-500">Need help?</strong> Our AI
              assistant is available 24/7 in the bottom-right corner. Fully
              accessible with keyboard navigation and screen reader support for
              an inclusive experience.
            </p>
          </div>
        </div>
      </section>

      <RfqModal
        isOpen={isRfqModalOpen}
        onClose={() => setIsRfqModalOpen(false)}
      />
    </div>
  );
};
