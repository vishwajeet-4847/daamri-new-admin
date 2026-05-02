export interface PriceFormatOptions {
  locale?: string;
  currency?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  useCurrencySymbol?: boolean;
}

export function formatPrice(value: number, options?: PriceFormatOptions): string {
  const {
    locale = 'en-IN',
    currency = 'INR',
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
    useCurrencySymbol = true,
  } = options || {};

  if (useCurrencySymbol) {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(value);
  }

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
}

export function parsePrice(value: string): number {
  if (!value || typeof value !== 'string') {
    return 0;
  }

  const cleaned = value
    .replace(/\u00A0/g, '')
    .replace(/,/g, '')
    .replace(/[^\d.-]/g, '');

  const parsed = Number(cleaned);
  return Number.isNaN(parsed) ? 0 : parsed;
}
