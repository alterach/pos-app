import { useMemo } from 'react';
import { parsePrice, formatPrice } from '../utils/price.js';

export function usePriceFormatter(priceValue, currency = 'IDR') {
  const numericValue = useMemo(() => parsePrice(priceValue), [priceValue]);
  const formattedValue = useMemo(
    () => formatPrice(numericValue, currency),
    [numericValue, currency]
  );

  return {
    parse: parsePrice,
    format: formatPrice,
    numericValue,
    formattedValue,
  };
}

export function useCartTotal(items, currency = 'IDR') {
  return useMemo(() => {
    const subtotal = items.reduce((sum, item) => {
      const price = parsePrice(item.price);
      return sum + price * item.quantity;
    }, 0);

    return {
      subtotal,
      formattedSubtotal: formatPrice(subtotal, currency),
    };
  }, [items, currency]);
}
