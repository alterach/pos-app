import { useState } from 'react'
import { CreditCard, X, Loader2 } from 'lucide-react'
import { createXenditInvoice, saveTransactionToSupabase } from '../lib/xendit'
import { useData } from '../context/DataContext'
import { useCart } from '../context/CartContext'
import './XenditPayment.css'

function XenditPayment({ onClose, onSuccess }) {
  const { settings } = useData()
  const { cart } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [paymentUrl, setPaymentUrl] = useState(null)
  const [invoiceId, setInvoiceId] = useState(null)

  const subtotal = cart.items.reduce((sum, item) => {
    const price = parsePrice(item.price)
    return sum + (price * item.quantity)
  }, 0)

  const taxRate = settings?.taxPercentage || 11
  const taxAmount = (subtotal * taxRate) / 100
  const total = subtotal + taxAmount

  const handlePayment = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const transactionData = {
        items: cart.items,
        subtotal,
        tax: taxAmount,
        total,
        paymentMethod: 'xendit',
        customer: cart.customer,
      }

      const invoice = await createXenditInvoice(transactionData)
      setPaymentUrl(invoice.invoice_url)
      setInvoiceId(invoice.id)

      const transaction = {
        items: JSON.stringify(cart.items),
        subtotal,
        tax: taxAmount,
        total,
        payment_method: 'xendit',
        payment_status: 'pending',
        payment_id: invoice.id,
        customer_id: cart.customer?.id || null,
      }

      await saveTransactionToSupabase(transaction)

    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess({ paymentId: invoiceId, method: 'xendit' })
    }
  }

  if (paymentUrl) {
    return (
      <div className="payment-modal-overlay">
        <div className="payment-modal xendit-modal">
          <div className="modal-header">
            <h3>Complete Payment</h3>
            <button className="close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
          <div className="modal-body">
            <p className="payment-info">Click the button below to complete your payment via Xendit:</p>
            <a
              href={paymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="xendit-pay-btn"
              onClick={handleSuccess}
            >
              <CreditCard size={20} />
              Pay with Xendit
            </a>
            <p className="payment-note">
              You will be redirected to Xendit's secure payment page.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        <div className="modal-header">
          <h3>Xendit Payment</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          <div className="payment-total">
            <span>Total Amount</span>
            <span className="amount">Rp {total.toLocaleString('id-ID')}</span>
          </div>

          {error && (
            <div className="payment-error">
              {error}
            </div>
          )}

          <button
            className="payment-btn xendit-btn"
            onClick={handlePayment}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={24} className="spinner" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <CreditCard size={24} />
                <span>Pay with Xendit</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

function parsePrice(priceStr) {
  if (typeof priceStr === 'number') return priceStr
  return parseInt(priceStr.replace(/[^\d]/g, '')) || 0
}

export default XenditPayment
