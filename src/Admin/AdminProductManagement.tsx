import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Plus, Save, X } from 'lucide-react';
import { adminAPI, productAPI } from '../services/api';
import { formatPrice, getImageUrl } from '../utils/helpers';

export default function AdminProductManagement() {
  const navigate = useNavigate();
  const location = useLocation();
  const category = location.state?.category || null;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: category || '',
    brand: '',
    price: '',
    stock: '',
    rating: 4.0
  });

  useEffect(() => {
    loadProducts();
  }, [category]);

  const loadProducts = async () => {
    try {
      const response = category
        ? await productAPI.getProductsByCategory(category)
        : await productAPI.getAllProducts();

      setProducts(response.data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['price', 'stock', 'rating'].includes(name)
        ? parseFloat(value) || 0
        : value
    }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      Object.keys(formData).forEach(key => form.append(key, formData[key]));
      if (imageFile) form.append('image', imageFile);

      await adminAPI.addProduct(form);

      alert('✅ Product added successfully!');
      setShowAddForm(false);
      resetForm();
      loadProducts();
    } catch (error) {
      alert('Failed to add product');
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      Object.keys(formData).forEach(key => form.append(key, formData[key]));
      if (imageFile) form.append('image', imageFile);

      await adminAPI.updateProduct(editingProduct.id, form);

      alert('✅ Product updated!');
      setEditingProduct(null);
      resetForm();
      loadProducts();
    } catch {
      alert('Failed to update product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await adminAPI.deleteProduct(id);
      loadProducts();
    } catch {
      alert('Failed to delete');
    }
  };

  const handleUpdateStock = async (id, newStock) => {
    try {
      await adminAPI.updateStock(id, newStock);
      loadProducts();
    } catch {
      alert('Failed to update stock');
    }
  };

  const startEditing = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      category: product.category,
      brand: product.brand,
      price: product.price,
      stock: product.stock,
      rating: product.rating
    });
    setImageFile(null);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: category || '',
      brand: '',
      price: '',
      stock: '',
      rating: 4.0
    });
    setImageFile(null);
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setShowAddForm(false);
    resetForm();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => navigate('/admin-dashboard')}
              className="flex items-center gap-2 text-blue-600 font-medium hover:underline mb-2"
            >
              <ArrowLeft className="w-5 h-5" /> Back to Dashboard
            </button>

            <h1 className="text-3xl font-bold">
              {category ? `${category} Products` : 'All Products'}
            </h1>
            <p className="text-gray-600">Manage your product inventory</p>
          </div>

          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5" /> Add Product
          </button>
        </div>

        {/* Form Modal */}
        {(showAddForm || editingProduct) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="space-y-4">

                {/* Fields */}
                {['name', 'brand', 'category'].map((field, i) => (
                  <div key={i}>
                    <label className="block text-sm font-medium text-gray-700 capitalize mb-2">{field}</label>
                    <input
                      name={field}
                      value={formData[field]}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-600"
                      required
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {['price', 'stock', 'rating'].map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">{field}</label>
                      <input
                        type="number"
                        name={field}
                        value={formData[field]}
                        onChange={handleInputChange}
                        step={field === 'rating' ? '0.1' : '1'}
                        min="0"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-600"
                        required
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                  <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} required={!editingProduct} />
                </div>

                <div className="flex gap-4 pt-4">
                  <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
                    <Save className="w-5 h-5" />
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                  <button type="button" onClick={cancelEdit} className="flex-1 bg-gray-200 text-gray-700 rounded-lg py-3 hover:bg-gray-300 transition">
                    Cancel
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">
              <tr>
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Brand</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Stock</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.description?.slice(0, 50)}...</p>
                    </div>
                  </td>

                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4">{product.brand}</td>
                  <td className="px-6 py-4 font-medium">{formatPrice(product.price)}</td>

                  <td className="px-6 py-4">
                    <input
                      type="number"
                      defaultValue={product.stock}
                      className={`w-20 border rounded text-center ${product.stock < 10 ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                      onBlur={(e) => {
                        const newStock = +e.target.value;
                        if (newStock >= 0 && newStock !== product.stock) {
                          handleUpdateStock(product.id, newStock);
                        }
                      }}
                    />
                  </td>

                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => startEditing(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>

          {products.length === 0 && (
            <div className="text-center py-12 text-gray-600">
              No products found
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

