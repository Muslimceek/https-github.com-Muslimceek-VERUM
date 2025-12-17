import React from 'react';
import { ScreenType } from '../types';

interface TabBarProps {
  activeScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  isNight: boolean;
}

export const TabBar: React.FC<TabBarProps> = ({ activeScreen, onNavigate, isNight }) => {
  // SVG gradients for 3D effect
  const Gradients = () => (
    <svg width="0" height="0" className="absolute">
      <defs>
        <linearGradient id="roseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E7C8C0" />
          <stop offset="100%" stopColor="#C89B7B" />
        </linearGradient>
        <linearGradient id="nightGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EAE0D5" />
          <stop offset="100%" stopColor="#9C9590" />
        </linearGradient>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15"/>
        </filter>
      </defs>
    </svg>
  );

  const getIcon = (id: ScreenType, isActive: boolean) => {
    const fill = isActive 
      ? (isNight ? "url(#nightGradient)" : "url(#roseGradient)") 
      : "currentColor";
    const filter = isActive ? "url(#softShadow)" : "none";
    
    switch (id) {
      case 'HOME': // Heart
        return <svg width="24" height="24" viewBox="0 0 24 24" fill={fill} filter={filter} stroke="none"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>;
      case 'LETTERS': // Envelope
        return <svg width="24" height="24" viewBox="0 0 24 24" fill={fill} filter={filter} stroke="none"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>;
      case 'IMAGES': // Flower/Image icon
        return <svg width="24" height="24" viewBox="0 0 24 24" fill={fill} filter={filter} stroke="none"><path d="M12 2C7.5 2 5.5 6 5.5 6C5.5 6 2 7.5 2 12C2 16.5 6 18.5 6 18.5C6 18.5 7.5 22 12 22C16.5 22 18.5 18 18.5 18C18.5 18 22 16.5 22 12C22 7.5 18 5.5 18 5.5C18 5.5 16.5 2 12 2ZM12 16C9.79 16 8 14.21 8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12C16 14.21 14.21 16 12 16Z"/></svg>;
      case 'JOURNAL': // Book
        return <svg width="24" height="24" viewBox="0 0 24 24" fill={fill} filter={filter} stroke="none"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 4h2v5l-1-.75L9 9V4zm9 16H6V4h1v9l3-2.25L13 13V4h5v16z"/></svg>; 
      case 'LIBRARY': // Star
        return <svg width="24" height="24" viewBox="0 0 24 24" fill={fill} filter={filter} stroke="none"><path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z"/></svg>;
      default: return null;
    }
  };

  const navItems: { id: ScreenType; label: string }[] = [
    { id: 'HOME', label: 'Слово' },
    { id: 'LETTERS', label: 'Письма' },
    { id: 'IMAGES', label: 'Образы' },
    { id: 'JOURNAL', label: 'Дневник' },
    { id: 'LIBRARY', label: 'Моё' }
  ];

  return (
    <>
      <Gradients />
      <div className={`fixed bottom-0 left-0 right-0 h-24 pb-6 px-2 flex justify-between items-center z-50 transition-colors duration-500 ${isNight ? 'bg-[#231F1D]/90' : 'bg-[#FAF7F4]/90'} backdrop-blur-xl`}>
        {navItems.map((item) => {
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 group`}
            >
              <div className={`transform transition-all duration-300 ${isActive ? '-translate-y-2 scale-110' : 'opacity-40 group-hover:opacity-60 scale-100'} ${isNight && !isActive ? 'text-white' : 'text-vera-text'}`}>
                {getIcon(item.id, isActive)}
              </div>
              
              {isActive && (
                <div className={`w-1 h-1 rounded-full mt-1 ${isNight ? 'bg-vera-rose' : 'bg-vera-caramel'} animate-fade-in`}></div>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
};