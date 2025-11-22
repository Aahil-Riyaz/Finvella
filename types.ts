
export type CurrencyCode = 'USD' | 'EUR' | 'JPY' | 'GBP' | 'AED' | 'INR' | 'SAR' | 'QAR' | 'BHD' | 'KWD' | 'OMR';

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  rate: number; // Relative to USD for demo purposes
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isGuest?: boolean;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  deadline: string;
  icon?: string;
}

export interface Budget {
  monthlyIncome: number;
  limits: Record<string, number>; // Category -> Amount
}

export interface MarketItem {
  symbol: string;
  name: string;
  price: number;
  change: number; // Percentage
  type: 'stock' | 'crypto';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export type View = 'dashboard' | 'expenses' | 'budget' | 'goals' | 'market' | 'ai-chat';
