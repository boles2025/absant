
import React from 'react';
import { View } from '../types';

interface HeaderProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  isAdminAuthenticated: boolean;
  onLogout: () => void;
}

const NavButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => {
    const baseClasses = "px-4 py-2 rounded-md font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900";
    const activeClasses = "bg-teal-600 text-white shadow-md";
    const inactiveClasses = "bg-slate-700 text-slate-300 hover:bg-slate-600";
    return (
        <button onClick={onClick} className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}>
            {children}
        </button>
    );
};

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView, isAdminAuthenticated, onLogout }) => {
  return (
    <header className="bg-slate-800 text-white shadow-lg p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-right">
            <h1 className="text-xl md:text-2xl font-bold text-teal-400">
              نظام متابعة الغياب
            </h1>
            <p className="text-xs md:text-sm text-slate-400">
                أكاديمية السادات للعلوم الإدارية - فرع المنيا
            </p>
        </div>
        <nav className="flex items-center space-x-2 space-x-reverse bg-slate-900 p-1 rounded-lg">
            <NavButton active={currentView === View.Observer} onClick={() => setCurrentView(View.Observer)}>
                شاشة المراقب
            </NavButton>
            <NavButton active={currentView === View.Admin} onClick={() => setCurrentView(View.Admin)}>
                لوحة التحكم
            </NavButton>
            {isAdminAuthenticated && (
                <button 
                    onClick={onLogout} 
                    className="px-3 py-2 rounded-md font-semibold text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 bg-red-600 text-white hover:bg-red-700 flex items-center justify-center space-x-2 space-x-reverse"
                    aria-label="تسجيل الخروج"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                    </svg>
                    <span>خروج</span>
                </button>
            )}
        </nav>
      </div>
    </header>
  );
};

export default Header;