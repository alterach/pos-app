import { Search, Bell, ChevronDown } from 'lucide-react';
import './Header.css';

function Header({ currentPage = 'Dashboard' }) {
    return (
        <header className="header">
            <div className="header-left">
                <div className="welcome-section">
                    <h1 className="welcome-title">{currentPage}</h1>
                    <p className="welcome-subtitle">Welcome back!</p>
                </div>
            </div>

            <div className="header-right">
                <div className="search-box">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="search-input"
                    />
                </div>

                <button className="notification-btn">
                    <Bell size={20} />
                    <span className="notification-dot"></span>
                </button>

                <div className="user-profile">
                    <div className="avatar">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Josh" alt="User Avatar" />
                    </div>
                    <ChevronDown size={16} className="dropdown-icon" />
                </div>
            </div>
        </header>
    );
}

export default Header;
