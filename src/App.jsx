import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { ShoppingCart, DollarSign, Package, Users, BarChart3, Settings, LogOut, Home } from 'lucide-react';
import './styles/global.css';
import './styles/layout.css';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatsCard from './components/StatsCard';
import ProductList from './components/ProductList';
import ChartWidget from './components/ChartWidget';
import PromoCard from './components/PromoCard';

import { CartProvider } from './context/CartContext';
import { DataProvider } from './context/DataContext';
import POS from './pages/POS';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Reports from './pages/Reports';

import './App.css';

const navItems = [
  { path: '/', icon: Home, label: 'Dashboard' },
  { path: '/pos', icon: ShoppingCart, label: 'POS' },
  { path: '/products', icon: Package, label: 'Products' },
  { path: '/customers', icon: Users, label: 'Customers' },
  { path: '/reports', icon: BarChart3, label: 'Reports' },
];

function Dashboard() {
  return (
    <div className="main-content">
      <div className="content-left">
        <div className="stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--spacing-lg)' }}>
          <StatsCard
            value="11"
            label="Orders completed"
            icon={ShoppingCart}
            color="accent"
          />
          <StatsCard
            value="4"
            label="Orders in progress"
            icon={Package}
            color="warning"
          />
          <StatsCard
            value="Rp 2.5M"
            label="Revenue today"
            icon={DollarSign}
            color="success"
          />
        </div>
        <ProductList />
      </div>
      <div className="content-right">
        <ChartWidget />
        <PromoCard />
      </div>
    </div>
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState('Dashboard');

  return (
    <DataProvider>
      <CartProvider>
        <Router>
          <div className="app-layout">
            <aside className="sidebar">
              <div className="sidebar-top">
                <div className="sidebar-logo">
                  <span className="logo-text">F.</span>
                </div>
                <nav className="sidebar-nav">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                      title={item.label}
                      onClick={() => setCurrentPage(item.label)}
                    >
                      <item.icon size={22} />
                    </NavLink>
                  ))}
                </nav>
              </div>
              <div className="sidebar-bottom">
                <button className="nav-item" title="Settings">
                  <Settings size={22} />
                </button>
                <button className="nav-item" title="Logout">
                  <LogOut size={22} />
                </button>
              </div>
            </aside>

            <div className="main-wrapper">
              <Header currentPage={currentPage} />
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/pos" element={<POS />} />
                <Route path="/products" element={<Products />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/reports" element={<Reports />} />
              </Routes>
            </div>
          </div>
        </Router>
      </CartProvider>
    </DataProvider>
  );
}

export default App;
