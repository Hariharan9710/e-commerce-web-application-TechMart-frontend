
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Heart, Shield, Truck, RotateCcw, ShoppingCart, Plus, Minus, Star } from 'lucide-react';
import Header from '../components/Header';
import { formatPrice, getImageUrl } from '../utils/Helpers';
import ReviewSection from './ReviewForm';
import { reviewAPI } from '../services/api';
import { useApp } from '../context/AppContext';

export default function ProductDetailPage() {
  const { addToCart } = useApp();
  const location = useLocation();
  const product = location.state;

  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    if (product?.id) fetchProductRating();
  }, [product]);

  const fetchProductRating = async () => {
    try {
      const response = await reviewAPI.getReviewsByProduct(product.id);
      const reviews = response.data;

      if (reviews.length > 0) {
        const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        setAvgRating(parseFloat(avg.toFixed(1)));
        setReviewCount(reviews.length);
      }
    } catch {
      console.error('Error fetching reviews');
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-600">Product not found</p>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (change) => {
    const newQuantity = Math.min(Math.max(quantity + change, 1), product.stock);
    setQuantity(newQuantity);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Link
          to="/all-products"
          className="flex items-center gap-2 text-blue-600 font-medium mb-6 hover:underline"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Products</span>
        </Link>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Product Image - ✅ FIXED: Uses getImageUrl() */}
            <div className="w-full h-[600px] bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center p-8">
              <img
                src={getImageUrl(product.image)}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium">
                  {product.category}
                </span>
                <button onClick={() => setIsFavorite(!isFavorite)} className="p-2 hover:scale-110 transition">
                  <Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-300'}`} />
                </button>
              </div>

              <h1 className="text-4xl font-bold">{product.name}</h1>

              <div className="flex items-center gap-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${
                        i < Math.round(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">({avgRating} / 5)</span>
                <span className="text-sm text-gray-500 font-medium">
                  • {reviewCount} review{reviewCount !== 1 && 's'}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold">{formatPrice(product.price)}</span>
                <span className="text-gray-400 line-through">
                  {formatPrice(Math.round(product.price * 1.2))}
                </span>
                <span className="bg-red-100 text-red-600 px-3 py-1 rounded text-sm font-semibold">
                  Save 17%
                </span>
              </div>

              <p className="text-sm">
                <span className="text-gray-600">Stock: </span>
                <span className={`font-semibold ${product.stock < 10 ? 'text-red-600' : 'text-green-600'}`}>
                  {product.stock} available
                </span>
              </p>

              <div className="flex items-center gap-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition disabled:opacity-50"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="w-16 text-center font-medium border-x border-gray-300">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition disabled:opacity-50"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <button
                onClick={() => addToCart(product, quantity)}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-3 hover:bg-blue-700 transition"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t">
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-blue-600" />
                  <p className="font-semibold text-sm">1 Year Warranty</p>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="w-6 h-6 text-blue-600" />
                  <p className="font-semibold text-sm">Free Shipping</p>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-6 h-6 text-blue-600" />
                  <p className="font-semibold text-sm">30-Day Returns</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ReviewSection productId={product.id} />
      </main>
    </div>
  );
}
