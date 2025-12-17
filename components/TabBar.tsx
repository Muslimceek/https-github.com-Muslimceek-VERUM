import React from 'react';
import { ScreenType } from '../types';

interface TabBarProps {
  activeScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  isNight: boolean;
}

export const TabBar: React.FC<TabBarProps> = ({ activeScreen, onNavigate, isNight }) => {
  
  const navItems: { id: ScreenType; label: string; emoji: string }[] = [
    { id: 'HOME', label: 'Слово', emoji: '🦢' }, // Swan for grace/home
    { id: 'LETTERS', label: 'Письма', emoji: '💌' }, // Love letter
    { id: 'IMAGES', label: 'Образы', emoji: '🎨' }, // Art palette
    { id: 'JOURNAL', label: 'Дневник', emoji: '✒️' }, // Fountain pen
    { id: 'LIBRARY', label: 'Моё', emoji: '🤍' } // White heart
  ];

  return (
    <div className={`fixed bottom-0 left-0 right-0 h-24 pb-6 px-4 flex justify-between items-center z-50 transition-colors duration-500 ${isNight ? 'bg-[#2A2422]/80' : 'bg-[#FFFCF8]/80'} backdrop-blur-xl border-t ${isNight ? 'border-white/5' : 'border-white/40'}`}>
      {navItems.map((item) => {
        const isActive = activeScreen === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 group`}
          >
            <div className={`transform transition-all duration-500 text-2xl mb-1 ${isActive ? '-translate-y-2 scale-125' : 'opacity-50 grayscale scale-100 group-hover:scale-110 group-hover:opacity-80'}`}>
              {item.emoji}
            </div>
            
            <span className={`text-[9px] uppercase tracking-widest font-medium transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'} ${isNight ? 'text-vera-rose' : 'text-vera-text'}`}>
                {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};