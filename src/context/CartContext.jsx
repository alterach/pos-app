import { createContext, useContext, useReducer, useEffect } from 'react';
import { parsePrice } from '../utils/price.js';
import { getFromStorage, setToStorage } from '../utils/storage.js';

const CartContext = createContext();

const initialState = {
  items: [],
  customer: null,
  paymentMethod: 'cash',
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(item => item.id === action.payload.id);
      if (existingIndex > -1) {
        const newItems = [...state.items];
        newItems[existingIndex].quantity += 1;
        return { ...state, items: newItems };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(item => item.id !== action.payload) };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ).filter(item => item.quantity > 0)
      };
    case 'SET_CUSTOMER':
      return { ...state, customer: action.payload };
    case 'SET_PAYMENT_METHOD':
      return { ...state, paymentMethod: action.payload };
    case 'CLEAR_CART':
      return { ...state, items: [], customer: null, paymentMethod: 'cash' };
    case 'LOAD_CART':
      return action.payload;
    default:
      return state;
  }
}

function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    const savedCart = getFromStorage('pos_cart');
    if (savedCart) {
      dispatch({ type: 'LOAD_CART', payload: savedCart });
    }
  }, []);

  useEffect(() => {
    setToStorage('pos_cart', state);
  }, [state]);

  const addItem = (product) => dispatch({ type: 'ADD_ITEM', payload: product });
  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', payload: id });
  const updateQuantity = (id, quantity) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  const setCustomer = (customer) => dispatch({ type: 'SET_CUSTOMER', payload: customer });
  const setPaymentMethod = (method) => dispatch({ type: 'SET_PAYMENT_METHOD', payload: method });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = state.items.reduce((sum, item) => sum + parsePrice(item.price) * item.quantity, 0);

  const value = {
    cart: state,
    addItem,
    removeItem,
    updateQuantity,
    setCustomer,
    setPaymentMethod,
    clearCart,
    totalItems,
    totalPrice,
    parsePrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export { CartProvider, useCart };
