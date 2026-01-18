import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const DataContext = createContext();

const initialProducts = [
  { id: 1, name: 'Cappuccino', category: 'Coffee', price: 25000, duration: '3-5min', rating: 4.9, image: '☕', stock: 50 },
  { id: 2, name: 'Croissant', category: 'Pastry', price: 18000, duration: '2min', rating: 4.7, image: '🥐', stock: 30 },
  { id: 3, name: 'Matcha Latte', category: 'Drinks', price: 32000, duration: '4min', rating: 4.8, image: '🍵', stock: 40 },
  { id: 4, name: 'Club Sandwich', category: 'Food', price: 45000, duration: '8min', rating: 4.6, image: '🥪', stock: 25 },
  { id: 5, name: 'Cheesecake', category: 'Dessert', price: 35000, duration: '2min', rating: 4.9, image: '🍰', stock: 20 },
  { id: 6, name: 'Americano', category: 'Coffee', price: 20000, duration: '3min', rating: 4.5, image: '☕', stock: 45 },
  { id: 7, name: 'Croissant Chocolate', category: 'Pastry', price: 22000, duration: '2min', rating: 4.8, image: '🥐', stock: 28 },
  { id: 8, name: 'Iced Lemon Tea', category: 'Drinks', price: 28000, duration: '3min', rating: 4.4, image: '🍋', stock: 35 },
];

const defaultSettings = {
  storeName: 'F. POS',
  taxPercentage: 11,
  currency: 'IDR',
  darkMode: false,
};

function DataProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setProducts(data.map(p => ({
          ...p,
          price: typeof p.price === 'number' ? `Rp ${p.price.toLocaleString('id-ID')}` : p.price
        })));
      } else {
        setProducts(initialProducts);
        await seedInitialProducts();
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setProducts(initialProducts);
    }
  }, []);

  const seedInitialProducts = async () => {
    try {
      const { error } = await supabase
        .from('products')
        .insert(initialProducts.map(p => ({
          ...p,
          price: typeof p.price === 'string' ? parsePrice(p.price) : p.price
        })));

      if (error && error.code !== '23505') {
        console.error('Error seeding products:', error);
      }
    } catch (err) {
      console.error('Error seeding products:', err);
    }
  };

  const fetchCustomers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setCustomers(data.map(c => ({
        ...c,
        totalSpent: `Rp ${(c.total_spent || 0).toLocaleString('id-ID')}`
      })));
    } catch (err) {
      console.error('Error fetching customers:', err);
    }
  }, []);

  const fetchTransactions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTransactions(data.map(t => ({
        ...t,
        items: typeof t.items === 'string' ? JSON.parse(t.items) : t.items
      })));
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  }, []);

  const fetchSettings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .limit(1)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') {
          throw error;
        }
      } else if (data) {
        setSettings({
          storeName: data.store_name || 'F. POS',
          taxPercentage: data.tax_percentage || 11,
          currency: data.currency || 'IDR',
          darkMode: data.dark_mode || false,
        });
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    }
  }, []);

  useEffect(() => {
    async function loadAllData() {
      try {
        await Promise.all([
          fetchProducts(),
          fetchCustomers(),
          fetchTransactions(),
          fetchSettings()
        ]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadAllData();
  }, [fetchProducts, fetchCustomers, fetchTransactions, fetchSettings]);

  const addProduct = async (product) => {
    const priceValue = parsePrice(product.price);
    const { data, error } = await supabase
      .from('products')
      .insert([{
        ...product,
        price: priceValue,
        stock: product.stock || 0,
        rating: product.rating || 0,
        duration: product.duration || '2min'
      }])
      .select()
      .single();

    if (error) {
      setError(error.message);
      const newProduct = { ...product, id: Date.now(), price: product.price };
      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    }

    const newProduct = {
      ...data,
      price: `Rp ${data.price.toLocaleString('id-ID')}`
    };
    setProducts(prev => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = async (id, updated) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const priceValue = parsePrice(updated.price || product.price);
    const { error } = await supabase
      .from('products')
      .update({
        ...updated,
        price: priceValue,
        stock: updated.stock ?? product.stock,
        rating: updated.rating ?? product.rating,
        duration: updated.duration ?? product.duration
      })
      .eq('id', id);

    if (error) {
      setError(error.message);
    }

    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const newPrice = updated.price !== undefined ? updated.price : p.price;
        return {
          ...p,
          ...updated,
          price: typeof newPrice === 'number'
            ? `Rp ${newPrice.toLocaleString('id-ID')}`
            : newPrice
        };
      }
      return p;
    }));
  };

  const deleteProduct = async (id) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      setError(error.message);
    }

    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addCustomer = async (customer) => {
    const { data, error } = await supabase
      .from('customers')
      .insert([{
        name: customer.name,
        email: customer.email || null,
        phone: customer.phone || null,
        total_orders: 0,
        total_spent: 0
      }])
      .select()
      .single();

    if (error) {
      setError(error.message);
      const newCustomer = {
        ...customer,
        id: Date.now(),
        totalOrders: 0,
        totalSpent: 'Rp 0'
      };
      setCustomers(prev => [...prev, newCustomer]);
      return newCustomer;
    }

    const newCustomer = {
      ...data,
      totalSpent: 'Rp 0'
    };
    setCustomers(prev => [newCustomer, ...prev]);
    return newCustomer;
  };

  const updateCustomer = async (id, updated) => {
    const customer = customers.find(c => c.id === id);
    if (!customer) return;

    const { error } = await supabase
      .from('customers')
      .update({
        name: updated.name ?? customer.name,
        email: updated.email ?? customer.email,
        phone: updated.phone ?? customer.phone
      })
      .eq('id', id);

    if (error) {
      setError(error.message);
    }

    setCustomers(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          ...updated,
          totalSpent: c.totalSpent
        };
      }
      return c;
    }));
  };

  const deleteCustomer = async (id) => {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);

    if (error) {
      setError(error.message);
    }

    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  const addTransaction = async (transaction) => {
    const { data, error } = await supabase
      .from('transactions')
      .insert([{
        items: JSON.stringify(transaction.items),
        subtotal: transaction.subtotal,
        tax: transaction.tax,
        total: transaction.total,
        payment_method: transaction.paymentMethod,
        payment_status: 'completed',
        customer_id: transaction.customer?.id || null
      }])
      .select()
      .single();

    if (error) {
      setError(error.message);
    }

    const newTransaction = {
      ...transaction,
      id: data?.id || Date.now(),
      date: new Date().toISOString()
    };

    setTransactions(prev => [newTransaction, ...prev]);
    return newTransaction;
  };

  const updateProductStock = (productId, quantity) => {
    setProducts(prev => prev.map(p => {
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
    loading,
    error,
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
    refetch: () => {
      fetchProducts();
      fetchCustomers();
      fetchTransactions();
      fetchSettings();
    }
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

function parsePrice(priceStr) {
  if (typeof priceStr === 'number') return priceStr;
  return parseInt(priceStr.replace(/[^\d]/g, '')) || 0;
}

export { DataProvider, useData };
