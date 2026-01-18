import { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

const initialProducts = [
  { id: 1, name: 'Cappuccino', category: 'Coffee', price: 'Rp 25.000', duration: '3-5min', rating: 4.9, image: '☕', stock: 50 },
  { id: 2, name: 'Croissant', category: 'Pastry', price: 'Rp 18.000', duration: '2min', rating: 4.7, image: '🥐', stock: 30 },
  { id: 3, name: 'Matcha Latte', category: 'Drinks', price: 'Rp 32.000', duration: '4min', rating: 4.8, image: '🍵', stock: 40 },
  { id: 4, name: 'Club Sandwich', category: 'Food', price: 'Rp 45.000', duration: '8min', rating: 4.6, image: '🥪', stock: 25 },
  { id: 5, name: 'Cheesecake', category: 'Dessert', price: 'Rp 35.000', duration: '2min', rating: 4.9, image: '🍰', stock: 20 },
  { id: 6, name: 'Americano', category: 'Coffee', price: 'Rp 20.000', duration: '3min', rating: 4.5, image: '☕', stock: 45 },
  { id: 7, name: 'Croissant Chocolate', category: 'Pastry', price: 'Rp 22.000', duration: '2min', rating: 4.8, image: '🥐', stock: 28 },
  { id: 8, name: 'Iced Lemon Tea', category: 'Drinks', price: 'Rp 28.000', duration: '3min', rating: 4.4, image: '🍋', stock: 35 },
];

const initialCustomers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '081234567890', totalOrders: 12, totalSpent: 'Rp 450.000' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '081234567891', totalOrders: 8, totalSpent: 'Rp 320.000' },
  { id: 3, name: 'Bob Wilson', email: 'bob@example.com', phone: '081234567892', totalOrders: 5, totalSpent: 'Rp 180.000' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', phone: '081234567893', totalOrders: 15, totalSpent: 'Rp 620.000' },
];

const initialTransactions = [];

const defaultSettings = {
  storeName: 'F. POS',
  taxPercentage: 11,
  currency: 'IDR',
  darkMode: false,
};

function DataProvider({ children }) {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('pos_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('pos_customers');
    return saved ? JSON.parse(saved) : initialCustomers;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('pos_transactions');
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('pos_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('pos_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('pos_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('pos_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('pos_settings', JSON.stringify(settings));
  }, [settings]);

  const addProduct = (product) => {
    const newProduct = { ...product, id: Date.now() };
    setProducts([...products, newProduct]);
    return newProduct;
  };

  const updateProduct = (id, updated) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updated } : p));
  };

  const deleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const addCustomer = (customer) => {
    const newCustomer = { ...customer, id: Date.now(), totalOrders: 0, totalSpent: 'Rp 0' };
    setCustomers([...customers, newCustomer]);
    return newCustomer;
  };

  const updateCustomer = (id, updated) => {
    setCustomers(customers.map(c => c.id === id ? { ...c, ...updated } : c));
  };

  const deleteCustomer = (id) => {
    setCustomers(customers.filter(c => c.id !== id));
  };

  const addTransaction = (transaction) => {
    const newTransaction = { ...transaction, id: Date.now(), date: new Date().toISOString() };
    setTransactions([newTransaction, ...transactions]);
    return newTransaction;
  };

  const updateProductStock = (productId, quantity) => {
    setProducts(products.map(p => {
      if (p.id === productId) {
        return { ...p, stock: Math.max(0, (p.stock || 0) - quantity) };
      }
      return p;
    }));
  };

  const value = {
    products,
    customers,
    transactions,
    settings,
    addProduct,
    updateProduct,
    deleteProduct,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addTransaction,
    updateProductStock,
    setProducts,
    setCustomers,
    setSettings,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

export { DataProvider, useData };
