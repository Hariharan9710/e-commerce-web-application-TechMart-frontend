
import { ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPrice, getImageUrl } from '../utils/Helpers';
import { useApp } from '../context/AppContext';

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  rating: number;
  image: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useApp();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <Link
      to={`/product-detail/${product.id}`}
      state={product}
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition block"
    >
      {/* Image */}
      <div className="h-56 overflow-hidden bg-gray-100 flex items-center justify-center p-4">
        <img
          src={getImageUrl(product.image)}
          alt={product.name}
          className="w-full h-full object-contain hover:scale-105 transition duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

        <div className="flex justify-between items-center text-sm mb-3">
          <span className="text-gray-600">{product.category}</span>
          <span className="font-medium text-gray-700">{product.brand}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center mb-4">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.round(product.rating) ? 'fill-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600">({product.rating})</span>
        </div>

        {/* Price & Actions */}
        <div className="flex justify-between items-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {formatPrice(product.price)}
            </div>
            <div
              className={`text-xs font-semibold px-2 py-1 rounded inline-block mt-1 ${
                product.stock < 10
                  ? 'text-red-600 bg-red-100'
                  : 'text-green-600 bg-green-100'
              }`}
            >
              Stock: {product.stock}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold hover:bg-blue-700 transition"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </Link>
  );
}