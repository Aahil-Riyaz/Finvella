import React, { useState } from 'react';
import { View } from '../types';
import { useApp } from '../context/AppContext';

interface LayoutProps {
  currentView: View;
  onChangeView: (view: View) => void;
  children: React.ReactNode;
  headerActions?: React.ReactNode; // NEW: Allows injecting fixed header buttons
}

const NavItem = ({ 
  active, 
  onClick, 
  icon, 
  label,
  isSpecial
}: { 
  active: boolean; 
  onClick: () => void; 
  icon: React.ReactNode; 
  label: string;
  isSpecial?: boolean;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 w-full text-left
      ${active 
        ? isSpecial 
          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 font-semibold'
          : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold' 
        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export const Layout = ({ currentView, onChangeView, children, headerActions }: LayoutProps) => {
  const { theme, toggleTheme } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg> },
    { id: 'expenses', label: 'Expenses', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> },
    { id: 'budget', label: 'Budget', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg> },
    { id: 'goals', label: 'Goals', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg> },
    { id: 'market', label: 'Market', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg> },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-dark text-gray-900 dark:text-gray-100 font-sans overflow-hidden">
      
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-dark-card border-r border-gray-200 dark:border-gray-800
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
              F
            </div>
            <h1 className="text-xl font-bold tracking-tight">Finvella</h1>
          </div>

          <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
            {navItems.map((item) => (
              <NavItem
                key={item.id}
                active={currentView === item.id}
                onClick={() => {
                  onChangeView(item.id as View);
                  setIsMobileMenuOpen(false);
                }}
                icon={item.icon}
                label={item.label}
              />
            ))}
            
            <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800">
               <NavItem 
                 active={currentView === 'ai-chat'}
                 onClick={() => {
                   onChangeView('ai-chat');
                   setIsMobileMenuOpen(false);
                 }}
                 icon={<span className="text-lg">✨</span>}
                 label="Finvella AI"
                 isSpecial
               />
            </div>
          </nav>

          <div className="pt-6 border-t border-gray-100 dark:border-gray-800 mt-auto">
            <button 
              onClick={toggleTheme}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-2xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              {theme === 'dark' ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <main className="flex-1 flex flex-col h-screen relative">
        
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-white dark:bg-dark-card border-b border-gray-200 dark:border-gray-800 flex items-center px-4 justify-between z-30 flex-shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">F</div>
             <span className="font-bold">Finvella</span>
          </div>
          <div className="flex items-center gap-2">
             <button onClick={() => setIsMobileMenuOpen(true)} className="p-2">
               <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
             </button>
          </div>
        </header>

        {/* Fixed Header Actions Area (Desktop) */}
        {headerActions && (
          <div className="absolute top-4 right-4 md:right-8 z-40 hidden md:block pointer-events-none">
             {/* Pointer events auto to allow clicking the buttons */}
             <div className="pointer-events-auto">
                {headerActions}
             </div>
          </div>
        )}

        {/* Scrollable Content Area */}
        <div className={`flex-1 overflow-y-auto relative ${currentView === 'ai-chat' ? 'p-0' : 'p-4 md:p-8'}`}>
           {/* Add top padding so content doesn't overlap with absolute header on Desktop */}
           <div className={currentView !== 'ai-chat' ? 'md:pt-8' : ''}>
             {children}
           </div>
        </div>
      </main>
    </div>
  );
};