import { useEffect, useRef } from 'react';
import { Printer, X } from 'lucide-react';
import { useData } from '../context/DataContext';
import './Receipt.css';

function Receipt({ transaction, onClose }) {
  const { settings } = useData();
  const printRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const formatPrice = (price) => {
    const numPrice = typeof price === 'string' ? parseFloat(price.replace(/[Rp\s.]/g, '')) : price;
    return `Rp ${numPrice.toLocaleString('id-ID')}`;
  };

  const calculateSubtotal = () => {
    return transaction.items.reduce((sum, item) => {
      const price = typeof item.price === 'string' ? parseFloat(item.price.replace(/[Rp\s.]/g, '')) : item.price;
      return sum + (price * item.quantity);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const taxRate = settings?.taxPercentage || 11;
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + taxAmount;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }) + ' ' + date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="receipt-overlay" onClick={onClose}>
      <div className="receipt-modal" onClick={(e) => e.stopPropagation()} ref={printRef}>
        <div className="receipt-header">
          <div className="receipt-store-name">{settings?.storeName || 'F. POS'}</div>
          <div className="receipt-store-info">
           Jl. Contoh No. 123<br />
            Telp: 021-12345678
          </div>
        </div>

        <div className="receipt-content">
          <div className="receipt-row">
            <span>No: {transaction.id}</span>
          </div>
          <div className="receipt-row">
            <span>Tgl: {formatDate(transaction.date)}</span>
          </div>

          <hr className="receipt-divider" />

          {transaction.items.map((item, index) => {
            const itemPrice = typeof item.price === 'string' ? parseFloat(item.price.replace(/[Rp\s.]/g, '')) : item.price;
            const itemTotal = itemPrice * item.quantity;

            return (
              <div key={index} className="receipt-item">
                <span className="receipt-item-name">
                  {item.quantity}x {item.name}
                </span>
                <span className="receipt-item-qty"></span>
                <span className="receipt-item-price">{formatPrice(itemTotal)}</span>
              </div>
            );
          })}

          <hr className="receipt-divider" />

          <div className="receipt-row">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="receipt-row">
            <span>PPN ({taxRate}%)</span>
            <span>{formatPrice(taxAmount)}</span>
          </div>
          <div className="receipt-row total">
            <span>TOTAL</span>
            <span>{formatPrice(total)}</span>
          </div>

          <div className="receipt-row">
            <span>Bayar</span>
            <span>{formatPrice(total)}</span>
          </div>
          <div className="receipt-row">
            <span>Kembali</span>
            <span>Rp 0</span>
          </div>

          <div className="receipt-tax-info">
            * Include tax {taxRate}%
          </div>
        </div>

        <div className="receipt-footer">
          Thank you for your purchase!
        </div>

        <div className="receipt-actions">
          <button className="receipt-btn receipt-btn-close" onClick={onClose}>
            <X size={18} />
            Close
          </button>
          <button className="receipt-btn receipt-btn-print" onClick={handlePrint}>
            <Printer size={18} />
            Print
          </button>
        </div>
      </div>
    </div>
  );
}

export default Receipt;
