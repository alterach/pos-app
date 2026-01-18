import { Clock, Star, ChevronRight } from 'lucide-react';
import './ProductList.css';

const products = [
    { id: 1, name: 'Cappuccino', category: 'Coffee', duration: '3-5min', rating: 4.9, price: 'Rp 25.000', image: '☕' },
    { id: 2, name: 'Croissant', category: 'Pastry', duration: '2min', rating: 4.7, price: 'Rp 18.000', image: '🥐' },
    { id: 3, name: 'Matcha Latte', category: 'Drinks', duration: '4min', rating: 4.8, price: 'Rp 32.000', image: '🍵' },
    { id: 4, name: 'Club Sandwich', category: 'Food', duration: '8min', rating: 4.6, price: 'Rp 45.000', image: '🥪' },
    { id: 5, name: 'Cheesecake', category: 'Dessert', duration: '2min', rating: 4.9, price: 'Rp 35.000', image: '🍰' },
];

const tabs = ['All Products', 'Best Seller', 'New', 'Promo'];

function ProductList() {
    return (
        <div className="product-list card">
            <div className="card-header">
                <h2 className="card-title">Products</h2>
            </div>

            <div className="product-tabs">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        className={`tab-btn ${index === 0 ? 'active' : ''}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="products">
                {products.map((product) => (
                    <div key={product.id} className="product-item">
                        <div className="product-image">
                            <span className="emoji">{product.image}</span>
                        </div>

                        <div className="product-info">
                            <h3 className="product-name">{product.name}</h3>
                            <span className="product-category">{product.category}</span>
                        </div>

                        <div className="product-meta">
                            <span className="meta-item">
                                <Clock size={14} />
                                {product.duration}
                            </span>
                            <span className="meta-item">
                                <Star size={14} fill="currentColor" />
                                {product.rating}
                            </span>
                        </div>

                        <span className="product-price">{product.price}</span>

                        <button className="view-btn">
                            View
                            <ChevronRight size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductList;
