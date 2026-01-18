export function parsePrice(priceStr) {
  if (typeof priceStr === 'number') return priceStr;
  return parseInt(priceStr.replace(/[^\d]/g, '')) || 0;
}

export function formatPrice(value, currency = 'IDR') {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value) {
  return new Intl.NumberFormat('id-ID').format(value);
}
