
import { Currency, MarketItem } from './types';

export const CATEGORIES = [
  'Food',
  'Rent',
  'Transport',
  'Entertainment',
  'Subscriptions',
  'Shopping',
  'Savings',
  'Education',
  'Other',
];

export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', rate: 1 },
  { code: 'EUR', symbol: '€', rate: 0.92 },
  { code: 'GBP', symbol: '£', rate: 0.79 },
  { code: 'JPY', symbol: '¥', rate: 150.5 },
  { code: 'INR', symbol: '₹', rate: 83.5 },
  // GCC Currencies
  { code: 'AED', symbol: 'AED', rate: 3.67 }, // UAE Dirham
  { code: 'SAR', symbol: 'SAR', rate: 3.75 }, // Saudi Riyal
  { code: 'QAR', symbol: 'QR', rate: 3.64 },  // Qatari Riyal
  { code: 'BHD', symbol: 'BD', rate: 0.376 }, // Bahraini Dinar
  { code: 'KWD', symbol: 'KD', rate: 0.307 }, // Kuwaiti Dinar
  { code: 'OMR', symbol: 'OMR', rate: 0.385 }, // Omani Rial
];

export const INITIAL_MARKET_DATA: MarketItem[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 178.32, change: 1.2, type: 'stock' },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 205.60, change: -2.4, type: 'stock' },
  { symbol: 'NVDA', name: 'NVIDIA', price: 820.15, change: 4.5, type: 'stock' },
  { symbol: 'MSFT', name: 'Microsoft', price: 415.20, change: 0.8, type: 'stock' },
  { symbol: 'BTC', name: 'Bitcoin', price: 64500, change: 2.1, type: 'crypto' },
  { symbol: 'ETH', name: 'Ethereum', price: 3450, change: 1.5, type: 'crypto' },
  { symbol: 'SOL', name: 'Solana', price: 145.20, change: 5.8, type: 'crypto' },
];
