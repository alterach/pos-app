import { useState } from 'react';
import { Search, Plus, Minus, Trash2, CreditCard, DollarSign, X, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';
import './POS.css';

const categories = ['All', 'Coffee', 'Pastry', 'Drinks', 'Food', 'Dessert'];

function POS() {
  const { products, addTransaction } = useData();
  const { cart, addItem, removeItem, updateQuantity, clearCart, totalPrice } = useCart();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPayment, setShowPayment] = useState(false);

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });



  const handleCheckout = () => {
    setShowPayment(true);
  };

  const confirmPayment = (method) => {
    const transaction = {
      items: cart.items,
      total: totalPrice,
      paymentMethod: method,
      customer: cart.customer,
      date: new Date().toISOString(),
    };
    addTransaction(transaction);
    clearCart();
    setShowPayment(false);
    alert('Transaction completed successfully!');
  };

  return (
    <div className="pos-page">
      <div className="pos-products-section">
        <div className="pos-search">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="pos-categories">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="pos-products-grid">
          {filteredProducts.map(product => (
            <button
              key={product.id}
              className="product-card"
              onClick={() => addItem(product)}
            >
              <span className="product-emoji">{product.image}</span>
              <span className="product-name">{product.name}</span>
              <span className="product-price">{product.price}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="pos-cart-section">
        <div className="cart-header">
          <h2>Current Order</h2>
          {cart.items.length > 0 && (
            <button className="clear-cart-btn" onClick={clearCart}>Clear All</button>
          )}
        </div>

        <div className="cart-items">
          {cart.items.length === 0 ? (
            <div className="empty-cart">
              <span>No items added yet</span>
            </div>
          ) : (
            cart.items.map(item => (
              <div key={item.id} className="cart-item">
                <span className="item-emoji">{item.image}</span>
                <div className="item-details">
                  <span className="item-name">{item.name}</span>
                  <span className="item-price">{item.price} x {item.quantity}</span>
                </div>
                <div className="item-quantity">
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="qty-value">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <button
                  className="remove-item-btn"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <div className="cart-total">
            <span>Total</span>
            <span className="total-price">Rp {totalPrice.toLocaleString('id-ID')}</span>
          </div>
          <button
            className="checkout-btn"
            disabled={cart.items.length === 0}
            onClick={handleCheckout}
          >
            Checkout
          </button>
        </div>
      </div>

      {showPayment && (
        <div className="payment-modal-overlay">
          <div className="payment-modal">
            <div className="modal-header">
              <h3>Payment</h3>
              <button className="close-btn" onClick={() => setShowPayment(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="payment-total">
                <span>Total Amount</span>
                <span className="amount">Rp {totalPrice.toLocaleString('id-ID')}</span>
              </div>
              <div className="payment-methods">
                <button
                  className="payment-btn"
                  onClick={() => confirmPayment('cash')}
                >
                  <DollarSign size={24} />
                  <span>Cash</span>
                </button>
                <button
                  className="payment-btn"
                  onClick={() => confirmPayment('card')}
                >
                  <CreditCard size={24} />
                  <span>Card</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default POS;
