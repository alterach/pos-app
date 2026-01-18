import { Home, ShoppingCart, Package, Users, Settings, LogOut, BarChart3 } from 'lucide-react';
import './Sidebar.css';

const navItems = [
    { icon: Home, label: 'Dashboard', active: true },
    { icon: ShoppingCart, label: 'POS' },
    { icon: Package, label: 'Products' },
    { icon: Users, label: 'Customers' },
    { icon: BarChart3, label: 'Reports' },
];

const bottomItems = [
    { icon: Settings, label: 'Settings' },
    { icon: LogOut, label: 'Logout' },
];

function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-top">
                <div className="sidebar-logo">
                    <span className="logo-text">F.</span>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item, index) => (
                        <button
                            key={index}
                            className={`nav-item ${item.active ? 'active' : ''}`}
                            title={item.label}
                        >
                            <item.icon size={22} />
                        </button>
                    ))}
                </nav>
            </div>

            <div className="sidebar-bottom">
                {bottomItems.map((item, index) => (
                    <button
                        key={index}
                        className="nav-item"
                        title={item.label}
                    >
                        <item.icon size={22} />
                    </button>
                ))}
            </div>
        </aside>
    );
}

export default Sidebar;
