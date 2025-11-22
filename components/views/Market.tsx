import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../UIComponents';
import { MarketItem } from '../../types';
import { getMarketData } from '../../services/marketService';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

// Mini Sparkline Component
const Sparkline = ({ color, isUp }: { color: string; isUp: boolean }) => {
  const data = Array.from({ length: 10 }, () => ({ val: Math.random() }));
  return (
    <div className="h-12 w-24">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line type="monotone" dataKey="val" stroke={isUp ? '#10b981' : '#ef4444'} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default function MarketView() {
  const { getCurrencySymbol } = useApp();
  const [items, setItems] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState(true);

  const currency = getCurrencySymbol();

  useEffect(() => {
    // Initial fetch
    getMarketData().then(data => {
      setItems(data);
      setLoading(false);
    });

    // Simulate live updates
    const interval = setInterval(() => {
      getMarketData().then(data => setItems(data));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="p-10 text-center text-gray-500">Loading market data...</div>;

  const stocks = items.filter(i => i.type === 'stock');
  const crypto = items.filter(i => i.type === 'crypto');

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Market Watch</h2>
        <p className="text-gray-500 dark:text-gray-400">Live(simulated) global feed.</p>
      </div>

      {/* Ticker Scroll Animation */}
      <div className="w-full overflow-hidden bg-gray-900 text-white py-2 rounded-lg mb-4">
        <div className="animate-[marquee_20s_linear_infinite] whitespace-nowrap flex gap-8 px-4">
           {[...items, ...items].map((item, i) => (
             <span key={`${item.symbol}-${i}`} className="flex items-center gap-2">
               <span className="font-bold">{item.symbol}</span>
               <span className={item.change >= 0 ? "text-green-400" : "text-red-400"}>
                 {item.change >= 0 ? '▲' : '▼'} {Math.abs(item.change).toFixed(2)}%
               </span>
             </span>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Stocks */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Stocks</h3>
            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-2 py-1 rounded">NYSE/NASDAQ</span>
          </div>
          <div className="space-y-4">
            {stocks.map(item => (
              <div key={item.symbol} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center font-bold text-xs">
                    {item.symbol[0]}
                  </div>
                  <div>
                    <p className="font-bold">{item.symbol}</p>
                    <p className="text-xs text-gray-500">{item.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Sparkline color="" isUp={item.change >= 0} />
                  <div className="text-right w-24">
                    <p className="font-bold">{currency}{item.price.toFixed(2)}</p>
                    <p className={`text-xs ${item.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                       {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Crypto */}
        <Card>
          <div className="flex items-center justify-between mb-6">
             <h3 className="text-xl font-bold">Crypto</h3>
             <span className="text-xs bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300 px-2 py-1 rounded">24h</span>
          </div>
          <div className="space-y-4">
            {crypto.map(item => (
              <div key={item.symbol} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                 <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-500 flex items-center justify-center font-bold text-xs">
                    {item.symbol[0]}
                  </div>
                  <div>
                    <p className="font-bold">{item.symbol}</p>
                    <p className="text-xs text-gray-500">{item.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Sparkline color="" isUp={item.change >= 0} />
                  <div className="text-right w-24">
                    <p className="font-bold">{currency}{item.price.toLocaleString()}</p>
                    <p className={`text-xs ${item.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                       {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <p className="text-center text-xs text-gray-400 pt-8">
        Market data is simulated for demonstration purposes. Do not use for financial decisions.
      </p>
    </div>
  );
}
