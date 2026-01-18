import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Search, Mail, Phone, User as UserIcon } from 'lucide-react';
import { useData } from '../context/DataContext';
import './Customers.css';

function Customers() {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const handleOpenModal = (customer = null) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      });
    } else {
      setEditingCustomer(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCustomer(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCustomer) {
      updateCustomer(editingCustomer.id, formData);
    } else {
      addCustomer(formData);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      deleteCustomer(id);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="customers-page">
      <div className="page-header">
        <div className="header-left">
          <h1>Customers</h1>
          <p>Manage your customer database</p>
        </div>
        <button className="add-btn" onClick={() => handleOpenModal()}>
          <Plus size={18} />
          Add Customer
        </button>
      </div>

      <div className="search-bar">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="customers-grid">
        {filteredCustomers.map(customer => (
          <div key={customer.id} className="customer-card">
            <div className="customer-avatar">
              <UserIcon size={32} />
            </div>
            <div className="customer-info">
              <h3 className="customer-name">{customer.name}</h3>
              <div className="customer-details">
                <span className="detail-item">
                  <Mail size={14} />
                  {customer.email}
                </span>
                <span className="detail-item">
                  <Phone size={14} />
                  {customer.phone}
                </span>
              </div>
            </div>
            <div className="customer-stats">
              <div className="stat">
                <span className="stat-value">{customer.totalOrders}</span>
                <span className="stat-label">Orders</span>
              </div>
              <div className="stat">
                <span className="stat-value">{customer.totalSpent}</span>
                <span className="stat-label">Spent</span>
              </div>
            </div>
            <div className="customer-actions">
              <button className="action-btn edit" onClick={() => handleOpenModal(customer)}>
                <Edit2 size={16} />
              </button>
              <button className="action-btn delete" onClick={() => handleDelete(customer.id)}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCustomer ? 'Edit Customer' : 'Add Customer'}</h2>
              <button className="close-btn" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingCustomer ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Customers;
