import React from 'react';
import { ScreenType } from '../types';

interface HeaderProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentScreen, onNavigate }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 pt-2">
      {/* Logo Area */}
      <button onClick={() => onNavigate('HOME')} className="flex flex-col items-center justify-center absolute left-1/2 -translate-x-1/2 group">
        <span className="text-2xl font-serif font-semibold tracking-widest text-ios-text group-hover:opacity-70 transition-opacity">VERUM</span>
        <div className="h-0.5 w-4 bg-ios-text/20 rounded-full mt-1"></div>
      </button>

      {/* Left Action (Back or Home) */}
      <div className="flex-1">
          {currentScreen !== 'HOME' && (
             <button 
               onClick={() => onNavigate('HOME')}
               className="w-10 h-10 rounded-full bg-white/40 backdrop-blur-md flex items-center justify-center text-ios-text shadow-sm border border-white/20 active:scale-90 transition-transform"
             >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
             </button>
          )}
      </div>

      {/* Right Action (Library) */}
      <div className="flex-1 flex justify-end">
        <button 
          onClick={() => onNavigate('LIBRARY')}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${currentScreen === 'LIBRARY' ? 'bg-ios-primary text-white shadow-lg' : 'bg-white/40 backdrop-blur-md text-ios-text shadow-sm border border-white/20'}`}
        >
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </button>
      </div>
    </header>
  );
};