
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { productAPI } from '../services/api';

export default function CategoryProductsPage() {
  const location = useLocation();
  const category = location.state?.category || 'All Products';

  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    productAPI.getProductsByCategory(category)
      .then(res => setProducts(res.data))
      .catch(err => console.error('Error loading products:', err))
      .finally(() => setLoading(false));
  }, [category]);

  const filteredProducts = searchQuery
    ? products.filter(p =>
        [p.name, p.brand].some(field =>
          field?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : products;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2">{category} Products</h1>
        <p className="text-lg text-gray-600 mb-8">
          Discover our complete collection of {category.toLowerCase()}
        </p>

        {loading ? (
          <div className="text-center py-20 text-gray-600">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Search className="w-16 h-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">No products found</h2>
            <button
              onClick={() => setSearchQuery('')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <>
            <div className="text-sm text-gray-600 mb-6">
              Showing {filteredProducts.length} products
            </div>

            {/* ✅ NO Link wrapper - ProductCard handles it */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}