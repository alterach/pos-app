import { useData } from '../context/DataContext';
import './Reports.css';

function Reports() {
  const { transactions, products } = useData();

  const totalRevenue = transactions.reduce((sum, t) => sum + t.total, 0);
  const averageOrder = transactions.length > 0 ? totalRevenue / transactions.length : 0;

  const salesByCategory = products.reduce((acc, product) => {
    const category = product.category;
    const revenue = transactions.filter(t => 
      t.items.some(item => item.category === category)
    ).reduce((sum, t) => sum + t.total, 0);
    acc[category] = (acc[category] || 0) + revenue;
    return acc;
  }, {});

  const recentTransactions = transactions.slice(0, 10);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const maxCategorySales = Math.max(...Object.values(salesByCategory), 1);

  return (
    <div className="reports-page">
      <h1 className="page-title">Sales Reports</h1>

      <div className="reports-stats">
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="stat-value">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p className="stat-value">{transactions.length}</p>
        </div>
        <div className="stat-card">
          <h3>Average Order</h3>
          <p className="stat-value">{formatCurrency(averageOrder)}</p>
        </div>
      </div>

      <div className="reports-grid">
        <div className="reports-section">
          <h2>Sales by Category</h2>
          <div className="category-bars">
            {Object.entries(salesByCategory).map(([category, amount]) => (
              <div key={category} className="category-bar-item">
                <div className="category-label">
                  <span>{category}</span>
                  <span>{formatCurrency(amount)}</span>
                </div>
                <div className="bar-container">
                  <div 
                    className="bar-fill" 
                    style={{ width: `${(amount / maxCategorySales) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="reports-section">
          <h2>Recent Transactions</h2>
          <div className="transactions-list">
            {recentTransactions.length === 0 ? (
              <p className="empty-message">No transactions yet</p>
            ) : (
              recentTransactions.map(t => (
                <div key={t.id} className="transaction-item">
                  <div className="transaction-info">
                    <span className="transaction-id">#{t.id.toString().slice(-6)}</span>
                    <span className="transaction-date">{formatDate(t.date)}</span>
                  </div>
                  <div className="transaction-details">
                    <span className="transaction-items">{t.items.length} items</span>
                    <span className="transaction-method">{t.paymentMethod}</span>
                  </div>
                  <span className="transaction-total">{formatCurrency(t.total)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;
