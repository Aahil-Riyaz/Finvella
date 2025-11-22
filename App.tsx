
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import DashboardView from './components/DashboardView';
import ExpensesView from './components/views/Expenses.tsx';
import BudgetView from './components/views/Budget.tsx';
import GoalsView from './components/views/Goals.tsx';
import MarketView from './components/views/Market.tsx';
import AIChat from './components/views/AIChat.tsx';
import AuthScreen from './components/auth/AuthScreen';
import { View } from './types';
import { useApp } from './context/AppContext';
import { CURRENCIES } from './constants';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { currencyCode, setCurrencyCode, user, loading, logout } = useApp();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-dark text-indigo-500">
        <svg className="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <DashboardView />;
      case 'expenses': return <ExpensesView />;
      case 'budget': return <BudgetView />;
      case 'goals': return <GoalsView />;
      case 'market': return <MarketView />;
      case 'ai-chat': return <AIChat />;
      default: return <DashboardView />;
    }
  };

  // Header Controls (Currency & Profile)
  const HeaderControls = () => (
    <div className="flex items-center gap-3">
       <select 
         value={currencyCode}
         onChange={(e) => setCurrencyCode(e.target.value as any)}
         className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
       >
         {CURRENCIES.map(c => (
           <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>
         ))}
       </select>

       <div className="relative">
         <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold shadow-md hover:bg-indigo-600 transition-colors relative z-20"
         >
           {user.displayName ? user.displayName[0].toUpperCase() : 'U'}
         </button>
         
         {/* Click Outside Backdrop */}
         {isProfileOpen && (
           <div 
             className="fixed inset-0 z-10" 
             onClick={() => setIsProfileOpen(false)}
           ></div>
         )}
         
         {/* Dropdown */}
         {isProfileOpen && (
           <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden z-20 animate-in fade-in slide-in-from-top-2">
             <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
               <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.displayName || 'User'}</p>
               <p className="text-xs text-gray-500 truncate">{user.email || 'Guest Mode'}</p>
             </div>
             <button 
               onClick={() => {
                 setIsProfileOpen(false);
                 logout();
               }}
               className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
             >
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
               Log Out
             </button>
           </div>
         )}
       </div>
    </div>
  );

  return (
    <Layout 
      currentView={currentView} 
      onChangeView={setCurrentView}
      headerActions={currentView !== 'ai-chat' ? <HeaderControls /> : null}
    >
      {/* View Container */}
      <div className={`animate-in fade-in duration-500 h-full`}>
        {renderView()}
      </div>
    </Layout>
  );
}
