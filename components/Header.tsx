import React from 'react';
import { AppScreen } from '../types';

interface HeaderProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentScreen, onNavigate }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-verum-black/80 backdrop-blur-md border-b border-white/5 h-16 flex items-center justify-between px-6">
      <button onClick={() => onNavigate(AppScreen.HOME)} className="flex items-center gap-2 group">
        <div className="w-8 h-8 border border-verum-gold flex items-center justify-center rotate-45 group-hover:rotate-0 transition-transform duration-500">
           <span className="text-verum-gold font-serif font-bold text-lg -rotate-45 group-hover:rotate-0 transition-transform duration-500">V</span>
        </div>
        <span className="text-xl font-serif tracking-widest text-verum-white ml-2">VERUM</span>
      </button>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => onNavigate(AppScreen.HOME)}
          className={`text-sm tracking-wide transition-colors ${currentScreen === AppScreen.HOME ? 'text-verum-gold' : 'text-verum-gray hover:text-white'}`}
        >
          СОЗДАТЬ
        </button>
        <button 
          onClick={() => onNavigate(AppScreen.LIBRARY)}
          className={`text-sm tracking-wide transition-colors ${currentScreen === AppScreen.LIBRARY ? 'text-verum-gold' : 'text-verum-gray hover:text-white'}`}
        >
          ИЗБРАННОЕ
        </button>
      </div>
    </header>
  );
};