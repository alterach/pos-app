import { useState, useEffect } from 'react';
import { Search, Plus, Minus, Trash2, CreditCard, DollarSign, X, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';
import Receipt from '../components/Receipt';
import XenditPayment from '../components/XenditPayment';
import './POS.css';

const categories = ['All', 'Coffee', 'Pastry', 'Drinks', 'Food', 'Dessert'];

function POS() {
  const { products, addTransaction, updateProductStock, settings } = useData();
  const { cart, addItem, removeItem, updateQuantity, clearCart, totalPrice } = useCart();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [showXenditPayment, setShowXenditPayment] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastTransaction, setLastTransaction] = useState(null);
  const [stockWarning, setStockWarning] = useState(null);

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });



  const handleCheckout = () => {
    setShowPayment(true);
  };

  const handleXenditSuccess = (paymentInfo) => {
    const subtotal = cart.items.reduce((sum, item) => {
      const price = typeof item.price === 'string' ? parseFloat(item.price.replace(/[Rp\s.]/g, '')) : item.price;
      return sum + (price * item.quantity);
    }, 0);

    const taxRate = settings?.taxPercentage || 11;
    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount;

    const transaction = {
      items: cart.items,
      subtotal,
      tax: taxAmount,
      taxRate,
      total,
      paymentMethod: 'xendit',
      paymentId: paymentInfo.paymentId,
      customer: cart.customer,
      date: new Date().toISOString(),
    };

    cart.items.forEach(item => {
      updateProductStock(item.id, item.quantity);
    });

    const newTransaction = addTransaction(transaction);
    setLastTransaction(newTransaction);
    clearCart();
    setShowXenditPayment(false);
    setShowReceipt(true);
  };

  const confirmPayment = (method) => {
    const subtotal = cart.items.reduce((sum, item) => {
      const price = typeof item.price === 'string' ? parseFloat(item.price.replace(/[Rp\s.]/g, '')) : item.price;
      return sum + (price * item.quantity);
    }, 0);

    const taxRate = settings?.taxPercentage || 11;
    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount;

    const transaction = {
      items: cart.items,
      subtotal,
      tax: taxAmount,
      taxRate,
      total,
      paymentMethod: method,
      customer: cart.customer,
      date: new Date().toISOString(),
    };

    cart.items.forEach(item => {
      updateProductStock(item.id, item.quantity);
    });

    const newTransaction = addTransaction(transaction);
    setLastTransaction(newTransaction);
    clearCart();
    setShowPayment(false);
    setShowReceipt(true);
  };

  const handleAddItem = (product) => {
    const existingItem = cart.items.find(item => item.id === product.id);
    const currentQty = existingItem ? existingItem.quantity : 0;
    const newQty = currentQty + 1;

    if (product.stock <= 0) {
      setStockWarning(product.name);
      setTimeout(() => setStockWarning(null), 2000);
      return;
    }

    if (newQty > product.stock) {
      setStockWarning(`${product.name} - Max stock: ${product.stock}`);
      setTimeout(() => setStockWarning(null), 2000);
      return;
    }

    addItem(product);
  };

  useEffect(() => {
    if (stockWarning) {
      const timer = setTimeout(() => setStockWarning(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [stockWarning]);

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
          {filteredProducts.map(product => {
            const isOutOfStock = product.stock <= 0;
            const isLowStock = product.stock > 0 && product.stock < 5;
            return (
              <button
                key={product.id}
                className={`product-card ${isOutOfStock ? 'out-of-stock' : ''}`}
                onClick={() => handleAddItem(product)}
                disabled={isOutOfStock}
              >
                <span className="product-emoji">{product.image}</span>
                <span className="product-name">{product.name}</span>
                <span className="product-price">{product.price}</span>
                {isLowStock && <span className="stock-badge low">Low: {product.stock}</span>}
                {isOutOfStock && <span className="stock-badge out">Out of Stock</span>}
              </button>
            );
          })}
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
                <button
                  className="payment-btn xendit-option"
                  onClick={() => {
                    setShowPayment(false);
                    setShowXenditPayment(true);
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect width="24" height="24" rx="4" fill="#0066FF"/>
                    <path d="M7 12h10v1H7v-1zm0-3h10v1H7V9zm0 6h6v1H7v-1z" fill="white"/>
                  </svg>
                  <span>Xendit</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showReceipt && lastTransaction && (
        <Receipt transaction={lastTransaction} onClose={() => setShowReceipt(false)} />
      )}

      {showXenditPayment && (
        <XenditPayment
          onClose={() => setShowXenditPayment(false)}
          onSuccess={(paymentInfo) => {
            handleXenditSuccess(paymentInfo);
          }}
        />
      )}

      {stockWarning && (
        <div className="stock-warning-toast">
          {stockWarning}
        </div>
      )}
    </div>
  );
}

export default POS;
