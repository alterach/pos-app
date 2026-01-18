import { supabase } from './supabase.js';
import { parsePrice } from '../utils/price.js';

const XENDIT_SECRET_KEY = import.meta.env.VITE_XENDIT_SECRET_KEY || ''

export async function createXenditInvoice(transactionData) {
  const { items, total, customer } = transactionData

  const response = await fetch('https://api.xendit.co/v2/invoices', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(XENDIT_SECRET_KEY + ':')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      external_id: `pos-${Date.now()}`,
      description: `POS Transaction - ${items.length} items`,
      amount: total,
      customer: customer ? {
        name: customer.name,
        email: customer.email || `${customer.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        phone: customer.phone,
      } : undefined,
      currency: 'IDR',
      items: items.map(item => ({
        name: item.name,
        price: parsePrice(item.price),
        quantity: item.quantity,
      })),
      success_redirect_url: `${window.location.origin}/payment/success`,
      failure_redirect_url: `${window.location.origin}/payment/failure`,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to create invoice')
  }

  return response.json()
}

export async function checkInvoiceStatus(invoiceId) {
  const response = await fetch(`https://api.xendit.co/v2/invoices/${invoiceId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${btoa(XENDIT_SECRET_KEY + ':')}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to check invoice status')
  }

  return response.json()
}

export async function saveTransactionToSupabase(transaction) {
  const { data, error } = await supabase
    .from('transactions')
    .insert([transaction])
    .select()

  if (error) {
    throw new Error(error.message)
  }

  return data[0]
}

export { supabase }
