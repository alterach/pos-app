import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Search } from 'lucide-react';
import { useData } from '../context/DataContext';
import './Products.css';

const categories = ['Coffee', 'Pastry', 'Drinks', 'Food', 'Dessert'];

function Products() {
  const { products, addProduct, updateProduct, deleteProduct } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    category: 'Coffee',
    price: '',
    duration: '',
    rating: 4.0,
    image: '☕',
    stock: 0,
  });

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price,
        duration: product.duration,
        rating: product.rating,
        image: product.image,
        stock: product.stock,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        category: 'Coffee',
        price: '',
        duration: '',
        rating: 4.0,
        image: '☕',
        stock: 0,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, formData);
    } else {
      addProduct(formData);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="products-page">
      <div className="page-header">
        <div className="header-left">
          <h1>Products</h1>
          <p>Manage your product catalog</p>
        </div>
        <button className="add-btn" onClick={() => handleOpenModal()}>
          <Plus size={18} />
          Add Product
        </button>
      </div>

      <div className="search-bar">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.id}>
                <td>
                  <div className="product-cell">
                    <span className="product-emoji">{product.image}</span>
                    <span className="product-name">{product.name}</span>
                  </div>
                </td>
                <td>
                  <span className="category-badge">{product.category}</span>
                </td>
                <td className="price-cell">{product.price}</td>
                <td>
                  <span className={`stock-badge ${product.stock < 10 ? 'low' : ''}`}>
                    {product.stock}
                  </span>
                </td>
                <td>
                  <div className="rating">
                    <span className="rating-value">{product.rating}</span>
                  </div>
                </td>
                <td>
                  <div className="actions">
                    <button className="action-btn edit" onClick={() => handleOpenModal(product)}>
                      <Edit2 size={16} />
                    </button>
                    <button className="action-btn delete" onClick={() => handleDelete(product.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
              <button className="close-btn" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select name="category" value={formData.category} onChange={handleChange}>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Price (Rp)</label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Rp 25.000"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Duration</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="3-5min"
                  />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Emoji Icon</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  maxLength={2}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingProduct ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
