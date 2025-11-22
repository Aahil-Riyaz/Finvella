import { MarketItem } from '../types';
import { INITIAL_MARKET_DATA } from '../constants';

// In a real app, this would fetch from an API. 
// Here we simulate live updates.

export const getMarketData = (): Promise<MarketItem[]> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      const updatedData = INITIAL_MARKET_DATA.map(item => ({
        ...item,
        // Random fluctuation
        price: item.price * (1 + (Math.random() - 0.5) * 0.01),
        change: item.change + (Math.random() - 0.5) * 0.2
      }));
      resolve(updatedData);
    }, 500);
  });
};
