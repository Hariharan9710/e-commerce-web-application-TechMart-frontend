import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Users, Shield, Truck } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { useApp } from '../context/AppContext';
import { productAPI } from '../services/api';

const HERO_SLIDES = [
  {
    title: "Your Electronics", subtitle: "Destination",
    description: "Discover the latest smartphones, laptops, and speakers from top brands",
    gradient: "from-teal-500 to-blue-600",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&h=600&fit=crop"
  },
  {
    title: "Latest Smartphones", subtitle: "Premium Collection",
    description: "Experience cutting-edge technology with the newest flagship devices",
    gradient: "from-blue-600 to-purple-600",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&h=600&fit=crop"
  },
  {
    title: "Premium Laptops", subtitle: "Power & Performance",
    description: "High-performance laptops for professionals and gamers",
    gradient: "from-purple-600 to-pink-600",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&h=600&fit=crop"
  }
];

const CATEGORIES = [
  { name: "Smartphones", category: "Mobiles", description: "Latest phones with cutting-edge technology",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop", icon: "📱" },
  { name: "Laptops", category: "Laptops", description: "Powerful laptops for work and gaming",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop", icon: "💻" },
  { name: "Headphones & Speakers", category: "Audio", description: "Premium audio equipment for music lovers",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop", icon: "🎧" },
  { name: "Smartwatches", category: "Smartwatches", description: "Wearable tech for fitness and connectivity",
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=300&fit=crop", icon: "⌚" },
  { name: "Keyboards", category: "Keyboards", description: "Mechanical and gaming keyboards for enthusiasts",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop", icon: "⌨️" },
  { name: "Other Electronics", category: "Electronics", description: "Tablets, gaming, and cameras",
    image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400&h=300&fit=crop", icon: "🎮" }
];

const FEATURES = [
  { icon: <Users className="w-8 h-8 text-blue-600" />, title: "Trusted by Millions",
    description: "Join over 1 million satisfied customers worldwide" },
  { icon: <Shield className="w-8 h-8 text-blue-600" />, title: "Secure Shopping",
    description: "Your data and transactions are always protected" },
  { icon: <Truck className="w-8 h-8 text-blue-600" />, title: "Fast Delivery",
    description: "Free shipping on orders over ₹1000 with quick delivery" }
];

export default function HomePage() {
  const { addToCart } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    productAPI.getFeaturedProducts().then(res => setFeaturedProducts(res.data));
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Carousel */}
      <section className="relative h-[500px] overflow-hidden">
        <div className="relative h-full">
          {HERO_SLIDES.map((slide, index) => (
            <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`}>
                <div className="absolute inset-0 opacity-20">
                  <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="relative h-full flex items-center justify-center z-10">
                <div className="text-center px-4">
                  <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                    {slide.title} <span className="text-yellow-300">{slide.subtitle}</span>
                  </h1>
                  <p className="text-xl text-white mb-8 max-w-2xl mx-auto">{slide.description}</p>

                  {/* ✅ Replaced navigate() with Link */}
                  <Link
                    to="/all-products"
                    className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold inline-flex items-center gap-2 hover:bg-gray-100 transition"
                  >
                    <span>Shop Now</span>
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => handleSlideChange((currentSlide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => handleSlideChange((currentSlide + 1) % HERO_SLIDES.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => handleSlideChange(index)}
              className={`transition-all ${index === currentSlide ? 'w-8 h-3 bg-white rounded-full' : 'w-3 h-3 bg-white/50 rounded-full hover:bg-white/75'}`}
            />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Shop by Category</h2>
          <p className="text-lg text-gray-600">Discover our wide range of premium electronics</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat, idx) => (
            <Link
              key={idx}
              to="/category/products"
              state={{ category: cat.category }}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer group"
            >
              <div className="h-48 overflow-hidden">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{cat.icon}</span>
                  <h3 className="text-xl font-bold">{cat.name}</h3>
                </div>
                <p className="text-gray-600 mb-4">{cat.description}</p>
                <div className="text-blue-600 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                  <span>View All</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-lg text-gray-600">Discover our most popular tech products</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose TechMart?</h2>
            <p className="text-lg text-gray-600">We provide the best shopping experience for all your tech needs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map((feature, idx) => (
              <div key={idx} className="text-center">
                <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
